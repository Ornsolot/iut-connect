package middleware

import (
	functs "api-iutconnect/internal/models/functions"
	"api-iutconnect/output"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Authenticate authenticates the user by checking the User header in the request context.
//
// Parameters:
// - c: *fiber.Ctx - the context object containing the request and response information.
//
// Returns:
// - error: an error if there was an issue during authentication, or nil if the authentication was successful.
func Authenticate(c *fiber.Ctx) error {
	userHeader := c.Get("User")
	if userHeader == "" {
		return output.ReturnError(c, fiber.StatusUnauthorized, "Missing User header", nil)
	}

	parsedUserID, _ := strconv.Atoi(userHeader)

	userID := uint64(parsedUserID)
	userAgent := string(c.Request().Header.UserAgent())
	clientIP := c.IP()

	session, err := functs.GetSession(userID, clientIP, userAgent)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to fetch session", err)
	}

	defaultTime := time.Time{}
	sessionExists := session.ExpiresAt != defaultTime
	if !sessionExists {
		return output.ReturnError(c, fiber.StatusUnauthorized, "Session doesn't exist", nil)
	}

	currentTime := time.Now()
	sessionIsExpired := session.ExpiresAt.Before(currentTime)

	if sessionIsExpired {
		err = functs.DeleteSession(userID, userAgent, clientIP)
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to delete session", err)
		}
		return output.ReturnError(c, fiber.StatusUnauthorized, "Session expired", nil)
	}

	user, err := functs.GetAccountByID(int32(session.UserId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to fetch user", err)
	}

	c.Locals("user", user)

	return c.Next()
}
