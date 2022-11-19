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

func TestGetCommunityByName(t *testing.T) {
	type CommunityInfo struct {
		Name string `json:"Name"`
	}

	communityInfo := CommunityInfo{
		Name: "group8",
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("GET", "http://localhost:10010/gf/api/community/getcommunity",
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
		t.Error("Failed to Get Community By Name. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestUpdateCommunity(t *testing.T) {
	type CommunityInfo struct {
		ID          int    `json:"ID"`
		Name        string `json:"Name"`
		Description string `json:"Description"`
	}

	communityInfo := CommunityInfo{
		ID:          11,
		Name:        "group11",
		Description: "test11",
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/updatecommunitybyid",
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
		t.Error("Failed to Update Community. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestDeleteCommunity(t *testing.T) {
	type CommunityInfo struct {
		ID int `json:"ID"`
	}

	communityInfo := CommunityInfo{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/deletecommunitybyid",
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
		t.Error("Failed to Delete Community. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestCreateCommunity(t *testing.T) {
	loginInfo, err := userLogin("boss", "007")
	if err != nil || loginInfo.Message == "" {
		t.Error("Fail to Login. Error Message: " + err.Error())
		return
	}
	cookie := &http.Cookie{
		Name:  "token",
		Value: loginInfo.Message,
	}

	communityInfo := entity.CommunityInfo{
		Name:        "NintendoGames",
		Description: "The Legend of Zelda: Breath of the Wild",
	}

	//type Info struct {
	//	Username string  `json:"username"`
	//	Capacity float32 `json:"capacity"`
	//}
	//
	//type CommunityInfo struct {
	//	Name        string `json:"Name"`
	//	Description string `json:"Description"`
	//}
	//
	//communityInfo := CommunityInfo{
	//	Name:        "group11",
	//	Description: "test11",
	//}

	requestData, _ := json.Marshal(communityInfo)
	request, err1 := http.NewRequest(
		"POST",
		"http://localhost:10010/gf/api/community/create",
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
	//	t.Error("Failed to Create Community. " + *str)
	//	return
	//}
	//fmt.Println(*str)
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

func TestDeleteCommunityByID(t *testing.T) {
	type CommunityInfo struct {
		ID int `json:"ID"`
	}

	communityInfo := CommunityInfo{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/delete/:id",
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
		t.Error("Failed to Delete Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestUpdateDescriptionByID(t *testing.T) {
	type CommunityInfo struct {
		ID          int    `json:"ID"`
		Description string `json:"Description"`
	}

	communityInfo := CommunityInfo{
		ID:          11,
		Description: "test11",
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/update",
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
		t.Error("Failed to Update Description By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetNumberOfMemberByID(t *testing.T) {
	type CommunityInfo struct {
		ID int `json:"ID"`
	}

	communityInfo := CommunityInfo{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/numberofmember/:id",
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
		t.Error("Failed to Get Number Of Member By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetOneCommunityByID(t *testing.T) {
	type CommunityInfo struct {
		ID int `json:"ID"`
	}

	communityInfo := CommunityInfo{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/getone/:id",
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
	defer response.Body.Close()

	str := (*string)(unsafe.Pointer(&content))
	if strings.Contains(*str, "400") {
		t.Error("Failed to Get One Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetCommunitiesByNameFuzzyMatch(t *testing.T) {
	type CommunityNameFuzzyMatch struct {
		Name string `json:"Name"`
	}

	communityInfo := CommunityNameFuzzyMatch{
		Name: "test",
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/getbyname",
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
		t.Error("Failed to Get Communities By Name Fuzzy Match. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestJoinCommunityByID(t *testing.T) {
	type JoinCommunity struct {
		ID int `json:"ID"`
	}

	communityInfo := JoinCommunity{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/join/:id",
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

func TestLeaveCommunityByID(t *testing.T) {
	type LeaveCommunity struct {
		ID int `json:"ID"`
	}

	communityInfo := LeaveCommunity{
		ID: 11,
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/leave/:id",
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
		t.Error("Failed to Leave Community By ID. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetMembersByCommunityIDs(t *testing.T) {
	type CommunityIDs struct {
		IDs []int `json:"IDs"`
	}

	communityInfo := CommunityIDs{
		IDs: []int{11},
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/getmember",
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
		t.Error("Failed to Get Members By Community IDs. " + *str)
		return
	}
	fmt.Println(*str)
}

func TestGetCommunityIDsByMember(t *testing.T) {
	type Member struct {
		Username string `json:"Username"`
	}

	communityInfo := Member{
		Username: "test",
	}

	requestData, _ := json.Marshal(communityInfo)
	response, err1 := http.NewRequest("POST", "http://localhost:10010/gf/api/community/getcommunityidbymember",
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
		t.Error("Failed to Get Community IDs By Member. " + *str)
		return
	}
	fmt.Println(*str)
}
