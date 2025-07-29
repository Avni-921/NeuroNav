# Online Judge System - MERN Stack

A comprehensive Online Judge platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for competitive programming and coding practice.

## 🚀 Features

### Core Functionality
- **Problem Management**: Browse and solve coding problems with different difficulty levels
- **Code Execution**: Real-time code evaluation with multiple language support (JavaScript, Python, Java, C++, C)
- **User Authentication**: Secure registration and login system
- **Leaderboard**: Global rankings and user statistics
- **Submission History**: Track your progress and submission results

### Technical Features
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Feedback**: Instant code execution results
- **Security**: JWT-based authentication and input validation
- **Scalable Architecture**: Modular backend design
- **Modern Frontend**: React with hooks and context API

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled UI components
- **Heroicons** - Icon library
- **Axios** - HTTP client
- **Monaco Editor** - Code editor (planned)

## 📁 Project Structure

```
online-judge/
├── backend/
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Submission.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── problems.js
│   │   ├── submissions.js
│   │   └── leaderboard.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── utils/           # Utility functions
│   │   └── codeExecutor.js
│   ├── temp/            # Temporary files for code execution
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   └── Layout/
│   │   ├── pages/        # Page components
│   │   │   ├── Auth/
│   │   │   ├── Home/
│   │   │   ├── Problems/
│   │   │   ├── Leaderboard/
│   │   │   └── Profile/
│   │   ├── context/      # React context
│   │   │   └── AuthContext.js
│   │   ├── utils/        # Utility functions
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-judge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/online-judge
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions/:id` - Get submission by ID
- `GET /api/submissions/user/me` - Get user submissions
- `GET /api/submissions/problem/:problemId` - Get problem submissions

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/user/:userId` - Get user statistics
- `GET /api/leaderboard/problems` - Get problem statistics

## 🎯 Code Execution

The system supports multiple programming languages:

- **JavaScript** (Node.js)
- **Python** (Python 3)
- **Java** (OpenJDK)
- **C++** (g++)
- **C** (gcc)

### Code Execution Flow
1. User submits code through the frontend
2. Backend receives submission and creates a record
3. Code is executed against test cases in isolated environment
4. Results are evaluated and stored
5. User receives real-time feedback

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Code Isolation**: Safe code execution in temporary environment

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Modern Interface**: Clean and intuitive design
- **Dark/Light Theme**: Tailwind CSS utilities
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages

## 🚀 Future Enhancements

- [ ] Contest system with time-based challenges
- [ ] Discussion forums for problems
- [ ] Advanced code editor with syntax highlighting
- [ ] Docker containerization for code execution
- [ ] Real-time collaboration features
- [ ] Mobile application
- [ ] Advanced analytics and insights
- [ ] Integration with external judges
- [ ] Plagiarism detection
- [ ] Video tutorials and editorials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by platforms like LeetCode, HackerRank, and Codeforces
- Built with modern web technologies and best practices
- Thanks to the open-source community for amazing tools and libraries

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Happy Coding! 🚀**