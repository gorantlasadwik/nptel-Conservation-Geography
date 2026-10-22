# NPTEL Quiz Practice Platform — Conservation Geography (Week 0–12)

A modern, responsive, high-performance practice and examination simulator for NPTEL Conservation Geography. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Questions](https://img.shields.io/badge/questions-130%20verified-indigo.svg)
![Weeks](https://img.shields.io/badge/weeks-0%20to%2012-emerald.svg)

---

## 🌟 Key Features

- **130 Verified Questions across Weeks 0 to 12**:
  - Week 0 (Pre-requisites & Basics from `week 0.txt`)
  - Weeks 1–12 extracted with 100% precision from official assignment solution keys.
- **Direct Learn Mode (Study Solutions)**:
  - Week-by-week direct answers and explanations.
  - Quick keyword search across questions and answers.
  - Fast Revision toggle ("Direct Answers only" vs "All Options").
  - One-click copy for quick notes.
- **Multiple Practice & Quiz Modes**:
  - **Individual Week Practice**: Practice questions from any specific week.
  - **Custom Multi-Week Quiz**: Combine any weeks (e.g., Week 1 + 3 + 5 + 8) with presets for First Half, Second Half, or All Weeks.
  - **Mock Exam Simulation**: Real exam environment with countdown timer, hidden answers until final submission, and automatic submission at zero.
- **Independent Shuffling Engine**:
  - Question shuffling and option choices shuffling (A–D) can be toggled independently.
  - Selected answers map back reliably to original identifiers for 100% accurate scoring.
- **Precision Timers**:
  - Target-deadline countdown timer (drift-free, resistant to interval throttling).
  - Stopwatch for elapsed practice time tracking.
- **Full Review & Analytics**:
  - Instant score, accuracy percentage, time taken, and per-week breakdown table.
  - Filter review by *All*, *Correct*, *Incorrect*, *Unanswered*, and *Flagged*.
  - **"Retry Incorrect Questions"**: Generates a custom quiz containing only previously missed questions.
- **Mobile First & Premium Aesthetics**:
  - Responsive layout optimized for phones (e.g. iPhone SE/Android) and desktops.
  - Native mobile navigation drawer for question jumping.
  - In-app exit confirmation modal (no clunky browser alerts).
  - Smooth dark/light mode with persistent LocalStorage state.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom dark variant
- **Icons**: Lucide React
- **Celebration FX**: Canvas Confetti
- **Storage**: LocalStorage (persists themes, quiz states, scores, and preferences)
- **Deployment**: Vercel-ready static application

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- Python 3.10+ (for PDF import pipeline)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/gorantlasadwik/nptel-Conservation-Geography.git
cd nptel-Conservation-Geography

# Install dependencies
npm install
```

### 3. Run Locally (Dev Server)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📄 PDF Extraction & Import Pipeline

The repository includes a automated Python pipeline (`scripts/import_pdfs.py`) that extracts questions from assignment PDFs, detects bold solution keys, and outputs validated JSON question banks:

```bash
# Run the PDF import pipeline
npm run import:pdfs
# or
python scripts/import_pdfs.py
```

### Pipeline Workflow:
1. Inspects `Conservation Geography Week X Solutions.pdf` (Weeks 1–12) and `week 0.txt`.
2. Employs a font visitor to detect bold option text (`<b>`) corresponding to official answer keys.
3. Parses Greek characters (α, β, γ, δ) and both `(a)` and `a.` option formats.
4. Validates each question (checks non-empty text, valid IDs, 4 options, and answer mapping).
5. Writes clean JSON files to `src/data/questions/week-00.json` ... `week-12.json` and updates `src/data/weeks.json`.

---

## 📱 Mobile Experience

- **Header**: Compact navigation with quick Exit confirmation and Mobile Navigator Drawer toggle.
- **Cards**: Responsive 1-column layout on mobile, 2-column on tablet, and 3-4 column on desktop.
- **Drawer**: Tap the grid icon during any quiz to jump between questions without scrolling.

---

## 🚢 Deployment to Vercel

This project is configured as a client-side Vite application ready for deployment on Vercel:

1. Push to your GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**!

---

## 📜 Course Outline
- **Week 0**: Pre-requisites & Introduction to Conservation
- **Week 1**: Fundamentals of Conservation Geography
- **Week 2**: Earth Structure & Geological Processes
- **Week 3**: Minerals, Rocks & Weathering Systems
- **Week 4**: Atmospheric Science, Climate & Air Masses
- **Week 5**: Oceanography & Marine Environments
- **Week 6**: River Systems, Drainage & Indian Geography
- **Week 7**: Soil Horizons, Weathering & Biodiversity Levels
- **Week 8**: Conservation Strategies, Species & Reserves
- **Week 9**: Demography, Population Dynamics & Development
- **Week 10**: Natural Resources, Energy & Pollution
- **Week 11**: Trade Economics, Corridors & Road Ecology
- **Week 12**: Photogrammetry, Remote Sensing & GIS Applications
