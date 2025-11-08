# 🎓 EduVault

**EduVault** is a full-stack web application built with **React (Vite)** and **Spring Boot** that helps students organize their academic materials — including notes, subjects, and reminders — in one clean, intuitive dashboard.

---

## 🚀 Features

- 🧠 **Subjects Management** – Add, view, and delete subjects.
- 📚 **File Storage** – Upload and manage study materials easily.
- ⏰ **Reminders** – Set and track important academic tasks.
- 🌓 **Dark/Light Mode** – Smooth UI toggle with local preference saving.
- 🔐 **Authentication** – Secure signup/login system with sessions.
- 💾 **Persistent Storage** – Stores data locally using H2 for development.

---

## 🏗️ Project Structure
EduVault-Web/
├── backend/     # Spring Boot REST API (Java 17)
│   ├── src/
│   ├── target/ (ignored)
│   ├── pom.xml
│   └── application.properties
│
└── frontend/    # React (Vite + Tailwind CSS)
├── src/
├── dist/ (ignored)
├── package.json
└── vite.config.ts
---

## ⚙️ Backend Setup (Spring Boot)

### Prerequisites
- Java 17+
- Maven 3.8+
- H2 Database (included)

### Run Backend
```bash
cd backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```
Access Points
	•	API: http://localhost:8080￼
	•	H2 Console: http://localhost:8080/h2-console￼
	•	JDBC URL: jdbc:h2:file:./data/eduvault-db
	•	User: sa
	•	Password: (blank)

  💻 Frontend Setup (React + Vite)

Prerequisites
	•	Node.js 18+
	•	npm or yarn

Run Frontend
cd frontend
npm install
npm run dev
Then open http://localhost:5173￼ in your browser.

🔗 Frontend ↔ Backend Connection

The frontend proxies API requests (/api/...) to the backend during development.
You can confirm this in vite.config.ts:
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}

🧩 Tech Stack

Frontend
	•	React 18 (Vite)
	•	Tailwind CSS
	•	Lucide Icons
	•	Axios

Backend
	•	Spring Boot 3
	•	Spring Security
	•	Spring Data JPA
	•	H2 Database (dev)
	•	Maven

⸻

🔒 Authentication Flow
	•	User signs up → credentials stored securely (encoded password).
	•	User logs in → session cookie (JSESSIONID) created.
	•	Authenticated routes use Spring Security for validation.
	•	Logout invalidates the session server-side.

⸻

🎨 UI & UX Enhancements
	•	Responsive layout (mobile + desktop)
	•	Smooth transitions
	•	Dark/Light theme auto-syncs with system
	•	Dashboard cards update in real-time

⸻

🧠 Contributors

👩‍💻 Charuu Jain — Project Owner

🪄 Future Improvements
	•	Cloud-based file storage (S3/Drive)
	•	Multi-user collaboration
	•	Email reminders & notifications

📜 License

This project is for educational and demonstration purposes.
