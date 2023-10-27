package event

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func Create(event *schema.Event) error {
	err := functs.CreateEvent(event)
	if err != nil {
		return err
	}

	// Pour chaque étudiant (student) qui correspond au parcours de l'évènement (event), on créé une étape (step)

	for _, program := range event.Programs {
		students, err := functs.GetStudentsByProgram(program)
		if err != nil {
			return err
		}
		for _, student := range students {
			step := &schema.Step{
				EventID:   event.ID,
				StudentID: student.ID,
			}
			err := functs.CreateStep(step)
			if err != nil {
				return err
			}
		}
	}

	return err
}

func Get(id uint64) (schema.Event, error) {
	event, err := functs.GetEvent(id)
	return event, err
}

func GetAll() ([]schema.Event, error) {
	var events []schema.Event
	events, err := functs.GetAllEvents()
	return events, err
}

func Delete(id uint64) error {
	err := functs.DeleteEvent(id)
	return err
}

func Deletes(ids ...interface{}) error {
	err := functs.DeleteEvents(ids...)
	return err
}
