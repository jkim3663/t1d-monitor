package handlers

import (
	"encoding/json"
	"fmt"
	"jkim3663/applogin/internal/auth"
	dbsql "jkim3663/applogin/internal/sql"
	"net/http"
	"os"

	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	Queries *dbsql.Queries
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) RegisterUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginRequest LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&loginRequest); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "invalid request body")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(loginRequest.Password), 10)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, "failed to hash password")
	}
	params := dbsql.InsertUserAndReturnIdParams{
		Email:        loginRequest.Email,
		PasswordHash: string(hash),
	}
	id, err := h.Queries.InsertUserAndReturnId(r.Context(), params)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, "failed to create user")
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "user created with id: %v", id)
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginRequest LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&loginRequest); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "invalid request body")
		return
	}

	if loginRequest.Email == "" || loginRequest.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "email and password are required")
		return
	}

	user, err := h.Queries.GetUser(r.Context(), loginRequest.Email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "invalid email")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginRequest.Password)); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "invalid email or password")
		return
	}

	tokenString, err := auth.CreateToken(loginRequest.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, "failed to create token")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   !(os.Getenv("T1D_APP_ENV") == "local"),
		SameSite: http.SameSiteLaxMode,
		MaxAge:   60 * 60, // 1 hour
	})

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, `{"message":"login successful"}`)
}
