# 🌐 How to Publish the Project Monitoring System Online (100% Free)

This guide shows you how to host the **Project Monitoring System** online with a permanent **24/7 live HTTPS URL** (e.g. `https://pms-college.vercel.app`) using **Vercel** (Frontend) and **Render** (Backend).

---

## 📋 Quick 3-Step Overview:

1. **Push your code to GitHub** (1 click using `PUSH-TO-GITHUB.bat`)
2. **Deploy the Java Backend on Render.com** (Free)
3. **Deploy the React Frontend on Vercel.com** (Free)

---

## 🚀 Step 1: Upload Code to GitHub

1. Open [https://github.com/new](https://github.com/new) in your browser.
2. Enter Repository name: `project-monitoring-system` (set it to Public or Private).
3. Click **Create repository**.
4. In your local project folder, double-click:
   👉 **`PUSH-TO-GITHUB.bat`**
5. Paste your GitHub repository link when prompted.

---

## ⚙️ Step 2: Deploy Backend on Render (Free)

1. Go to [https://render.com](https://render.com) and sign in with GitHub.
2. Click **New +** &rarr; **Web Service**.
3. Select your `project-monitoring-system` repository.
4. Settings:
   - **Name**: `pms-backend`
   - **Language / Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Context Directory**: `backend`
   - **Instance Type**: **Free**
5. Click **Create Web Service**.
6. Wait 2-3 minutes until it says **"Live"**.
7. Copy your backend URL (e.g. `https://pms-backend.onrender.com`).

---

## 🎨 Step 3: Deploy Frontend on Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** &rarr; **Project**.
3. Import your `project-monitoring-system` repository.
4. Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select **`frontend`**
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: Your Render Backend URL + `/api` (e.g. `https://pms-backend.onrender.com/api`)
5. Click **Deploy**.
6. In 30 seconds, Vercel will give you a live production link (e.g., `https://project-monitoring-system.vercel.app`).

---

## 📱 Step 4: Share & Test Anywhere!
- Open the Vercel link on your **Mobile Phone, Tablet, or Laptop** from anywhere in the world!
- Use your demo credentials:
  - **Project Head**: `projecthead` / `Project@123`
  - **Faculty Guide**: `guide_jawandhiya` / `Guide@123`
  - **Student Leader**: `student01` / `Student@123`
