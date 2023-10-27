package student

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
	"api-iutconnect/utils"
	"errors"
)

func Create(student *schema.Student) error {
	HashPassword(student)

	// // On récupère le programme (program) de l'étudiant qui correspond à son adresse e-mail universitaire
	// universityMail, err := functs.GetProgramFromUniversityMail(student.MailUBS)
	// if err != nil {
	// 	return err
	// }
	// student.ProgramID = universityMail.ID

	// On vérifie que l'e-mail universitaire est valide
	emailIsValid, err := functs.IsValidUniversityEmail(student.UniversityMail.MailUBS)
	if err != nil {
		return err
	}
	if !emailIsValid {
		return errors.New("this email is not valid")
	}

	err = functs.CreateStudent(student)
	if err != nil {
		return err
	}

	// On récupère l'identifiant de l'étudiant qui vient d'être créé
	studentID, err := functs.GetStudentIDFromUBSMail(student.UniversityMail.MailUBS)
	if err != nil {
		return err
	}
	student.ID = studentID
	// Pour chaque évènement (event) qui correspond au parcours de l'étudiant (student), on créé une étape (step)
	studentProgram, err := functs.GetProgramFromUniversityMail(student.UniversityMail.MailUBS)
	if err != nil {
		return err
	}
	events, err := functs.GetEventsByProgramID(studentProgram.ProgID)
	if err != nil {
		return err
	}
	for _, event := range events {
		step := &schema.Step{
			EventID:   event.ID,
			StudentID: student.ID,
		}
		err := functs.CreateStep(step)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetAll() ([]schema.Student, error) {
	var students []schema.Student
	students, err := functs.GetAllStudents()
	return students, err
}

func Get(id int32) (schema.Student, error) {
	var student = schema.Student{}
	student, err := functs.GetStudent(id)
	return student, err
}

func Update(id uint64, updates map[string]interface{}) error {
	err := functs.UpdateStudent(id, updates)

	return err
}

func Updates(updates map[string]interface{}, ids ...interface{}) error {
	err := functs.UpdateStudents(updates, ids...)

	return err
}

func GetByTutor(id uint64) ([]schema.Student, error) {
	var students []schema.Student
	students, err := functs.GetStudentsByTutor(id)
	return students, err
}

func HidePassword(student *schema.Student) {
	functs.HideStudentPassword(student)
}

func HashPassword(student *schema.Student) error {
	studentPassword := student.Account.Password

	hashedPassword, err := utils.HashPassword(studentPassword)
	if err != nil {
		return err
	}

	student.Account.Password = hashedPassword
	return nil
}
