package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	services "api-iutconnect/internal/services"
	acc "api-iutconnect/internal/services/account"
	emp "api-iutconnect/internal/services/employee"
	ses "api-iutconnect/internal/services/session"
	stu "api-iutconnect/internal/services/student"
	tut "api-iutconnect/internal/services/tutor"
	"api-iutconnect/output"
	"api-iutconnect/utils"

	"github.com/gofiber/fiber/v2"
)

// Register handles the registration of a user based on their role.
//
// It takes a *fiber.Ctx as a parameter.
// It returns an error if there was an issue parsing the JSON request or registering the user.
func Register(c *fiber.Ctx) error {
	var account schema.Account
	err := c.BodyParser(&account)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request account", err)
	}

	switch account.Role {
	case "student":
		var student schema.Student

		err := c.BodyParser(&student)
		if err != nil {
			return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request student", err)
		}
		student.Account = account

		err = stu.Create(&student)
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to register as a student", err)
		}
	case "employee":
		var employee schema.Employee

		err := c.BodyParser(&employee)
		if err != nil {
			return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request employee", err)
		}
		employee.Account = account

		err = emp.Create(&employee)
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to register as a employee", err)
		}

	case "tutor":
		var tutor schema.Tutor

		err := c.BodyParser(&tutor)
		if err != nil {
			return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request", err)
		}
		tutor.Account = account

		err = tut.Create(&tutor)
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to register as a tutor", err)
		}
	default:
		return output.ReturnError(c, fiber.StatusBadRequest, "Invalid role", nil)
	}

	services.SendConfirmationMail(account.Mail)

	acc.HidePassword(&account)
	message := "User successfully registered!"
	data := map[string]interface{}{"account": account}
	return output.ReturnMessage(c, fiber.StatusOK, message, data)
}

// Login handles the login functionality.
//
// It takes a *fiber.Ctx object as a parameter.
// It returns an error.
func Login(c *fiber.Ctx) error {
	var user schema.Account

	if err := c.BodyParser(&user); err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request", err)
	}

	account, err := acc.GetByMail(user.Mail)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to log in user", err)
	}

	if account.ID == 0 {
		return output.ReturnError(c, fiber.StatusInternalServerError, "User doesn't exist", err)
	}

	if !account.Confirmed {
		return output.ReturnError(c, fiber.StatusUnauthorized, "This user is not confirmed", nil)
	}

	if err = utils.CheckPassword(user.Password, account.Password); err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Incorrect email or password", err)
	}

	var session schema.Session

	session.UserId = account.ID
	session.ClientIp = c.IP()
	session.UserAgent = string(c.Request().Header.UserAgent())

	existingSession, _ := ses.Get(session.UserId, session.ClientIp, session.UserAgent)

	sessionExists := existingSession.ID != 0
	if !sessionExists {
		err = ses.Create(&session)
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create session", err)
		}
	} else {
		session = existingSession
	}

	switch account.Role {
	case "student":
		student, err := stu.Get(int32(account.ID))
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to retrieve student data", err)
		}
		data := map[string]interface{}{
			"user": student,
		}
		message := "User successfully logged in!"
		return output.ReturnMessage(c, fiber.StatusOK, message, data)

	case "tutor":
		tutor, err := tut.Get(int32(account.ID))
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to retrieve tutor data", err)
		}
		// Not sure
		acc.HidePassword(&account)

		data := map[string]interface{}{
			"user": tutor,
		}
		message := "Tutor successfully logged in!"
		return output.ReturnMessage(c, fiber.StatusOK, message, data)

	case "employee":
		employee, err := emp.Get(int32(account.ID))
		if err != nil {
			return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to retrieve employee data", err)
		}
		// Not sure
		acc.HidePassword(&account)

		data := map[string]interface{}{
			"user": employee,
		}

		message := "Employee successfully logged in!"
		return output.ReturnMessage(c, fiber.StatusOK, message, data)

	default:
		return output.ReturnError(c, fiber.StatusBadRequest, "Invalid role", nil)

	}
}

// Logout logs out the user.
//
// c is a pointer to a fiber.Ctx object representing the current HTTP request context.
// It is used to access the request information and the user session.
// The function returns an error indicating whether the logout was successful or not.
func Logout(c *fiber.Ctx) error {
	user, _ := c.Locals("user").(schema.Account)
	session, err := ses.Get(user.ID, c.IP(), string(c.Request().Header.UserAgent()))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to fetch session", err)
	}

	err = ses.Delete(uint64(user.ID), session.UserAgent, session.ClientIp)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to logout user", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "User successfully logged out!", nil)
}
