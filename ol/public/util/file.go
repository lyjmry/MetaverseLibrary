/*
 * @Author: tj
 * @Date: 2022-09-01 10:32:43
 * @LastEditors: tj
 * @LastEditTime: 2022-09-01 10:32:58
 * @FilePath: \MetaverseLibrary\server\public\util\file.go
 */
package util

import (
	"io"
	"io/ioutil"
	"os"
	"path"
	"strings"
)

// WriteFile 覆盖源文件
func WriteFile(filename string, data []byte, perm os.FileMode) error {
	f, err := os.OpenFile(filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, perm)
	if err != nil {
		return err
	}

	n, err := f.Write(data)
	if err == nil && n < len(data) {
		err = io.ErrShortWrite
	}

	if err1 := f.Close(); err == nil {
		err = err1
	}
	return err
}

// ReadFile ReadFile
func ReadFile(filename string, perm os.FileMode) ([]byte, error) {
	if filename == "" {
		return nil, os.ErrInvalid
	}

	f, err := os.OpenFile(filename, os.O_RDONLY, 0600)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	contentByte, err := ioutil.ReadAll(f)
	return contentByte, nil
}

//IsExist File or Dir exists
func IsExist(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}

	return true
}

// CreateDirIfMissing creates a dir for dirPath if not already exists. If the dir is empty it returns true
func CreateDirIfMissing(dirPath string) (bool, error) {
	// if dirPath does not end with a path separator, it leaves out the last segment while creating directories
	if !strings.HasSuffix(dirPath, "/") {
		dirPath = dirPath + "/"
	}

	err := os.MkdirAll(path.Dir(dirPath), 0755)
	if err != nil {
		return false, err
	}
	return DirEmpty(dirPath)
}

// DirEmpty returns true if the dir at dirPath is empty
func DirEmpty(dirPath string) (bool, error) {
	f, err := os.Open(dirPath)
	if err != nil {
		return false, err
	}
	defer f.Close()

	_, err = f.Readdir(1)
	if err == io.EOF {
		return true, nil
	}
	return false, err
}
