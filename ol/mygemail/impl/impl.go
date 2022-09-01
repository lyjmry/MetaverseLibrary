/*
 * @Author: tj
 * @Date: 2022-09-01 10:30:02
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:42:37
 * @FilePath: \ol\mygemail\impl\impl.go
 */
package impl

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
	"os"
)

// MyGoogleEmail MyGoogleEmail
type MyGoogleEmail struct {
	user   string // xxxx@gmail.com
	passwd string // 谷歌邮箱应用专用密码
}

func NewMyGoogleEmail(emailAddr, pwd string) (*MyGoogleEmail, error) {
	if emailAddr == "" || pwd == "" {
		return nil, os.ErrInvalid
	}

	e := &MyGoogleEmail{
		user:   emailAddr,
		passwd: pwd,
	}
	return e, nil
}

func (e *MyGoogleEmail) SendEmailContent(title, text, destAddr string) error {
	if title == "" || text == "" || destAddr == "" {
		return os.ErrInvalid
	}

	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         "smtp.gmail.com",
	}

	conn, err := tls.Dial("tcp", "smtp.gmail.com:465", tlsconfig)
	if err != nil {
		return err
	}

	client, err := smtp.NewClient(conn, "smtp.gmail.com")
	if err != nil {
		return err
	}

	auth := smtp.PlainAuth("", e.user, e.passwd, "smtp.gmail.com")

	err = client.Auth(auth)
	if err != nil {
		return err
	}

	err = client.Mail(e.user)
	if err != nil {
		return err
	}

	err = client.Rcpt(destAddr)
	if err != nil {
		return err
	}

	// A send data
	// msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", e.user, destAddr, title, text)
	// smtp.SendMail("smtp.gmail.com:465", auth, m.user, []string{toId}, []byte(msg))

	// B send data
	w, err := client.Data()
	if err != nil {
		return err
	}
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", e.user, destAddr, title, text)
	_, err = w.Write([]byte(msg))
	if err != nil {
		return err
	}
	err = w.Close()
	if err != nil {
		return err
	}

	err = client.Quit()
	if err != nil {
		return err
	}

	return nil
}
