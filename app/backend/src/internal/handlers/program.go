package handlers

import (
	pro "api-iutconnect/internal/services/program"
	"api-iutconnect/output"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetPrograms retrieves all programs and returns them in the response.
//
// Parameters:
//
//	c - The Fiber context object.
//
// Returns:
//
//	An error if there was a problem retrieving the programs.
func GetPrograms(c *fiber.Ctx) error {
	programs, err := pro.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get programs", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Programs successfully get!", map[string]interface{}{
		"programs": programs,
	})
}

// GetProgram returns the program with the specified ID.
//
// It takes a *fiber.Ctx parameter and returns an error.
func GetProgram(c *fiber.Ctx) error {
	id := c.Params("id")
	programId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get program id", err)
	}

	program, err := pro.Get(uint64(programId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get program", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Program successfully get!", map[string]interface{}{
		"program": program,
	})
}

// func CreateProgram(c *fiber.Ctx) error {
// 	var program schema.Program
// 	err := c.BodyParser(&program)
// 	if err != nil {
// 		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request program", err)
// 	}

// 	err = pro.Create(&program)
// 	if err != nil {
// 		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create program", err)
// 	}

// 	return output.ReturnMessage(c, fiber.StatusOK, "Program successfully created!", nil)
// }

// func DeleteProgram(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	programId, err := strconv.ParseInt(id, 10, 64)
// 	if err != nil {
// 		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get program id", err)
// 	}

// 	err = pro.Delete(uint64(programId))
// 	if err != nil {
// 		return output.ReturnError(c, fiber.StatusBadRequest, "Failed delete program", err)
// 	}

// 	return output.ReturnMessage(c, fiber.StatusOK, "Program successfully deleted!", nil)
// }
