package test

import (
	"GFBackend/entity"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/cookiejar"
	"testing"
)

func TestGetSpaceInfo(t *testing.T) {
	loginInfo, err := userLogin("foo", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/file/space/info",
		nil)
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

func TestExpandSpace(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	type Info struct {
		Username string  `json:"username"`
		Capacity float32 `json:"capacity"`
	}

	info := Info{
		Username: "foo",
		Capacity: 39.9,
	}

	requestData, _ := json.Marshal(info)

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/file/space/update",
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

func TestScanFiles(t *testing.T) {
	loginInfo, err := userLogin("kirby", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/file/scan",
		nil)
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

func TestDeleteFile(t *testing.T) {
	loginInfo, err := userLogin("kirby", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}
	info := entity.UserFilename{
		Filename: "avatar.jpg",
	}

	requestData, _ := json.Marshal(info)

	request, err1 := http.NewRequest(
		"POST",
		"http://"+IP+":10010/gf/api/file/delete",
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
