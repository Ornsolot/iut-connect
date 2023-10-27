package endpoints

import (
	ini "api-iutconnect/config"
	"api-iutconnect/internal/handlers"
	"api-iutconnect/middleware"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// InitRoutes initializes the routes for the application.
func InitRoutes() {
	app := fiber.New()
	// Default CORS
	app.Use(cors.New())

	// Custom CORS
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "https://gofiber.io, https://gofiber.net",
	// 	AllowHeaders:  "Origin, Content-Type, Accept",
	// }))

	// Setup routes
	private := app.Group("/private", middleware.Authenticate)

	app.Post("/auth/register", handlers.Register)
	app.Post("/auth/login", handlers.Login)
	app.Post("/auth/send-confirmation-email", handlers.ResendConfirmMail)
	app.Post("/auth/email-confirmation/:token", handlers.CheckMail)
	app.Post("/auth/renew-password", handlers.ResendRenewPasswordMail)
	app.Post("/auth/renew-password/:token", handlers.RenewPassword)

	private.Post("/auth/logout", handlers.Logout)

	private.Get("/users", handlers.GetUsers)
	private.Get("/user/:id", handlers.GetUser)

	private.Patch("/student/:id", handlers.UpdateStudent)

	private.Get("/events", handlers.GetEvents)
	private.Get("/event/:id", handlers.GetEvent)
	private.Post("/event", handlers.CreateEvent)
	private.Delete("/event/:id", handlers.DeleteEvent)
	private.Delete("/events", handlers.DeleteEvents)

	private.Get("/steps/:user_id", handlers.GetStepsOf)
	private.Patch("/steps/:user_id/:event_id/valid", handlers.ValidStep)
	private.Patch("/steps/:user_id/:event_id/unvalid", handlers.UnValidStep)

	private.Get("/programs", handlers.GetPrograms)
	private.Get("/program/:id", handlers.GetProgram)
	// private.Post("/program", handlers.CreateProgram)
	// private.Delete("/program/:id", handlers.DeleteProgram)

	private.Get("/offers", handlers.GetOffers)
	private.Get("/offer/:id", handlers.GetOffer)
	private.Post("/offer", handlers.CreateOffer)
	private.Delete("/offer/:id", handlers.DeleteOffer)
	private.Patch("/offer/:id", handlers.UpdateOffer)
	private.Patch("/offers/validate/:id", handlers.ValidateOffer)
	private.Get("/offer", handlers.GetOffersForStudents)
	private.Get("/offers/actived", handlers.GetActivedOffers)
	private.Get("/offers/archived", handlers.GetArchivedOffers)
	private.Get("/offers/company", handlers.GetOffersForEmployee)

	private.Get("/companies", handlers.GetCompanies)
	private.Get("/company/:com_name", handlers.GetCompany)
	private.Post("/company", handlers.CreateCompany)
	private.Delete("/company/:com_name", handlers.DeleteCompany)

	private.Get("/employees", handlers.GetEmployees)
	private.Get("/employee/:id", handlers.GetEmployee)
	private.Post("/employee", handlers.CreateEmployee)
	private.Delete("/employee/:id", handlers.DeleteEmployee)
	private.Patch("/employee/assign/:id/:com_id", handlers.UpdateEmployeeWithCompany)

	private.Get("/students", handlers.GetStudents)
	private.Patch("/student/:id", handlers.UpdateStudent)
	private.Patch("/students", handlers.UpdateStudents)

	private.Get("/tutor/:tutor_id/students", handlers.GetStudentsByTutor)
	private.Get("/tutors", handlers.GetAllTutors)

	app.Listen(":" + strconv.Itoa(ini.Env.Backend.Port))
}
