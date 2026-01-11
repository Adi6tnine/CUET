# 🚀 Adarsh's 4th Sem Command Center

A cyberpunk-themed academic dashboard built for dominating Computer Science placements and exams.

## ⚡ Features

- **Command HQ Dashboard**: Real-time placement readiness tracking, study streak monitoring, and enhanced daily grind checklist
- **Smart Analytics**: AI-powered insights with placement predictions, study pattern analysis, and personalized recommendations
- **Battle Plan Syllabus Tracker**: Interactive progress tracking for all 7 subjects with IndexedDB persistence  
- **Mission Timeline**: Full-featured timeline with custom events, filtering, and deadline management
- **Data Center**: Complete database management with export/import, statistics, and backup functionality
- **Grok AI Advisor**: Savage academic mentor powered by Groq AI with lightning-fast Hinglish responses
- **Cyberpunk UI**: Neon green/purple theme with smooth animations and responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Persistence**: IndexedDB for robust local storage
- **AI**: Groq API integration (faster than OpenAI!)

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Add your Grok API key to .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Key Components

### Dashboard Features
- **Placement Readiness**: Weighted calculation based on DAA + Java + Competitive Coding completion
- **Study Streak Tracking**: Consecutive days with study activity and motivational badges
- **Weekly Goal Progress**: Smart tracking of topics completed this week with visual progress
- **CareSync AI Progress**: Manual project progress slider with gradient visualization
- **Daily Grind Checklist**: 4 daily tasks that reset at midnight with database persistence
- **Quick Analytics Preview**: Study streak, weekly progress, and next deadline at a glance
- **Activity Heatmap**: GitHub-style contribution graph synced with daily task completion

### Smart Analytics Dashboard
- **Placement Readiness Score**: Weighted algorithm considering subject importance for placements
- **Subject Performance Analysis**: Detailed breakdown with personalized recommendations
- **Study Pattern Recognition**: Most/least productive days and efficiency recommendations
- **Performance Prediction**: AI-powered exam score prediction with confidence levels
- **Actionable Insights**: Next steps and priority recommendations based on current progress
- **Study Streak Analytics**: Consecutive day tracking with motivational feedback

### Syllabus Tracker
- **7 Subjects**: Complete 4th semester CS curriculum
- **Priority Highlighting**: DAA and Java marked as "HIGH PRIORITY" with glowing borders
- **Progress Tracking**: Real-time completion percentage with animated progress bars
- **Topic Checkboxes**: Persistent state management via IndexedDB

### Mission Timeline
- **Default Events**: All semester deadlines and exams pre-loaded
- **Custom Events**: Add, edit, and delete personal deadlines and milestones
- **Smart Filtering**: Filter by event type, upcoming/past, or view all
- **Priority System**: High-priority events with urgent visual indicators
- **Countdown Timers**: Days remaining with color-coded urgency levels

### Data Center
- **Database Statistics**: Real-time stats on all stored data
- **Export/Import**: Full backup and restore functionality
- **Data Migration**: Automatic migration from localStorage to IndexedDB
- **Storage Management**: Clear data and manage database size

### Grok AI Chat
- **Savage Advisor**: Motivational but brutally honest academic guidance
- **Hinglish Responses**: Mix of English and Hindi for relatable communication
- **Placement Focus**: Optimized for DSA, projects, and interview preparation
- **Fallback Mode**: Works even without API key with pre-written responses

## 📅 Academic Timeline

- **MST-1**: Feb 9-12, 2026
- **Project Expo**: March 6, 2026 (CareSync Deadline)
- **MST-2**: March 17, 2026
- **End Sem**: May 1, 2026

## 🎨 Design System

- **Background**: `#09090b` (Cyber Black)
- **Text**: `#e4e4e7` (Cyber White)
- **Success**: `#22c55e` (Neon Green)
- **Danger**: `#ef4444` (Neon Red)  
- **AI/Purple**: `#a855f7` (Neon Purple)
- **Fonts**: JetBrains Mono (code) + Inter (UI)

## 🔧 Configuration

### Groq AI Setup
1. Get API key from [console.groq.com](https://console.groq.com/)
2. Add to `.env`: `VITE_GROQ_API_KEY=your_key_here`
3. Chat will work with fallback responses if no key provided

### Data Customization
- Edit `src/data/semesterData.js` to modify subjects/timeline
- All progress data persists automatically in IndexedDB
- Daily checklist resets at midnight with activity tracking
- Export/import functionality for data backup and migration

## 📱 Responsive Design

- **Mobile**: Optimized for syllabus checking on-the-go
- **Desktop**: Full dashboard experience with animations
- **Tablet**: Adaptive grid layouts

## 🎯 Placement Focus

This dashboard is specifically designed for CS students targeting top-tier placements:

- **DAA Priority**: Algorithms are marked as highest priority
- **Project Tracking**: CareSync AI (MERN stack) progress monitoring  
- **Competitive Coding**: Dedicated subject for interview prep
- **Timeline Awareness**: All major academic deadlines tracked

---

**Built with 💚 for academic excellence and placement domination!**