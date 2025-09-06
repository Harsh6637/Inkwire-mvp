# Inkwire MVP

This is the **Inkwire MVP** frontend project built with React.

## Project Structure

- Inkwire-mvp/  
  - frontend/  
  - backend/ # (Future backend)

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- Git

---

## Getting Started (Frontend)

### 1. Clone the repository

```bash
1. git clone https://github.com/Harsh6637/Inkwire-mvp.git  
   cd Inkwire-mvp/frontend

2. Install dependencies
   Using npm: npm install
   Using Yarn: yarn install

3. Run the project locally
   Using npm: npm start Or 
   Using Yarn: yarn start
```

This will start the React development server. Open http://localhost:3000 in your browser to see the app.

Notes:  
- All uploaded resources are stored in session storage, so they will reset when application is re-started.  
- Allowed file types: PDF, TXT, MD, DOC, DOCX.

HardCoded Credentials are:  
- UserName: JakeDoe@gmail.com  
- Password: P@$$word123

Credentials are stored in local storage under the key inkwire_user.
  If the key is present, the login page will be bypassed automatically.
  They remain until the user manually removes them.
