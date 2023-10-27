package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	services "api-iutconnect/internal/services"
	acc "api-iutconnect/internal/services/account"
	"api-iutconnect/output"
	"api-iutconnect/utils"

	"github.com/gofiber/fiber/v2"
)

// ResendConfirmMail is a function that resends the confirmation email to a user.
//
// It takes a *fiber.Ctx parameter which represents the context of the HTTP request.
// The function returns an error.
func ResendConfirmMail(c *fiber.Ctx) error {
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

	services.SendConfirmationMail(user.Mail)

	return output.ReturnMessage(c, fiber.StatusOK, "Confirmation email successfully sent!", nil)
}

// CheckMail checks the email token and confirms the user's email.
//
// The function takes a parameter c of type *fiber.Ctx, which represents the request context.
// It returns an error.
func CheckMail(c *fiber.Ctx) error {
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

	_, err = acc.Confirm(email)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "User doesn't exist", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Email successfully confirmed!", nil)
}
