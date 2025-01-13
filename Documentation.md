

# Table of Contents

- [Table of Contents](#table-of-contents)
- [1. Authentication routes](#1-authentication-routes)
  - [1.1. `auth/login` Route](#11-authlogin-route)
    - [1.1.1. Prerequisite](#111-prerequisite)
    - [1.1.2. Input](#112-input)
    - [1.1.3. Output](#113-output)
      - [1.1.3.1. Success Response](#1131-success-response)
      - [1.1.3.2. Possible errors](#1132-possible-errors)
  - [1.2. `auth/register` Route](#12-authregister-route)
    - [1.2.1. Header](#121-header)
    - [1.2.2. Input](#122-input)
    - [1.2.3. Output](#123-output)
      - [1.2.3.1. Success Response](#1231-success-response)
      - [1.2.3.2. Possible errors](#1232-possible-errors)
  - [1.3. `auth/logout` Route](#13-authlogout-route)
    - [1.3.1. Header](#131-header)
    - [1.3.2. Output](#132-output)
      - [1.3.2.1. Success Response](#1321-success-response)
      - [1.3.2.2. Possible errors](#1322-possible-errors)
  - [1.4. `auth/me` Route](#14-authme-route)
    - [1.4.1. Header](#141-header)
    - [1.4.2. Output](#142-output)
      - [1.4.2.1. Success Response](#1421-success-response)
      - [1.4.2.2. Possible errors](#1422-possible-errors)
- [2. User management routes](#2-user-management-routes)
  - [2.1. PUT `users/:id` Route](#21-put-usersid-route)
    - [2.1.1. Header](#211-header)
    - [2.1.2. Params](#212-params)
    - [2.1.3. Input](#213-input)
    - [2.1.4. Output](#214-output)
      - [2.1.4.1. Success Response](#2141-success-response)
      - [2.1.4.2. Possible errors](#2142-possible-errors)
  - [2.2. GET `users/:id` Route](#22-get-usersid-route)
    - [2.2.1. Header](#221-header)
    - [2.2.2. Params](#222-params)
    - [2.2.3. Output](#223-output)
      - [2.2.3.1. Success Response](#2231-success-response)
      - [2.2.3.2. Possible errors](#2232-possible-errors)
  - [2.3. DELETE `users/:id` Route](#23-delete-usersid-route)
    - [2.3.1. Header](#231-header)
    - [2.3.2. Params](#232-params)
    - [2.3.3. Output](#233-output)
      - [2.3.3.1. Success Response](#2331-success-response)
      - [2.3.3.2. Possible errors](#2332-possible-errors)
  - [2.4. GET `users/` Route](#24-get-users-route)
    - [2.4.1. Header](#241-header)
    - [2.4.2. Output](#242-output)
      - [2.4.2.1. Success Response](#2421-success-response)
      - [2.4.2.2. Possible errors](#2422-possible-errors)
- [3. Appendix](#3-appendix)
  - [3.1. Errors](#31-errors)
    - [3.1.1. Validation Error](#311-validation-error)
    - [3.1.2. Invalid Credentials](#312-invalid-credentials)
    - [3.1.3. Unexpected Error](#313-unexpected-error)
    - [3.1.4. Duplicate Email or Name](#314-duplicate-email-or-name)
    - [3.1.5. Authorization error](#315-authorization-error)
    - [3.1.6. User Not Authenticated](#316-user-not-authenticated)
    - [3.1.7. User Not Found](#317-user-not-found)




# 1. Authentication routes

## 1.1. `auth/login` Route

### 1.1.1. Prerequisite

The first login must be done using the pre-registered admin credentials:

- **Email:** `admin@gmail.com`
- **Password:** `00000000`

After this, additional users can be created by the admin.

---

### 1.1.2. Input

| Field      | Type   | Required | Validation Rules                                          |
|------------|--------|----------|-----------------------------------------------------------|
| `email`    | String | Yes      | Must be a valid email address.                            |
| `password` | String | Yes      | Must be a string, 8-512 characters long.                  |

---

### 1.1.3. Output

#### 1.1.3.1. Success Response
**HTTP Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "<oat_token>",
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  },
  "message": "Login successful"
}
```

#### 1.1.3.2. Possible errors

- [Validation Error](#111-validation-error)
- [Unexpected Error](#113-unexpected-error)


##  1.2. `auth/register` Route

**Note:** 
- The request must include a valid Bearer Token in the `Authorization` header 
- The authentified user must be an admin

### 1.2.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

### 1.2.2. Input

| Field      | Type   | Required | Validation Rules                                                                 |
|------------|--------|----------|----------------------------------------------------------------------------------|
| `name`     | String | Yes      | Must be a string, 3-64 characters long, unique (no duplicate names in the `users` table). |
| `email`    | String | Yes      | Must be a valid email, normalized, unique (no duplicate emails in the `users` table).     |
| `password` | String | Yes      | Must be a string, 8-512 characters long.                                                |
| `role`     | Enum   | Yes      | Must be one of the following: `admin`, `user`.                                          |

### 1.2.3. Output

#### 1.2.3.1. Success Response
**HTTP Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  },
  "message": "User registered successfully"
}

```
#### 1.2.3.2. Possible errors

- [Validation Error](#111-validation-error)
- [Unexpected Error](#113-unexpected-error)
- [Duplicate Email or Name](#114-duplicate-email-or-name)
- [Authorization Error](#115-authorization-error) *if user is not an admin*
- [User Not Authenticated](#216-user-not-authenticated) *if the token is absent or not valid*


## 1.3. `auth/logout` Route

**Note:** The request must include a valid Bearer Token in the `Authorization` header 


### 1.3.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

---

### 1.3.2. Output

#### 1.3.2.1. Success Response
**HTTP Status Code:** `200 OK`

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```
#### 1.3.2.2. Possible errors

- [Unexpected Error](#113-unexpected-error)
- [User Not Authenticated](#216-user-not-authenticated)
  
---


## 1.4. `auth/me` Route

**Note:**  The request must include a valid Bearer Token in the `Authorization` header

### 1.4.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

---

### 1.4.2. Output

#### 1.4.2.1. Success Response

**HTTP Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "userResponse": {
      "id": "<user_id>",
      "name": "<user_name>",
      "email": "<user_email>",
      "role": "<user_role>",
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>"
    },
    "tokenResponse": {
      "created_at": "<token_created_at>",
      "expired": "<token_expiry_date>",
      "lastused_at": "<token_last_used_at>"
    }
  },
  "message": "User data fetched successfully"
}
```

#### 1.4.2.2. Possible errors

- [Unexpected Error](#113-unexpected-error)
- [User Not Authenticated](#216-user-not-authenticated)

---



# 2. User management routes

## 2.1. PUT `users/:id` Route

**Note:** 
- The request must include a valid Bearer Token in the `Authorization` header 
- The authentified user must be an admin


### 2.1.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

### 2.1.2. Params

| Field      | Type   | Required | Validation Rules                                                                 |
|------------|--------|----------|----------------------------------------------------------------------------------|
| `id`     | String   | Yes      | Must be a string |

### 2.1.3. Input

| Field      | Type   | Required | Validation Rules                                                                 |
|------------|--------|----------|----------------------------------------------------------------------------------|
| `id`     | String   | Yes      | Must be a string, 3-64 characters long, unique (no duplicate names in the `users` table). |
| `email`    | String | Yes      | Must be a valid email, normalized, unique (no duplicate emails in the `users` table).     |
| `password` | String | Yes      | Must be a string, 8-512 characters long.                                                |
| `role`     | Enum   | Yes      | Must be one of the following: `admin`, `user`.                                          |

### 2.1.4. Output

#### 2.1.4.1. Success Response
**HTTP Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  },
  "message": "User updated successfully"
}

```
#### 2.1.4.2. Possible errors

- [Validation Error](#111-validation-error)
- [Unexpected Error](#113-unexpected-error)
- [Duplicate Email or Name](#114-duplicate-email-or-name)
- [Authorization Error](#115-authorization-error) *if user is not an admin*
- [User Not Authenticated](#216-user-not-authenticated) *if the token is absent or not valid*
- [User Not Found](#user-not-found)


## 2.2. GET `users/:id` Route

**Note:** 
- The request must include a valid Bearer Token in the `Authorization` header 
- The authentified user must be an admin


### 2.2.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

### 2.2.2. Params

| Field      | Type   | Required | Validation Rules                                                                 |
|------------|--------|----------|----------------------------------------------------------------------------------|
| `id`     | String   | Yes      | Must be a string |

                                         |

### 2.2.3. Output

#### 2.2.3.1. Success Response
**HTTP Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  },
  "message": "User fetched successfully"
}

```
#### 2.2.3.2. Possible errors


- [Unexpected Error](#113-unexpected-error)
- [Authorization Error](#115-authorization-error) *if user is not an admin*
- [User Not Authenticated](#216-user-not-authenticated) *if the token is absent or not valid*
- [User Not Found](#user-not-found)



## 2.3. DELETE `users/:id` Route

**Note:** 
- The request must include a valid Bearer Token in the `Authorization` header 
- The authentified user must be an admin


### 2.3.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |

### 2.3.2. Params

| Field      | Type   | Required | Validation Rules                                                                 |
|------------|--------|----------|----------------------------------------------------------------------------------|
| `id`     | String   | Yes      | Must be a string |

                                         |

### 2.3.3. Output

#### 2.3.3.1. Success Response
**HTTP Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  },
  "message": "User deleted successfully"
}

```
#### 2.3.3.2. Possible errors


- [Unexpected Error](#113-unexpected-error)
- [Authorization Error](#115-authorization-error) *if user is not an admin*
- [User Not Authenticated](#216-user-not-authenticated) *if the token is absent or not valid*
- [User Not Found](#user-not-found)


## 2.4. GET `users/` Route

**Note:** 
- The request must include a valid Bearer Token in the `Authorization` header 
- The authentified user must be an admin


### 2.4.1. Header

| Key            | Value             | Required |
|-----------------|-------------------|----------|
| Authorization   | Bearer `<token>` | Yes      |



### 2.4.2. Output

#### 2.4.2.1. Success Response
**HTTP Status Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "<user_id>",
    "name": "<user_name>",
    "email": "<user_email>",
    "role": "<user_role>",
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>"
  }[],
  "message": "All Users data fetched successfully"
}

```
#### 2.4.2.2. Possible errors


- [Unexpected Error](#113-unexpected-error)
- [Authorization Error](#115-authorization-error) *if user is not an admin*
- [User Not Authenticated](#216-user-not-authenticated) *if the token is absent or not valid*
- [User Not Found](#user-not-found)

# 3. Appendix

## 3.1. Errors

### 3.1.1. Validation Error
**HTTP Status Code:** `422 Unprocessable Entity`

```json
{
  "success": false,
  "data": {
    "<field_name>": ["<error_message>", "..."]
  },
  "message": "Validation failed"
}
```

### 3.1.2. Invalid Credentials
**HTTP Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password"
}
```

###  3.1.3. Unexpected Error
**HTTP Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "data": null,
  "message": "An unexpected error occurred"
}
```

### 3.1.4. Duplicate Email or Name
**HTTP Status Code:** `400 Bad Request`

```json
{
    "success": false,
    "data": [
        {
            "message": "The name has already been taken",
            "rule": "database.unique",
            "field": "name"
        },
        {
            "message": "The email has already been taken",
            "rule": "database.unique",
            "field": "email"
        }
    ],
    "message": "Validation failed"
}
```
### 3.1.5. Authorization error

**HTTP Status Code:** `403 Internal Server Error`

```json
{
  "success": false,
  "data": null,
  "message": "Access denied. Admins only"
}
```
### 3.1.6. User Not Authenticated
**HTTP Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "data": null,
  "message": "Unauthenticated"
}
```

### 3.1.7. User Not Found
**HTTP Status Code:** `404 Not Found`

```json
{
  "success": false,
  "data": null,
  "message": "User not found"
}
```
