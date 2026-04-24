package initializer

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	// in GCP VM this should be set to "dev"
	godotenv.Load()
	env := os.Getenv("T1D_APP_ENV")
	if env == "" {
		env = "local"
	}
	log.Println("env level: ", env)
	godotenv.Load(".env." + env)
	godotenv.Load() // default .env
}
