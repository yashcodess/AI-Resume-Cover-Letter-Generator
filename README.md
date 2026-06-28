# AI Resume Optimizer

An AI-powered web application that helps job seekers optimize their resumes, analyze alignment with job descriptions, and generate tailored resumes and cover letters using the Google Gemini API.

This project is built as a highly polished, responsive web dashboard supporting both **Dark** and **Light** themes. It runs entirely client-side, using local browser storage to save optimization runs, which makes it perfect for free static web hosting.

---

## 🚀 Live Demo & Screenshots

> [!NOTE]
> *Insert screenshots or screen recordings here once deployed to showcase the beautiful glassmorphism panels, circular loading bars, and light/dark theme swaps.*

---

## ✨ Features

- 📄 **Client-Side PDF Text Extraction:** Drag and drop your resume PDF or TXT directly into the browser. Text is extracted locally using `pdfjs-dist` without uploading files to any external server.
- 🎯 **Resume Match Analysis:** Replaces raw numerical scores with a detailed dashboard listing:
  - **Matching Skills:** Keywords and skills identified in both your resume and the job requirements.
  - **Missing Skills / Gaps:** Core requirements in the job description that your resume lacks.
  - **Strengths & Weaknesses:** Key highlights and areas of concern analyzed by AI.
  - **Actionable Section-by-Section Suggestions:** Actionable recommendations for sections like Summary, Experience, or Skills.
- ✏️ **Side-by-Side Resume Tailor:** Compares your original resume with a Gemini-optimized Markdown resume side-by-side. Supports in-app editing, clipboard copies, and direct PDF printing.
- ✉️ **Custom Cover Letter Generator:** Drafts a custom cover letter based on your experience and target job. Parameterize Tone (Professional, Bold, Enthusiastic, Creative) and Length (Short, Standard, Detailed) on the fly.
- 💾 **Local Persistence (History Panel):** Tracks past analyses and saves them in the browser's `localStorage` so you can jump back to previous optimizations.
- 🌓 **Theme Toggle:** Smoothly toggle between deep-space Dark Mode and clean Light Mode.
- 🧪 **One-Click Demo Data:** Load pre-made sample resumes and job requirements to test the optimizer instantly.

---

## 🛠️ Tech Stack

* **Frontend Library:** [React 18](https://react.dev/) (Vite bundler)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/) (via the official `@google/generative-ai` SDK)
* **Styling:** Custom CSS3 Variables (No heavy CSS frameworks like Tailwind, ensuring maximum layout customizability and lighting-fast loads)
* **PDF Parser:** [PDF.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist` for local client-side parsing)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Markdown Parser:** [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 📦 Folder Structure

```
AI-Resume-Optimizer/
├── .env.example              # Environment variables template
├── .gitignore                # Files excluded from git
├── index.html                # Main entry HTML (imports Outfit & Inter fonts)
├── package.json              # App dependencies & scripts
├── vite.config.js            # Vite configuration
├── README.md                 # Project documentation
├── public/                   # Favicons and SVG icons
└── src/
    ├── main.jsx              # React app mount script
    ├── App.jsx               # Main state coordinator & dashboard layout
    ├── index.css             # Base styles, animation keyframes, theme variables
    ├── components/           # Subcomponents
    │   ├── ThemeToggle.jsx         # Dark/Light theme switcher
    │   ├── HistoryPanel.jsx        # Sidebar managing localStorage session logs
    │   ├── ResumeUpload.jsx        # Drag-and-drop file parsing widget
    │   ├── LoadingProgress.jsx     # Step-by-step progress scanner
    │   ├── ResumeMatchAnalysis.jsx # Skills-matching comparison boards
    │   ├── ResumeTailor.jsx        # Side-by-side optimized resume view
    │   └── CoverLetterTailor.jsx   # Customizable letter generator
    ├── services/             # Core integrations
    │   ├── geminiService.js        # Gemini SDK configuration, schemas, and prompts
    │   ├── historyService.js       # LocalStorage CRUD utilities
    │   └── pdfParser.js            # Client-side PDF.js extractor
    └── utils/
        └── sampleData.js           # Demo Resume and Job Description data
```

---

## 🔧 Installation & Setup

Follow these steps to run the application locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/AI-Resume-Optimizer.git
cd AI-Resume-Optimizer
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Gemini API Key
Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/). 

Create a `.env` file in the root folder (copying from `.env.example`):
```bash
cp .env.example .env
```
Open `.env` and paste your key:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

### 5. Start Dev Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 💡 Usage Guide

1. **Load Demo:** If you want a quick demonstration, click the **"Load Sample Resume"** and **"Load Sample Job Description"** buttons.
2. **Upload custom resume:** Click the drag-and-drop box to upload your resume (PDF or TXT).
3. **Insert Job Description:** Paste the text of the job description you want to optimize for in the second column.
4. **Trigger optimization:** Click **"Optimize Resume & Letter"**.
5. **Review analysis:** Inspect matching and missing keywords, strengths, and recommendations.
6. **Tailored assets:** Click the **"Tailored Resume"** tab to compare or print to PDF. Move to the **"Cover Letter"** tab, adjust tone, and copy the letter.

---

## 🔮 Future Improvements

- [ ] **Multi-Format Export:** Directly export tailored resumes to DOCX format.
- [ ] **Interactive Resume Editor:** Allow users to accept specific AI suggestions, auto-applying changes into the tailored text.
- [ ] **Custom Styling Templates:** Provide multiple professional resume formatting templates (e.g. Creative, Harvard, Executive).
- [ ] **Google Drive Integration:** Allow direct importing from and exporting to Google Docs.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it for personal or commercial projects.
