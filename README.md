REAL ESTATE

## Prerequisites

Before you begin, ensure you have the following installed:

Node.js (version 16 or higher)

Visual Studio Code

Git (optional, for version control)

Step 1: Verify Node.js Installation
Open VS Code Terminal (Ctrl + `) and run:

bash
node --version
npm --version
You should see version numbers. If not, download Node.js.
https://nodejs.org/en/download/

Step 2: Create Your React Project
In VS Code Terminal:

bash

# Create new React project with Vite (recommended for faster builds)

npm create vite@latest my-react-website -- --template react

# OR using Create React App (alternative)

npx create-react-app my-react-website

# Navigate to project folder

cd my-react-website
Step 3: Install Dependencies
bash

# Install all required packages

npm install
Step 4: Install VS Code Extensions
Open VS Code Extensions panel (Ctrl+Shift+X) and install:

ES7+ React/Redux/React-Native snippets (by dsznajder)

Prettier - Code formatter (by Prettier)

ESLint (by Microsoft)

Auto Rename Tag (by Jun Han)

Bracket Pair Colorizer (by CoenraadS)

# Material Icon Theme - Better file icons

pkief.material-icon-theme

# Live Server - Launch local development server

ritwickdey.liveserver

# GitLens - Supercharge Git capabilities

eamodio.gitlens

# Path Intellisense - Autocomplete filenames

christian-kohler.path-intellisense

# npm Intellisense - Autocomplete npm modules

christian-kohler.npm-intellisense

Post-Installation Setup:
After installing, configure these settings:

Enable Format on Save:

File → Preferences → Settings

Search "format on save"

Check "Editor: Format On Save"

Set Prettier as Default Formatter:

In settings, search "default formatter"

Select "Prettier - Code formatter"

Configure Bracket Colors:

Install "Bracket Pair Colorizer 2"

It works automatically, no setup needed

Step 5: Start Development Server
bash

# For Vite projects:

npm run dev

# For Create React App projects:

npm start
Your app will open at http://localhost:5173 (Vite) or http://localhost:3000 (CRA).

📁 Project Structure
text
my-react-website/
├── public/ # Static files
│ ├── index.html # Main HTML file
│ └── favicon.ico # Site icon
├── src/ # Source code
│ ├── components/ # Reusable components
│ ├── App.jsx # Main application component
│ ├── main.jsx # Application entry point
│ ├── App.css # Main styles
│ └── index.css # Global styles
├── package.json # Dependencies and scripts
├── vite.config.js # Vite configuration
└── README.md # This file
🛠️ Available Commands
Command Description
npm run dev Start development server
npm run build Build for production
npm run preview Preview production build
npm run lint Run code linting
npm test Run tests (CRA only)
🎨 Creating Your First Component

1. Create a component file:
   Create src/components/Header.jsx:

jsx
// src/components/Header.jsx
import React from 'react';
import './Header.css';

function Header() {
return (

<header className="header">
<h1>My React Website</h1>
</header>
);
}

export default Header; 2. Create component styles:
Create src/components/Header.css:

css
/_ src/components/Header.css _/
.header {
background: #282c34;
color: white;
padding: 20px;
text-align: center;
} 3. Use the component in App.jsx:
Update src/App.jsx:

jsx
// src/App.jsx
import React from 'react';
import Header from './components/Header';
import './App.css';

function App() {
return (

<div className="App">
<Header />
<main>
<p>Welcome to your React website!</p>
</main>
</div>
);
}

export default App;
⚙️ VS Code Configuration (Optional)
Enable Auto-Formatting:
Create .vscode/settings.json in project root:

json
{
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode",
"files.autoSave": "onFocusChange"
}
Set up Prettier:
Create .prettierrc in project root:

json
{
"semi": true,
"singleQuote": true,
"tabWidth": 2,
"trailingComma": "es5"
}
📦 Useful NPM Packages
Install additional packages as needed:

bash

# Routing

npm install react-router-dom

# HTTP requests

npm install axios

# Icons

npm install react-icons

# CSS framework

npm install tailwindcss
🔧 Development Tips
VS Code Shortcuts:
Ctrl + ` - Toggle terminal

Ctrl + Shift + P - Command palette

Ctrl + S - Save and format (with Prettier)

Ctrl + Space - Code suggestions

Alt + Click - Multiple cursors

React Snippets (with ES7+ extension):
rfce - Create functional component with export

rafce - Create arrow function component with export

imr - Import React

imrc - Import React and Component

🚢 Deployment
Build for Production:
bash
npm run build
This creates an optimized dist/ (Vite) or build/ (CRA) folder.

Deploy to Free Hosting:
Vercel: Drag and drop dist/ folder to vercel.com

Netlify: Drag and drop dist/ folder to netlify.com

GitHub Pages: Follow GitHub Pages guide

recommended folder structure for frontend
folder structure
src/
├── components/
│ └── home/
│ ├── index.js // Barrel export for all home components
│ ├── Hero/
│ │ ├── Hero.jsx
│ │ ├── Hero.css
│ │ └── index.js // Exports Hero component
│ ├── Vision/
│ │ ├── Vision.jsx
│ │ ├── Vision.css
│ │ └── index.js // Exports Vision component
│ └── Services/
│ ├── Services.jsx
│ ├── Services.css
│ └── index.js // Exports Services component
└── pages/
└── HomePage.jsx

src/
├── components/
│ └── user/
│ ├── pages/
│ │ ├── Home/
│ │ ├── About/
│ │ ├── Contact/
│ │ ├── Services/
│ │ └── Consultation/
│ ├── components/
│ │ ├── Header/
│ │ ├── Footer/
│ │ ├── Contact/
│ │ └── SocialLinks/
│ ├── layouts/
│ │ └── MainLayout.jsx
│ └── styles/
│ ├── variables.css
│ ├── animations.css
│ └── global.css

hompage contents

<header>
HomePage.jsx
├── Hero Section
├── Vision Section  
├── Services Section
├── Why Choose Us
├── Testimonials
├── Partners Section
├── CTA Section
└── Footer

about page folder structure
src/
├── component/
│ ├── userpages/
│ │ ├── AboutPage.js (Main page - keep it simple)
│ │ └── styles/
│ │ └── AboutPage.css
│ └── about/ (New folder for About page components)
│ ├── Hero/
│ │ ├── AboutHero.jsx
│ │ └── AboutHero.css
│ ├── Story/
│ │ ├── CompanyStory.jsx
│ │ └── CompanyStory.css
│ ├── MissionVision/
│ │ ├── MissionVision.jsx
│ │ └── MissionVision.css
│ ├── Team/
│ │ ├── TeamSection.jsx
│ │ └── TeamSection.css
│ ├── Values/
│ │ ├── CoreValues.jsx
│ │ └── CoreValues.css
│ ├── Achievements/
│ │ ├── Achievements.jsx
│ │ └── Achievements.css
│ └── CTA/
│ ├── AboutCTA.jsx
│ └── AboutCTA.css
