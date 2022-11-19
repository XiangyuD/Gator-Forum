package test

import (
	"GFBackend/entity"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"unsafe"
)

var IP = "167.71.166.120"

//var IP = "localhost"

func userLogin(username, password string) (entity.ResponseMsg, error) {
	type UserInfo struct {
		Username string `json:"Username"`
		Password string `json:"Password"`
	}

	userInfo := UserInfo{
		Username: username,
		Password: password,
	}

	requestData, _ := json.Marshal(userInfo)

	response, err1 := http.Post(
		"http://"+IP+":10010/gf/api/user/login",
		"application/json",
		bytes.NewBuffer(requestData))
	if err1 != nil {
		return entity.ResponseMsg{}, err1
	}
	defer response.Body.Close()

	content, err2 := ioutil.ReadAll(response.Body)
	if err2 != nil {
		return entity.ResponseMsg{}, err2
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		return entity.ResponseMsg{}, errors.New("authentication fail")
	}

	respMsg := entity.ResponseMsg{}
	err3 := json.Unmarshal([]byte(*str), &respMsg)
	if err3 != nil {
		return entity.ResponseMsg{}, errors.New("unmarshal response message failure")
	}
	return respMsg, nil
}

func printResponseContent(response *http.Response) error {
	content, err1 := ioutil.ReadAll(response.Body)
	if err1 != nil {
		return errors.New("Failed to Request. " + err1.Error())
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		return errors.New("Failed to Request. " + *str)
	}
	fmt.Println(*str)
	return nil
}
