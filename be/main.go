package main

import (
	"fmt"
	login "jkim3663/applogin/internal"

	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/login", login.LoginHandler).Methods("POST")
	router.HandleFunc("/test", login.TestHandler).Methods("POST")
	fmt.Println("Starting the server")
	// TODO: use dotenv and pull url from there
	err := http.ListenAndServe("localhost:8081", router)
	if err != nil {
		fmt.Println("Could not start the server", err)
	}
}
