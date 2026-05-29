# 𝕏 X-Clone

A clone of X (formerly named Twitter). Managing posts and creating user accounts are some of the key features.

## 🚀 Live Demo

🔗 [X-Clone](https://mern-netflix-clone-gofs.onrender.com/)

## ✨ Key Features

- **Real-time chat:** Uses Websockets for chatting with other account in real time
- **Responsive Design:** Styled with Tailwind CSS for a better UX on all devices
- **State Management:** Eliminated the need of useStates and useEffects by using Tanstack Query for state management and data fetching
- **User Interactions:** Follow a user and like, comment, or even save the posts
- **Refresh Token:** Refresh tokens stored in Redis database for improved authentication without affecting user experience
- **Temporary data storage in Redis:** Fetched data will be stored in Redis temporarily to refetch it faster later
- **Graceful Shutdown** To ensure data integrity and a seamless user experience during deployments or server maintenance.

<details>
<summary><b>🔍 View Implementation Snippet</b></summary>

```javascript
export const setUpGracefulShutdown = (server) => {
  const handler = (signal) => {
    console.log(`\nReceived ${signal}, starting graceful shutdown...`)

    server.close(async (err) => {
      if (err) {
        console.error('Error closing the server', err)
        process.exit(1)
      }

      console.log('Http server closed.')

      try {
        await mongoose.connection.close()
        console.log('Database connection closed.')

        process.exit(0)
      } catch (dbErr) {
        console.error('Error closing the database', dbErr)
        process.exit(1)
      }
    })

    setTimeout(() => {
      console.log('Shutdown timed out, forcing exit.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => handler('SIGTERM'))
  process.on('SIGINT', () => handler('SIGINT'))
}
```

</details>

## 🛠️ Tech Stack

- **Frontend:** React, Tanstack Query, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Mongodb, Mongoose, Redis
- **Authentication:** JSON Web Tokens (JWT), Bcrypt (Password Hashing)

## ⚙️ How to Run the Project Locally

#### 1. Clone the Project

```bash
git clone https://github.com/Ray-Ibno/x-clone.git
cd x-clone
```

#### 2. Set Up Environmental Variables

Create a .env file in the root folder

```env
PORT=5100
MONGO_URI=<Your Mongo URI>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary Api Key>
CLOUDINARY_SECRET=<Your Cloudinary Secret>
```

Create a .env.development in the frontend folder

```env
VITE_SOCKET_URL=http://localhost:5100
```

#### 3. Install Dependencies and Start

Open a new terminal and paste this code

```bash
cd backend
npm install
npm run dev
```

Open another terminal and paste this code

```bash
npm install
npm run dev
```

Open http://localhost:5100 in your browser

## 📁 Project Folder Structure

```text
project-root/
├── backend/                # Node.js/Express server
│   ├── config/             # Database and third-party service configurations
│   ├── controller/         # Logic for handling API requests
│   ├── middleware/         # Authentication and validation layers
│   ├── models/             # Database schemas (User, Post, Message, etc.)
│   ├── routes/             # API endpoint definitions
│   ├── services/           # Core business logic separated from controllers
│   └── listeners/          # WebSocket and real-time communication logic
│
└── frontend/               # React/Vite application
    ├── src/
    │   ├── features/       # Modular features (Auth, Home, Message, Profile)
    │   │   └── [feature]/  # Each contains its own components and hooks
    │   ├── components/     # Shared UI components and skeletons
    │   ├── context/        # Global state management providers
    │   ├── hooks/          # Shared custom React hooks
    │   ├── pages/          # Individual route components
    │   ├── types/          # TypeScript definitions and interfaces
    │   └── utils/          # Helper functions and API utilities
```

## 🧠 What I Learned

- **Real Time Data:** Implemantation of real time chat feature using WebSockets
- **Refreshing Access Tokens:** How refresh token works in making security more robust while still maintaining seamless user experience
- **Using Redis Database to Store Refresh Tokens:** A faster database for caching data from Mongodb
