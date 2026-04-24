package dbconnection

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPool() (*pgxpool.Pool, error) {
	host := os.Getenv("AUTH_DB_HOST")
	port := os.Getenv("AUTH_DB_PORT")
	user := os.Getenv("AUTH_DB_USER")
	password := os.Getenv("AUTH_DB_PASSWORD")
	dbName := os.Getenv("AUTH_DB_NAME")
	sslmode := os.Getenv("AUTH_DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user,
		password,
		host,
		port,
		dbName,
		sslmode,
	)
	var dbPool *pgxpool.Pool
	var err error
	for i := 0; i < 15; i++ {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		dbPool, err = pgxpool.New(ctx, dsn)
		if err == nil {
			err = dbPool.Ping(ctx)
		}
		cancel()
		if err == nil {
			log.Println("database pool successfully created")
			return dbPool, nil
		}
		if dbPool != nil {
			dbPool.Close()
		}
		time.Sleep(2 * time.Second)

	}
	return dbPool, nil
}
