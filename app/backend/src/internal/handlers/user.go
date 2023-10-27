package handlers

import (
	acc "api-iutconnect/internal/services/account"
	emp "api-iutconnect/internal/services/employee"
	stu "api-iutconnect/internal/services/student"
	tut "api-iutconnect/internal/services/tutor"
	"api-iutconnect/output"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GetUsers gets all the users, including students, employees, and tutors.
//
// Parameter(s):
// - c: the fiber.Ctx object representing the HTTP request and response context.
//
// Return type(s):
// - error: an error object if there was an issue retrieving the users.
func GetUsers(c *fiber.Ctx) error {
	students, err := stu.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get students", err)
	}

	employees, err := emp.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employees", err)
	}

	tutors, err := tut.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get tutors", err)
	}

	users := map[string]interface{}{
		"users": []interface{}{students, employees, tutors},
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Users successfully gotten!", users)
}

// GetUser retrieves a user based on the provided ID from the database.
//
// The parameter `c` is a pointer to the fiber.Ctx object, which represents the HTTP context.
// It is used to extract the value of the "id" route parameter.
//
// The function returns an error if any of the following operations fail:
//   - Parsing the ID as an integer
//   - Getting the account by ID from the database
//   - Getting the user based on the role from the corresponding repository
//
// The function returns the retrieved user information as a map[string]interface{} and
// an HTTP status code of fiber.StatusOK to indicate success.
func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	userId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get user id", err)
	}

	account, err := acc.GetByID(int32(userId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get account", err)
	}

	if account.ID <= 0 {
		return output.ReturnError(c, fiber.StatusUnauthorized, "Failed to get user", err)
	}

	var user interface{}

	switch account.Role {
	case "student":
		user, err = stu.Get(int32(userId))
	case "tutor":
		user, err = tut.Get(int32(userId))
	case "employee":
		user, err = emp.Get(int32(userId))
	}

	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get user", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "User successfully get!", map[string]interface{}{
		"user": user,
	})
}
