package logs

import (
	"api-iutconnect/output"
	"fmt"
	"log"
	"os"
	"time"
)

func LogInstance(path string) {
	now := time.Now()
	dateString := now.Format("02-01-2006 15h04s05")

	if err := os.MkdirAll(path, os.ModePerm); err != nil {
		log.Fatal("Error creating log directory:", err)
	}

	logFile, err := os.Create(fmt.Sprintf("%s/%s.log", path, dateString))
	if err != nil {
		log.Fatal("Error creating log file:", err)
	}
	defer logFile.Close()

	output.SetDeepLog(true)
	output.SetDeepPrint(true)

	log.SetOutput(logFile)
}
