package test

import (
	"GFBackend/entity"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"strings"
	"testing"
	"unsafe"
)

func TestUserLogin(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	if loginInfo.Code == 200 {
		fmt.Println("Login Successfully")
		fmt.Println(loginInfo)
	} else {
		t.Errorf("Fail to Login. Error Message: %v", loginInfo)
		return
	}
}

func TestUserRegister(t *testing.T) {
	userInfo := entity.UserInfo{
		Username: "foo",
		Password: "007",
	}

	requestData, _ := json.Marshal(userInfo)

	response, err1 := http.Post(
		"http://"+IP+":10010/gf/api/user/register",
		"application/json",
		bytes.NewBuffer(requestData))
	if err1 != nil {
		t.Error("Failed to Request: " + err1.Error())
		return
	}
	defer response.Body.Close()

	content, err2 := ioutil.ReadAll(response.Body)
	if err2 != nil {
		t.Error("Failed to Interpret Response Message: " + err2.Error())
		return
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		t.Error("Register Parameters Error:")
		return
	} else if strings.Contains(*str, "500") {
		t.Error("Internal Server Error:")
		return
	}

}

func TestUserUpdatePassword(t *testing.T) {
	loginInfo, err := userLogin("foo", "008")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	userInfo := entity.UserInfo{
		Username:    "foo",
		Password:    "008",
		NewPassword: "007",
	}

	requestData, _ := json.Marshal(userInfo)

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/user/password",
		bytes.NewBuffer(requestData))
	if err1 != nil {
		t.Error("Failed to Generate Request: " + err1.Error())
		return
	}
	request.AddCookie(cookie)
	jar, err2 := cookiejar.New(nil)
	if err2 != nil {
		t.Error("Failed to Set Cookie: " + err2.Error())
		return
	}
	var client http.Client
	client = http.Client{
		Jar: jar,
	}
	response, err3 := client.Do(request)
	if err3 != nil {
		t.Error("Failed to Request: " + err3.Error())
		return
	}
	defer response.Body.Close()

	err4 := printResponseContent(response)
	if err4 != nil {
		t.Error("Failed to Interpret Response Message: " + err4.Error())
		return
	}

}

func TestUserUpdateInfo(t *testing.T) {
	loginInfo, err := userLogin("foo", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	userInfo := entity.NewUserInfo{
		Username:   "foo",
		Nickname:   "food",
		Birthday:   "2020-02-02",
		Gender:     "unknown",
		Department: "CISE",
	}

	requestData, _ := json.Marshal(userInfo)

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/user/update",
		bytes.NewBuffer(requestData))
	if err1 != nil {
		t.Error("Failed to Generate Request: " + err1.Error())
		return
	}
	request.AddCookie(cookie)
	jar, err2 := cookiejar.New(nil)
	if err2 != nil {
		t.Error("Failed to Set Cookie: " + err2.Error())
		return
	}
	var client http.Client
	client = http.Client{
		Jar: jar,
	}
	response, err3 := client.Do(request)
	if err3 != nil {
		t.Error("Failed to Request: " + err3.Error())
		return
	}
	defer response.Body.Close()

	err4 := printResponseContent(response)
	if err4 != nil {
		t.Error("Failed to Interpret Response Message: " + err4.Error())
		return
	}
}

func TestUserFollowers(t *testing.T) {
	loginInfo, err := userLogin("lion", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	request, err1 := http.NewRequest("POST", "http://"+IP+":10010/gf/api/user/followers", nil)
	if err1 != nil {
		t.Error("Failed to Generate Request: " + err1.Error())
		return
	}
	request.AddCookie(cookie)
	jar, err2 := cookiejar.New(nil)
	if err2 != nil {
		t.Error("Failed to Set Cookie: " + err2.Error())
		return
	}
	var client http.Client
	client = http.Client{
		Jar: jar,
	}
	response, err3 := client.Do(request)
	if err3 != nil {
		t.Error("Failed to Request: " + err3.Error())
		return
	}
	defer response.Body.Close()

	err4 := printResponseContent(response)
	if err4 != nil {
		t.Error("Failed to Interpret Response Message: " + err4.Error())
		return
	}
}

func TestUserFollowees(t *testing.T) {
	loginInfo, err := userLogin("dog", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	request, err1 := http.NewRequest("POST", "http://"+IP+":10010/gf/api/user/followees", nil)
	if err1 != nil {
		t.Error("Failed to Generate Request: " + err1.Error())
		return
	}
	request.AddCookie(cookie)
	jar, err2 := cookiejar.New(nil)
	if err2 != nil {
		t.Error("Failed to Set Cookie: " + err2.Error())
		return
	}
	var client http.Client
	client = http.Client{
		Jar: jar,
	}
	response, err3 := client.Do(request)
	if err3 != nil {
		t.Error("Failed to Request: " + err3.Error())
		return
	}
	defer response.Body.Close()

	err4 := printResponseContent(response)
	if err4 != nil {
		t.Error("Failed to Interpret Response Message: " + err4.Error())
		return
	}
}
