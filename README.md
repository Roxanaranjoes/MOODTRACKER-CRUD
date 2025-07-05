# 🌱 MoodTracker - Emotional Diary

MoodTracker is a simple and visually appealing web app that allows users to track their daily emotions, take notes, and visualize emotional trends using a calendar and interactive charts. It uses **JSON Server** to simulate a backend API and **Fetch API** to perform full CRUD operations.

---

##  Project Structure

```
MoodTracker/
├── index.html       # Main HTML file
├── style.css        # Styles and animations
├── app.js           # JavaScript logic and CRUD
├── db.json          # JSON Server database (emotions)
└── README.md        # Project description
```

---

## Features

-  Register emotions by date, type and optional note
-  Interactive emotional calendar (month view)
-  Bar chart showing emotion frequency using Chart.js
- Personalized recommendations based on emotion
-  Full CRUD (Create, Read, Update, Delete) using Fetch API
-  Smooth transitions and clean responsive design
-  Emotion editing and deletion with modal support
-  Toast notifications for user feedback

---

## ⚙️ Technologies Used

- HTML5 + CSS3
- JavaScript (vanilla)
- [Chart.js](https://www.chartjs.org/)
- JSON Server (for mock API)

---

##  How to Run Locally

1. **Clone the repository or download the ZIP**
2. **Install JSON Server globally (if you haven't):**
   ```bash
   npm install -g json-server
   ```
3. **Navigate to the project folder and run JSON Server:**
   ```bash
   json-server --watch db.json --port 3000
   ```
4. **Open `index.html` in your browser**

---

##  API Structure (JSON Server)

```json
[
  {
    "id": 1,
    "fecha": "2025-07-05",
    "tipo": "feliz",
    "nota": "Had a great day!"
  }
]
```

---

##  Feedback to Users

-  Toast notifications for success/error
-  Emotion-based recommendations appear after each registration
-  Colorful and friendly UI for emotional comfort


---

##  Author

Roxana Naranjo Estrada
