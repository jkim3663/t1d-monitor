package main

import (
	"jkim3663/applogin/handlers"
	dbconnection "jkim3663/applogin/internal/db"
	"jkim3663/applogin/internal/initializer"
	"jkim3663/applogin/internal/sql"
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

	queries := sql.New(pool)
	_ = queries

	router := mux.NewRouter()
	router.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
	router.HandleFunc("/test", handlers.TestHandler).Methods("POST")
	log.Println("Starting the server")

	serverUrl := os.Getenv("GO_APP_URL") + ":" + os.Getenv("PORT")
	if err := http.ListenAndServe(serverUrl, router); err != nil {
		log.Println("Could not start the server", err)
	}
}
