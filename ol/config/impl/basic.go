/*
 * @Author: tj
 * @Date: 2022-09-01 10:32:30
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:54:58
 * @FilePath: \ol\config\impl\basic.go
 */
package impl

import (
	"errors"
	"os"
	"strings"

	"github.com/jinzhu/configor"
)

// BasicConfig basic config
type BasicConfig struct {
	User      string `yaml:"User" required:"true"`      // 发送邮件的用户
	Passwd    string `yaml:"Password" required:"true"`  // 发送邮件的用户密码
	SendEmail string `yaml:"SendEmail" required:"true"` // 接收邮件的地址
	Title     string `yaml:"Title"`                     // 发送邮件的标题
	Content   string `yaml:"Content"`                   // 发送邮件的内容
}

// LoadFromFile load config from file
func (dc *BasicConfig) LoadFromFile(path string) error {
	if dc == nil {
		return os.ErrInvalid
	}

	err := configor.Load(dc, path)
	if err != nil {
		return err
	}

	dc.setDefaultValue()

	if !dc.IsValid() {
		return errors.New("invalid BasicConfig config")
	}

	return nil
}

func (dc *BasicConfig) setDefaultValue() {
}

// IsValid check config data valid
func (dc *BasicConfig) IsValid() bool {
	if dc == nil || dc.User == "" || dc.Passwd == "" || dc.SendEmail == "" {
		return false
	}

	return true
}

// Default the config default value
func (dc *BasicConfig) Default(asSub bool) string {
	if asSub {
		return strings.Replace(basicDefCfg, "\n", "\n  ", -1)
	}

	return basicDefCfg
}

var basicDefCfg = `
# required only one email address
User: xxxx@email.com

# Password: user password
Password: p<fN)rbQ!5Ws

# required xxxx@email.com,xxxx@email.com
SendEmail: xxxx@email.com,xxxx@email.com

# Title:
Title: email title

# Content: 
Content: email content
`
