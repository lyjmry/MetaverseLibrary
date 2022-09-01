/*
 * @Author: tj
 * @Date: 2022-07-19 08:13:38
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:41:48
 * @FilePath: \ol\config\configer.go
 */
package config

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"ol/config/impl"

	"github.com/sirupsen/logrus"
)

// Configer interface
type Configer interface {
	LoadFromFile(path string) error
	Default(asSub bool) string
}

var (
	log = logrus.WithFields(logrus.Fields{
		"Config": "interface",
	})
)

// LoadCentralServerConfig return server config
func LoadCentralServerConfig(file string) (*impl.ServerConfig, error) {
	cfg := &impl.ServerConfig{}
	err := checkConfigFile(file, cfg.Default())
	if err != nil {
		log.Error("check config file failed error:", file)
		return nil, err
	}

	err = cfg.LoadFromFile(file)
	if err != nil {
		log.Error("load config file failed error:", file)
		return nil, err
	}
	return cfg, nil
}

func checkConfigFile(path, defCfg string) error {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return fmt.Errorf("incorrect config file path has been set error:%#v", err)
	}
	path = absPath
	_, err = os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			log.Warn("the program should be first run. create config file now")

			e := ioutil.WriteFile(path, []byte(defCfg), 0644)
			if e != nil {
				log.Error("can not create config file.")
				return e
			}

			log.Info("create config file success:", path)

		} else {
			log.Error("can not touch the config file")
		}
		return err
	}
	return nil
}
