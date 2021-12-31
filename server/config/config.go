package config

import (
	"flag"
	"os"
	"strings"

	"github.com/randallmlough/nextjs-ssg-auth/db"

	"github.com/randallmlough/nextjs-ssg-auth/middleware"
)

type Config struct {
	Version string
	Port    int
	Env     string
	DB      db.Config
	SMTP    struct {
		Host     string
		Port     int
		Username string
		Password string
		Sender   string
	}
	middleware.CORS
}

func New() Config {
	return parseFlags()
}

func parseFlags() Config {
	var cfg Config

	flag.IntVar(&cfg.Port, "port", 8080, "API server port")
	flag.StringVar(&cfg.Env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.DB.ConnURL, "db-dsn", os.Getenv("NEXTJS_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.DB.MaxOpenConns, "max-open-cons", 25, "Max db open connections")
	flag.IntVar(&cfg.DB.MaxOpenConns, "max-idle-cons", 25, "Max db idle connections")
	flag.Func("cors-trusted-origins", "Trusted CORS origins (space separated)", func(val string) error {
		cfg.CORS.TrustedOrigins = strings.Fields(val)
		return nil
	})
	flag.Parse()
	return cfg
}
