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

func TestCreateArticle(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	//type CreateArticleTest struct {
	//	//ID          int
	//	Username    string
	//	Title       string
	//	TypeID      int    `gorm:"column:TypeID"`
	//	CommunityID int    `gorm:"column:CommunityID"`
	//	CreateDay   string `gorm:"column:CreateDay"`
	//	Content     string
	//}
	//ArticleInfo := CreateArticleTest{
	//	ID:          1,
	//	Username:    "foo",
	//	Title:       "test",
	//	TypeID:      1,
	//	CommunityID: 1,
	//	CreateDay:   "2019-01-01",
	//	Content:     "test",
	//}
	ArticleInfo := entity.ArticleInfo{
		Title:       "testing insertion",
		TypeID:      1,
		CommunityID: 12,
		Content:     "test for recording",
	}
	requestData, _ := json.Marshal(ArticleInfo)
	request, err2 := http.NewRequest("POST", "http://localhost:10010/gf/api/article/create",
		bytes.NewReader(requestData))
	//if err1 != nil {
	//	t.Error("Failed to Request. " + err1.Error())
	//}
	//defer response.Body.Close()
	//
	//content, err2 := ioutil.ReadAll(response.Body)
	//if err2 != nil {
	//	t.Error("Failed to Read Response Body. " + err2.Error())
	//	return
	//}
	//
	//str := (*string)(unsafe.Pointer(&content))
	//if strings.Contains(*str, "400") {
	//	t.Error("Failed to Join Community By ID. " + *str)
	//	return
	//}
	//fmt.Println(*str)
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

func TestDeleteArticleByID(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	//type DeleteArticleByIDTest struct {
	//	ID int
	//}
	//ArticleInfo := DeleteArticleByIDTest{
	//	ID: 1,
	//}
	//requestData, _ := json.Marshal(ArticleInfo)
	request, err2 := http.NewRequest("GET", "http://localhost:10010/gf/api/article/delete/45", nil)
	//if err1 != nil {
	//	t.Error("Failed to Request. " + err1.Error())
	//}
	//defer request.Body.Close()
	//
	//content, err2 := ioutil.ReadAll(request.Body)
	//if err2 != nil {
	//	t.Error("Failed to Read Response Body. " + err2.Error())
	//	return
	//}
	//
	//str := (*string)(unsafe.Pointer(&content))
	//if strings.Contains(*str, "400") {
	//	t.Error("Failed to Join Community By ID. " + *str)
	//	return
	//}
	//fmt.Println(*str)
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

func TestUpdateArticleTitleOrContentByID(t *testing.T) {
	type UpdateArticleTitleOrContentByIDTest struct {
		ID      int
		Title   string
		Content string
	}
	ArticleInfo := UpdateArticleTitleOrContentByIDTest{
		ID:      1,
		Title:   "test",
		Content: "test",
	}
	requestData, _ := json.Marshal(ArticleInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/article/update",
		strings.NewReader(string(requestData)))
	if err1 != nil {
		t.Error("Failed to Request. " + err1.Error())
	}
	defer response.Body.Close()

	content, err2 := ioutil.ReadAll(response.Body)
	if err2 != nil {
		t.Error("Failed to Read Response Body. " + err2.Error())
		return
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		t.Error("Failed to Join Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetOneArticleByID(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	//type GetOneArticleByIDTest struct {
	//	ID      int
	//	Title   string
	//	Content string
	//}
	//ArticleInfo := GetOneArticleByIDTest{
	//	ID: 45,
	//}
	//requestData, _ := json.Marshal(ArticleInfo)
	request, err2 := http.NewRequest("GET", "http://localhost:10010/gf/api/article/getone?id=44", nil)
	//if err1 != nil {
	//	t.Error("Failed to Request. " + err1.Error())
	//}
	//defer response.Body.Close()
	//
	//content, err2 := ioutil.ReadAll(response.Body)
	//if err2 != nil {
	//	t.Error("Failed to Read Response Body. " + err2.Error())
	//	return
	//}
	//
	//str := (*string)(unsafe.Pointer(&content))
	//if strings.Contains(*str, "400") {
	//	t.Error("Failed to Join Community By ID. " + *str)
	//	return
	//}
	//fmt.Println(*str)
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

func TestGetArticlesBySearchWords(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	//type GetArticlesBySearchWordsTest struct {
	//	SearchWords string
	//}
	//ArticleInfo := GetArticlesBySearchWordsTest{
	//	SearchWords: "test",
	//}
	articleSearchInfo := entity.ArticleSearchInfo{
		PageNO:      1,
		PageSize:    3,
		SearchWords: "fly",
	}

	requestData, _ := json.Marshal(articleSearchInfo)
	request, err2 := http.NewRequest("POST", "http://localhost:10010/gf/api/article/search",
		bytes.NewReader(requestData))
	//if err1 != nil {
	//	t.Error("Failed to Request. " + err1.Error())
	//}
	//defer response.Body.Close()
	//
	//content, err2 := ioutil.ReadAll(response.Body)
	//if err2 != nil {
	//	t.Error("Failed to Read Response Body. " + err2.Error())
	//	return
	//}
	//
	//str := (*string)(unsafe.Pointer(&content))
	//if strings.Contains(*str, "400") {
	//	t.Error("Failed to Join Community By ID. " + *str)
	//	return
	//}
	//fmt.Println(*str)
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

func TestGetArticleList(t *testing.T) {
	type GetArticleListTest struct {
		Page int
	}
	ArticleInfo := GetArticleListTest{
		Page: 1,
	}
	requestData, _ := json.Marshal(ArticleInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/article/getarticlelist",
		strings.NewReader(string(requestData)))
	if err1 != nil {
		t.Error("Failed to Request. " + err1.Error())
	}
	defer response.Body.Close()

	content, err2 := ioutil.ReadAll(response.Body)
	if err2 != nil {
		t.Error("Failed to Read Response Body. " + err2.Error())
		return
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		t.Error("Failed to Join Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetLikeList(t *testing.T) {
	type GetLikeListTest struct {
		Page int
	}
	ArticleInfo := GetLikeListTest{
		Page: 1,
	}
	requestData, _ := json.Marshal(ArticleInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/article/getlikelist",
		strings.NewReader(string(requestData)))
	if err1 != nil {
		t.Error("Failed to Request. " + err1.Error())
	}
	defer response.Body.Close()

	content, err2 := ioutil.ReadAll(response.Body)
	if err2 != nil {
		t.Error("Failed to Read Response Body. " + err2.Error())
		return
	}

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		t.Error("Failed to Join Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}
