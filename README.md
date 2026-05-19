# RallyIQ – Volleyball Statistics Platform

**Real-time volleyball match statistics tracker built for coaches and players.**

[🌐 Live Demo](https://volleyball-statistics.vercel.app/)  
[💻 GitHub Repository](https://github.com/Meripa/volleyball-statistics)

---

## About

RallyIQ is a full-stack web application that allows volleyball coaches and players to track match statistics quickly and efficiently during live games. It focuses on fast input workflows, real-time updates, and detailed performance analytics.

---

## ✨ Features

- **🏐 Real-time match tracking** with live score and set updates
- **📊 Detailed player & team statistics** (per set and full match)
- **👤 User authentication** + private match storage
- **🔗 Shareable public match reports**
- **📤 PDF & CSV export**
- **📜 Match history** and overview dashboard
- **📱 Fully responsive** – optimized for mobile use during games
- **↩️ Undo system** for events
- **⚡ Fast event-based input** workflow

---

## 🎥 Demo

### Create Match
![Create Match](/assets/gifs/CreateGame.gif)

### Real-Time Match Tracking
![Live Tracking](/assets/gifs/Statistic.gif)

### Mobile Interface
![Mobile View](/assets/gifs/Mobile.gif)

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM

**Backend**
- Node.js + Express
- TypeScript
- PostgreSQL
- REST API
- JWT Authentication

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL (Cloud)

---

## 🚀 Key Highlights

- Full-stack TypeScript application
- Fast and intuitive real-time scoring system
- Clean separation of concerns between frontend and backend
- Mobile-first design tailored for live game situations
- Scalable architecture ready for advanced analytics and future features

---

## 📂 Project Structure

volleyball-statistics/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
└── backend/           # Node.js + Express
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   └── db/

    ⚙️ Local Development
Bash# Clone the repository
git clone https://github.com/Meripa/volleyball-statistics.git
cd volleyball-statistics

# Frontend
cd frontend
npm install
npm run dev     # Runs on http://localhost:5173

# Backend (new terminal)
cd backend
npm install
npm run dev     # Runs on http://localhost:3000

🎯 Purpose
RallyIQ was created to help volleyball teams replace manual Excel sheets and paper notes with a modern, fast, and reliable statistics platform.

👨‍💻 Author
Meris Pärna

GitHub
LinkedIn