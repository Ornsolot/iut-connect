package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	comp "api-iutconnect/internal/services/company"
	"api-iutconnect/output"

	"github.com/gofiber/fiber/v2"
)

func GetCompanies(c *fiber.Ctx) error {
	company, err := comp.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get Company", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Company successfully get!", map[string]interface{}{
		"company": company,
	})
}

func GetCompany(c *fiber.Ctx) error {
	name := c.Params("com_name")

	company, err := comp.Get(name)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get company", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "company successfully get!", map[string]interface{}{
		"company": company,
	})
}

func CreateCompany(c *fiber.Ctx) error {
	var company schema.Company
	err := c.BodyParser(&company)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request company", err)
	}

	err = comp.Create(&company)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create company", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "company successfully created!", nil)
}

func DeleteCompany(c *fiber.Ctx) error {
	name := c.Params("com_name")

	comp.Delete(name)

	return output.ReturnMessage(c, fiber.StatusOK, "company successfully deleted!", nil)
}
