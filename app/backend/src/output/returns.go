package output

import (
	"fmt"
	"log"
	"runtime"
	"time"

	"github.com/gofiber/fiber/v2"
)

func ReturnError(c *fiber.Ctx, status int, message string, err error) error {
	_, file, line, _ := runtime.Caller(1)
	printLog(status, c.Method(), c.Path(), message, c.IP(), string(c.Request().Header.UserAgent()), file, line, err)
	printConsole(clr.BgRed, status, c.Method(), c.Path(), message, c.IP(), string(c.Request().Header.UserAgent()), file, line, err)

	return c.Status(status).JSON(fiber.Map{
		"error": message,
	})
}

func ReturnMessage(c *fiber.Ctx, status int, message string, data map[string]interface{}) error {
	_, file, line, _ := runtime.Caller(1)
	printLog(status, c.Method(), c.Path(), message, c.IP(), string(c.Request().Header.UserAgent()), file, line, nil)
	printConsole(clr.BgGreen, status, c.Method(), c.Path(), message, c.IP(), string(c.Request().Header.UserAgent()), file, line, nil)

	if data == nil {
		return c.Status(status).JSON(fiber.Map{
			"message": message,
		})
	} else {
		return c.Status(status).JSON(fiber.Map{
			"message": message,
			"data":    data,
		})
	}
}

func printLog(status int, method string, path string, message string, ip string, userAgent string, file string, line int, err error) string {
	str := fmt.Sprintf("▶ [%v] %v\t (%v) : %v", status, method, path, message)
	if deepLog {
		str += fmt.Sprintf("\n\trequest from %v with %v\n\tlog from %v:%v", ip, userAgent, file, line)
	}
	if err != nil {
		str += fmt.Sprintf("\n\t► %v", err)
	}
	log.Println(str)
	return str
}

func printConsole(statusColor string, status int, method string, path string, message string, ip string, userAgent string, file string, line int, err error) string {
	str := fmt.Sprintf("[%v] ▶ %v %v \u001b[0m \u001b[1m%v\t\u001b[0m \u001b[4m%v\u001b[0m", time.Now().Format("2006/01/02 15:04:05"), statusColor, status, method, path)
	for i := len(str); i < 100; i++ {
		str += " "
	}
	str += fmt.Sprintf(" | %v", message)
	if deepPrint {
		str += fmt.Sprintf("\n\trequest from \u001b[0;96m%v\u001b[0m with \u001b[0;96m%v\u001b[0m\n\tlog from \u001b[0;3;4;96m%v\u001b[0;1;4;95m:%v\u001b[0m", ip, userAgent, file, line)
	}
	fmt.Printf("%v\n", err)
	if err != nil {
		str += fmt.Sprintf("\n\t\u001b[3;90m► %v\u001b[0m", err)
	}
	fmt.Println(str)
	return str
}
