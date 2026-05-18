# F2 Fit Factory — Gym Management App
### 📍 Best Gym in Mandla | Built with React + Firebase

---

## 🚀 How to Run This App (Step by Step)

### STEP 1 — Install Node.js
Download and install from: https://nodejs.org (choose LTS version)

---

### STEP 2 — Set Up Firebase (Free)

1. Go to https://console.firebase.google.com
2. Click **"Add Project"** → Name it `f2-fit-factory` → Continue
3. Disable Google Analytics (not needed) → Create Project
4. Click **"Web"** icon (</>) to add a web app
5. Register app name as `f2-fit-factory`
6. Copy the `firebaseConfig` object shown

7. **Enable Firestore:**
   - Left sidebar → Build → Firestore Database
   - Click "Create database" → Start in **test mode** → Choose region (asia-south1 for India) → Done

8. **Enable Authentication:**
   - Left sidebar → Build → Authentication
   - Click "Get started" → Email/Password → Enable → Save

9. **Create Admin Account:**
   - In Authentication → Users tab → Add user
   - Email: `admin@f2fitfactory.com`
   - Password: Choose a strong password

---

### STEP 3 — Add Firebase Config to the App

Open the file: `src/firebase/config.js`

Replace the placeholder values with your actual Firebase config:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

---

### STEP 4 — Install & Run the App

Open a terminal (Command Prompt on Windows), navigate to this folder:

```bash
cd f2fitfactory
npm install
npm start
```

The app will open at: **http://localhost:3000**

Login with the admin account you created in Firebase.

---

### STEP 5 — Deploy for Free (Vercel)

1. Create a free account at https://vercel.com
2. Push this project to GitHub (https://github.com → New repo → upload files)
3. On Vercel: "New Project" → Import from GitHub → Select repo → Deploy
4. Your app will be live at: `https://f2-fit-factory.vercel.app` (or similar)

---

## 📱 App Features

| Section | What it does |
|---|---|
| Dashboard | Live stats, attendance chart, expiry alerts |
| BCA Analysis | Body composition tracking with charts (Your USP!) |
| Workout Plans | Weight Loss / Muscle Gain / Body Recomp plans |
| Diet Plans | Indian meal plans with calorie counts |
| Steam Bath | Slot booking system |
| Progress | Streaks, badges, achievements |
| Leaderboard | Top members by points |
| Members | Full member list with search & filter |
| Add Member | Register new member with auto expiry |
| Payments | Track all payments, pending amounts |
| Notifications | Send WhatsApp/SMS reminders |

---

## 💡 Firestore Database Structure

The app uses these collections in Firebase:
```
members/       → All member records
payments/      → Payment history
bca_readings/  → BCA body analysis readings
steam_bookings/→ Steam bath booking slots
```

---

## 🆘 Need Help?

Common issues:
- **"Firebase not configured"** → App runs in Demo Mode with sample data. Add your Firebase config to use real data.
- **Login not working** → Make sure you created a user in Firebase Authentication.
- **npm not found** → Install Node.js from nodejs.org first.

---

*F2 Fit Factory Management System · Mandla, Madhya Pradesh*
