package session

import (
	functs "api-iutconnect/internal/models/functions"
	schema "api-iutconnect/internal/models/schema"
)

func GetAllOf(studentId uint64) ([]schema.CompleteStep, error) {
	var steps []schema.CompleteStep
	steps, err := functs.GetAllStepsOf(studentId)
	return steps, err
}

func ValidStep(userId uint64, eventId uint64) error {
	err := functs.UpdateStep(userId, eventId, map[string]interface{}{
		"is_validated": "true",
	})

	return err
}

func UnValidStep(userId uint64, eventId uint64) error {
	err := functs.UpdateStep(userId, eventId, map[string]interface{}{
		"is_validated": "false",
	})

	return err
}
