package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	services "api-iutconnect/internal/services"
	acc "api-iutconnect/internal/services/account"
	"api-iutconnect/output"
	"api-iutconnect/utils"

	"github.com/gofiber/fiber/v2"
)

// ResendRenewPasswordMail is a function that resends the renew password mail to a user.
//
// It takes a *fiber.Ctx object as a parameter.
// The function returns an error.
func ResendRenewPasswordMail(c *fiber.Ctx) error {
	var user schema.Account
	if err := c.BodyParser(&user); err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request", err)
	}

	user, err := acc.GetByMail(user.Mail)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to fetch user", err)
	}

	if user.ID == 0 {
		return output.ReturnError(c, fiber.StatusInternalServerError, "User doesn't exist", err)
	}

	services.SendRenewPasswordMail(user.Mail)

	return output.ReturnMessage(c, fiber.StatusOK, "Renew password email successfully sent!", nil)
}

// RenewPassword is a Go function that handles the renewal of a user's password.
//
// It takes a *fiber.Ctx parameter, which represents the context of the HTTP request.
// The function returns an error.
func RenewPassword(c *fiber.Ctx) error {
	var user schema.Account
	if err := c.BodyParser(&user); err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request", err)
	}

	token := c.Params("token")

	ok, claims, err := utils.ParseToken(token)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Invalid token", err)
	}

	if !ok {
		return output.ReturnError(c, fiber.StatusBadRequest, "Invalid token", nil)
	}

	email, ok := claims["email"].(string)
	if !ok {
		return output.ReturnError(c, fiber.StatusUnauthorized, "Invalid email in token", nil)
	}

	user, err = acc.RenewPassword(email, user.Password)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "User doesn't exist", err)
	}

	// Return
	acc.HidePassword(&user)
	message := "Password successfully renewed!"
	data := map[string]interface{}{"user": user}
	return output.ReturnMessage(c, fiber.StatusOK, message, data)
}
