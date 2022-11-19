# Gator Forum Backend

## Dependency

- Go 1.16.12
- Configuration Info
  - gopkg.in/yaml.v2
- Web Server

  - github.com/gin-gonic/gin
- Database

  - gorm.io/gorm
  - gorm.io/driver/mysql
- Logger

  - go.uber.org/zap
  - gopkg.in/natefinch/lumberjack.v2
- Authentication

  - github.com/golang-jwt/jwt
- RBAC

  - github.com/casbin/casbin/v2
  - github.com/casbin/gorm-adapter/v3
- Searching

  - github.com/elastic/go-elasticsearch/v7@7.16
- API Info

  - github.com/swaggo/swag/cmd/swag
  - github.com/swaggo/gin-swagger
  - github.com/swaggo/files
- Redis
  - github.com/go-redis/redis/v8
- Dependency Injection
  - github.com/google/wire/cmd/wire@latest
