# Kanwer Polytex Website

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](#license)
[![Status](https://img.shields.io/badge/status-Design%20Ready-orange.svg)](#)
[![Website](https://img.shields.io/badge/site-kanwerpolytex.com-lightgrey.svg)](https://kanwerpolytex.com)

🌐 Official website of **Kanwer Polytex** — Yarn Dyeing Specialists since 1999, based in Bhiwandi (Mumbai’s textile hub).
Built with **Next.js**, **Material 3 design**, and **Firebase backend integration** for enquiry management and
notifications.

---

## ✨ Highlights

- 🧵 Specialization in **nylon & polyester yarn dyeing** (filament & spun)
- 🎨 Material 3 design (elevated cards, accessible components, responsive)
- 🌍 SEO-ready & multilingual-ready architecture (English → extendable)
- ☁️ Firebase integration for lead storage, Cloud Functions, and FCM notifications
- 📱 Future-ready: can be connected to Android/iOS apps sharing the same backend
- ⚡ Optimized for performance and Core Web Vitals

---

## 🛠️ Tech Stack

- **Framework:** Next.js (React)
- **UI Library:** Material UI (MUI) configured with Material 3 tokens
- **Backend:** Firebase (Firestore, Cloud Functions, FCM)
- **Hosting:** Vercel or Firebase Hosting (recommended)
- **Fonts:** Noto Sans (body) + Noto Serif (headings) — broad script coverage
- **Version Control:** Git + GitHub

---

## 📂 Project Structure

    kanwerpolytex-website/
    ├── public/            # Static assets (images, icons, favicon, etc.)
    ├── src/
    │   ├── components/    # Reusable React components (AppBar, Hero, Card, Form...)
    │   ├── pages/         # Next.js pages (index.js, _app.js, _document.js)
    │   ├── styles/        # Global & component styles (CSS/SCSS)
    │   └── utils/         # Helper functions, Firebase setup, constants
    ├── functions/         # Firebase Cloud Functions (optional)
    ├── .gitignore
    ├── LICENSE            # Proprietary License (EULA)
    ├── NOTICE             # Copyright and usage notice
    ├── README.md          # This file
    └── package.json

---

## 🚀 Getting Started (Local Development)

1. Clone the repo

   git clone https://github.com/your-org/kanwerpolytex-website.git
   cd kanwerpolytex-website

2. Install dependencies

   npm install
   # or
   yarn

3. Setup Firebase (local)

- Create a Firebase project at https://console.firebase.google.com/
- Enable **Firestore** and **Cloud Functions** (if you will use functions).
- Create a `.env.local` file in the project root with the following variables (replace values with your Firebase
  config):

  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

> **Never commit** `.env.local` — it is included in `.gitignore`.

4. Run locally

   npm run dev
   # or
   yarn dev

Open http://localhost:3000

5. Build for production

   npm run build
   npm run start
   # or
   yarn build
   yarn start

---

## 🌍 Deployment

**Recommended options**

- **Vercel** — easy Next.js deployments and previews (connect your GitHub repo, auto-deploy main branch).
- **Firebase Hosting** — good if you want to keep frontend and backend unified in Firebase.

**Quick Vercel setup**

1. Connect GitHub repository in Vercel dashboard.
2. Set Environment Variables (the same `NEXT_PUBLIC_*` keys) in Vercel project settings.
3. Deploy — Vercel will run `npm run build` automatically.

---

## 📧 Contact & Enquiries

- **Website:** https://kanwerpolytex.com
- **Email:** info@kanwerpolytex.com
- **Phone:** +91-XXXXXXXXXX
- **Location:** Bhiwandi, Maharashtra (Mumbai textile hub)

---

## 🔐 License & Notices

This repository is **proprietary software**. Use of the source code is governed by the `LICENSE` file (Kanwer Polytex
Proprietary EULA). See `NOTICE` for copyright details.

---

## 🧩 Next steps & Recommendations

- Replace Unsplash demo images in `public/` with your factory/product photos (optimize to WebP).
- If you want multilingual SEO, I can generate language-specific static pages (`/index.hi.html`, `/index.mr.html`, etc.)
  with `hreflang` tags.
- Configure Firebase Cloud Function to push notifications (FCM) on new enquiries and optionally send owner emails.

---

## Contributing

This repository is controlled by Kanwer Polytex. For contributions (internal developers only), follow the branch policy:

- `main` — production-ready
- `dev` — integration branch
- `feature/*` — feature branches (merge to `dev` via PR)
- Use PR reviews and CI checks before merging to `main`

---

## Support

For questions or commercial licensing, contact: **info@kanwerpolytex.com**
