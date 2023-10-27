package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	emp "api-iutconnect/internal/services/employee"
	"api-iutconnect/output"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateEmployee(c *fiber.Ctx) error {
	var employee schema.Employee
	err := c.BodyParser(&employee)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request employee", err)
	}

	err = emp.Create(&employee)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create employee", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "employee successfully created!", nil)
}

func GetEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	employeeId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employee id", err)
	}

	employee, err := emp.Get(int32(employeeId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employee", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "employee successfully get!", map[string]interface{}{
		"employee": employee,
	})
}

func GetEmployees(c *fiber.Ctx) error {
	employee, err := emp.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employee", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "employee successfully get!", map[string]interface{}{
		"employee": employee,
	})
}

func DeleteEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	employeeId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employee id", err)
	}

	err = emp.Delete(int32(employeeId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed delete employee", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "employee successfully deleted!", nil)
}

func UpdateEmployeeWithCompany(c *fiber.Ctx) error {
	id := c.Params("id")
	employeeId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get employee id", err)
	}
	com_id := c.Params("com_id")
	companyId, err := strconv.ParseInt(com_id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get company id", err)
	}

	err = emp.UpdateWithCompany(int32(employeeId), int32(companyId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed update employee", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "employee successfully updated!", nil)
}
