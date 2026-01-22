# 🌟 Habit Tracker App

A beautiful, personal habit tracking web application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔐 **Simple Password Authentication** - Personal use only (password: `rooshybazing`)
- ✅ **Daily Habit Tracking** - Track 5 default habits or add your own
- 📊 **Analytics Dashboard** - Weekly and monthly trend charts with streak tracking
- 📅 **Interactive Calendar** - View past completions with visual indicators
- 💾 **Local Data Storage** - All data stored in your browser (IndexedDB)
- 🎨 **Calming Design** - Beautiful beige/brown color palette
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Enter password: `rooshybazing`
   - Start tracking your habits!

### Building for Production

```bash
npm run build
npm run preview
```

## 📖 Default Habits

The app comes with 5 default habits:
1. Praying
2. Reading Quran
3. Reading a Book
4. Learning a CS Skill
5. Doing Exercise

You can add more habits at any time!

## 🎯 How to Use

### Today View
- Check off habits as you complete them
- See your daily completion percentage
- Add new habits with the "Add New Habit" button

### Analytics View
- View weekly trend (last 7 days)
- View monthly trend (last 30 days)
- See per-habit completion rates
- Track current and longest streaks

### Calendar View
- Navigate through months
- Click any day to see that day's habits
- Visual indicators:
  - **Dark brown** = 100% complete
  - **Light brown** = Partially complete
  - **Beige** = Not complete

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **IndexedDB (idb)** - Local database
- **Recharts** - Data visualization
- **date-fns** - Date utilities

## 📚 Learning Resources

For a complete, step-by-step guide on how this app was built, see:
**[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**

This guide explains:
- Every technology used and why
- How each component works
- Data flow and state management
- Design decisions
- How to extend the app

Perfect for learning web development!

## 🎨 Design Philosophy

- **Minimalist** - Clean, distraction-free interface
- **Calming** - Beige/brown color palette for reduced eye strain
- **Intentional** - Focused on building consistent habits
- **Private** - All data stays on your device

## 📝 Project Structure

```
src/
├── components/       # React components
├── lib/             # Utilities and database
├── types/           # TypeScript types
├── App.tsx          # Main app
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## 🔒 Privacy

- **No backend** - Everything runs in your browser
- **No tracking** - Zero analytics or telemetry
- **No cloud** - Data never leaves your device
- **No accounts** - Simple password protection

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

MIT License - Feel free to use and modify as you wish.

---

**Built with ❤️ for Ali Rooshan**

Start your habit tracking journey today! 🚀
