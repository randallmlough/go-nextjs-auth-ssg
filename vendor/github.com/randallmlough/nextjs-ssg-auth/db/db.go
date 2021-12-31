package db

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"time"
)

// shared database errors
var (
	// ErrRecordNotFound error. We'll be returned from HTTP requests when
	// looking up a record that doesn't exist in our database.
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrDuplicateEmail = errors.New("duplicate email")
)

type Executor interface {
	Exec(ctx context.Context, sql string, arguments ...interface{}) (commandTag pgconn.CommandTag, err error)
	Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row
}

type DB struct {
	*pgxpool.Pool
}

type Config struct {
	ConnURL      string
	MaxOpenConns int
	MaxIdleConns int
}

func New(ctx context.Context, config Config) (*DB, error) {
	cfg, err := pgxpool.ParseConfig(config.ConnURL)
	if err != nil {
		return nil, fmt.Errorf("failed to initalize db config: %w", err)
	}

	cfg.MaxConns = int32(config.MaxOpenConns)
	cfg.MaxConnIdleTime = time.Minute * time.Duration(config.MaxIdleConns)
	pool, err := pgxpool.ConnectConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %w", err)
	}
	// Create a context with a 5-second timeout deadline.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Use PingContext() to establish a new connection to the database, passing in the
	// context we created above as a parameter. If the connection couldn't be
	// established successfully within the 5 second deadline, then this will return an
	// error.
	err = pool.Ping(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}
	return &DB{pool}, nil
}

// InTx runs the given function f within a transaction with isolation level isoLevel.
func (db *DB) InTx(ctx context.Context, isoLevel pgx.TxIsoLevel, f func(tx pgx.Tx) error) error {
	conn, err := db.Pool.Acquire(ctx)
	if err != nil {
		return fmt.Errorf("acquiring connection: %v", err)
	}

	defer conn.Release()

	tx, err := conn.BeginTx(ctx, pgx.TxOptions{IsoLevel: isoLevel})
	if err != nil {
		return fmt.Errorf("starting transaction: %v", err)
	}

	if err := f(tx); err != nil {
		if err1 := tx.Rollback(ctx); err1 != nil {
			return fmt.Errorf("rolling back transaction: %v (original error: %v)", err1, err)
		}
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("committing transaction: %v", err)
	}
	return nil
}
