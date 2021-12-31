package token

import (
	"context"
	"time"

	"github.com/randallmlough/nextjs-ssg-auth/db"
)

// insert adds the data for a specific token to the tokens table.
func insert(db db.Executor, token *Token) error {
	query := `
        INSERT INTO tokens (hash, user_id, expiry, scope) 
        VALUES ($1, $2, $3, $4)`

	args := []interface{}{token.Hash, token.UserID, token.Expiry, token.Scope}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := db.Exec(ctx, query, args...)
	return err
}

// delete removes a token for a specific user from the tokens table.
func delete(db db.Executor, tokenHash string, userID int64) error {
	query := `
        DELETE FROM tokens WHERE hash = $1 AND user_id = $2`

	args := []interface{}{tokenHash, userID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := db.Exec(ctx, query, args...)
	return err
}

// deleteAllForUser deletes all tokens for a specific user and scope.
func deleteAllForUser(db db.Executor, scope string, userID int64) error {
	query := `
        DELETE FROM tokens 
        WHERE scope = $1 AND user_id = $2`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := db.Exec(ctx, query, scope, userID)
	return err
}
