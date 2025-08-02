# ZenFlow - Wellness Session Management Platform

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
task_arvyax/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserSessions.jsx
│   │   │   ├── SessionEditor.jsx
│   │   │   ├── SessionDetails.jsx
│   │   │   └── NotFound.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── assets.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── controllers/
    │   ├── userController.js
    │   ├── sessionController.js
    │   └── indexController.js
    ├── models/
    │   ├── User.js
    │   └── Session.js
    ├── routes/
    │   ├── users.js
    │   └── sessions.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── index.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/taskArvyax.git
cd taskArvyax
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with these variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arvyax
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/arvyax
JWT_SECRET=jwt_key
MAX_AGE=2592000 (30 days)
LOCAL_CLIENT_URL=http://localhost:5173
PRODUCTION_CLIENT_URL=render_site

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file with these variables:
VITE_LOCAL_API_URL=http://127.0.0.1:5000
VITE_PRODUCTION_API_URL=https://your-deployed-backend-url.render.com

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints

#### POST /register
Register a new user
```json
{
  "username": "string (5-17 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)"
}
```
**Response**: `{ message: "User Registered", token: "jwt_token" }`

#### POST /login
Authenticate user
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: `{ message: "User Authenticated", token: "jwt_token" }`

#### GET /logout
Logout user and clear JWT cookie
**Response**: `{ message: "Logged out" }`

#### POST /delete
Delete user account and all associated sessions
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: `{ message: "User Deleted" }`

### Session Endpoints

#### GET /sessions
Get all published sessions (public)
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of published session objects

#### GET /my-sessions
Get user's own sessions (drafts + published)
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of user's session objects

#### GET /my-sessions/:id
Get specific session by ID
**Headers**: `Authorization: Bearer <token>`
**Response**: Session object

#### POST /my-sessions/save-draft
Save session as draft
**Headers**: `Authorization: Bearer <token>`
```json
{
  "title": "string (required)",
  "tags": ["string"],
  "jsonFileUrl": "string (optional)",
  "sessionId": "string (optional, for updates)"
}
```
**Response**: `{ message: "Draft saved successfully", session: {...} }`

#### POST /my-sessions/publish
Publish session to make it public
**Headers**: `Authorization: Bearer <token>`
```json
{
  "title": "string (required)",
  "tags": ["string"],
  "jsonFileUrl": "string (optional)",
  "sessionId": "string (optional, for updates)"
}
```
**Response**: `{ message: "Session published successfully", session: {...} }`

## Database Schema

### User Model
```javascript
{
  username: String (unique, 5-17 chars),
  email: String (unique, valid email),
  password: String (hashed, min 8 chars),
  createdAt: Date
}
```

### Session Model
```javascript
{
  userId: ObjectId (ref to User),
  title: String (required),
  tags: [String],
  jsonFileUrl: String (optional),
  status: Boolean (false=draft, true=published),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Home | ❌ | Landing page |
| `/login` | Login | ❌ | User authentication |
| `/signup` | SignUp | ❌ | User registration |
| `/dashboard` | Dashboard | ✅ | Public sessions view |
| `/my-sessions` | UserSessions | ✅ | User's sessions list |
| `/my-sessions/:id` | SessionDetails | ✅ | Session detail view |
| `/session-editor` | SessionEditor | ✅ | Create/edit sessions |
| `*` | NotFound | ❌ | 404 error page |

## Key Features Implementation

### Auto-Save System
- Automatic saving every 5 seconds during active editing
- Additional save every 45 seconds for long editing sessions
- Visual feedback with loading states and timestamps
- Prevents duplicate session creation with sessionId tracking

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Adaptive navbar switching between icons and text
- Optimized touch targets for mobile devices
- Smooth animations with CSS transitions

### Authentication Flow
- JWT tokens stored in localStorage and HTTP-only cookies
- Automatic token injection in API requests
- Protected route wrapper component
- Persistent login state across browser sessions

## Deployment

### Backend (Render)
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy with automatic builds

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy with automatic builds

### Environment Variables for Production
**Backend**:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random secret key
- `PRODUCTION_CLIENT_URL`: Your deployed frontend URL

**Frontend**:
- `VITE_PRODUCTION_API_URL`: Your deployed backend URL

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- HTTP-only cookies for enhanced security
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Protected API routes with middleware

## Custom Styling

### Zen Button Animation
```css
.zen-button {
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.zen-button:hover {
  border-radius: 0;
}
```

### Color Palette
- Primary Green: `#00684A`
- Accent Green: `#00ED64`
- Light Green: `#B1FF05`
- Background: `#C6F6D5` (green-200)

## Author

**Herzlichkeit** - [GitHub Profile](https://github.com/roy-herzlichkeit)

---

### Quick Start Commands

```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
```

**Frontend URL**: http://localhost:5173  
**Backend URL**: http://localhost:5000

---