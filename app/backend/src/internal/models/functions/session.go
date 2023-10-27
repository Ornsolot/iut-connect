package models

import (
	schema "api-iutconnect/internal/models/schema"
)

func CreateSession(session *schema.Session) error {
	statement := `
		INSERT INTO session(user_id, user_agent, client_ip)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, user_agent, client_ip, expires_at, created_at
		;
	`
	rows := db.QueryRow(statement, session.UserId, session.UserAgent, session.ClientIp)

	err := rows.Scan(
		&session.ID, &session.UserId, &session.UserAgent, &session.ClientIp, &session.ExpiresAt, &session.CreatedAt,
	)

	return err
}

func DeleteSession(userId uint64, userAgent string, clientIp string) error {
	statement := `
		DELETE FROM session
		WHERE user_id = $1
		AND user_agent = $2
		AND client_ip = $3;
	`
	_, err := db.Exec(statement, userId, userAgent, clientIp)

	return err
}

func GetSession(userId uint64, clientIp string, userAgent string) (schema.Session, error) {
	var session schema.Session

	statement := `
		SELECT id, user_id, user_agent, client_ip, expires_at, created_at
		FROM session
		WHERE user_id = $1
		AND client_ip = $2
		AND user_agent = $3;
	`

	rows, err := db.Query(statement, userId, clientIp, userAgent)
	if err != nil {
		return schema.Session{}, err
	}

	for rows.Next() {
		err = rows.Scan(
			&session.ID, &session.UserId, &session.UserAgent, &session.ClientIp, &session.ExpiresAt, &session.CreatedAt,
		)
		if err != nil {
			return schema.Session{}, err
		}
	}

	return session, nil
}
