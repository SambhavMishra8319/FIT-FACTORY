# F2 Fit Factory — Complete Setup Guide
## Play Store + Razorpay Payment + Database

---

## PART 1 — Fix Admin/Member Routing Bug ✅ (Already fixed in this update)

The bug was: admin would briefly flash to member dashboard on login.

**What was wrong:** Routes rendered before Firebase finished loading the user's role from Firestore.

**What's fixed:** App now waits for BOTH Firebase Auth AND Firestore role before rendering any route. No more flashing.

---

## PART 2 — Firebase Database Setup

### Step 1: Deploy Firestore Security Rules
1. Go to https://console.firebase.google.com → Your Project
2. Click **Firestore Database** → **Rules** tab
3. Delete everything in the editor
4. Open `firestore.rules` file from this project
5. Copy the entire content → paste into Firebase → click **Publish**

### Step 2: Deploy Firestore Indexes
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore` (select your project)
4. Replace the generated `firestore.indexes.json` with the one in this project
5. Deploy: `firebase deploy --only firestore:indexes`

OR manually create indexes in Firebase Console:
- Firestore → Indexes → Composite → Add Index (for each entry in firestore.indexes.json)

### Step 3: Firestore Collections Structure
Your database will have these collections:

```
users/
  {uid}/
    uid, name, email/phone, role ("admin"|"member"), memberId, createdAt

members/
  {docId}/
    memberId (F2-0001), name, phone, email, age, gender
    weight, height, goal, plan, joinDate, expiryDate
    amountPaid, paymentMethod, status, notes, uid

payments/
  {docId}/
    memberId, memberName, plan, amount, method
    date, type, razorpayOrderId, razorpayPaymentId
    status ("paid"|"pending"|"failed"), createdAt

bca_readings/
  {docId}/
    memberId, memberName, date
    weight, fat, muscle, water, bmi, createdAt

steam_bookings/
  {docId}/
    date, slot, memberId, memberName, memberPhone, createdAt

attendance/
  {docId}/
    memberId, memberName, date, createdAt

notifications/
  {docId}/
    target, phone, message, channel, date, status, createdAt
```

---

## PART 3 — Play Store (Android App)

### Method: Capacitor (converts your React web app to Android app)

**Why Capacitor?** Your React app is already built. Capacitor wraps it in a native Android shell without rewriting anything. Takes ~2 hours.

### Step 1: Install Capacitor
```bash
cd f2fitfactory
npm install @capacitor/core @capacitor/android @capacitor/cli
npx cap init "F2 Fit Factory" "com.f2fitfactory.app" --web-dir=build
```

### Step 2: Build your React app
```bash
npm run build
```

### Step 3: Add Android platform
```bash
npx cap add android
npx cap sync
```

### Step 4: Open in Android Studio
```bash
npx cap open android
```

### Step 5: Configure app in Android Studio
Open `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
  <string name="app_name">F2 Fit Factory</string>
  <string name="title_activity_main">F2 Fit Factory</string>
  <string name="package_label">F2 Fit Factory</string>
</resources>
```

Open `android/app/build.gradle` and update:
```gradle
android {
  defaultConfig {
    applicationId "com.f2fitfactory.app"
    minSdkVersion 22
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
  }
}
```

### Step 6: Add your app icon
- Create icon 512x512px with F2 logo (gold on black)
- Go to Android Studio → File → New → Image Asset
- Set Foreground Layer to your icon → Generate
- This creates all required icon sizes automatically

### Step 7: Generate signed APK/AAB for Play Store
In Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Choose **Android App Bundle (.aab)** (required for Play Store)
3. Click **Create new keystore** (SAVE THIS FILE SAFELY — you need it for every update!)
   - Key store path: `f2fitfactory-keystore.jks`
   - Password: (choose strong password — write it down!)
   - Alias: `f2fitfactory`
   - First and Last Name: Your name
   - Country Code: IN
4. Click **Next** → **Release** → **Finish**
5. Your `.aab` file will be in `android/app/release/`

### Step 8: Create Play Store Listing
1. Go to https://play.google.com/console
2. Create developer account (one-time $25 fee)
3. Create new app → fill details:
   - **App name:** F2 Fit Factory
   - **Short description:** Track Workouts, BCA & Book Steam Bath
   - **Full description:** (see below)
   - **Category:** Health & Fitness
   - **Content rating:** Everyone
4. Upload your `.aab` file to Internal Testing first
5. After testing → Promote to Production

### Play Store Full Description (copy-paste ready):
```
F2 Fit Factory — Mandla's Premier Gym App

Track your fitness journey with our gym app:

🏋️ WORKOUT PLANS
Personalized plans for Weight Loss, Muscle Gain, Body Toning and General Fitness.

📊 BCA BODY ANALYSIS
Track body fat %, muscle mass, BMI and body water with our advanced BCA machine. See your progress over time with charts.

🥗 INDIAN DIET PLANS
Meal plans designed for Indian diet — roti, dal, paneer, whey combinations with calorie counts.

🌫️ STEAM BATH BOOKING
Book your steam bath slot from your phone. No queuing. 80-90°C sessions for detox and muscle recovery.

📈 PROGRESS TRACKING
Attendance streaks, achievement badges, body transformation charts.

💳 MEMBERSHIP MANAGEMENT
Buy and renew memberships. View expiry date and payment history.

F2 Fit Factory.
```

### Step 9: After Play Store Approval (2-3 days)
- Share the Play Store link with your members
- Members install → Login → Features unlock after membership purchase

---

## PART 4 — Razorpay Online Payment Integration

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com → Sign Up
2. Complete KYC (Aadhaar + PAN + Bank account)
3. Get approved (1-2 business days)
4. Go to Dashboard → Settings → API Keys → Generate Key ID and Secret

### Step 2: Install Razorpay package
```bash
cd f2fitfactory
npm install razorpay
```

### Step 3: Add Razorpay script to public/index.html
Add this before `</body>`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 4: Add these environment variables
Create `.env` file in project root:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXX
```
⚠️ Never put the SECRET key in frontend code. The secret goes on a backend server.

### Step 5: Create payment flow in upgrade page
The payment flow works like this:
1. Member clicks "Buy Monthly Plan" 
2. App calls your backend to create a Razorpay Order
3. Razorpay payment popup opens on member's phone
4. Member pays via UPI/Card/NetBanking
5. On success, Razorpay sends webhook to your backend
6. Backend verifies payment → writes membership to Firestore
7. Member's app unlocks automatically ✅

### Step 6: Backend needed for Razorpay
You need a small backend. Options:
- **Firebase Cloud Functions** (recommended — stays in Firebase ecosystem, free tier)
- Node.js server on Render.com (free)

Example Cloud Function (create in Firebase Console → Functions):
```javascript
const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const admin = require("firebase-admin");

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

exports.createOrder = functions.https.onCall(async (data, context) => {
  const order = await razorpay.orders.create({
    amount: data.amount * 100, // in paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
  });
  return { orderId: order.id };
});

exports.verifyPayment = functions.https.onCall(async (data, context) => {
  // Verify signature, then write membership to Firestore
  const { memberId, plan, months, amount, paymentId } = data;
  
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  
  await admin.firestore().collection("members").doc(memberId).update({
    status: "active",
    plan: plan,
    expiryDate: expiryDate.toISOString().split("T")[0],
    amountPaid: amount,
    lastPaymentId: paymentId,
  });
  
  return { success: true };
});
```

---

## PART 5 — What's Left To Build (Priority Order)

### 🔴 Build Next (Critical)
1. **Edit Member Page** — Admin can fix typos, change plan, update expiry
2. **Member Profile Edit** — Member updates weight, height, goal from app
3. **QR Code Check-in** — Auto attendance when member scans at gym entrance
4. **WhatsApp Integration** — Real messages via WATI.io (₹2,500/month)

### 🟡 Build After (High Value)  
5. **Custom Trainer Workout** — Trainer assigns custom plan to specific member
6. **PDF Receipt** — Download receipt after payment
7. **Progress Photos** — Before/after transformation upload
8. **Push Notifications** — Firebase Cloud Messaging for reminders

### 🟢 Build Later (Nice to Have)
9. **Hindi Language** — Toggle between Hindi and English
10. **Referral System** — Member gets 1 free week for each referral
11. **Personal Trainer Booking** — Book PT sessions with schedule
12. **Video Exercise Library** — YouTube-linked demos for each exercise

---

## PART 6 — Deployment (Free Hosting)

### Option A: Vercel (Recommended — easiest)
```bash
npm install -g vercel
vercel login
vercel --prod
```
Your app goes live at: `https://f2fitfactory.vercel.app`

### Option B: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting  # web dir: build, SPA: yes
npm run build
firebase deploy
```
Your app: `https://your-project.web.app`

### Custom Domain (optional, ~₹800/year)
Buy domain like `f2fitfactory.in` from GoDaddy/BigRock and connect to Vercel.

---

## Summary: What to do TODAY

1. ✅ Download new ZIP — routing bug is fixed
2. 📋 Copy `firestore.rules` into Firebase Console → Publish
3. 📋 Deploy `firestore.indexes.json` via Firebase CLI
4. 🚀 Run `npm run build` → deploy to Vercel (live in 5 minutes)
5. 📱 Install Capacitor → build Android → test on your phone
6. 💳 Create Razorpay account → complete KYC (takes 1-2 days)
7. 🏪 Submit to Play Store (takes 2-3 days for review)
