package middleware

import (
	"jkim3663/applogin/internal/auth"
	"net/http"
)

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("access_token")
		if err != nil {
			http.Error(w, "Missing auth cookie", http.StatusUnauthorized)
			return
		}

		if err := auth.VerifyToken(cookie.Value); err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
