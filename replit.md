# Scrape the Plate v4

## Overview

Scrape the Plate is a full-stack web application designed for managing restaurant bookings with an integrated AI chatbot assistant. The system uses a microservices architecture with three main components: a React frontend, a Node.js/Express backend API, and a Python Flask chatbot service. The application facilitates booking management, administrative functions, and conversational AI interactions for users.

## Recent Changes

**September 30, 2025 - GitHub Import Setup**:
- Completed setup of GitHub import with missing configuration files
- Created all frontend components (pages, ChatBot component)
- Configured Vite with `allowedHosts: true` for Replit proxy environment
- Set up unified workflow that starts all three services (backend, chatbot, frontend)
- Configured VM deployment for production
- All dependencies installed and services running successfully

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with Vite as the build tool and development server.

**Routing**: React Router DOM v6 for client-side navigation and multi-page application structure.

**Development Server**: Vite configured to run on port 5000 with host binding to 0.0.0.0 for network accessibility. HMR (Hot Module Replacement) is configured with clientPort 443 for development in cloud environments.

**API Communication**: Uses Vite's proxy configuration to forward `/api` requests to the backend server (http://127.0.0.1:3000), solving CORS issues during development and providing a unified development experience.

**Styling**: Custom CSS with a mobile-first, responsive design approach using standard CSS conventions.

### Backend Architecture

**Technology Stack**: Node.js with Express framework running on CommonJS module system.

**API Structure**: RESTful API design with modular route handlers organized by domain:
- `/api/bookings` - Booking management endpoints
- `/api/admin` - Administrative operations (patch management)
- `/api/chat` - Chatbot proxy service

**Server Configuration**: Binds to localhost (127.0.0.1) on port 3000, ensuring security by not exposing directly to external networks.

**Cross-Origin Resource Sharing**: CORS middleware enabled to allow frontend communication.

**Proxy Pattern**: The backend acts as a reverse proxy for the chatbot service, forwarding chat requests from the frontend to the Python Flask service. This design:
- Centralizes API endpoints under a single domain
- Abstracts the chatbot service location from the frontend
- Provides error handling and service availability checking
- Simplifies security and authentication implementation

### Microservices Architecture

**Chatbot Service**: Separate Python Flask application running on port 5001, providing AI chat functionality. The service is:
- Independently deployable and scalable
- Loosely coupled from the main backend
- Designed to integrate with OpenAI API (based on dependencies)
- Returns structured JSON responses for frontend consumption

**Service Communication**: Internal HTTP communication between Node.js backend (port 3000) and Python chatbot service (port 5001) using localhost networking.

**Rationale for Separation**: 
- Python ecosystem provides better AI/ML library support (OpenAI SDK)
- Allows independent scaling of chatbot functionality
- Separates concerns between business logic (Node.js) and AI processing (Python)
- Enables language-specific optimizations

### Design Patterns

**Modular Route Organization**: Express routes separated into individual modules (`bookings.js`, `admin.js`, `chatProxy.js`) for maintainability and single responsibility.

**Environment Configuration**: dotenv pattern for managing environment-specific variables across both backend services.

**Error Handling**: Chatbot proxy implements try-catch with graceful degradation, returning user-friendly error messages when the chatbot service is unavailable.

## External Dependencies

### Third-Party NPM Packages

**Backend**:
- `express` (v4.18.2) - Web application framework
- `cors` (v2.8.5) - Cross-origin resource sharing middleware
- `axios` (v1.6.7) - HTTP client for service-to-service communication
- `dotenv` (v16.4.1) - Environment variable management

**Frontend**:
- `react` (v18.2.0) - UI library
- `react-dom` (v18.2.0) - React DOM rendering
- `react-router-dom` (v6.22.0) - Client-side routing
- `vite` (v5.1.0) - Build tool and development server
- `@vitejs/plugin-react` (v4.2.1) - React support for Vite

### Python Dependencies

- `flask` (v3.0.2) - Web framework for chatbot service
- `flask-cors` (v4.0.0) - CORS support for Flask
- `python-dotenv` (v1.0.1) - Environment configuration
- `openai` (v1.12.0) - OpenAI API client for AI functionality

### External Services

**OpenAI API**: The chatbot service is configured to integrate with OpenAI's API for natural language processing and conversational AI capabilities. API key management through environment variables.

### Port Allocation

- Frontend (Vite): Port 5000
- Backend (Express): Port 3000
- Chatbot Service (Flask): Port 5001

All services bind to localhost (127.0.0.1) for security, with the frontend proxy handling external access.