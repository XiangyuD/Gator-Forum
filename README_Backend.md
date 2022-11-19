# Gator Forum Backend

## Developer

- Bowei Wu(bowei.wu@ufl.edu)
- Yingjie Chen(yingjie.chen@ufl.edu)

## Components

- **gin** for web server
- **gorm** for database operation
  - MySQL
- **Redis** for cache
- uber/**zap** for log
- **JWT** for user authentication
- configuration information stored in yaml file
- **Casbin** for role management
- **Elasticsearch** for forum user searching
- **gin-swagger** for api information
- **wire** for dependency injection

## File Structure

- Directory "SmallDemo" is used for test when adding new components or features
- Directory "GFBackend" is pre-version for this project backend, when some features or functions have been accomplished, we will merge to main branch
- "tables.sql" is the database schema for this project backend
