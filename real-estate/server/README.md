server setup

real-estate/ # Root directory (existing)
├── client/  
│ ├── public/
│ ├── src/
│ │ ├── component/
│ │ ├── pages/
│ │ └── ...
│ └── package.json
│
├── server/ # New backend directory
│ ├── src/
│ │ ├── config/ # Database connection, env vars
│ │ ├── controllers/ # Business logic
│ │ │ ├── auth.controller.js
│ │ │ ├── property.controller.js
│ │ │ ├── user.controller.js
│ │ │ └── contact.controller.js
│ │ ├── models/ # Database schemas
│ │ │ ├── User.model.js
│ │ │ ├── Property.model.js
│ │ │ ├── Inquiry.model.js
│ │ │ └── Contact.model.js
│ │ ├── routes/ # API endpoints
│ │ │ ├── auth.routes.js
│ │ │ ├── property.routes.js
│ │ │ ├── user.routes.js
│ │ │ └── contact.routes.js
│ │ ├── middleware/ # Auth, validation, error handling
│ │ │ ├── auth.middleware.js
│ │ │ ├── validation.middleware.js
│ │ │ └── error.middleware.js
│ │ ├── services/ # Business logic layer [citation:6]
│ │ │ ├── email.service.js
│ │ │ └── file.service.js
│ │ ├── utils/ # Helpers, constants
│ │ │ ├── logger.js
│ │ │ └── constants.js
│ │ └── app.js # Express app setup
│ ├── uploads/ # Temporary file storage [citation:9]
│ ├── tests/ # Backend tests
│ ├── .env.example # Environment variables template
│ ├── package.json
│ └── server.js # Entry point
│
├── shared/ # Shared between client/server [citation:6]
│ ├── types/ # Data types/constants
│ └── utils/ # Shared utilities
│
├── package.json # Root package.json for scripts
└── .gitignore

mkdir src, src\config, src\controllers, src\models, src\routes, src\middleware, src\services, src\utils, uploads, tests

Step 3: Initialize Backend
bash
cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken express-validator multer
npm install -D nodemon

Development Workflow
Start backend: cd server && npm run dev (nodemon auto-reloads)

Start frontend: cd client && npm start

Or use root script: npm run dev runs both concurrently

vim .env.example

cd src
vim app.js
