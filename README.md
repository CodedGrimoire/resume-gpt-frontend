# ResumeGPT

An AI-powered resume analysis application that provides comprehensive feedback on your resume using advanced language models. Upload your resume PDF and receive detailed insights including scoring, role recommendations, improvement suggestions, and career guidance.

## 🎯 About

ResumeGPT is a full-stack web application that leverages AI to analyze resumes and provide actionable feedback. The application extracts text from PDF resumes, sends it to the Groq API (powered by Llama 3.3 70B), and presents structured feedback to help users improve their resumes and understand their career positioning.

### Key Features

- **PDF Resume Upload**: Simple drag-and-drop interface for uploading PDF resumes
- **AI-Powered Analysis**: Comprehensive resume analysis using Groq's Llama 3.3 70B model
- **Resume Scoring**: Visual score display (out of 10) with color-coded feedback
- **Role Recommendations**: Identifies the best-suited job roles for your resume
- **Detailed Feedback**: 
  - General feedback and overall assessment
  - Issues and areas for improvement
  - Actionable suggestions for enhancement
  - Required technical and soft skills
  - Project recommendations that impress recruiters
  - Job market insights and trends
  - Learning paths and certification recommendations

## 🛠️ Tech Stack

### Frontend (`resume-gpt-frontend`)

- **Framework**: [Next.js](https://nextjs.org/) 15.3.3 (App Router)
- **UI Library**: [React](https://react.dev/) 19.0.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Geist Sans & Geist Mono (via Next.js)

**Key Features:**
- Modern glassmorphism UI design
- Responsive layout with dark theme
- Client-side file upload handling
- Real-time feedback display

### Backend (`resume-gpt-backend`)

- **Runtime**: Node.js
- **Framework**: [Express.js](https://expressjs.com/) 5.1.0
- **AI Service**: [Groq API](https://groq.com/) (Llama 3.3 70B Versatile)
- **File Upload**: [Multer](https://github.com/expressjs/multer) 2.0.1
- **PDF Processing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse) 1.1.1
- **HTTP Client**: [node-fetch](https://www.npmjs.com/package/node-fetch) 2.7.0
- **Environment**: [dotenv](https://www.npmjs.com/package/dotenv) 16.5.0
- **CORS**: [cors](https://www.npmjs.com/package/cors) 2.8.5

**Key Features:**
- RESTful API with Express
- PDF text extraction (first 4000 characters)
- Structured AI response parsing
- Automatic file cleanup after processing

## 📁 Project Structure

```
resume/
├── resume-gpt-backend/          # Express.js backend server
│   ├── index.js                 # Main server file
│   ├── package.json             # Backend dependencies
│   └── uploads/                 # Temporary PDF storage (auto-created)
│
└── resume-gpt-frontend/         # Next.js frontend application
    ├── app/
    │   ├── page.js              # Main application page
    │   ├── layout.js            # Root layout component
    │   └── globals.css           # Global styles
    ├── package.json              # Frontend dependencies
    └── next.config.mjs           # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com/))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd resume-gpt-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3003`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd resume-gpt-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the backend URL in `app/page.js` (line 186) if running locally:
```javascript
const res = await fetch('http://localhost:3003/upload', {
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔄 How It Works

1. **Upload**: User uploads a PDF resume through the frontend interface
2. **Processing**: Frontend sends the PDF to the backend `/upload` endpoint
3. **Extraction**: Backend extracts text from the PDF (first 4000 characters)
4. **Analysis**: Backend sends the resume text to Groq API with a structured prompt
5. **Parsing**: Backend parses the AI response into structured feedback fields
6. **Display**: Frontend renders the feedback in an organized, visually appealing layout

## 📝 API Endpoints

### `POST /upload`

Uploads and analyzes a PDF resume.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `resume` (PDF file)

**Response:**
```json
{
  "message": "✅ Resume analyzed successfully",
  "text": "Extracted resume text...",
  "feedback": {
    "role": "Software Engineer",
    "score": "8.5 out of 10",
    "feedback": "General feedback...",
    "issues": "Issues found...",
    "suggestions": "Suggestions...",
    "technicalSkills": "Required technical skills...",
    "softSkills": "Required soft skills...",
    "projects": "Project recommendations...",
    "marketInsight": "Job market insights...",
    "learningPaths": "Learning recommendations...",
    "raw": "Raw AI response..."
  }
}
```

## 🎨 UI Features

- **Modern Design**: Dark theme with glassmorphism effects
- **Score Visualization**: Circular progress indicator with color coding
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Icon Integration**: Lucide React icons for visual clarity
- **Loading States**: Smooth loading animations during analysis

## 🔒 Environment Variables

### Backend
- `GROQ_API_KEY`: Your Groq API key (required)

## 📦 Scripts

### Backend
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Frontend
- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## 🌐 Deployment

The backend is currently deployed on Render.com. To deploy:

1. **Backend**: Deploy to any Node.js hosting service (Render, Railway, Heroku, etc.)
2. **Frontend**: Deploy to Vercel, Netlify, or any static hosting service

Remember to:
- Set environment variables on your hosting platform
- Update the backend URL in the frontend code for production
- Ensure CORS is properly configured

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, Express.js, and Groq AI
