package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	stu "api-iutconnect/internal/services/student"
	"strings"

	"api-iutconnect/output"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// UpdateStudent updates a student record.
//
// The function takes a fiber.Ctx object as its parameter.
// It returns an error.
func UpdateStudent(c *fiber.Ctx) error {
	uId := c.Params("id")
	userId, err := strconv.ParseInt(uId, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get student id", err)
	}

	var updates map[string]interface{}
	err = c.BodyParser(&updates)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request student", err)
	}

	err = stu.Update(uint64(userId), updates)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to update student", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Student successfully updated!", nil)
}

// UpdateStudents updates the students' information based on the provided updates.
//
// It expects a JSON body containing the updates for the students. If the JSON parsing fails,
// it returns an error with the appropriate status code.
//
// The student IDs are retrieved from the query parameters. The IDs are expected to be
// comma-separated. If the ID parsing fails, it returns an error with the appropriate status code.
//
// The function then calls the stu.Updates() function to perform the updates using the provided
// updates and student IDs. If the update operation fails, it returns an error with the appropriate
// status code.
//
// Finally, it returns a success message with the appropriate status code.
//
// Parameters:
// - c: The fiber.Ctx object representing the HTTP request context.
//
// Returns:
// - An error if any of the operations fail, otherwise nil.
func UpdateStudents(c *fiber.Ctx) error {
	var updates map[string]interface{}
	err := c.BodyParser(&updates)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request student", err)
	}
	idParams := c.Query("ids")
	splitedParams := strings.Split(idParams, ",")

	var ids []interface{}
	for _, id := range splitedParams {
		numId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request events", err)
		}
		ids = append(ids, numId)
	}

	err = stu.Updates(updates, ids...)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to update student", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Student successfully updated!", nil)
}

// GetStudents retrieves a list of students.
//
// It takes a *fiber.Ctx parameter and returns an error.
func GetStudents(c *fiber.Ctx) error {
	var students []schema.Student
	students, err := stu.GetAll()
	if err != nil {
		message := "Failed to get students"
		return output.ReturnError(c, fiber.StatusInternalServerError, message, err)
	}

	message := "Students successfully get!"
	data := map[string]interface{}{"students": students}
	return output.ReturnMessage(c, fiber.StatusOK, message, data)
}

// GetStudentsByTutor retrieves a list of students associated with a tutor.
//
// c *fiber.Ctx: The fiber context object for handling HTTP requests and responses.
// Returns an error if there was a problem retrieving the students.
func GetStudentsByTutor(c *fiber.Ctx) error {
	tutorID := c.Params("tutor_id")
	println(fmt.Sprintf("TUTOR ID ======> %v", tutorID))
	tutorIDUint, err := strconv.ParseUint(tutorID, 10, 64)
	if err != nil {
		message := "Invalid tutorID"
		return output.ReturnError(c, fiber.StatusBadRequest, message, err)
	}

	students, err := stu.GetByTutor(tutorIDUint)
	if err != nil {
		message := "Failed to get students by tutor"
		return output.ReturnError(c, fiber.StatusInternalServerError, message, err)
	}

	message := "Students by tutor successfully retrieved!"
	data := map[string]interface{}{"students": students}
	return output.ReturnMessage(c, fiber.StatusOK, message, data)
}
