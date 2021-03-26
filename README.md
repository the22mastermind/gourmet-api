[![Build Status](https://travis-ci.com/the22mastermind/gourmet-api.svg?branch=main)](https://travis-ci.com/the22mastermind/gourmet-api)
# Gourmet API
REST API for Gourmet Online Food Ordering App
<br/><br/>

### Description

Gourmet API is a very simple Online Food Ordering API built with NodeJS that offers endpoints to manage authentication and orders.<br/><br/>

The API offers the following endpoints:

| Method | Endpoint | Description |
| ----------- | ----------- | ----------- |
| POST | /api/auth/signup | Signup or registration |
| GET | /api/auth/verify | Account verification or activation |
| GET | /api/auth/verify/retry | Resend OTP for account verification |
| POST | /api/auth/login | Log in |
| GET | /api/auth/logout | Log out |
| POST | /api/orders | Create or place an order |
| GET | /api/orders | User retrieve own list of orders |
| GET | /api/orders/:id | User retrieve own single order |
| GET | /api/menu | Retrieve menu categories and items |
| POST | /api/payments | Create payment intent |
| GET | /api/admin/orders/:id | Admin retrieve a single order |
| GET | /api/admin/orders | Admin retrieve list of all the orders |
| PATCH | /api/admin/orders/:id | Admin update status of a single order |

<br/>

### Technologies used

#### Databases
1. PostgreSQL
2. Redis

#### Libraries/frameworks
1. ExpressJS
2. Sequelize ORM
3. JSON Web Token
4. Joi
5. Bcrypt
6. Twilio
7. Cors
8. Stripe
<br/><br/>

### CI/CD
1. Travis CI
2. Heroku

### Author
Bertrand Masabo
