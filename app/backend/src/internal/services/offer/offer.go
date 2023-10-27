package services

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func Create(offer *schema.Offer) error {
	err := functs.CreateOffer(offer)
	return err
}

func Update(id uint64) error {
	err := functs.UpdateOffer(id)
	return err
}

func Validate(id uint64) error {
	err := functs.ValidateOffer(id)
	return err
}

func Get(id uint64) (schema.Offer, error) {
	offer, err := functs.GetOffer(id)
	return offer, err
}

func GetAll() ([]schema.Offer, error) {
	var offers []schema.Offer
	offers, err := functs.GetAllOffers()
	return offers, err
}

func GetArchived() ([]schema.Offer, error) {
	var offers []schema.Offer
	offers, err := functs.GetArchivedOffers()
	return offers, err
}

func GetActived() ([]schema.Offer, error) {
	var offers []schema.Offer
	offers, err := functs.GetActivedOffers()
	return offers, err
}

func Delete(id uint64) error {
	err := functs.DeleteOffer(id)
	return err
}

func GetForStudents() ([]schema.Offer, error) {
	var offers []schema.Offer
	offers, err := functs.GetOffersForStudents()
	return offers, err
}

func GetForEmployee() ([]schema.Offer, error) {
	var offers []schema.Offer
	offers, err := functs.GetOffersForEmployee()
	return offers, err
}
