/*
 * @Author: tj
 * @Date: 2022-09-01 10:30:02
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:42:43
 * @FilePath: \ol\mygemail\interface.go
 */
package mygemail

type MyGoogleEmailer interface {
	SendEmailContent(title, text, destAddr string) error
}
