package main

import (
	"context"
	"os"
	"strings"
	"time"
)

type App struct {
	ctx    context.Context
	ticker *time.Ticker
}

// for now, app settings will be stored in the FE. If accounts
// become a thing then so be it, but until then, no need
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) BeginTicker() {
	a.ticker = time.NewTicker(time.Second * 5)
	go func(_ time.Time) {

	}(<-a.ticker.C)
}

func (a *App) IsDev() bool {
	exeName, err := os.Executable()
	if err == nil && strings.Contains(exeName, "-dev") {
		return true
	}
	return len(os.Getenv("DEBUG")) != 0 || len(os.Getenv("DEV")) != 0
}
