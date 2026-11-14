# SWE-363-Project-Study-Assist-
This is the group project github


# Study Assist

**SWE 363 – Web Engineering | Milestone 4: Front-End Prototype**

here is the link to the google drive with all the documentation files: https://drive.google.com/drive/folders/1HsNHO6w32Jh5cBLam6g9L-5Blbzscl5s?usp=sharing

## 1. Project Overview

Study Assist is a web-based educational platform designed to help students and educators organize learning materials, create interactive study activities, and improve the learning experience.

The application provides educational libraries, quizzes, flashcards, AI-assisted study tools, and live quiz matches.

Study Assist supports three user roles: **Student, Educator, and Administrator**, each with different features and responsibilities.

This project is developed as part of SWE 363 – Web Engineering at King Fahd University of Petroleum and Minerals (KFUPM).

## 2. Main Features

The following features describe the overall project scope. Some are implemented in the current front-end prototype, while others are planned or still under development.

### Student Features

- Create personal study libraries and join existing libraries using joining codes.
- Access educational materials, quizzes, and flashcards.
- Take quizzes and review answers and scores.
- Study using interactive flashcards.
- Generate AI-assisted summaries of educational materials.
- Request explanations for incorrect quiz answers.
- Participate in live quiz matches.
- View learning progress and results.
- Submit comments and report problems.

### Educator Features

- Create and manage educational libraries.
- Upload and organize course materials.
- Share library joining codes with students.
- Create quizzes manually or using AI-assisted generation.
- Create and manage flashcard sets.
- Edit, preview, and publish quizzes.
- Host live quiz matches.
- View student results and performance analytics.
- Respond to student comments.

### Administrator Features

- Access an administrative dashboard.
- Search and manage user accounts.
- Approve or reject educator requests.
- Change user roles and account statuses.
- Review and manage support tickets.
- Manage advertisements displayed in the application.

### Shared Features

- User registration and login.
- Role-based dashboards.
- Profile management.
- Form validation and feedback messages.
- Navigation between application features.

## 3. Technologies Used

| Technology | Purpose |
|------------|---------|
| React | Front-end user interface |
| JavaScript (JSX) | Application logic and components |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layouts |
| Vite | Development server and build tool |
| React Router | Client-side navigation |
| Lucide React | Interface icons |
| Git & GitHub | Version control and team collaboration |

## 4. Installation and Setup

### Prerequisites

Install the following software before running the project:

- Node.js and npm
- Git
- A code editor, such as Visual Studio Code

### Installation Steps

**Step 1: Clone the repository**

```bash
git clone <repository-url>
```

**Step 2: Navigate to the project directory**

```bash
cd <project-folder>
```

**Step 3: Install dependencies**

```bash
npm install
```

**Step 4: Start the development server**

```bash
npm run dev
```

**Step 5: Open the application**

Open the local URL displayed in the terminal, typically:

`http://localhost:5173`

### Build for Production

To generate a production build:

```bash
npm run build
```

To preview the build locally:

```bash
npm run preview
```

## 5. Project Structure

The project organizes its React pages according to functionality and user roles.

```text
src/
├── pages/
│   ├── public/
│   ├── user/
│   │   ├── shared/
│   │   ├── library/
│   │   ├── quiz/
│   │   ├── flashcards/
│   │   ├── live/
│   │   ├── student/
│   │   └── educator/
│   └── admin/
├── data/
│   ├── index.js
│   ├── mockUsers.js
│   ├── mockLibraries.js
│   └── mockContent.js
└── App.jsx
```

### Folder Descriptions

- **public/** – Landing page, login, registration, and authentication-related screens.
- **shared/** – Dashboards, profiles, comments, and problem reporting.
- **library/** – Library creation, joining, management, and material uploads.
- **quiz/** – Quiz creation, editing, participation, and results.
- **flashcards/** – Flashcard creation and study sessions.
- **live/** – Live quiz participation and hosting.
- **student/** – Student-specific study tools.
- **educator/** – Educator-specific publishing and analytics.
- **admin/** – Administrative management.
- **data/** – Mock datasets and functions used by the prototype.
- **App.jsx** – Application routing and navigation configuration.

## 6. How to Use

### Student

1. Log in using a student account.
2. Open the Student Dashboard.
3. Create a personal library or join an existing library using a joining code.
4. Access the library's available educational materials.
5. Open quizzes or flashcards to study.
6. Use available study tools and review quiz results.

### Educator

1. Log in using an approved educator account.
2. Open the Educator Dashboard.
3. Create an educational library.
4. Share the library joining code with students.
5. Upload educational materials.
6. Create and manage quizzes and flashcards.
7. Use available publishing, live-match, and analytics features.

### Administrator

1. Log in using an administrator account.
2. Open the Admin Dashboard.
3. Navigate to User Management, Support Tickets, or Advertisements.
4. Use the available administrative controls.

**Note:** Some workflows are still being developed and may not yet be fully accessible.

## 7. Demo Accounts

The prototype includes mock accounts for testing the different user roles.

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | Password1 |
| Educator | educator@example.com | Password1 |
| Administrator | admin@example.com | Password1 |

These credentials are for demonstration purposes only and are defined in the project's mock user data.

They must not be used as production credentials.

## 8. Development Status

Study Assist is currently being developed as part of **Milestone 4 – Front-End Prototype**.

The current development focuses on:

- Building interactive React pages.
- Implementing navigation between application screens.
- Demonstrating user flows for different roles.
- Adding input validation and user feedback.
- Supporting responsive layouts.
- Using mock data to simulate application behavior.

### Mock Data and Simulated Functionality

The prototype uses mock data and simulated operations instead of a fully integrated backend.

Mock datasets include users, libraries, educational materials, quizzes, and flashcard sets.

Some operations are simulated to demonstrate front-end interactions. For example, library creation and joining may update temporary in-memory data that resets when the application reloads.

AI-related functionality and other backend-dependent features are part of the planned application scope and should not be assumed to be connected to live services.

**The current application is a front-end prototype, not a production-ready system.**

## 9. Team Members

| Team Member | Responsibilities |
|-------------|------------------|
| [Juana] | [LIB-01 TO LIB-06, STU-01, STU-02 and ADM-02] |
| [Zainab] | [Role: PUB-01 to PUB-06, SHR-01 to SHR-04, and ADM-01] |
| [Layan] | [ QZ-01, QZ-02, QZ-03, QZ-04,QZ-05,QZ-06,QZ-07, EDU-01,EDU-02,ADM-03,ADM-04] |
| [Jude] | [the remaining components] |

The project is developed collaboratively using Git and GitHub. Team members work on assigned components and contribute their changes to the shared repository.

## 10. Additional Documentation
- **AI Usage Declaration:** See `AI_USAGE.md`.
- **Course:** SWE 363 – Web Engineering
- **University:** King Fahd University of Petroleum and Minerals (KFUPM)

---

*Study Assist – SWE 363 Team Project*
