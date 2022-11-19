package config

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

var AppConfig AppSettings

func InitConfig() {
	AppConfig = AppSettings{}
	appConfigData, _ := ioutil.ReadFile("./config/application.yaml")
	err := yaml.Unmarshal(appConfigData, &AppConfig)
	if err != nil {
		panic("Load Application Configuration Information Failure!!!")
	}
}
