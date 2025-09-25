# GEMINI Project Context: M-Team Frontend

This document provides a comprehensive overview of the M-Team frontend project, intended as a guide for AI-assisted development.

## 1. Project Overview

This is a modern web frontend for the M-Team service, which appears to be a private torrent tracker. The application is a Single Page Application (SPA) built with Vue.js 3. It provides user authentication (including two-factor OTP), torrent browsing, and searching capabilities.

The application is designed to communicate with a specific backend API that requires custom-signed requests, indicating a tightly-coupled architecture.

### Core Technologies

- **Framework**: [Vue.js](https://vuejs.org/) v3 (using the Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router](https://router.vuejs.org/) v4
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom color palette.
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linting & Formatting**: ESLint and Prettier

## 2. Getting Started

### Key Commands

All commands should be run from the root of the `frontend` directory.

- **Install Dependencies**:
  ```bash
  npm install
  ```

- **Run Development Server**:
  Starts a local server with hot-reloading.
  ```bash
  npm run dev
  ```

- **Build for Production**:
  Compiles and minifies the application for deployment. The output is placed in the `dist/` directory.
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  Serves the `dist/` directory locally to preview the production app.
  ```bash
  npm run preview
  ```

- **Run Tests**:
  Executes the unit and integration tests using Vitest.
  ```bash
  npm run test
  ```

- **Lint and Format**:
  Checks for code style issues and automatically formats the code.
  ```bash
  npm run lint
  npm run format
  ```

## 3. Development Conventions

### Architecture & Code Style

- **Component-Based**: The UI is built with Vue single-file components (`.vue`).
- **Composition API**: The project uses Vue 3's Composition API for logic within components.
- **State Management**: Global application state (like user authentication) is managed centrally in Pinia stores located in `src/stores/`. The `auth.js` store is critical for handling user sessions.
- **Routing**: Page-level views are defined in `src/views/` and mapped to routes in `src/router/index.js`. The router uses navigation guards to protect authenticated routes.
- **API Interaction**: All communication with the backend is handled through a pre-configured Axios instance in `src/utils/api.js`. This module is crucial as it contains interceptors that automatically:
    1.  Add the `Authorization` token to headers.
    2.  Generate and append a unique request signature (`x-request-signature`, `x-request-timestamp`). This is a **critical security feature** of the backend API.
    3.  Handle 401 Unauthorized errors by logging the user out.
- **Styling**: Utility-first CSS is implemented with Tailwind CSS. Custom theme extensions (colors, fonts) are defined in `tailwind.config.js`.
- **Linting**: The project follows rules defined in `.eslintrc.js`, which extends `eslint:recommended` and `@vue/eslint-config-prettier`. Component names are not required to be multi-word.

### Key Files & Directories

- `src/main.js`: The main entry point of the application. It initializes Vue, Pinia, and the Vue Router.
- `src/App.vue`: The root Vue component.
- `src/router/index.js`: Defines all application routes and implements authentication guards.
- `src/stores/auth.js`: Pinia store for managing authentication state (user, token, device IDs). It includes logic for persisting state to `localStorage`.
- `src/utils/api.js`: The central hub for backend communication. Contains the configured Axios client and API service definitions (`authAPI`, `torrentAPI`).
- `src/utils/signature.js`: Contains the logic for generating the required request signatures for the backend API. **Do not modify this unless the backend API changes.**
- `vite.config.js`: Configuration for the Vite build tool.
- `tailwind.config.js`: Configuration for Tailwind CSS.
