package utils

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"math/rand"
	"time"
)

func GetRandomString(n int) string {
	randBytes := make([]byte, n/2)
	rand.Seed(time.Now().UnixNano())
	rand.Read(randBytes)
	return fmt.Sprintf("%x", randBytes)
}

func EncodeInMD5(s string) string {
	hasher := md5.New()
	hasher.Write([]byte(s))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GetCurrentDate() string {
	return time.Now().Format("2006-01-02")
}
