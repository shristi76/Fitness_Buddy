# Fitness Buddy

Fitness Buddy is a full-stack AI fitness planner. Users can create an account, enter their fitness profile, receive a personalized workout and nutrition plan, download it as a PDF, and revisit or delete their saved plans.

## Features

- Secure registration, login, logout, and protected client routes
- Password hashing with Node's `scrypt` and signed JWT-style session tokens
- Per-user plan history: users can only access their own plans
- Gemini-powered workout, diet, calorie, water-intake, and fitness-tip recommendations
- BMI preview before generating a plan
- Plan download as a PDF
- Responsive React interface for desktop and mobile
- Clear validation and API error messages

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, React Hot Toast |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| AI | Google Gemini API |
| PDF export | jsPDF and html2canvas |

## Dummy data for login
email - dinesh@gmail.com
password - 1234

## Deployment

https://fitness-buddy5.netlify.app/

---


<img width="1847" height="882" alt="image" src="https://github.com/user-attachments/assets/6f36bffa-ec5f-44d3-85a6-34252b468454" />

---
## Prerequisites

- Node.js 18 or later
- MongoDB, either locally installed or hosted with MongoDB Atlas
- A Google Gemini API key

## Installation

1. Clone the repository and open the project folder.

   ```bash
   git clone https://github.com/shristi76/Fitness_Buddy.git
   cd fitness_buddy
   ```

2. Install backend dependencies.

   ```bash
   cd backend
   npm install
   ```

3. Create `backend/.env` by copying `backend/.env.example`, then provide your values.

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/fitness_buddy
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=use_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ```

   Do not commit `.env` to GitHub.

4. Start the backend.

   ```bash
   npm start
   ```

   The API runs on `http://localhost:5000`.

5. In a second terminal, install and start the frontend.

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open `http://localhost:5173` in your browser.

## Available scripts

### Backend

```bash
npm start     # Start the API server
npm run dev   # Start with nodemon
```

### Frontend

```bash
npm run dev    # Start the Vite development server
npm run build  # Create a production build
npm run lint   # Run ESLint
```

## API overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account |
| `POST` | `/api/auth/login` | Public | Sign in and receive a token |
| `POST` | `/api/fitness/generate` | Authenticated | Generate and save a fitness plan |
| `GET` | `/api/fitness` | Authenticated | List the signed-in user's plans |
| `DELETE` | `/api/fitness/:id` | Authenticated | Delete one of the signed-in user's plans |
| `GET` | `/api/health` | Public | Health-check endpoint |

Authenticated endpoints require an `Authorization` header:

```http
Authorization: Bearer <token>
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `GEMINI_API_KEY` | Yes | Google Gemini API key used to generate plans. |
| `JWT_SECRET` | Yes | Long, unique secret used to sign authentication tokens. |
| `CLIENT_URL` | No | Allowed frontend origin. Defaults to `http://localhost:5173`. |

## Security notes

- Passwords are never stored in plain text; they are salted and hashed with `scrypt`.
- Fitness endpoints are protected by an authentication middleware.
- Each plan is linked to its owner, and list/delete queries are scoped to that user.
- Keep secrets in `.env` only. Use a different `JWT_SECRET` and database for production.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
