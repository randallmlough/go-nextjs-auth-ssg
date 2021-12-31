package api

import (
	"errors"
	"github.com/randallmlough/nextjs-ssg-auth/config"
	"github.com/randallmlough/nextjs-ssg-auth/db"
	"github.com/randallmlough/nextjs-ssg-auth/user"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type API struct {
	config   config.Config
	db       *db.DB
	services Services
}

type Services struct {
	Users user.Service
}

func New(cfg config.Config, db *db.DB) *API {
	return &API{
		config:   cfg,
		db:       db,
		services: RegisterServices(db),
	}
}

func RegisterServices(db *db.DB) Services {
	userService := user.New(db)
	return Services{
		Users: userService,
	}
}
