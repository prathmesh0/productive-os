# 🚀 Productivity OS

**Productivity OS** is a high-performance, single-user progressive web application (PWA) built to unify task management, calendar scheduling, habit tracking, and weekly reviews into a single, cohesive interface.

Built with **Next.js 14 (App Router)** and **Firebase**, it replaces fragmented apps with a unified system designed for high-performers.

---

## ✨ Core Features

### 1️⃣ Task Management System
- **Categories**: DSA, Jobs, Book, Learning, Insta, Personal.
- **Smart Recurrence**: Tasks marked as recurring automatically create a copy for the next day once completed.
- **Real-time Sync**: Powered by Firestore for instant updates across devices.
- **Success Template**: One-click generation of core daily routines (DSA, Job Apps, Content, etc.).

### 2️⃣ Today Calendar View
- **Vertical Time Grid**: 6 AM – 12 AM grid visualization.
- **Quick Schedule**: Click any empty time slot to pre-fill the task creation modal.
- **Visual Feedback**: Tasks are positioned and sized dynamically based on their duration.

### 3️⃣ Streak & Analytics
- **Evaluation**: A day is successful if 3+ core tasks are completed.
- **Visual Trends**: 7-day productivity score trend and category distribution using **Recharts**.
- **Motivation**: Current and longest streak tracking on the homepage.

### 4️⃣ Weekly Review Dashboard
- **Reflection**: Dedicated space for weekly wins and lessons learned.
- **Stats**: Automated calculation of "Core Consistency" across the week.
- **Historical Snapshots**: View previous week's reflection and performance.

### 5️⃣ Night Planning Section
- **MITs**: Identify 3 Most Important Tasks for tomorrow.
- **Focus**: Set a theme or focus word for the next day.
- **Reset**: Auto-prompts for fresh planning every evening.

### 6️⃣ Smart Features & PWA
- **WFO / WFH Toggle**: Shifts the UI theme and suggests workload intensity.
- **PWA Enabled**: Install to home screen, offline caching, and standalone mode support.
- **Mobile First**: Fully responsive and optimized for thumb-driven navigation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Firebase Firestore
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Utils**: date-fns, clsx, tailwind-merge

---

## 💡 How to Use: The High-Performance Workflow

Productivity OS is designed to be a "Second Brain" for your daily execution. Here is the recommended workflow:

### 🌅 Morning: Set Your Intention
1. **Toggle Mode**: Switch between **WFO (Work From Office)** and **WFH (Work From Home)** to set the psychological theme for the day.
2. **Generate Template**: If it's a new day, click **"Generate Today’s Success Template"**. This instantly populates your 5 core high-leverage tasks (DSA, Jobs, Learning, etc.).
3. **Review Calendar**: Head to the **Calendar** tab. See how your tasks fit into the day. Click on an empty hour slot to schedule deep-work blocks or meetings.

### ☀️ Daytime: Execution & Flow
1. **Check Off Tasks**: As you finish a task, click the circle to complete it.
2. **Smart Recurrence**: If it’s a daily habit (like "Solve 3 DSA"), completing it today will automatically create a fresh copy for tomorrow.
3. **Monitor Score**: Keep an eye on your **Productivity Score** on the homepage. Aim for 80% or higher.

### 🌃 Night: Planning for Tomorrow
1. **Night Planning Section**: Before you sleep, fill out the **MITs (Most Important Tasks)** for tomorrow.
2. **Tomorrow Focus**: Set one word or theme for the next day to prime your subconscious mind.

### 📊 Weekly: Review & Reflect
1. **Dashboard**: Visit the **Stats** tab to see your 7-day performance trend. 
2. **Weekly Review**: Every Sunday, go to the **Review** tab. Enter your metrics (like total words written) and write a reflection on what worked and what didn't. This helps you break plateaus and improve weekly consistency.

---

## 🏗️ Architecture Overview

The project follows a **Modular Clean Architecture** to ensure maintainability:

- **/app**: Next.js App Router pages and layouts.
- **/components**: Atomic UI components and feature-specific modules (e.g., `CalendarView`, `TaskCard`).
- **/hooks**: Business logic extracted into custom hooks (`useTasks`, `useStreak`, `useAnalytics`).
- **/lib**: Type definitions and global utility functions.
- **/firebase**: Firestore configuration and initialization.
- **/public**: PWA assets, manifest, and service worker.

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone <your-repo-url>
cd productive-os
npm install
```

### 2. Firebase Setup
1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** in test mode.
3. Add a Web App and copy your config.

### 3. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📱 PWA / Mobile Installation

1. Deploy the app to a HTTPS environment (e.g., Vercel).
2. **iOS**: Open in Safari -> Share -> Add to Home Screen.
3. **Android**: Open in Chrome -> Settings -> Install App.

---

## 🔒 Security Note
This is a **single-user local-first application**. Firestore rules are set to public for simplicity in a personal environment. If deploying for multiple users, implement Firebase Auth and update Firestore rules to `allow read, write: if request.auth != null`.

---

## 📝 License
MIT License - Created for high-performance individuals.
