package models

import (
	schema "api-iutconnect/internal/models/schema"
	"fmt"
)

func CreateOffer(offer *schema.Offer) error {
	statement := `SELECT create_offer($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
	_, err := db.Exec(statement, offer.Sector, offer.ComName, offer.Name, offer.Attachment, offer.Presentation, offer.Context, offer.Tools, offer.Result, offer.Contact, offer.URL)
	return err
}

func DeleteOffer(id uint64) error {
	statement := `
		DELETE FROM offer
		WHERE id = $1;
	`
	_, err := db.Exec(statement, id)

	return err
}

func UpdateOffer(id uint64) error {
	statement := `
		UPDATE offer
		SET is_blocked = true
		WHERE id = $1;
	`
	_, err := db.Exec(statement, id)

	return err
}

func ValidateOffer(id uint64) error {
	statement := `
		UPDATE offer
		SET approved = True
		WHERE id = $1;
	`
	_, err := db.Exec(statement, id)

	return err
}

func GetOffer(id uint64) (schema.Offer, error) {
	var offer schema.Offer

	statement := `
		SELECT id, name, com_name, mail, offer_name, context, result, sector, tools, attachment, url, date,  archived, approved
		FROM offer
		WHERE id = $1;
	`

	rows, err := db.Query(statement, id)
	if err != nil {
		return schema.Offer{}, err
	}

	for rows.Next() {
		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return schema.Offer{}, err
		}
	}

	return offer, nil
}

func GetAllOffers() ([]schema.Offer, error) {
	statement := `
	SELECT id, name, com_name, mail, offer_name, context, result, sector, tools, attachment, url, date,  archived, approved
	FROM offer;
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Offer{}, err
	}
	defer rows.Close()

	var offers []schema.Offer
	for rows.Next() {
		var offer schema.Offer
		println(fmt.Sprintf("%v", rows))
		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return []schema.Offer{}, err
		}
		offers = append(offers, offer)
	}

	if err = rows.Err(); err != nil {
		return []schema.Offer{}, err
	}

	return offers, nil
}

/*
Récupéré la liste des offres que verront les étudiants
*/

func GetOffersForStudents() ([]schema.Offer, error) {
	var studentOffers []schema.Offer

	statement := `
		SELECT
			id, name, com_name, mail, offer_name, context, result, sector, tools, attachment, url, date,  archived, approved
		FROM
			Offer
		WHERE
			Offer.approved = TRUE
		AND
			Offer.archived = FALSE
	`

	rows, err := db.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var offer schema.Offer

		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return nil, err
		}

		studentOffers = append(studentOffers, offer)
	}

	return studentOffers, nil
}

func GetArchivedOffers() ([]schema.Offer, error) {
	statement := `
	SELECT id, name, com_name, mail, offer_name, context, result, sector, tools, attachment, url, date,  archived, approved
	FROM offer
	WHERE archived = TRUE
	;
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Offer{}, err
	}
	defer rows.Close()

	var offers []schema.Offer
	for rows.Next() {
		var offer schema.Offer
		println(fmt.Sprintf("%v", rows))
		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return []schema.Offer{}, err
		}
		offers = append(offers, offer)
	}

	if err = rows.Err(); err != nil {
		return []schema.Offer{}, err
	}

	return offers, nil
}

func GetActivedOffers() ([]schema.Offer, error) {
	statement := `
	SELECT id, name, com_name, mail, offer_name, context, result, sector, tools, attachment, url, date,  archived, approved
	FROM offer
	WHERE archived = FALSE
	AND approved = TRUE
	;
	`
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Offer{}, err
	}
	defer rows.Close()

	var offers []schema.Offer
	for rows.Next() {
		var offer schema.Offer
		println(fmt.Sprintf("%v", rows))
		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return []schema.Offer{}, err
		}
		offers = append(offers, offer)
	}

	if err = rows.Err(); err != nil {
		return []schema.Offer{}, err
	}

	return offers, nil
}

func GetOffersForEmployee() ([]schema.Offer, error) {
	statement := `
    SELECT o.id, o.name, o.com_name, o.mail, o.offer_name, o.context, o.result, o.sector, o.tools, o.attachment, o.url, o.date,  o.archived, o.approved
    FROM offer o
    JOIN employee e ON o.com_name = e.com_name
    ;
    `
	rows, err := db.Query(statement)
	if err != nil {
		return []schema.Offer{}, err
	}
	defer rows.Close()

	var offers []schema.Offer
	for rows.Next() {
		var offer schema.Offer
		println(fmt.Sprintf("%v", rows))
		err := rows.Scan(&offer.ID, &offer.Name, &offer.ComName, &offer.Contact, &offer.Presentation, &offer.Context, &offer.Result, &offer.Sector, &offer.Tools, &offer.Attachment, &offer.URL, &offer.Date, &offer.Archived, &offer.Approved)
		if err != nil {
			return []schema.Offer{}, err
		}
		offers = append(offers, offer)
	}

	if err = rows.Err(); err != nil {
		return []schema.Offer{}, err
	}

	return offers, nil
}
