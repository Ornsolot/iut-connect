package handlers

import (
	tut "api-iutconnect/internal/services/tutor"
	"api-iutconnect/output"
	"strconv"

	schema "api-iutconnect/internal/models/schema"

	"github.com/gofiber/fiber/v2"
)

// GetAllTutors retrieves all the tutors.
//
// c: a pointer to a fiber.Ctx object.
// Returns an error.
func GetAllTutors(c *fiber.Ctx) error {
	var tutors []schema.Tutor
	tutors, err := tut.GetAll()
	if err != nil {
		message := "Failed to get tutors"
		return output.ReturnError(c, fiber.StatusInternalServerError, message, err)
	}

	message := "tutors successfully get!"
	data := map[string]interface{}{"tutors": tutors}
	return output.ReturnMessage(c, fiber.StatusOK, message, data)
}

// UpdateTutor updates a tutor's information.
//
// c - The Fiber context object.
// Returns an error.
func UpdateTutor(c *fiber.Ctx) error {
	uId := c.Params("id")
	userId, err := strconv.ParseInt(uId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get tutor id", err)
	}

	var updates map[string]interface{}
	err = c.BodyParser(&updates)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request tutor", err)
	}

	err = tut.Update(uint64(userId), updates)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to update tutor", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Tutor successfully updated!", nil)
}
