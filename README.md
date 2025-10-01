# 🎉 EventKonnect

EventKonnect is an **open-source Event Management Platform** built with [Next.js](https://nextjs.org/).  
It helps organizers create, manage, and promote events while providing attendees with seamless booking and notifications.  

This repo is part of **Hacktoberfest** 🍂 – contributions are welcome!

---

## ✨ Features (Planned & Ongoing)
- 🔐 User Authentication (Sign In / Sign Up with Firebase & NextAuth)
- 🎟️ Create & Manage Events
- 📅 Event Booking System
- 🔔 Notifications & Reminders
- 📊 Admin Dashboard with Analytics (Recharts)
- 🎨 Modern UI with Tailwind + shadcn/ui + Radix UI
- 📱 Responsive Design + PWA support

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)  
- **Frontend**: React 18, TailwindCSS, shadcn/ui, Radix UI, Framer Motion  
- **Backend / APIs**: Next.js API routes, Firebase, Axios  
- **Auth**: [NextAuth.js](https://next-auth.js.org/) + Firebase  
- **State Management**: Redux Toolkit  
- **Forms & Validation**: React Hook Form + Zod  
- **Charts & Analytics**: Recharts  
- **UI Enhancements**: React Icons, Lucide, Toastify, SweetAlert2  
- **Other Utilities**: date-fns, uuid, dotenv  
- **PWA Support**: next-pwa + workbox  

---

## 📂 Project Structure

eventkonnect/
│── app/ # Next.js App Router
│ ├── admin/ # Admin pages
│ ├── api/ # API routes
│ ├── create-event/ # Event creation pages
│ ├── events/ # Event listing & details
│ ├── notifications/ # User notifications
│ ├── profile/ # User profile
│ ├── signIn/ # Login page
│ ├── signup/ # Register page
│ ├── Eventdetails.jsx # Single event details
│ ├── layout.js # Main layout
│ └── page.js # Homepage
│
│── components/ # Shared UI components
│ ├── ui/ # UI widgets (cards, forms, modals)
│ └── dashboard/ # Dashboard-specific components
│
│── public/ # Static assets
│── styles/ # Global styles (Tailwind, globals.css)
│── data/ # Mock or static data
│── package.json
│── README.md


---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/eventkonnect.git
cd eventkonnect

Install Dependencies 

npm install
# or
yarn install
# or
pnpm install

command to Run the server 
npm run dev

