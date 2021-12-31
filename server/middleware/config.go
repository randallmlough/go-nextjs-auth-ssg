package middleware

import (
	"github.com/randallmlough/nextjs-ssg-auth/db"
	"github.com/randallmlough/nextjs-ssg-auth/user"
)

type Config struct {
	PublicPaths map[string][]string
	CORS
}
type CORS struct {
	TrustedOrigins []string
}

type Service struct {
	db     *db.DB
	config Config
	user   UserGetter
}

type UserGetter interface {
	GetFromToken(tokenScope, tokenPlaintext string) (*user.User, error)
}

func New(config Config, db *db.DB, ug UserGetter) Service {
	return Service{config: config, db: db, user: ug}
}
