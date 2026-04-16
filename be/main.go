package main

import (
	initializer "jkim3663/applogin/internal/initializer"
	login "jkim3663/applogin/internal/login"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	initializer.LoadEnvVariables()

	router := mux.NewRouter()
	router.HandleFunc("/login", login.LoginHandler).Methods("POST")
	router.HandleFunc("/test", login.TestHandler).Methods("POST")
	log.Println("Starting the server")

	serverUrl := os.Getenv("GO_APP_URL") + ":" + os.Getenv("PORT")
	err := http.ListenAndServe(serverUrl, router)
	if err != nil {
		log.Println("Could not start the server", err)
	}
}
