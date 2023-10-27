package system

import (
	"fmt"
	"strconv"

	"github.com/mattn/go-runewidth"
)

type Colors struct {
	Reset     string
	Bold      string
	Italic    string
	Underline string
	Invert    string
	Hiden     string

	Black   string
	Red     string
	Green   string
	Yellow  string
	Blue    string
	Magenta string
	Cyan    string
	White   string

	BgBlack   string
	BgRed     string
	BgGreen   string
	BgYellow  string
	BgBlue    string
	BgMagenta string
	BgCyan    string
	BgWhite   string

	DarkBlack   string
	DarkRed     string
	DarkGreen   string
	DarkYellow  string
	DarkBlue    string
	DarkMagenta string
	DarkCyan    string
	DarkWhite   string

	BgDarkBlack   string
	BgDarkRed     string
	BgDarkGreen   string
	BgDarkYellow  string
	BgDarkBlue    string
	BgDarkMagenta string
	BgDarkCyan    string
	BgDarkWhite   string
}

var DefaultColors = Colors{
	Reset:     "\u001b[0m",
	Bold:      "\u001b[1m",
	Italic:    "\u001b[3m",
	Underline: "\u001b[4m",
	Invert:    "\u001b[7m",
	Hiden:     "\u001b[8m",

	Black:   "\u001b[90m",
	Red:     "\u001b[91m",
	Green:   "\u001b[92m",
	Yellow:  "\u001b[93m",
	Blue:    "\u001b[94m",
	Magenta: "\u001b[95m",
	Cyan:    "\u001b[96m",
	White:   "\u001b[97m",

	BgBlack:   "\u001b[100m",
	BgRed:     "\u001b[101m",
	BgGreen:   "\u001b[102m",
	BgYellow:  "\u001b[103m",
	BgBlue:    "\u001b[104m",
	BgMagenta: "\u001b[105m",
	BgCyan:    "\u001b[106m",
	BgWhite:   "\u001b[107m",

	DarkBlack:   "\u001b[30m",
	DarkRed:     "\u001b[31m",
	DarkGreen:   "\u001b[32m",
	DarkYellow:  "\u001b[33m",
	DarkBlue:    "\u001b[34m",
	DarkMagenta: "\u001b[35m",
	DarkCyan:    "\u001b[36m",
	DarkWhite:   "\u001b[37m",

	BgDarkBlack:   "\u001b[40m",
	BgDarkRed:     "\u001b[41m",
	BgDarkGreen:   "\u001b[42m",
	BgDarkYellow:  "\u001b[43m",
	BgDarkBlue:    "\u001b[44m",
	BgDarkMagenta: "\u001b[45m",
	BgDarkCyan:    "\u001b[46m",
	BgDarkWhite:   "\u001b[47m",
}

func Value(s string, width int, color string) string {
	pad := width - len(s)
	str := ""
	for i := 0; i < pad; i++ {
		str += "."
	}
	if s == "Disabled" {
		str += " " + s
	} else {
		str += fmt.Sprintf(" %s%s%s", color, s, DefaultColors.Black)
	}
	return str
}

func Center(s string, width int) string {
	const padDiv = 2
	pad := strconv.Itoa((width - len(s)) / padDiv)
	str := fmt.Sprintf("%"+pad+"s", " ")
	str += s
	str += fmt.Sprintf("%"+pad+"s", " ")
	if len(str) < width {
		str += " "
	}
	return str
}

func CenterValue(s string, width int, color string) string {
	const padDiv = 2
	pad := strconv.Itoa((width - runewidth.StringWidth(s)) / padDiv)
	str := fmt.Sprintf("%"+pad+"s", " ")
	str += fmt.Sprintf("%s%s%s", color, s, DefaultColors.Black)
	str += fmt.Sprintf("%"+pad+"s", " ")
	if runewidth.StringWidth(s)-10 < width && runewidth.StringWidth(s)%2 == 0 {
		str += " "
	}
	return str
}
