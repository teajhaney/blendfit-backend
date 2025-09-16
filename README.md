# Blendfit Backend API

## Overview

This is a comprehensive, high-performance e-commerce REST API built with TypeScript and Express.js. It leverages MongoDB with Mongoose for data persistence and integrates Redis for efficient caching, ensuring a scalable and robust backend solution.

## Features

- **Express**: Robust framework for building the RESTful API server and handling routes.
- **TypeScript**: Provides static typing for enhanced code quality, maintainability, and developer experience.
- **Mongoose**: Acts as an Object Data Modeler (ODM) for elegant MongoDB object modeling.
- **Redis**: Implements in-memory caching for API responses to minimize database latency and improve performance.
- **JSON Web Tokens (JWT)**: Ensures secure, stateless authentication and authorization for protected endpoints.
- **Argon2**: Employs modern, secure password hashing to protect user credentials.
- **Zod**: Handles schema declaration and rigorous validation of incoming request data.
- **Cloudinary**: Manages cloud-based storage, optimization, and delivery of product images.
- **Winston**: Provides a flexible, multi-transport logging system for effective monitoring and debugging.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
- **Rate Limiter Flexible**: Protects the API from brute-force attacks and limits request rates per IP.



### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/teajhaney/blendfit-backend.git
    cd blendfit-backend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory and populate it with the required variables listed below.

4.  **Start the development server**
    ```bash
    npm run dev
    ```

### Environment Variables

Create a `.env` file in the project root and add the following variables:

# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URL=mongodb://localhost:27017/blendfit_db
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_strong_and_secret_jwt_key

# Cloudinary API Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## API Documentation

### Base URL

`http://localhost:8000/api`

### Endpoints

#### **Authentication (`/api/auth`)**

---

#### POST /auth/signup

Registers a new user.

**Request**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "strongPassword123",
  "role": "user"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "_id": "60d0fe4f5311236168a109ca",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: Validation failed (e.g., password too short, invalid email).
- `409 Conflict`: Email is already in use.
- `500 Internal Server Error`: Server-side processing error.

---

#### POST /auth/signin

Logs in an existing user and returns an access token.

**Request**:

```json
{
  "email": "john.doe@example.com",
  "password": "strongPassword123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User logged in succcessfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "userId": "60d0fe4f5311236168a109ca",
  "role": "user"
}
```

**Errors**:

- `401 Unauthorized`: Invalid email or password.
- `409 Conflict`: User not found.
- `500 Internal Server Error`: Server-side processing error.

---

#### GET /auth/users

Retrieves a list of all users. (Admin access required)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

**Response**:

```json
{
  "success": true,
  "message": "User fetched succcessfully",
  "length": 1,
  "user": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "_id": "60d0fe4f5311236168a109ca",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: No token provided or token is invalid.
- `403 Forbidden`: Access denied. User is not an admin.
- `500 Internal Server Error`: Server-side processing error.

#### **Products (`/api/products`)**

---

#### POST /

Creates a new product. (Admin access required)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

```json
{
  "name": "Classic T-Shirt",
  "description": "A comfortable and stylish classic t-shirt.",
  "price": 19.99,
  "stock": 100,
  "category": "60d0fe4f5311236168a109cb",
  "brand": "60d0fe4f5311236168a109cc",
  "gender": "60d0fe4f5311236168a109cd"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "userId": "60d0fe4f5311236168a109ca",
    "name": "Classic T-Shirt",
    "description": "A comfortable and stylish classic t-shirt.",
    "price": 19.99,
    "stock": 100,
    "category": "60d0fe4f5311236168a109cb",
    "brand": "60d0fe4f5311236168a109cc",
    "gender": "60d0fe4f5311236168a109cd",
    "_id": "60d0fe4f5311236168a109ce",
    "images": [],
    "reviews": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Errors**:

- `400 Bad Request`: Validation failed.
- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not an admin.

---

#### GET /

Fetches all products with pagination.

**Request**:

- Query Parameters: `?page=1&limit=10`

**Response**:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "products": {
    "totalProducts": 20,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10,
    "allProducts": [
      {
        "_id": "60d0fe4f5311236168a109ce",
        "name": "Classic T-Shirt",
        "price": 19.99,
        "category": { "name": "Apparel" },
        "brand": { "_id": "...", "name": "Blendfit" },
        "gender": { "_id": "...", "gender": "unisex" },
        "images": [{ "_id": "...", "url": "http://..." }],
        "reviews": []
      }
    ]
  }
}
```

**Errors**:

- `500 Internal Server Error`: Server-side processing error.

---

#### GET /:id

Fetches a single product by its ID.

**Request**:

- URL Parameter: `/api/products/60d0fe4f5311236168a109ce`

**Response**:

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "product": {
    "_id": "60d0fe4f5311236168a109ce",
    "name": "Classic T-Shirt",
    "description": "A comfortable and stylish classic t-shirt.",
    "price": 19.99,
    "stock": 100,
    "category": { "name": "Apparel" },
    "brand": { "_id": "...", "name": "Blendfit" },
    "gender": { "_id": "...", "gender": "unisex" },
    "images": [{ "_id": "...", "url": "http://..." }],
    "reviews": [{ "_id": "...", "comment": "Great!", "rating": 5 }]
  }
}
```

**Errors**:

- `404 Not Found`: Product with the specified ID does not exist.
- `500 Internal Server Error`: Server-side processing error.

---

#### PUT /:id

Updates an existing product. (Admin access required)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/products/60d0fe4f5311236168a109ce`
- Body:

```json
{
  "price": 24.99,
  "stock": 90
}
```

**Response**:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "updatedProduct": {
    "_id": "60d0fe4f5311236168a109ce",
    "name": "Classic T-Shirt",
    "price": 24.99,
    "stock": 90
  }
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not an admin or not the product owner.
- `404 Not Found`: Product with the specified ID does not exist.

---

#### DELETE /:id

Deletes a product and its associated reviews and media. (Admin access required)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/products/60d0fe4f5311236168a109ce`

**Response**:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not an admin or not the product owner.
- `404 Not Found`: Product with the specified ID does not exist.

---

#### POST /add-category

Adds one or more product categories.

**Request**:

```json
{
  "categories": [{ "name": "Apparel" }, { "name": "Footwear" }]
}
```

**Response**:

```json
{
  "success": true,
  "message": "Category created succcessfully",
  "length": 2,
  "category": [
    { "name": "Apparel", "_id": "..." },
    { "name": "Footwear", "_id": "..." }
  ]
}
```

**Errors**:

- `400 Bad Request`: Validation failed.

---

#### GET /browse-categories

Fetches all available product categories.

**Request**: (No body)

**Response**:

```json
{
  "success": true,
  "message": "User fetched succcessfully",
  "length": 2,
  "categories": [
    { "_id": "...", "name": "Apparel" },
    { "_id": "...", "name": "Footwear" }
  ]
}
```

**Errors**:

- `409 Conflict`: No categories available.

---

#### POST /add-brand

Adds one or more product brands.

**Request**:

```json
{
  "brands": [{ "name": "Brand A" }, { "name": "Brand B" }]
}
```

**Response**:

```json
{
  "success": true,
  "message": "Brand created succcessfully",
  "length": 2,
  "brand": [
    { "name": "Brand A", "_id": "..." },
    { "name": "Brand B", "_id": "..." }
  ]
}
```

**Errors**:

- `400 Bad Request`: Validation failed.

---

#### GET /browse-brands

Fetches all available product brands.

**Request**: (No body)

**Response**:

```json
{
  "success": true,
  "message": "User fetched succcessfully",
  "length": 2,
  "brands": [
    { "_id": "...", "name": "Brand A" },
    { "_id": "...", "name": "Brand B" }
  ]
}
```

**Errors**:

- `409 Conflict`: No brands available.

---

#### POST /add-gender

Adds a gender category.

**Request**:

```json
{
  "gender": "unisex"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Gender created succcessfully",
  "genders": {
    "gender": "unisex",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: Validation failed (must be 'men', 'women', or 'unisex').

---

#### POST /review

Adds a review for a product. (Authenticated users only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

```json
{
  "rating": 5,
  "comment": "Excellent quality!",
  "productId": "60d0fe4f5311236168a109ce"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "rating": 5,
    "comment": "Excellent quality!",
    "userId": "60d0fe4f5311236168a109ca",
    "productId": "60d0fe4f5311236168a109ce",
    "_id": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: Validation error.
- `401 Unauthorized`: Invalid or missing token.

---

#### GET /review/:id

Fetches all reviews for a given product ID. (Authenticated users only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/products/review/60d0fe4f5311236168a109ce`

**Response**:

```json
{
  "success": true,
  "message": "Review fetched successfully",
  "length": 1,
  "reviews": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "Excellent quality!",
      "userId": "60d0fe4f5311236168a109ca",
      "productId": {
        "_id": "60d0fe4f5311236168a109ce",
        "name": "Classic T-Shirt"
      }
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `404 Not Found`: No product or reviews found.

---

#### DELETE /review/:id

Deletes a review by its ID. (Review owner only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/products/review/review_id_here`

**Response**:

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not the owner of the review.
- `404 Not Found`: Review not found.

#### **Cart (`/api/cart`)**

---

#### POST /

Adds a product to the user's cart. (Authenticated users only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

```json
{
  "productId": "60d0fe4f5311236168a109ce",
  "quantity": 2
}
```

**Response**:

```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "review": {
    "userId": "60d0fe4f5311236168a109ca",
    "productId": "60d0fe4f5311236168a109ce",
    "quantity": 2,
    "_id": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: Validation failed.
- `401 Unauthorized`: Invalid or missing token.

---

#### GET /

Fetches all items in the user's cart. (Authenticated users only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

**Response**:

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "length": 1,
  "carts": [
    {
      "_id": "...",
      "userId": "60d0fe4f5311236168a109ca",
      "quantity": 2,
      "productId": {
        "_id": "60d0fe4f5311236168a109ce",
        "name": "Classic T-Shirt",
        "price": 19.99
      }
    }
  ]
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `404 Not Found`: No cart found for the user.

---

#### PUT /:id

Updates the quantity of an item in the cart. (Cart item owner only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/cart/cart_item_id_here`

```json
{
  "quantity": 3
}
```

**Response**:

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "updatedCart": {
    "_id": "...",
    "userId": "60d0fe4f5311236168a109ca",
    "productId": "60d0fe4f5311236168a109ce",
    "quantity": 3
  }
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not the owner of the cart item.
- `404 Not Found`: Cart item not found.

---

#### DELETE /:id

Removes an item from the cart. (Cart item owner only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/cart/cart_item_id_here`

**Response**:

```json
{
  "success": true,
  "message": "Cart deleted successfully"
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not the owner of the cart item.
- `404 Not Found`: Cart item not found.

#### **Media (`/api/media`)**

---

#### POST /uplaod

Uploads a product image. (Admin access required)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: (file) The image file to upload.
  - `productId`: (string) The ID of the product to associate the image with.

**Response**:

```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "...",
    "productId": "60d0fe4f5311236168a109ce",
    "userId": "60d0fe4f5311236168a109ca",
    "_id": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: No file uploaded or `productId` is missing.
- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not an admin.

---

#### DELETE /delete/:id

Deletes an uploaded image by its ID. (Media owner/Admin only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`
- URL Parameter: `/api/media/delete/media_id_here`

**Response**:

```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

**Errors**:

- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: User is not the owner of the media.
- `404 Not Found`: Media not found.

#### **Order (`/api/order`)**

---

#### POST /

Creates an order from the user's cart items. (Authenticated users only)

**Request**:

- Headers: `Authorization: Bearer <accessToken>`

```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "postalCode": "12345",
    "country": "USA"
  }
}
```

**Response**:

```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "userId": "60d0fe4f5311236168a109ca",
    "productId": ["60d0fe4f5311236168a109ce"],
    "totalPrice": 39.98,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Anytown",
      "postalCode": "12345",
      "country": "USA"
    },
    "status": "pending",
    "quantity": 2,
    "_id": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: No items in cart to create an order.
- `401 Unauthorized`: Invalid or missing token.

#### **Search (`/api/search`)**

---

#### GET /

Searches and filters products based on query parameters.

**Request**:

- Query Parameters: `/api/search?name=shirt&minPrice=10&maxPrice=50&category=Apparel`

**Response**:

```json
{
  "success": true,
  "message": "Products search successful",
  "length": 1,
  "products": [
    {
      "_id": "60d0fe4f5311236168a109ce",
      "name": "Classic T-Shirt",
      "price": 19.99,
      "category": { "_id": "...", "name": "Apparel" },
      "brand": { "_id": "...", "name": "Blendfit" },
      "gender": { "_id": "...", "gender": "unisex" }
    }
  ]
}
```

**Errors**:

- `500 Internal Server Error`: Server-side processing error.

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
