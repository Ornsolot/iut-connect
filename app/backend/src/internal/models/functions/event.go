package models

import (
	schema "api-iutconnect/internal/models/schema"
	"strconv"
	"strings"
)

func CreateEvent(event *schema.Event) error {
	statement := `
		INSERT INTO event(name, deadline, color, icon, description)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
		;
	`
	rows := db.QueryRow(statement,
		event.Name, event.Deadline, event.Color, event.Icon, event.Description,
	)

	err := rows.Scan(&event.ID)
	if err != nil {
		return err
	}

	for _, program := range event.Programs {
		statement = `
			INSERT INTO program_event(program_id, event_id)
			VALUES ($1, $2)
			;
		`
		_, err = db.Exec(statement, program, event.ID)
	}

	return err
}

func DeleteEvent(id uint64) error {
	statement := `
		DELETE FROM program_event WHERE event_id = $1;
		DELETE FROM step WHERE event_id = $1;
		DELETE FROM event WHERE id = $1;
	`
	_, err := db.Exec(statement, id)

	return err
}

func DeleteEvents(ids ...interface{}) error {
	programEvents := `DELETE FROM program_event WHERE `
	steps := `DELETE FROM step WHERE `
	events := `DELETE FROM event WHERE `

	for i, _ := range ids {
		if i != 0 {
			programEvents += " OR "
			steps += " OR "
			events += " OR "
		}
		programEvents += "event_id = $" + strconv.Itoa(i+1)
		steps += "event_id = $" + strconv.Itoa(i+1)
		events += "id = $" + strconv.Itoa(i+1)
	}

	statement := programEvents + "; "
	_, err := db.Exec(statement, ids...)
	if err != nil {
		return err
	}

	statement = steps + "; "
	_, err = db.Exec(statement, ids...)
	if err != nil {
		return err
	}

	statement = events + "; "
	_, err = db.Exec(statement, ids...)
	if err != nil {
		return err
	}

	return err
}

func UpdateEvent(id uint64, updates map[string]interface{}) error {
	var setValues []string
	var values []interface{}

	index := 1
	for key, value := range updates {
		setValues = append(setValues, key+" = $"+strconv.Itoa(index))
		values = append(values, value)
		index++
	}

	updateCols := strings.Join(setValues, ", ")
	statement := "UPDATE event SET " + updateCols + " WHERE id = $" + strconv.Itoa(index)
	values = append(values, id)

	println(statement)

	_, err := db.Exec(statement, values...)
	return err
}

func GetEvent(id uint64) (schema.Event, error) {
	// var event schema.RawEvent

	statement := `
	SELECT e.id, e.name, e.deadline, e.color, e.icon, e.description, p.id, y.name, d.name, m.name
	FROM event e
	JOIN program_event pe ON e.id = pe.event_id
	LEFT JOIN program p ON p.id = pe.program_id
	LEFT JOIN year_group y ON p.year_group_id = y.id
	LEFT JOIN department d ON p.department_id = d.id
	LEFT JOIN major m ON p.major_id = m.id
	WHERE e.id = $1;
	`

	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Event{}, err
	}
	defer rows.Close()

	var events []schema.RawEvent
	for rows.Next() {
		var event schema.RawEvent
		err := rows.Scan(&event.ID, &event.Name, &event.Deadline, &event.Color, &event.Icon, &event.Description)
		if err != nil {
			return schema.Event{}, err
		}
		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		return schema.Event{}, err
	}

	// rows, err := db.Query(statement, id)
	// if err != nil {
	// 	return schema.Event{}, err
	// }

	// for rows.Next() {
	// 	err := rows.Scan(&event.ID, &event.Name, &event.Deadline, &event.Color, &event.Icon, &event.Description)
	// 	if err != nil {
	// 		return schema.Event{}, err
	// 	}
	// }

	var programs []schema.Program
	var ids []uint64
	for _, event := range events {
		programs = append(programs, schema.Program{ProgID: event.ProgramID, YearGroup: event.YearGroup, Department: event.Department, Major: event.Major})
		ids = append(ids, event.ProgramID)
	}

	event := schema.Event{
		ID:           events[0].ID,
		Name:         events[0].Name,
		Deadline:     events[0].Deadline,
		Color:        events[0].Color,
		Icon:         events[0].Icon,
		Description:  events[0].Description,
		Programs:     ids,
		ProgramsData: programs,
	}
	return event, nil
}

func GetAllEvents() ([]schema.Event, error) {
	statement := `
	SELECT e.id, e.name, e.deadline, e.color, e.icon, e.description, p.id, y.name, d.name, m.name
	FROM event e
	JOIN program_event pe ON e.id = pe.event_id
	LEFT JOIN program p ON p.id = pe.program_id
	LEFT JOIN year_group y ON p.year_group_id = y.id
	LEFT JOIN department d ON p.department_id = d.id
	LEFT JOIN major m ON p.major_id = m.id
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Event{}, err
	}
	defer rows.Close()

	var events []schema.RawEvent
	for rows.Next() {
		var event schema.RawEvent
		err := rows.Scan(&event.ID, &event.Name, &event.Deadline, &event.Color, &event.Icon, &event.Description, &event.ProgramID, &event.YearGroup, &event.Department, &event.Major)
		if err != nil {
			return []schema.Event{}, err
		}
		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		return []schema.Event{}, err
	}

	var returnedEvents []schema.Event
	for _, event := range events {
		index := -1
		for i, e := range returnedEvents {
			if e.ID == event.ID {
				index = i
			}
		}
		if index == -1 {
			returnedEvents = append(
				returnedEvents,
				schema.Event{
					ID:          event.ID,
					Name:        event.Name,
					Deadline:    event.Deadline,
					Color:       event.Color,
					Icon:        event.Icon,
					Description: event.Description,
					Programs: []uint64{
						event.ProgramID,
					},
					ProgramsData: []schema.Program{
						{
							ProgID:     event.ProgramID,
							YearGroup:  event.YearGroup,
							Department: event.Department,
							Major:      event.Major,
						},
					},
				},
			)
		} else {
			returnedEvents[index].Programs = append(returnedEvents[index].Programs, event.ProgramID)
			returnedEvents[index].ProgramsData = append(returnedEvents[index].ProgramsData, schema.Program{
				ProgID:     event.ProgramID,
				YearGroup:  event.YearGroup,
				Department: event.Department,
				Major:      event.Major,
			})
		}
	}

	return returnedEvents, nil
}

func GetEventsByProgramID(programID uint64) ([]schema.Event, error) {
	statement := `
		SELECT e.id, e.name, e.deadline, e.color, e.icon, e.description
		FROM event e
		LEFT JOIN program_event pe ON e.id = pe.event_id
		WHERE pe.program_id = $1
		;
	`
	rows, err := db.Query(statement, programID)
	if err != nil {
		return []schema.Event{}, err
	}
	defer rows.Close()

	var events []schema.Event
	for rows.Next() {
		var event schema.Event
		err := rows.Scan(&event.ID, &event.Name, &event.Deadline, &event.Color, &event.Icon, &event.Description)
		if err != nil {
			return []schema.Event{}, err
		}
		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		return []schema.Event{}, err
	}

	return events, nil
}
