package config

type AppSettings struct {
	Server
	Database
	Redis
	ElasticSearch
	JWT
	Logger
}

type Server struct {
	Port     int
	BasePath string
}

type Database struct {
	IP       string
	Port     int
	Username string
	Password string
	DB1      string
	DB2      string
}

type Redis struct {
	IP       string
	Port     int
	Password string
	DB       int
}

type ElasticSearch struct {
	IP       string
	Port     int
	Username string
	Password string
}

type JWT struct {
	SecretKey string
	Expires   int
}

type Logger struct {
	LowestLevel string
	LoggerFilePath
}

type LoggerFilePath struct {
	Debug string
	Info  string
	Warn  string
	Error string
}
