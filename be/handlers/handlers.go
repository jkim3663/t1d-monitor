package handlers

import (
	"encoding/json"
	"fmt"
	"jkim3663/applogin/internal/auth"
	dbsql "jkim3663/applogin/internal/sql"
	"net/http"

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

	// TODO: later replace this with actual DB query
	_ = h.Queries
	// TODO: replace this with actual query lookup and hasing, etc.
	if loginRequest.Email == "admin" && loginRequest.Password == "1234" {
		tokenString, err := auth.CreateToken(loginRequest.Email)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, "failed to create token")
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, tokenString)
		return
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "invalid credentials")
	}
}

func (h *Handler) TestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Missing authorization header")
		return
	}

	err := auth.VerifyToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid token")
		return
	}
	fmt.Fprint(w, "Welcome to the the protected area")
}
