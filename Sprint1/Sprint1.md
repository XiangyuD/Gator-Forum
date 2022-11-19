In this file, we will briefly talk about what we've accomplished.


# Frontend

## Developers

- Yuwei Xia (yuweixia@ufl.edu))
- Kaiyue Wang(kaiyuewang@ufl.edu)

## Done
 1. We have found a library(@ant-design-pro) which we think is modifiable and can be used by our Gator Forum.
 2. We have set English as default language.
 3. After login, search page is set as main page of our forum. We can access the basic form page(which is used for posting)by clicking 'edit icon'. After inputing content and submitting , we access result page to show whether posting is successful. 
 4. Also, we could click avator on header to access personal center/settings.
 5. We could click 'notification icon' on header to see messages including mentions,comments,likes.





# Backend

## Developers

- Bowei Wu (bowei.wu@ufl.edu))
- Yingjie Chen (yingjie.chen@ufl.edu)

## Building Development Foundation in Sprint1

## Related Functions Decision

- User Authentication & Authorization
- Save & Search Articles
- Private cloud space management
- Cache Information (Related User Information)

## Database Design

- Discuss Database Schema
- Tables Definition in backend branch "tables.sql"

## Components Combination

Components Combination in "SmalleDemo" (in backend branch) for Sprint1

- **gin** for web server
- **gorm** from **MySQL** database operation
- **Redis** for cache
- uber/**zap** for log
- **JWT** for user authentication
- Configuration Information stored in yaml file (Load when Server Starting)

## Implemented Some Functions

Implementation of Sprint1 is in "SmallDemo", later we will use "GFBackend" as formal version of backend

- Load Configuration for different components
  - load configuration information from yaml file when starting server

- CRUD User Table in DB

- User Authentication 

  - Generation, Verification, Refreshing  of JWT token

- User Login/Register Request/Response

  - with data wrote into database
  - related API in GitHub Wiki

- Logging Component

  - different log level


## Remote Server Deployment

- Deployed

  - MySQL

  - Redis

Later we will deploy our backend into remote server.

