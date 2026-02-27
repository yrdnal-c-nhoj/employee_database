# Employee Database

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing employee records with CRUD operations.

## 🚀 Features

- **Employee Management**: Create, read, update, and delete employee records
- **Modern UI**: Built with React 19 and Tailwind CSS
- **RESTful API**: Express.js backend with MongoDB Atlas integration
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant UI updates after CRUD operations

## 📋 Employee Data Model

Each employee record contains:
- **Name**: Full name (stored as single field, displayed as first/last name in form)
- **Position**: Job title or role
- **Level**: One of "Intern", "Junior", or "Senior"

## 🏗️ Project Structure

```
employee_database/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecordList.jsx    # Employee list with delete functionality
│   │   │   ├── Record.jsx        # Create/edit employee form
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── main.jsx              # React Router setup
│   │   └── App.jsx              # Main layout component
│   ├── public/                   # Static assets
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── db/
│   │   └── connection.js         # MongoDB connection
│   ├── routes/
│   │   └── record.js            # API routes (unused - routes in server.js)
│   ├── server.js                # Main Express server
│   └── package.json
├── .env.example            # Environment variables template
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks
- **React Router v7**: Client-side routing
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **MongoDB Atlas**: Cloud-hosted database
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yrdnal-c-nhoj/employee_database.git
cd employee_database
```

### 2. Backend Setup

#### Environment Variables
Create `server/.env`:
```env
ATLAS_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/emp_list?retryWrites=true&w=majority
PORT=5001
```

#### Install Dependencies & Start Server
```bash
cd server
npm install
node server.js
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

#### Environment Variables
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5001
```

#### Install Dependencies & Start Client
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5174`

## 🌐 API Endpoints

### Employee Records (`/record`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/record` | Get all employee records |
| GET | `/record/:id` | Get specific employee record |
| POST | `/record` | Create new employee record |
| PATCH | `/record/:id` | Update employee record |
| DELETE | `/record/:id` | Delete employee record |

### Request/Response Examples

#### Create Employee
```javascript
POST /record
Content-Type: application/json

{
  "name": "John Doe",
  "position": "Software Engineer", 
  "level": "Junior"
}
```

#### Update Employee
```javascript
PATCH /record/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "position": "Senior Software Engineer",
  "level": "Senior"
}
```

## 🚀 Deployment

### Production Environment Variables

#### Backend
- `ATLAS_URI`: MongoDB Atlas connection string
- `PORT`: Server port (default: 10000 for Render)
- `NODE_ENV`: Set to "production"

#### Frontend
- `VITE_API_URL`: Backend API URL (e.g., `https://your-api.onrender.com`)

### Deployment Platforms

#### Render (Recommended)
1. **Backend Service**:
   - Web Service → Node.js
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`

2. **Frontend Service**:
   - Web Service → Static
   - Root Directory: `client`
   - Build: `npm install && npm run build`
   - Publish: `dist`

#### Vercel (Frontend Only)
- Connect repository to Vercel
- Set `VITE_API_URL` environment variable
- Automatic deployment on git push

## 🔧 Development

### Available Scripts

#### Backend (`server/`)
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

#### Frontend (`client/`)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### CORS Configuration
The backend is configured to accept requests from:
- Local development: `http://localhost:5173`, `http://localhost:5174`
- Production: Your deployed frontend URLs
- Environment variable: `CLIENT_URL` (set in deployment platform)

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is in backend CORS allowed origins
   - Check `VITE_API_URL` environment variable

2. **Database Connection**
   - Verify `ATLAS_URI` is correct
   - Check MongoDB Atlas network access (IP whitelist)

3. **Build Failures**
   - Ensure Node.js version 18+ is installed
   - Clear node_modules and reinstall dependencies

4. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Never commit `.env` files to version control

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=*
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using the MERN stack**
