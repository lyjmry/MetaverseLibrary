/*
 * @Author: tj
 * @Date: 2022-09-01 10:30:11
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 11:02:07
 * @FilePath: \ol\main.go
 */
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"ol/config"
	"ol/mygemail/impl"
	"ol/public/logger"

	"github.com/sirupsen/logrus"
)

const (
	Sep = ","
)

var (
	// -d=true
	debug   = flag.Bool("d", false, "if true, program will print detail logs")
	cfgFile = flag.String("c", "config.yaml", "specified the config file path")

	log = logrus.WithFields(logrus.Fields{
		"Main": "",
	})
)

func flagParse() {
	flag.Parse()
	if len(flag.Args()) > 0 {
		flag.Usage()
		os.Exit(1)
	}

	if *debug {
		log.Logger.SetLevel(logrus.DebugLevel)
	}

	wd, err := os.Getwd()
	if err != nil {
		fmt.Printf("Error: can not reach the work directory. %v.\n", err)
		os.Exit(1)
	}

	if !filepath.IsAbs(*cfgFile) {
		newCfg := filepath.Join(wd, *cfgFile)
		cfgFile = &newCfg
	}
}

func main() {
	flagParse()

	defer func() {
		if err := recover(); err != nil {
			log.Errorln("main recover error:", err)
		}
	}()

	// load server config from file config.yaml
	cfg, err := config.LoadCentralServerConfig(*cfgFile)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Printf("Error: please config the config file first.\n")
			os.Exit(1)
		}
		fmt.Printf("Error: server load config failed. %v.\n", err)
		os.Exit(1)
	}

	// 开启日志
	logger.DefaultLogger()
	logrus.SetLevel(logrus.InfoLevel)

	email, err := impl.NewMyGoogleEmail(cfg.BasicCfg.User, cfg.BasicCfg.Passwd)
	if err != nil {
		log.Errorln("NewMyGoogleEmail error:", err)
		return
	}

	if cfg.BasicCfg.Title == "" || cfg.BasicCfg.Content == "" {
		log.Warnln("the email is nil")
		return
	}

	hasError := false
	addrs := strings.Split(cfg.BasicCfg.SendEmail, Sep)
	for _, addr := range addrs {
		err = email.SendEmailContent(cfg.BasicCfg.Title, cfg.BasicCfg.Content, addr)
		if err != nil {
			hasError = true
			log.Errorln("SendEmailContent to ", addr, " error:", err)
			continue
		}
	}

	if hasError {
		log.Errorln("there has some errors, please check the log.")
	}

	log.Infoln("send email success")
}
