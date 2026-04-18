# Traffic Management and Redirection Platform

A full-stack web application for call center agents to generate tracking links, monitor social media traffic, and control smart redirection.

## Features

- Agent dashboard with login, tracking link generation, analytics, and traffic monitoring
- Admin dashboard for agent management, link creation, redirect rules, and system analytics
- Unique short URLs with tracking parameter insertion
- Dynamic landing page display for Facebook traffic and 301/302 redirect handling for other sources
- MongoDB backend with full logging of agent actions, link visits, and user interactions
- Responsive HTML/CSS UI with white and sky blue theme

## Required Tools

- Node.js and npm
- MongoDB Community Server (Windows MSI)
- VS Code Live Server extension (optional for frontend preview)

## Full Setup Steps

### 1. Copy environment file

In the project folder, run:

```powershell
copy .env.example .env
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Install MongoDB (Windows MSI)

1. Open browser and go to `https://www.mongodb.com/try/download/community`
2. Download the "Windows" Community Server MSI
3. Run the installer and choose the default "Complete" setup
4. Enable "Install MongoDB as a Service" if shown
5. Finish the installation

### 4. Start MongoDB

If installed as a service, it may start automatically.
Otherwise open PowerShell and run:

```powershell
net start MongoDB
```

If you installed MongoDB manually without service, start it like this:

```powershell
mongod --dbpath "C:\data\db"
```

> Make sure the folder `C:\data\db` exists first.

### 5. Verify `.env`

Open `.env` and make sure it contains:

```text
PORT=3000
MONGODB_URI=mongodb+srv://skytrack_user:xnozdUDOqLfoTmDj@cluster0.scbmfwc.mongodb.net/skytrack?retryWrites=true&w=majority
SESSION_SECRET=super-secret-key-123
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM="SkyTrack <no-reply@example.com>"
```

If you want password recovery emails to work, fill in the SMTP details with a working email provider.

### 6. Start backend server

Run:

```powershell
npm start
```

Then open in browser:

```text
http://localhost:3000
```

## Testing the Website

### Frontend preview with Live Server (port 5500)

If you want to preview just the HTML pages in VS Code:

1. Open the folder in VS Code
2. Click `Go Live` at the bottom right
3. Live Server will open a preview on port `5500`

This is useful to view the static pages, but it will not support login, dashboard, or tracking functionality.

### Full website test with backend

For full functionality, use the backend server on port `3000`:

- `http://localhost:3000`
- `http://localhost:3000/admin/login`
- `http://localhost:3000/agent/login`

### Create admin account

Visit this once:

```text
http://localhost:3000/setup
```

Then log in with:

- Username: `admin`
- Password: `Admin@123`

### Admin panel test

- Create new agents
- Generate tracking links
- Monitor traffic and agent performance
- Use the "Forgot Password" link on the admin login page if you need a reset email

### Agent panel test

- Log in as an agent
- Create tracking links
- Check recent visits and link statistics
- Use the "Forgot Password" link on the agent login page if you need a reset email

### Redirect test

Open a generated short link in the browser:

```text
http://localhost:3000/r/<slug>
```

Replace `<slug>` with the actual generated slug.

## Default Admin

The app will create a default admin account automatically if none exists.

## Deployment

Deploy to any Node.js host with MongoDB support. Configure the `MONGODB_URI` and `SESSION_SECRET` in `.env` or in your host's environment settings.

- On Render, do not hardcode `PORT` in your environment variables; the platform provides it automatically.
