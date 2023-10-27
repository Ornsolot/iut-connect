package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	eve "api-iutconnect/internal/services/event"
	"api-iutconnect/output"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// GetEvents is a function that retrieves events from the database.
//
// It takes a *fiber.Ctx parameter and returns an error.
func GetEvents(c *fiber.Ctx) error {
	events, err := eve.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get events", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Events successfully get!", map[string]interface{}{
		"events": events,
	})
}

// GetEvent retrieves an event based on the provided ID.
//
// It takes a *fiber.Ctx parameter and returns an error. The *fiber.Ctx parameter represents the context of the HTTP request.
// The function retrieves the ID from the request parameters and converts it to an int64 using strconv.ParseInt.
// If there is an error during the conversion, the function returns an error using the output.ReturnError function.
// Otherwise, it calls the eve.Get function to retrieve the event based on the converted ID.
// If there is an error during the retrieval, the function returns an error using the output.ReturnError function.
// Finally, the function returns a success message and the retrieved event using the output.ReturnMessage function.
func GetEvent(c *fiber.Ctx) error {
	id := c.Params("id")
	eventId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get event id", err)
	}

	event, err := eve.Get(uint64(eventId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get event", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Event successfully get!", map[string]interface{}{
		"event": event,
	})
}

// CreateEvent creates a new event.
//
// c: A pointer to the fiber.Ctx object representing the HTTP context.
// Returns an error.
func CreateEvent(c *fiber.Ctx) error {
	var event schema.Event
	err := c.BodyParser(&event)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request event", err)
	}

	err = eve.Create(&event)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create event", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Event successfully created!", nil)
}

// DeleteEvent deletes an event by its ID.
//
// Parameter:
// - c: a pointer to a fiber.Ctx object, which represents the context of the HTTP request.
//
// Return type:
// - error: an error object, if any error occurs during the deletion process.
func DeleteEvent(c *fiber.Ctx) error {
	id := c.Params("id")
	eventId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get event id", err)
	}

	err = eve.Delete(uint64(eventId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed delete event", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Event successfully deleted!", nil)
}

// DeleteEvents deletes events based on the given IDs.
//
// Parameters:
// - c: A pointer to the fiber.Ctx object.
//
// Returns:
// - An error if there was an error while deleting the events.
func DeleteEvents(c *fiber.Ctx) error {
	idParams := c.Query("ids")
	splitedParams := strings.Split(idParams, ",")

	var ids []interface{}
	for _, id := range splitedParams {
		numId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request events", err)
		}
		ids = append(ids, interface{}(numId))
	}

	err := eve.Deletes(ids...)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed delete event", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "Event successfully deleted!", nil)
}
