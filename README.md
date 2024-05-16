﻿# User Authentication System

## Overview
This project is a User Authentication System built using Express.js, Handlebars (hbs), Mongoose, bcrypt, and JSON Web Tokens (JWT). It provides features for user signup, login, profile management, password reset, account deletion, and more.

### Project Structure
<pre>
        ├───bin
        │   └───www
        ├───controllers
        │   ├───user.controller.js
        │   └───index.js
        ├───helper
        │   ├───db.helper.js
        │   ├───token.helper.js
        │   └───index.js
        ├───middlewares
        │   ├───auth.middleware.js
        │   ├───loggedIn.middleware.js
        │   └───signup.middleware.js
        ├───model
        │   ├───user.model.js
        │   └───index.js
        ├───public
        │   ├───javascripts
        │   └───stylesheets
        ├───routes
        │   └───index.js
        ├───services
        │   └───index.js
        │   └───user.service.js
        └───views
            ├───form
            ├───layouts
            ├───pages
            └───partials
            ├───index.hbs
            └───error.hbs
    </pre>


### Features
- **Signup**: Allows users to create a new account with email and password. Validates input fields including password complexity.
- **Login**: Users can securely login using their credentials. Passwords are hashed and compared for authentication.
- **JWT Authentication**: Implements JSON Web Token (JWT) based authentication for session management.
- **Profile Management**: Users can view and update their profile information such as name, email, batch, etc.
- **Password Reset**: Provides functionality for users to reset their password securely.
- **Account Deletion**: Allows users to delete their account permanently.
- **Middleware**: Utilizes middleware for authentication and authorization purposes.
- **Popup Modal**: Implements AJAX requests to perform actions like updating profile and deleting account without refreshing the page.

### Technologies Used
- **Express.js**: Node.js web application framework used for building the backend.
- **Handlebars (hbs)**: Template engine for generating HTML markup.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **bcrypt**: Password hashing library for securely storing passwords.
- **JSON Web Tokens (JWT)**: Standard for securely transmitting information between parties.
- **Ajax**: Asynchronous JavaScript and XML for performing asynchronous requests.


## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   cd <project-directory>
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root.
   - Add environment variables like `PORT`, `MONGO_URI`, etc.

4. Start the server:
   ```bash
   npm start
   ```

## Usage
- Access the application at `http://localhost:3000`
- Sign up for a new account or log in if you already have one.
- Update your profile, reset your password, or delete your account from the profile page.

## Credits
- This project was created by codingadventure[Abhishek Kumar].
- Special thanks to the contributors and open-source community for their valuable contributions.

## License
[MIT License] - [A permissive license that allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software.]
```
# User-Authentication-System
# User-Authentication-System
