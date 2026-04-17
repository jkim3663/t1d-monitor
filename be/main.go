package main

import (
	"jkim3663/applogin/handlers"
	dbconnection "jkim3663/applogin/internal/db"
	"jkim3663/applogin/internal/initializer"
	dbsql "jkim3663/applogin/internal/sql"
	"jkim3663/applogin/middleware"
	"log"
	"net/http"
	"os"

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

	router := mux.NewRouter()
	router.HandleFunc("/register", h.RegisterUserHandler).Methods("POST")
	router.HandleFunc("/login", h.LoginHandler).Methods("POST")

	protectedRouter := router.PathPrefix("").Subrouter()
	protectedRouter.Use(middleware.RequireAuth)
	protectedRouter.HandleFunc("/test", h.TestHandler).Methods("POST")

	log.Println("Starting the server")

	serverUrl := os.Getenv("GO_APP_URL") + ":" + os.Getenv("PORT")
	if err := http.ListenAndServe(serverUrl, router); err != nil {
		log.Fatal("Could not start the server", err)
	}
}
