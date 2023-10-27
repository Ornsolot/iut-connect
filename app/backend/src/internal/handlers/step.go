package handlers

import (
	ste "api-iutconnect/internal/services/step"
	"api-iutconnect/output"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetStepsOf retrieves the steps for a given user.
//
// c - The fiber.Ctx object representing the context of the HTTP request.
// Returns an error if there was an issue retrieving the steps.
func GetStepsOf(c *fiber.Ctx) error {
	id := c.Params("user_id")
	userId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get step id", err)
	}

	steps, err := ste.GetAllOf(uint64(userId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get steps", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Steps successfully get!", map[string]interface{}{
		"steps": steps,
	})
}

// ValidStep validates a step.
//
// c *fiber.Ctx: The context object.
// error: The error, if any.
func ValidStep(c *fiber.Ctx) error {
	uId := c.Params("user_id")
	eId := c.Params("event_id")

	userId, err := strconv.ParseInt(uId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get user id", err)
	}

	eventId, err := strconv.ParseInt(eId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get step id", err)
	}

	err = ste.ValidStep(uint64(userId), uint64(eventId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to valid steps", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Steps successfully valid!", nil)
}

// UnValidStep is a function that performs an action to unvalidate a step.
//
// It takes in a pointer to a fiber.Ctx object as its parameter.
// It returns an error if there is any issue encountered during the unvalidation process.
func UnValidStep(c *fiber.Ctx) error {
	uId := c.Params("user_id")
	eId := c.Params("event_id")

	userId, err := strconv.ParseInt(uId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get user id", err)
	}

	eventId, err := strconv.ParseInt(eId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get step id", err)
	}

	err = ste.UnValidStep(uint64(userId), uint64(eventId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to unvalid steps", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Steps successfully unvalid!", nil)
}
