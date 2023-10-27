package tutor

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
	"api-iutconnect/utils"
	"errors"
)

func Create(tutor *schema.Tutor) error {
	HashPassword(tutor)

	emailIsValid, err := functs.IsValidUniversityEmail(tutor.UniversityMail.MailUBS)
	if err != nil {
		return err
	}
	if !emailIsValid {
		return errors.New("this email is not valid")
	}

	err = functs.CreateTutor(tutor)
	if err != nil {
		return err
	}

	return nil
}

func GetAll() ([]schema.Tutor, error) {
	var tutors []schema.Tutor
	tutors, err := functs.GetAllTutors()
	return tutors, err
}

func Get(id int32) (schema.Tutor, error) {
	var tutor = schema.Tutor{}
	tutor, err := functs.GetTutor(id)
	return tutor, err
}

func HidePassword(tutor *schema.Tutor) {
	functs.HideTutorPassword(tutor)
}

func HashPassword(tutor *schema.Tutor) error {
	tutorPassword := tutor.Account.Password

	hashedPassword, err := utils.HashPassword(tutorPassword)
	if err != nil {
		return err
	}

	tutor.Account.Password = hashedPassword
	return nil
}

func Update(id uint64, updates map[string]interface{}) error {
	err := functs.UpdateTutor(id, updates)

	return err
}
