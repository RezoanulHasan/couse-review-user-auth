# Project-name: Course Review with auth

## Project-type: DataBase and API Design follow Module Pattern

## Live-link:https://course-review-auth-pi.vercel.app
## API-documentation-link:  https://documenter.getpostman.com/view/30665703/2s9YkuZJkv#676163a1-61e7-4bbe-85d7-895be07188c1
## Technology use

- Node js
- Express js
- Mongoose
- typescript
- JWT(validation)
- bcrypt (validation)
- Zod (validation)
- eslint ( code formatting and quality checking )
- prettier (maintain code structure)

## Proper Error handling

- Jwt Error
- Validation Error
- Cast Error
- Duplicate Entry
- Internal Server Error

# API

Welcome to the Awesome API! This API provides various functionalities for managing courses, categories, and reviews.

## Table of Contents for users

- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:** data formate like this \*

```json

{
  "username": "your_username",
  "password": "your_password",
  "email": "your_email@example.com",
  "role": "user"/"admin"
}

```

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:** data formate like this \*

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

- **Endpoint:** `/api/auth/change-Password`
- **Method:** `POST`
- **Access:** `Authenticated User`
- **Request Body:** data formate like this \*

```json
{
  "currentPassword": "your_current_password",
  "newPassword": "set_new_password"
}
```

## Table of Contents for courses

- [Endpoints](#endpoints)
- [Create a Course](#create-a-course)
- [Get Paginated and Filtered Courses](#get-paginated-and-filtered-courses)
- [Get single Courses by ID](#get-single-course-by-id)
- [Create a Category](#create-a-category)
- [Delete a Course](#delete-a-course)
- [Update a Course](#update-a-course)
- [Get All Categories](#get-all-categories)
- [Create a Review](#create-a-review)
- [Get Course by ID with Reviews](#get-course-by-id-with-reviews)
- [Get the Best Course Based on Average Review](#get-the-best-course-based-on-average-review)

## Endpoints

### Create a Course

- **Endpoint:** `/api/course`
- **Method:** `POST`
- **Access:** `admin`
- **Request Body:** data formate like this \*
- "durationInWeeks": Calclute by Backend.

```json
{
  "title": "Backend Developer Bootcamp",
  "instructor": "Rezoanul Hasan",
  "categoryId": "6588b2f31a07e1acddce3d96",
  "price": 69.99,
  "tags": [
    { "name": "Programming", "isDeleted": false },
    { "name": "Backend", "isDeleted": false },
    { "name": "Web Development", "isDeleted": false }
  ],
  "startDate": "2023-05-01",
  "endDate": "2023-07-01",
  "language": "Hindi",
  "provider": "PH ",

  "details": {
    "level": "Beginner",
    "description": "Master the fundamentals of Backend programming and explore its applications in web development. This bootcamp is designed for beginners and those looking to enhance their Backend skills."
  }
}
```

### Get Paginated and Filtered all Courses

- **Endpoint:** `/api/courses`
- **Method:** `GET`
- **Access:** `Authenticated User`

Query Parameters:

- page: (?page=1) Specifies the page number for paginated results.
- limit: (?limit=10) Sets the number of items per page.
- minPrice, maxPrice: (?minPrice=20.00&maxPrice=50.00) Filters results by a price range.
- tags: (?tags=Programming) Filters results by the name of a specific tag.
- startDate, endDate: (?startDate=2023-01-01&endDate=2023-12-31) Filters results by a date range.
- language: (?language=English) Filters results by the language of the course.
- provider: (?provider=Tech Academy) Filters results by the course provider.
- durationInWeeks: (?durationInWeeks=9) Filters results by the duration of the course in weeks.
- level: (?level=Intermediate) Filters results by the difficulty level of the course.
- sortBy: Specifies the field by which the results should be sorted.
  Only applicable to the following fields: title, price, startDate, endDate, language, duration. Example: ?sortBy=startDate

### Get single Courses by ID

- **Endpoint:** `/api/course/:id`
- **Method:** `GET`
- **Access:** `Authenticated User`

### Delete a Course

- **Endpoint:** `/api/courses/:courseId`
- **Method:** `delete`
- **Access:** `admin`

### Update a Course

- **Endpoint:** `/api/courses/:courseId`
- **Method:** `PUT`
- **Access:** `admin`
- Updating Both Primitive and Non-Primitive Data

### Create a Category

- **Endpoint:** `/api/categories`
- **Method:** `POST`
- **Access:** `admin`
- **Request Body:** (data formate like)

```json
{
  "name": "Java Programming"
}
```

### Get All Categories

- **Endpoint:** `/api/categories`
- **Method:** `GET`

### Create a Review

- **Endpoint:** `/api/reviews`
- **Method:** `POST`
- **Request Body:** ( data formate like this)
- **Access:** `Authenticated User`

```json
{
  "courseId": "65894bd2cf601c221d03c764",
  "rating": 4,
  "review": "Great course!"
}
```

### Get Course by ID with Reviews

- **Endpoint:** `/api/courses/:courseId/reviews`
- **Method:** `GET`

### Get the Best Course Based on Average Review

- **Endpoint:** `/api/course/best`
- **Method:** `GET`
- The response includes details about the course, its average rating, and the total number of reviews

## Requirements link:https://github.com/Apollo-Level2-Web-Dev/L2-B2-Assignment-4

## Getting Started

to set up and run projects locally

- download this repository
- npm install
- npm run build
- npm run start: dev
