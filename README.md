# 🗂️ Employee Database

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application for efficiently managing employee records with complete CRUD operations, responsive design, and seamless user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-4.4%2B-green.svg)

## 🚀 Features

### 🎯 Core Functionality
- **📝 Employee Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **🔍 Search & Filter**: Quick employee lookup and filtering capabilities
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Real-time Updates**: Instant UI feedback after all operations
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS

### 🛠️ Technical Features
- **🔄 RESTful API**: Well-structured Express.js backend
- **🗄️ MongoDB Integration**: Cloud-hosted with MongoDB Atlas
- **🔐 Secure CORS**: Configurable cross-origin resource sharing
- **🌍 Environment Config**: Flexible deployment configurations
- **📦 Component Architecture**: Modular React components
- **🚀 Fast Development**: Vite for lightning-fast builds

## 📋 Employee Data Model

Each employee record contains:

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "position": "Software Engineer",
  "level": "Junior"
}
```

### Field Descriptions
- **Name**: Full name (stored as single field, displayed as first/last name in form)
- **Position**: Job title or role within the organization
- **Level**: Career level - one of "Intern", "Junior", or "Senior"

### Database Schema
- **Database**: `emp_list`
- **Collection**: `records`
- **Index**: MongoDB ObjectId as primary key

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

### 🌍 Production Environment Variables

#### Backend Environment Variables
```env
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/emp_list?retryWrites=true&w=majority
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

#### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-domain.com
```

### 🚀 Deployment Platforms

#### Render (Recommended)

**Backend Service Setup:**
1. **Create Web Service** → **Node.js**
2. **Configuration**:
   - **Name**: `employee-database-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `10000`

3. **Environment Variables**:
   - `ATLAS_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

**Frontend Service Setup:**
1. **Create Web Service** → **Static**
2. **Configuration**:
   - **Name**: `employee-database-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**:
   - `VITE_API_URL`: `https://employee-database-api.onrender.com`

#### Vercel (Frontend Only)

**Setup Steps:**
1. Connect your GitHub repository to Vercel
2. Set root directory to `client`
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL (e.g., Render backend)

#### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 🔄 CI/CD Pipeline

**GitHub Actions Example:**
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: johnnychaney/render-deploy@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

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

### 🔧 Common Issues & Solutions

#### 1. CORS Errors
**Problem**: Frontend cannot connect to backend
```
Access to fetch at 'http://localhost:5001/record' from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Solutions**:
- Ensure frontend URL is in backend CORS allowed origins
- Check `VITE_API_URL` environment variable
- Verify backend is running on correct port

#### 2. Database Connection Issues
**Problem**: Cannot connect to MongoDB Atlas
```
MongoServerError: bad auth Authentication failed
```

**Solutions**:
- Verify `ATLAS_URI` is correct (username, password, cluster)
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database name `emp_list` exists

#### 3. Build Failures
**Problem**: npm install or build fails
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions**:
- Ensure Node.js version 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check package.json for correct scripts

#### 4. Environment Variables
**Problem**: `process.env.VARIABLE` returns undefined

**Solutions**:
- Copy `.env.example` to `.env` in appropriate directory
- Restart server after changing environment variables
- Never commit `.env` files to version control

#### 5. Port Conflicts
**Problem**: Port already in use
```
Error: listen EADDRINUSE :::5001
```

**Solutions**:
- Kill process: `lsof -ti:5001 | xargs kill`
- Change port in `.env` file
- Use different port for development

### 🐛 Debug Mode

Enable comprehensive debugging:
```env
DEBUG=*
NODE_ENV=development
```

Add logging to API calls:
```javascript
console.log('API Request:', method, url);
console.log('Request Body:', req.body);
```

## 📊 Performance & Optimization

### 🚀 Frontend Optimization
- **Code Splitting**: Lazy load components with React.lazy()
- **Bundle Analysis**: Use `npm run build -- --analyze`
- **Image Optimization**: Compress images before adding to project
- **Caching**: Implement proper HTTP caching headers

### ⚡ Backend Optimization
- **Database Indexing**: Add indexes for frequently queried fields
- **Connection Pooling**: MongoDB connection pooling
- **Response Compression**: Enable gzip compression
- **Rate Limiting**: Implement API rate limiting

### 📈 Monitoring & Analytics
```javascript
// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 🔒 Security Best Practices

### 🛡️ Backend Security
- **Input Validation**: Validate all incoming data
- **Sanitization**: Sanitize user inputs to prevent XSS
- **Rate Limiting**: Prevent brute force attacks
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never expose sensitive data

### 🔐 Frontend Security
- **Content Security Policy**: Implement CSP headers
- **XSS Prevention**: Sanitize user-generated content
- **Authentication**: Implement proper auth flows
- **Secure Storage**: Use secure storage for tokens

## 🧪 Testing

### 📋 Test Strategy
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Load testing for API endpoints

### 🧪 Example Test Setup
```javascript
// Example Jest test for API
test('GET /record returns all employees', async () => {
  const response = await request(app).get('/record');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

### 📋 Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/employee_database.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature: description'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if applicable

### 🎯 Code Style Guidelines
- Use ES6+ syntax
- Follow React hooks best practices
- Maintain consistent indentation
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📞 Support & Community

### 🆘 Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check this README and inline comments
- **Code Review**: Request code reviews for PRs

### 📚 Additional Resources
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### 🌟 Show Your Support
- ⭐ Star this repository
- 🐛 Report issues you find
- 💡 Suggest improvements
- 📝 Contribute to documentation

---

## 🏆 Acknowledgments

- Built with modern MERN stack technologies
- Inspired by modern web development best practices
- Community-driven improvements and feedback

**Built with ❤️ using the MERN stack**

---

*Last updated: March 2026*
