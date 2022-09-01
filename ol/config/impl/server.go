/*
 * @Author: tj
 * @Date: 2022-09-01 10:41:19
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:41:26
 * @FilePath: \ol\config\impl\server.go
 */
package impl

import (
	"errors"
	"os"
	"strings"

	"github.com/jinzhu/configor"
	"github.com/sirupsen/logrus"
)

var (
	log = logrus.WithFields(logrus.Fields{
		"Config": "",
	})
)

// ServerConfig configuration for store server，database and disk monitor
type ServerConfig struct {
	BasicCfg BasicConfig `yaml:"BasicCfg"`
}

// LoadFromFile load config from file
func (sc *ServerConfig) LoadFromFile(path string) error {
	if sc == nil {
		return os.ErrInvalid
	}

	// auto reload configuration every second
	cfg := &configor.Config{AutoReload: true}
	err := configor.New(cfg).Load(sc, path)
	// err := configor.Load(sc, path)
	if err != nil {
		log.Error("load config file failed. %s.", path)
		return err
	}

	if !sc.IsValid() {
		return errors.New("invalid server config")
	}
	return nil
}

// IsValid check config data valid
func (sc *ServerConfig) IsValid() bool {
	if !(sc.BasicCfg.IsValid()) {
		return false
	}
	return true
}

// Default the config default value
func (sc *ServerConfig) Default() string {
	builder := strings.Builder{}
	builder.WriteString("BasicCfg:\n")
	builder.WriteString(sc.BasicCfg.Default(true))
	builder.WriteString("\n")
	builder.WriteString(defServerConfig)

	return builder.String()
}

var defServerConfig = `
`
