# People Planner Fullstack App

## Overview
People Planner is a fully responsive full-stack application developed using the MERN stack. It is designed to help users manage their in-time and out-time, apply for leaves, view and filter applied leaves based on month, leave type & status, and view holidays on a calendar. It features secure authentication and a role-based UI for effective leave management.

## Table of Contents
- [Features](#features)
- [Major Technologies Used](#major-technologies-used)
- [Demo Video](#demo-video)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Application Screenshots](#application's-screenshots)

## Features
- **User Authentication**: Secure login and registration.
- **Time Management**: Set in-time and out-time.
- **Leave Management**: Apply for regular and half-day leaves.
- **Holiday Calendar**: View all holidays on an interactive calendar.
- **Leave Overview**: View applied leaves based on month and filter by type (regular or half-day) and status (approved, pending, denied, cancelled).
- **Role-Based UI**: The manager can approve or deny leave requests before the leave start date. (Note: The manager role is seeded at the start of the application for simplicity. Future updates may include separate modules for more advanced manager management.)
- **Multiple-Day Handling**: Handled the multiple-day login-logout scenarios.

## Major Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, React-Suite
- **Backend**: Node.js, Express, Mongoose, BcryptJS
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Demo Video

https://github.com/maanasb01/People-Planner/assets/94924895/691fb64b-7532-4687-ae32-a671d8ae8536

## Installation

### Prerequisites
- Node.js
- MongoDB

### Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/maanasb01/People-Planner.git
    cd People-Planner
    ```

2. **Install dependencies for the server:**
    ```sh
    cd server
    npm install
    ```

3. **Install dependencies for the client (in separate terminal):**
    ```sh
    cd client
    npm install
    ```

4. **Environment Variables:**
    Create a `.env` file in the `server` directory and add the following:
    ```
    DATABASE_URL=your_mongodb_connection_string
    AUTH_SECRET_KEY = your_jwt_secret
    PORT = 3000
    CLIENT_URL = "http://localhost:5173"
    ```

5. **Run the Application for Development:**

    - **Server:**
        ```sh
        cd server
        npm run dev
        ```

    - **Client (in a separate terminal):**
        ```sh
        cd client
        npm run dev
        ```

6. **Open your browser and visit:**
    ```
    http://localhost:5173
    ```

## Application's Screenshots

### Home

![1](https://github.com/maanasb01/People-Planner/assets/94924895/f4be9870-4f7b-453d-bfe0-fc79f21e6be0)

![2](https://github.com/maanasb01/People-Planner/assets/94924895/6dd26c6e-2064-4f81-8e26-d8ed76e62969)

![3](https://github.com/maanasb01/People-Planner/assets/94924895/1734eb91-383d-42dc-bd7e-f61053d1ed00)

### Leave Management for User

#### Select Leave-Type
![leaves1](https://github.com/maanasb01/People-Planner/assets/94924895/ae2865f0-f4fd-4b30-9104-46b1b75780d5)

#### Apply for Regular Leave
![leaves2](https://github.com/maanasb01/People-Planner/assets/94924895/dae75dfe-f750-4684-8d38-9ba47fda4787)

#### Apply for Half-Day Leave
![leaves4](https://github.com/maanasb01/People-Planner/assets/94924895/51e5ae9c-c5b0-4f46-9d7a-4cbb3be660c6)

#### Applied Leaves
![leaves5](https://github.com/maanasb01/People-Planner/assets/94924895/bd5e2bb3-edd8-4af9-91ad-e404e22e112b)

#### Applied Leaves with Filters
![leaves6](https://github.com/maanasb01/People-Planner/assets/94924895/a77ddaab-4125-4349-b183-7f93184778d6)

![leaves7](https://github.com/maanasb01/People-Planner/assets/94924895/692e9e7d-2fb6-4229-ade6-646b0bb6e1e7)

### Leave Administration for Manager
![manager1](https://github.com/maanasb01/People-Planner/assets/94924895/a37bc199-3ceb-4e79-8d0b-2bc69f715599)

![manager2](https://github.com/maanasb01/People-Planner/assets/94924895/d36b9c81-04e0-46cd-be9a-44d48ee05940)


### Login
![login](https://github.com/maanasb01/People-Planner/assets/94924895/b8bca45f-5d94-4c6f-8d73-0c99a450ba18)
