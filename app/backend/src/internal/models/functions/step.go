package models

import (
	schema "api-iutconnect/internal/models/schema"
	"strconv"
	"strings"
)

func CreateStep(step *schema.Step) error {
	statement := `
		INSERT INTO step(event_id, student_id, is_validated)
		VALUES ($1, $2, $3)
		RETURNING event_id, student_id, is_validated
		;
	`
	rows := db.QueryRow(statement, step.EventID, step.StudentID, step.IsValidated)

	err := rows.Scan(&step.EventID, &step.StudentID, &step.IsValidated)

	return err
}

func GetAllStepsOf(userId uint64) ([]schema.CompleteStep, error) {
	statement := `
	SELECT step.student_id, step.is_validated, event.id, event.name, event.deadline, event.color, event.icon, event.description
	FROM step
	JOIN event ON event.id = step.event_id
	WHERE student_id = $1
	`
	rows, err := db.Query(statement, userId)
	if err != nil {
		return []schema.CompleteStep{}, err
	}
	defer rows.Close()

	var steps []schema.CompleteStep
	for rows.Next() {
		var step schema.CompleteStep
		err := rows.Scan(&step.StudentID, &step.IsValidated, &step.ID, &step.Name, &step.Deadline, &step.Color, &step.Icon, &step.Description)
		if err != nil {
			return []schema.CompleteStep{}, err
		}
		steps = append(steps, step)
	}

	if err = rows.Err(); err != nil {
		return []schema.CompleteStep{}, err
	}

	return steps, nil
}

func UpdateStep(userID uint64, eventID uint64, updates map[string]interface{}) error {
	var setValues []string
	var values []interface{}

	index := 1
	for key, value := range updates {
		setValues = append(setValues, key+" = $"+strconv.Itoa(index))
		values = append(values, value)
		index++
	}

	updateCols := strings.Join(setValues, ", ")
	statement := "UPDATE step SET " + updateCols + " WHERE student_id = $" + strconv.Itoa(index) + " AND event_id = $" + strconv.Itoa(index+1)
	values = append(values, userID, eventID)

	println(statement)

	_, err := db.Exec(statement, values...)
	return err
}
