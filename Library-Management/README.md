# Community Library Management System

A React application based on the supplied library project.

## Features
- Dashboard showing book count, total copies, low-stock titles and registered users
- Add, edit and delete books (title, author, genre, ISBN and quantity)
- Stock-in and borrowing transactions with transaction history
- Add, edit and delete users (name, membership ID, role and password)
- Membership ID/password login demonstration with first-run administrator setup
- User management is restricted to signed-in Admin accounts; the first account is automatically assigned Admin
- React hooks, reusable components, React Router and browser Local Storage
- Responsive CSS layout

## Run in VS Code
1. Install Node.js if it is not already installed.
2. Extract this ZIP and open the `901020666` folder in VS Code.
3. Open Terminal > New Terminal.
4. run 'dir'
5. run 'cd library-management'
6. Run `npm install`
7. Run `npm run dev`
8. Open the Local URL printed in the terminal.

## First-time setup and demo login
1. Start the app and open **Login**.
2. Choose **Create the administrator account**.
3. Register the first account; it is automatically assigned the **Admin** role and signed in.
4. Use the Users page to create member and staff accounts. Sign out and test login using their membership ID and password.

## Notes
- Data is stored in the browser's Local Storage. It stays in the same browser until the site data is cleared.
- This is a coursework demonstration, not a secure production login system. Passwords are stored in Local Storage for the assignment demonstration.
- The project uses React and React Router as required by the brief. The supplied ZIP's existing features and data fields were used as the starting point and implemented with React components/hooks.
