# Scrape the Plate v4

## Overview

Scrape the Plate is a full-stack web application designed for managing entertainment services (comedy, car wraps, and modeling) with an integrated AI chatbot assistant. The system uses a microservices architecture with three main components: a React frontend, a Node.js/Express backend API, and a Python Flask chatbot service. The application features a content management system, booking system, and social media-style post creation with video support.

## Recent Changes

**October 3, 2025 - Complete Admin & Booking System**:
- Updated color scheme from gold to red (#f50505) while maintaining Saints Row purple (#9300c5)
- Enhanced admin panel with comprehensive content management system
- Added post creation system with support for images, videos, and comments
- Implemented booking/scheduling system on all service pages
- Created admin interface to view and manage service bookings
- Added video embedding support for YouTube and Vimeo URLs
- All features use localStorage for data persistence

**September 30, 2025 - GitHub Import Setup**:
- Completed setup of GitHub import with missing configuration files
- Created all frontend components (pages, ChatBot component)
- Configured Vite with `allowedHosts: true` for Replit proxy environment
- Set up unified workflow that starts all three services (backend, chatbot, frontend)
- Configured VM deployment for production

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with Vite as the build tool and development server.

**Routing**: React Router DOM v6 for client-side navigation and multi-page application structure.

**Development Server**: Vite configured to run on port 5000 with host binding to 0.0.0.0 for network accessibility. HMR (Hot Module Replacement) is configured with clientPort 443 for development in cloud environments.

**API Communication**: Uses Vite's proxy configuration to forward `/api` requests to the backend server (http://127.0.0.1:3000), solving CORS issues during development and providing a unified development experience.

**Styling**: Custom CSS with Saints Row game aesthetic using official colors:
- Purple: #9300c5 (primary brand color)
- Red: #f50505 (accent and call-to-action color)
- Dark background: #1a1a1a
- Component background: #2a262b
- Font: Teko (bold, uppercase for headers)

**Data Persistence**: Uses localStorage for client-side data storage:
- `siteContent`: Stores editable page content (titles, descriptions)
- `sitePosts`: Stores all posts with images, videos, and comments
- `siteBookings`: Stores all service booking submissions

### Backend Architecture

**Technology Stack**: Node.js with Express framework running on CommonJS module system.

**API Structure**: RESTful API design with modular route handlers organized by domain:
- `/api/bookings` - Booking management endpoints
- `/api/admin` - Administrative operations (patch management)
- `/api/chat` - Chatbot proxy service

**Server Configuration**: Binds to localhost (127.0.0.1) on port 3000, ensuring security by not exposing directly to external networks.

**Cross-Origin Resource Sharing**: CORS middleware enabled to allow frontend communication.

**Proxy Pattern**: The backend acts as a reverse proxy for the chatbot service, forwarding chat requests from the frontend to the Python Flask service.

### Microservices Architecture

**Chatbot Service**: Separate Python Flask application running on port 5001, providing AI chat functionality integrated with OpenAI API.

**Service Communication**: Internal HTTP communication between Node.js backend (port 3000) and Python chatbot service (port 5001) using localhost networking.

### Admin Panel Features

**Access Control**: Protected by access code 4922 for security.

**Content Management**:
- Edit page titles and descriptions for all service pages
- Changes apply instantly across the site
- Reset to defaults option available

**Post Management**:
- Create posts for any service page (Home, Comedy, Car Wraps, Modeling)
- Add titles, content, images (via URL), and videos (YouTube/Vimeo)
- Add comments to posts
- Delete posts
- View all posts organized by page

**Booking Management**:
- View all service bookings with customer details
- Track booking status (pending/completed)
- Mark bookings as completed
- Delete processed bookings
- See booking timestamps and service page origin

**Site Settings**:
- View site statistics (total posts, total bookings)
- Monitor site status
- View configuration details

### Booking System

**Customer-Facing Features**:
- Booking forms on all service pages (Home, Comedy, Car Wraps, Modeling)
- Collect customer name, email, phone, date, time, and service details
- Success confirmation message after submission
- Form validation to ensure all required fields are filled

**Admin Features**:
- Centralized view of all bookings in admin panel
- Filter bookings by service page
- Track booking status
- Customer contact information readily available
- Timestamp tracking for all submissions

### Post System

**Content Types Supported**:
- Text posts with title and description
- Image posts (via image URL)
- Video posts (YouTube and Vimeo embedding)
- Mixed media posts (text + image + video)

**Social Features**:
- Comment system on all posts
- Comment timestamps
- Posts organized by service page
- View post history in admin panel

**Video Support**:
- Automatic YouTube and Vimeo URL detection
- Converts URLs to embedded players
- Responsive video display
- Fallback handling for invalid URLs

## Design Patterns

**Modular Route Organization**: Express routes separated into individual modules (`bookings.js`, `admin.js`, `chatProxy.js`) for maintainability and single responsibility.

**Environment Configuration**: dotenv pattern for managing environment-specific variables across both backend services.

**Error Handling**: Chatbot proxy implements try-catch with graceful degradation, returning user-friendly error messages when the chatbot service is unavailable.

**Component-Based UI**: React components organized by feature (pages, ChatBot) with shared styles and reusable patterns.

**Client-Side State Management**: React hooks (useState, useEffect) for local state and localStorage integration for persistence.

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

**OpenAI API**: The chatbot service integrates with OpenAI's API for natural language processing and conversational AI capabilities. API key management through environment variables.

### Port Allocation

- Frontend (Vite): Port 5000
- Backend (Express): Port 3000
- Chatbot Service (Flask): Port 5001

All services bind to localhost (127.0.0.1) for security, with the frontend proxy handling external access.

## Admin Access

- Access Code: 4922
- Login at: /admin page
- Features: Content editing, post management, booking management, site settings
