-- name: GetUser :one
SELECT * FROM users
WHERE email = $1;

-- name: InsertUserAndReturnId :one
INSERT INTO users (email, password_hash)
VALUES ($1, $2)
RETURNING id;