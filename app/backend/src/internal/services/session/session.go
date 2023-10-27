package session

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func Create(session *schema.Session) error {
	err := functs.CreateSession(session)
	return err
}

func Get(userId uint64, clientIp string, userAgent string) (schema.Session, error) {
	session, err := functs.GetSession(userId, clientIp, userAgent)
	return session, err
}

func Delete(userId uint64, userAgent string, clientIp string) error {
	err := functs.DeleteSession(userId, userAgent, clientIp)
	return err
}
