# Real-Time Chat Application

A modern, real-time chat application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Real-time Messaging**: Instant message delivery using Supabase real-time subscriptions.
- **User Presence**: Real-time online/offline status tracking for all connected users.
- **Authentication**: Secure user login and registration powered by Supabase Auth.
- **State Management**: Efficient global state handling using Zustand.
- **Modern UI**: Clean and responsive design styled with Tailwind CSS v4 and Lucide React icons.

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Dates**: [date-fns](https://date-fns.org/)

## Configuration

### Prerequisites
- Node.js (v18 or higher recommended)
- A Supabase account and a new project

### Environment Variables
To run this project locally, you will need to add the following environment variables to your `.env` file. These can be found in your Supabase project settings under **API**.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
You can start by copying the example file:
```bash
cp .env.example .env
```

## Running the Application Locally

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd Chat-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production using TypeScript and Vite.
- `npm run lint` - Runs ESLint to check for code issues.
- `npm run preview` - Boots up a local static web server that serves the files from `dist` to preview the production build.

<img width="1902" height="964" alt="image" src="https://github.com/user-attachments/assets/a76f1533-3b56-4f54-a8a3-18cf6a395479" />
<img width="1910" height="970" alt="image" src="https://github.com/user-attachments/assets/70960192-872c-4f37-b068-16982e37ffd5" />

**Built with ❤️**

