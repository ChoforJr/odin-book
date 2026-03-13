# ODIN-BOOK

> A modern, full-featured social media platform built with React and Vite. Connect with others, share posts, discover trending content, and build your network.

---

## 📋 Overview

ODIN-BOOK is a social media application that enables users to:

- **Share posts** with the community
- **Interact** through likes and comments
- **Discover trends** with a trending posts feed
- **Build connections** by following other users
- **Manage profiles** with customizable information
- **Explore content** from across the platform

The frontend is built with modern web technologies providing a smooth, responsive user experience with a sleek dark theme design.

## ✨ Features

- **🔐 User Authentication**
  - Sign up and login functionality
  - Demo accounts for easy exploration
  - Secure password management

- **📝 Post Management**
  - Create, read, and delete posts
  - Like posts and add comments
  - Real-time interaction counts

- **👥 Social Features**
  - Follow/unfollow other users
  - View profiles and user statistics
  - Discover new profiles to follow
  - See follower and following lists

- **📊 Content Discovery**
  - Home feed with posts from followed users
  - Trending posts section
  - Profile exploration
  - Personalized content feed

- **⚙️ Account Management**
  - Edit profile information (display name, bio, email)
  - Change profile photo
  - Password management
  - Account deletion

- **📱 Responsive Design**
  - Mobile-first design approach
  - Works seamlessly on all devices
  - Touch-friendly interface
  - Dark mode UI with modern styling

## 🛠️ Tech Stack

### Frontend

- **React** 19.1.1 - UI library
- **Vite** 7.1.2 - Build tool and dev server
- **React Router** 7.8.2 - Client-side routing
- **Lucide React** - Icon library
- **CSS Modules** - Component scoped styling

### Development & Testing

- **Vitest** 3.2.4 - Unit testing framework
- **ESLint** 9.33.0 - Code linting
- **@testing-library/react** - Component testing

### Build & Deployment

- **Vercel** - Hosting and deployment

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChoforJr/odin-book.git
   cd odin-book
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   VITE_ODIN_BOOK_API_URL=https://your-api-url.com
   ```

   Replace with your actual API URL (see [API Documentation](#api-documentation))

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### Demo Accounts

Try the application instantly with these demo accounts:

- **Username:** `goku@gmail.com` | **Password:** `1234`
- **Username:** `vegeta@gmail.com` | **Password:** `1234`

### Main Navigation

- **Home** - View posts from followed users
- **Trending** - Discover trending posts
- **Follow** - Explore and follow new users
- **My Profile** - View and manage your profile
- **Setting** - Update account information

## 🔌 API Documentation

This frontend connects to the **ODIN-BOOK API** for all data operations.

### API Repository

[ChoforJr/odin-book-api](https://github.com/ChoforJr/odin-book-api)

## 📁 Project Structure

```
src/
├── App Components/          # Main app layout and logic
│   ├── App.jsx
│   ├── App.css
│   └── UseAppLogic.jsx    # Custom hook for app state
├── SignIn Components/       # Authentication pages
├── HomePosts Components/    # Home feed
├── TrendingPosts Components/ # Trending feed
├── Post Components/         # Individual post & comments
├── PostCard component/      # Reusable post card
├── MyProfile Components/    # User profile page
├── ProfileCard component/   # Reusable profile card
├── Follow Components/       # User discovery/follow
├── Account Components/      # Account settings
├── ItemContext.jsx         # Global context provider
├── routes.jsx              # Route definitions
├── main.jsx                # React entry point
└── assets/                 # Static files
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

## 🎨 Design

The application features:

- **Dark theme** for reduced eye strain
- **Modern UI** with smooth animations
- **Consistent styling** using CSS modules
- **Icons** from Lucide React library
- **Responsive layout** that works on all screen sizes

## 🔒 Authentication

Authentication is handled via JWT tokens:

- Tokens are included in all authorized requests
- Expired tokens trigger automatic logout

## 👤 Author

**FORSAKANG CHOFOR JUNIOR**

- **GitHub:** [@ChoforJr](https://github.com/ChoforJr)
- **LinkedIn:** [Chofor Forsakang](https://www.linkedin.com/in/choforforsakang/)
