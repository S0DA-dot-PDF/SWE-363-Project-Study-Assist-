# AI Usage

## Phase 4 – Front-End

| ID | Member | Tool (model) | Purpose | Files affected |
|---|---|---|---|---|
| Zainab-C01 | Zainab Alzayer | ChatGPT | Understanding milestone requirements; planning React page structure and routing; drafting and explaining React/JSX code; debugging navigation and validation issues; improving UI layout and CSS; testing role-based behavior. | Login, SignUp, VerifyEmail, ResetPassword, NotFound, Dashboard, Profile, Comments, ReportProblem, AdminDashboard, App.jsx, mock user data, and related CSS. |
| Zainab-C02 | Zainab Alzayer | ChatGPT | Understanding front-end screen requirements, page structure, and implementation expectations for Milestone 4. | Front-end planning and page organization. |
| Layan-C01 | Layan Alshanbari | ChatGPT (GPT-5) | Complete Phase 4 collaboration: understanding requirements; setting up React/Vite; explaining React, JSX, state, props, routing, validation, timers, scoring, file handling, role protection, and CSS; debugging errors; resolving Git conflicts; integrating team work; testing; and preparing the submission. | All files identified in Layan-A01 through Layan-A08. |
| Layan-A01 | Layan Alshanbari | ChatGPT (GPT-5) | React/Vite setup, Bootstrap integration, project organization, shared routing, role protection, and Git workflow guidance. | `.gitignore`, `package.json`, `package-lock.json`, `src/main.jsx`, `src/App.jsx`, `Style/style.css`, and `AI_USAGE.md`. |
| Layan-A02 | Layan Alshanbari | ChatGPT (GPT-5) | Creating the AI quiz form with quiz settings, multiple PDF/DOCX uploads, validation, loading feedback, and navigation. | `src/pages/user/quiz/CreateQuiz.jsx`, `src/App.jsx`, and `Style/style.css`. |
| Layan-A03 | Layan Alshanbari | ChatGPT (GPT-5) | Implementing generated MCQ questions, answer storage, previous/next navigation, countdown timer, progress bar, manual and automatic submission, scoring, result counts, and color-coded answer review. | `src/pages/user/quiz/GeneratedQuiz.jsx`, `src/pages/user/quiz/QuizResults.jsx`, `src/App.jsx`, and `Style/style.css`. |
| Layan-A04 | Layan Alshanbari | ChatGPT (GPT-5) | Implementing educator-only question editing, including editing question text and options, selecting the correct answer, deleting questions, validating content, and returning to the dashboard. | `src/pages/user/quiz/QuestionEditor.jsx`, `src/pages/user/quiz/GeneratedQuiz.jsx`, `src/App.jsx`, and `Style/style.css`. |
| Layan-A05 | Layan Alshanbari | ChatGPT (GPT-5) | Creating a simple educator analytics page using mock student results, total attempts, average-score calculation, a results table, educator navigation, and an empty-safe calculation. | `src/pages/user/educator/QuizAnalytics.jsx`, `src/pages/user/shared/Dashboard.jsx`, and `src/App.jsx`. |
| Layan-A06 | Layan Alshanbari | ChatGPT (GPT-5) | Implementing support-ticket display, messages, escalation, prevention of repeated escalation, deletion, empty state, admin navigation, and admin-only route protection. | `src/pages/admin/SupportTickets.jsx`, `src/pages/admin/AdminDashboard.jsx`, `src/App.jsx`, and `Style/style.css`. |
| Layan-A07 | Layan Alshanbari | ChatGPT (GPT-5) | Implementing image/video advertisement upload, validation, preview, publication confirmation, previous-advertisement history, advertisement reselection, active advertisement state, and display on student and educator dashboards. | `src/pages/admin/AdvertisementManagement.jsx`, `src/pages/admin/AdminDashboard.jsx`, `src/pages/user/shared/Dashboard.jsx`, `src/App.jsx`, and `Style/style.css`. |
| Layan-A08 | Layan Alshanbari | ChatGPT (GPT-5) | Debugging JSX structure, hooks, imports, route paths, disabled buttons, role access, and CSS; resolving team merge conflicts; integrating shared routes and styles; guiding commits, pushes, pull requests, and final build verification. | `src/App.jsx`, `Style/style.css`, quiz pages, educator analytics, admin pages, shared Dashboard, and Git commit/merge history. |

| Juana-C01 | Juana Hasan | Claude (Sonnet 5.5) | Assist with implementing My Libraries, including library cards, filtering, searching, and responsive styling. | `MyLibraries.jsx`, `style.css`, `data/index.js`, `mockLibraries.js` |
| Juana-C02 | Juana Hasan | Claude (Sonnet 5.5) | Assist with implementing Join Library, including joining-code validation, membership checks, error handling, and navigation. | `JoinLibrary.jsx`, `data/index.js`, `mockLibraries.js`, `style.css`, `CreateLibray.jsx`, `LibrayDetails.jsx` |
| Juana-C03 | Juana Hasan | ChatGPT (GPT-6) | Assist with implementing material uploading, including file validation, simulated upload progress, and error handling. | `UploadMaterial.jsx`, `data/index.js`, `style.css`, `App.jsx` |
| Juana-C04 | Juana Hasan | ChatGPT (GPT-6) | Assist with troubleshooting library navigation, routing, and integration between existing components. | `App.jsx`, `MyLibraries.jsx`, `JoinLibrary.jsx`, `LibraryDetails.jsx` |
| Juana-C05 | Juana Hasan | ChatGPT (GPT-6) | Assist with implementing Create Menu and connecting library content creation to quiz and flashcard pages. | `CreateMenu.jsx`, `style.css`, `App.jsx`, `LibraryDetails.jsx` |
| Juana-C06 | Juana Hasan | ChatGPT (GPT-6) | Assist with AI Study Help integration and User Management implementation, including account actions, validation, and debugging. | `AISummaries.jsx`, `QuizResults.jsx`, `UserManagement.jsx`, `data/index.js`, `style.css`, `App.jsx` |
| Juana-C07 | Juana Hasan | ChatGPT (GPT-6) | Assist with implementing My Quizzes, filtering published quizzes by library, and displaying libraries on the dashboard. | `MyQuizzes.jsx`, `Dashboard.jsx`, `data/index.js`, `mockContent.js`, `style.css`, `App.jsx` |
| Juana-C08 | Juana Hasan | ChatGPT (GPT-6) | Assist with role-based library access, quiz navigation, and consistent Back to Dashboard links. | `MyLibraries.jsx`, `JoinLibrary.jsx`, `MyQuizzes.jsx`, `LibraryDetails.jsx`, `CreateLibrary.jsx`, `style.css` |
| Juana-C09 | Juana Hasan | GitHub Copilot | Assist with resolving Git merge conflicts and CSS syntax errors after integrating teammates' changes. | `Dashboard.jsx`, `style.css` |

JUDE:
ID
Member
Tool (model)
Date(s)
Purpose
Part of deliverable affected
What you changed and how you verified it
Evidence file
JUDE-C01
Jude
Claude, claude.ai (Claude Opus 5.5)
7–8 Nov 2026 (export 14 Nov)
Plan and set up the front-end phase: repository layout, GitHub collaboration, React project setup, screen list and page checklists
Repository setup; front-end planning (screen list, task checklists)
Asked questions step by step and rejected or redirected suggestions that didn’t fit, e.g. switched from plain HTML to React and changed the library model. Checked the setup against the course lab (lab 5-6) and the Milestone 3 requirements.
Chat01_Transcript.docx
JUDE-A01
Jude
Claude, claude.ai (Claude Opus 5.5)
7 Nov 2026
Example React front-end folder layout
Repository folder structure
Adapted the layout roughly, keeping CSS and JS separate, and created the folders without files. [Confirm the folders show on GitHub]
Chat01_ArtifactC_React_FrontEnd_Repo_Layout.docx
JUDE-A02
Jude
Claude, claude.ai (Claude Opus 5.5)
7 Nov 2026
Share the repository, set up branch protection, fix a merge conflict
GitHub repository settings; main branch
Chose the branch protection options (1 required approval). Resolved the divergent pull in Codespaces and kept the README. [Confirm the final protection settings and that the push succeeded]
Chat01_ArtifactD_GitHub_Collaboration.docx; Chat01_ArtifactE_Divergent_Branch_Fix.docx
JUDE-A03
Jude
Claude, claude.ai (Claude Opus 5.5)
7 Nov 2026
Set up the React project
Project scaffolding (package.json, Vite, ESLint, React Router, Bootstrap)
Compared with lab 5-6 to confirm the course uses Vite. Ran the setup and saw the starter page with npm run dev. Checked with git ls-files and on GitHub that node_modules was not uploaded.
Chat01_ArtifactG_Project_Setup_Vite.docx
JUDE-A04
Jude
Claude, claude.ai (Claude Opus 5.5)
8 Nov 2026
List of screens / page files and a checklist for each page
Front-end screen list and task definitions
Directed the structure: split the live-match host and player screens, set the two-level library model, chose the ID scheme by area, dropped the Layout heading and assigned mock data to one owner. Edited the document and sent it to teammates for review; [status: pending team approval].
Chat01_ArtifactJ_Screen_Organisation_and_Library_Model.docx; Chat01_ArtifactK_Study_Assist_Screens_and_Checklists.docx
JUDE-C02
Jude
Claude, claude.ai (Claude Opus 5.5)
11–14 Nov 2026
Researched GitHub’s documentation on the AI agents a repository can use, to plan an AI code-reviewer and tester role (the team has no member for it), keep it free on student resources, and avoid charging teammates’ accounts. Also covered clash prevention (Prettier, ESLint, CSS Modules, shared files, CODEOWNERS), Git and GitHub CLI usage, and exporting chats for this record.
Development process: code review and testing workflow, repository setup, team conventions
Adopted the AI reviewer and tester role (ledger 02-A); usage is triggered only by Jude, so it stays off teammates’ accounts. Verified each recommendation against the official GitHub and Claude documentation cited in the chat. Copilot Student coverage is still unconfirmed because the Education application is pending.
Chat02_Record_and_Transcript.docx (in Chat02_Export.zip)
JUDE-A02B
Jude
Claude, claude.ai (Claude Opus 5.5)
11 Nov 2026
Draft the team conventions agreement, Section 1 (mock data), to stop teammates’ data work clashing
Front end: mock data layer (src/data/) and the data access functions
No changes yet; this is a draft awaiting team sign-off, with open decisions D1 (data owner), D2 (whether saved data survives a reload) and D3 (entity fields). Claude checked the document’s layout. Eventually approval request didnt reach my teammates.
Chat02_ArtifactB_Study_Assist_Conventions_Agreement.docx, Chat02_ArtifactB_build.js
JUDE-A02C
Jude
Claude, claude.ai (Claude Opus 5.5)
12 Nov 2026
Script to create the 41 page issues on GitHub in one go, assigned according to the team’s page division
Project management: GitHub Issues (one issue per page, PUB to ADM)
Added the team’s GitHub usernames. Installed the GitHub CLI and signed in, checked the file was complete (107 lines), then ran the script from the project folder. [confirm] Issues checked in the Issues tab: 41 in total, split 11 / 9 / 11 / 10 by assignee.
Chat02_ArtifactC_create_issues.sh
JUDE-C03 
Jude
Claude, claude.ai (Claude Opus 5.5)
13–14 Nov 2026
building the LIVE match pages (LIVE-01 to LIVE-06) and the flashcard pages (FC-01 to FC-04); CSS colour variables; a function-by-function code review; Git help with a merge conflict and divergent branches; a review of the LiveGame branch and PR #45. 
front end: src/pages/user/live/* and src/pages/user/flashcards/* Style/live.css and Style/addToStyle.css src/pages/data/index.js and mockContent.js Dashboard.jsx and AISummaries.jsx App.jsx (routes) and main.jsx (imports) 
Set the requirements and design for each screen over many rounds: the layout, timer, countdown, reveal, confetti, host view and swipe study. Reviewed every function list with the AI before moving on, and removed features she didn’t want. Chose to keep the team’s blue palette instead of the KFUPM conversion. Added the files to the repo herself and adjusted the file names, import paths, routes and the Ask AI link.    Interactive previews in the chat. Ran the app locally (npm run dev). Merged main into LiveGame and resolved the conflicts. The pushed branch was cloned and built with no errors (vite build). PR #45 was merged into main on 14 Nov 2026. 
Chat03_Export.zip → 01_Chat/Chat03_Transcript.docx; chat: claude.ai/chat/291f3019-852e-4d4c-b5ec-8b6d10c5c866
JUDE-A301 
Jude
Claude, claude.ai (Claude Opus 5.5)
13–14 Nov 2026
Convert the login CSS from hard-coded values to CSS variables, as a base for a theme and night mode (artifacts A–D).
Style/style.css (reference only; not merged).
Asked for the colours to become variables first, with no other change to the rules. D is the first KFUPM palette version. Verified: Compared with the original CSS: the rules and selectors are the same, and only values were replaced.
Chat03_Export.zip → 02_Artifacts/Chat03_ArtifactA–D
JUDE-A302  
Jude
Claude, claude.ai (Claude Opus 5.5)
14th Nov 2026
Purpose: Reference documents for the team: a CSS cheat sheet, a UI catalogue and a colour tokens integration key (artifacts E, F, H).
Part of deliverable affected: Design reference for the team and the basis for the Figma reference. No code.
Changed: Revised over four versions to her corrections. Verified: Read through the rendered PDF and Word files. 
Evidence file: Chat03_Export.zip → 02_Artifacts/Chat03_ArtifactE, F, H; older versions are in 05_Older_versions


