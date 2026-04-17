package main

import (
	"jkim3663/applogin/handlers"
	dbconnection "jkim3663/applogin/internal/db"
	"jkim3663/applogin/internal/initializer"
	"jkim3663/applogin/internal/proxy"
	dbsql "jkim3663/applogin/internal/sql"
	"jkim3663/applogin/middleware"
	"log"
	"net/http"
	"os"

	gorillahandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	initializer.LoadEnvVariables()
	pool, err := dbconnection.NewPool()
	if err != nil {
		log.Fatalf("db connection failed: %v", err)
	}
	defer pool.Close()

	queries := dbsql.New(pool)

	h := &handlers.Handler{
		Queries: queries,
	}

	fhirProxy, err := proxy.FhirProxy()
	if err != nil {
		log.Fatalf("failed to create FHIR proxy: %v", err)
	}

	router := mux.NewRouter()
	// Public routes - register and login
	router.HandleFunc("/register", h.RegisterUserHandler).Methods("POST")
	router.HandleFunc("/login", h.LoginHandler).Methods("POST")
	// Protected routes that require JWT auth
	protectedRouter := router.PathPrefix("").Subrouter()
	protectedRouter.Use(middleware.RequireAuth)
	// Protected routes with reverse proxy
	protectedRouter.PathPrefix("/api/fhir/").Handler(fhirProxy)

	corsHandler := gorillahandlers.CORS(
		gorillahandlers.AllowedOrigins([]string{os.Getenv("CORS_ORIGIN")}),
		gorillahandlers.AllowCredentials(),
		gorillahandlers.AllowedMethods([]string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
		gorillahandlers.AllowedHeaders([]string{"Content-Type"}),
	)(router)

	log.Println("Starting the server")

	serverUrl := os.Getenv("GO_APP_URL") + ":" + os.Getenv("PORT")
	if err := http.ListenAndServe(serverUrl, corsHandler); err != nil {
		log.Fatal("Could not start the server", err)
	}
}
