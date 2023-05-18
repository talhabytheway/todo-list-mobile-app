# React Native Notes App

This is a mobile application built with React Native that allows users to create, read, update, and delete notes. Users can sign up and log in using their email and password credentials. The app utilizes Firebase Authentication for user authentication and Firebase Cloud Firestore for storing the notes data.

## Features

- User authentication using email and password
- Create, read, update, and delete notes
- Each note has a title and a description

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- NPM (Node Package Manager)
- React Native CLI
- Firebase project with Authentication and Firestore enabled

## Getting Started

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` in the project directory.
3. Create a Firebase project and enable Authentication and Firestore.
4. Obtain your Firebase project's configuration details.
5. Paste the Firebase configuration details into the `firebaseConfig.js` file in the project.
6. Start the application by running `expo start` in the project directory.
7. Open the Expo app on your mobile device and scan the QR code displayed in the terminal or in the browser.

## Technologies Used

- React Native
- Firebase Authentication
- Firebase Cloud Firestore
