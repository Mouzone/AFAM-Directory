# AFAM Directory Management System

This project is a web application for managing student and staff directories for the AFAM department/organization. It provides features for user authentication, directory browsing, and administrative controls for staff members.

## Features

*   **User Authentication:** Secure signup and login functionality for users.
*   **Directory Access:** Users can access directories based on their roles and permissions. The primary directory is "afam".
*   **Staff Invitations:** Authorized staff members can invite new users to join the system and assign them to the "afam" staff directory.
*   **Student Data Management:** Staff members have capabilities to manage student data, including deleting student records (which also removes associated attendance and private data).
*   **(Potential) CSV Data Import:** The system may include functionality for importing data from CSV files (inferred from backend dependencies).

## Technologies Used

*   **Frontend:**
    *   Next.js (v15.2.4)
    *   React (v19)
    *   TypeScript
    *   Tailwind CSS (v4)
    *   DaisyUI (v5)
    *   Firebase (Web SDK v11.6.0)
    *   Tanstack React Query (v5.71.1) - For data fetching and state management.
    *   Tanstack React Table (v8.21.2) - For displaying tabular data.
*   **Backend:**
    *   Firebase Functions (Node.js 22 environment)
    *   TypeScript
    *   SendGrid API - For sending email invitations (inferred from dependencies).
    *   `csv-parse` - For parsing CSV files.
*   **Database:**
    *   Firestore - NoSQL database for storing user, student, and directory information.
*   **Utility Scripts:**
    *   Python - Scripts located in `modify firestore/` for tasks like adding test users, creating users, deleting test users, and uploading student data.

## Setup and Installation

### Prerequisites

*   Node.js (v22 or compatible for functions, latest stable for frontend recommended)
*   npm (comes with Node.js) or bun
*   Firebase CLI (for deploying functions and managing Firebase project)
*   Python (for running utility scripts in `modify firestore/`)

### 1. Frontend (`frontend/`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # bun install
    ```
3.  **Configure Firebase:**
    *   Ensure you have a Firebase project created.
    *   Set up Firebase configuration for the web. This typically involves creating a `firebaseConfig` object with your project's API keys and other details. This configuration is used in `frontend/src/utility/firebase.ts`. You might need to create a local environment file (e.g., `.env.local`) to store these credentials securely.
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # bun dev
    ```
    The application should be accessible at `http://localhost:3000`.

### 2. Backend Functions (`functions/`)

1.  **Navigate to the functions directory:**
    ```bash
    cd functions
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Firebase:**
    *   Ensure your Firebase project is initialized in the root directory (`firebase init` if not already done).
    *   Select the correct Firebase project using `firebase use <project_id>`.
    *   Backend functions may require service account credentials or specific Firebase configurations, often managed through environment variables or the Firebase console.
4.  **Deploy Functions:**
    ```bash
    firebase deploy --only functions
    ```
    Alternatively, you can run the functions locally using the Firebase Emulator Suite:
    ```bash
    npm run serve
    ```

### 3. Python Utility Scripts (`modify firestore/`)

1.  **Navigate to the scripts directory:**
    ```bash
    cd "modify firestore"
    ```
2.  **Install Python dependencies** (if any are listed in a `requirements.txt` file - not present in current listing, but good practice to check). For example:
    ```bash
    # pip install -r requirements.txt
    ```
3.  **Configure Firebase Admin SDK:**
    *   These scripts likely use the Firebase Admin SDK, which requires a service account key. Download your service account JSON file from the Firebase console (Project settings -> Service accounts).
    *   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your service account key file.
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
    ```
4.  **Run the scripts** as needed, e.g.:
    ```bash
    python uploadStudentData.py
    ```

## Project Structure

*   `frontend/`: Contains the Next.js frontend application.
    *   `src/app/`: Main application routes and pages.
    *   `src/components/`: Reusable React components.
    *   `src/utility/`: Utility functions, Firebase configuration.
*   `functions/`: Contains the Firebase Cloud Functions (TypeScript).
    *   `src/index.ts`: Main entry point for backend functions like `inviteStaff` and `deleteStudent`.
*   `modify firestore/`: Contains Python scripts for direct Firestore database manipulation (e.g., data seeding, user management).
*   `firebase.json`: Configuration for Firebase CLI, including Firestore rules, indexes, and functions deployment settings.
*   `firestore.indexes.json`: Defines composite indexes for Firestore queries.
*   `firestore.rules`: Security rules for Firestore database access.
*   `storage.rules`: Security rules for Firebase Storage (if used).

## Firebase Configuration

This project heavily relies on Firebase for several core functionalities:

*   **Authentication:** Manages user sign-up and login.
*   **Firestore:** Acts as the primary database for storing all application data.
*   **Cloud Functions:** Provides backend logic for operations like inviting staff and deleting students.

**Key Firebase Configuration Files:**

*   `firebase.json`: Defines how the Firebase CLI deploys project assets, including Firestore rules, indexes, and Cloud Functions.
*   `firestore.rules`: Crucial for securing your data. These rules define who can read and write data to different parts of your Firestore database.
*   `firestore.indexes.json`: Specifies any composite indexes needed for complex Firestore queries to ensure optimal performance.
*   `storage.rules`: Defines security for Firebase Cloud Storage. While not explicitly seen in use for file storage from the code exploration, it's a standard part of Firebase configurations.

**Setup Requirements:**

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Register Your App:**
    *   For the **frontend**, register a web app and copy the Firebase SDK setup snippet. This will be used in `frontend/src/utility/firebase.ts`.
    *   For **backend functions** and **Python scripts**, you'll typically use the Firebase Admin SDK, which requires a service account key (JSON file) obtained from your Firebase project settings.
3.  **Enable Services:** Ensure Firestore, Firebase Authentication, and Cloud Functions are enabled for your project in the Firebase Console.
4.  **Security Rules:** Review and update `firestore.rules` and `storage.rules` to ensure your data is secure according to your application's needs. Deploy these rules using `firebase deploy`.
