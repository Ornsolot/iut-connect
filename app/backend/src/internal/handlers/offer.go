package handlers

import (
	schema "api-iutconnect/internal/models/schema"
	off "api-iutconnect/internal/services/offer"
	"api-iutconnect/output"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// CreateOffer creates an offer using the provided request body.
//
// c - the fiber.Ctx object representing the HTTP request context.
// Returns an error, if any.
func CreateOffer(c *fiber.Ctx) error {
	var offer schema.Offer
	err := c.BodyParser(&offer)
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed to parse JSON request offer", err)
	}

	err = off.Create(&offer)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to create offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully created!", nil)
}

// GetOffer returns the offer with the specified ID.
//
// It takes a fiber.Ctx parameter which represents the context of the HTTP request.
// Returns an error if the offer ID is not valid or if there is an error while retrieving the offer.
func GetOffer(c *fiber.Ctx) error {
	id := c.Params("id")
	offerId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer id", err)
	}

	offer, err := off.Get(uint64(offerId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})
}

// GetOffers retrieves all offers.
//
// Parameters:
// - c: A pointer to a fiber.Ctx object.
//
// Returns:
// - error: An error if there was a problem retrieving the offers.
func GetOffers(c *fiber.Ctx) error {
	offer, err := off.GetAll()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})
}

// DeleteOffer deletes an offer.
//
// c: The fiber context.
// Returns an error.
func DeleteOffer(c *fiber.Ctx) error {
	id := c.Params("id")
	offerId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer id", err)
	}

	err = off.Delete(uint64(offerId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed delete offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully deleted!", nil)
}

// UpdateOffer updates an offer.
//
// c *fiber.Ctx: The fiber context.
// error: Returns an error if there's any.
func UpdateOffer(c *fiber.Ctx) error {
	id := c.Params("id")
	offerId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer id", err)
	}

	err = off.Update(uint64(offerId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed update offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully updated!", nil)
}

func ValidateOffer(c *fiber.Ctx) error {
	id := c.Params("id")
	offerId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer id", err)
	}

	err = off.Validate(uint64(offerId))
	if err != nil {
		return output.ReturnError(c, fiber.StatusBadRequest, "Failed update offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully updated!", nil)
}

func GetOffersForStudents(c *fiber.Ctx) error {
	offer, err := off.GetForStudents()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})
}

// GetArchivedOffers retrieves the archived offers.
//
// The function takes a pointer to a fiber.Ctx object as its parameter.
// It returns an error.
func GetArchivedOffers(c *fiber.Ctx) error {
	offer, err := off.GetArchived()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer", err)
	}

	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})

}

// GetActivedOffers retrieves the active offers.
//
// Takes a fiber context as a parameter.
// Returns an error.
func GetActivedOffers(c *fiber.Ctx) error {
	offer, err := off.GetActived()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer", err)
	}
	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})
}

func GetOffersForEmployee(c *fiber.Ctx) error {
	offer, err := off.GetForEmployee()
	if err != nil {
		return output.ReturnError(c, fiber.StatusInternalServerError, "Failed to get offer for Employee", err)
	}
	return output.ReturnMessage(c, fiber.StatusOK, "offer successfully get!", map[string]interface{}{
		"offer": offer,
	})
}
