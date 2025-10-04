# Scrape the Plate v4

## Overview

Scrape the Plate is a full-stack web application for managing entertainment services (comedy, car wraps, and modeling) with an integrated AI chatbot. It features a microservices architecture, a React frontend, a Node.js/Express backend, and a Python Flask chatbot. The application includes an e-commerce store with Stripe integration, a comprehensive user account system, a content management system, a booking system, and social media-style post creation with video support. The project also boasts an advanced patch management system for secure code modifications and a user activity tracking system for analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with Vite, React Router DOM v6.

**Styling**: Custom CSS with a Saints Row aesthetic using purple (#9300c5), red (#f50505), dark backgrounds, and the Teko font.

**Core Features**:
- **Navigation**: Sticky navigation with Home, About, Comedy, Car Wrapping, Modeling, Media, Contact, and Admin pages.
- **E-commerce**: Product catalog, shopping cart with global state management (CartContext), checkout with Stripe Elements, order processing, and an admin panel for product CRUD.
- **User Authentication**: Login/registration, user profiles, and session management.
- **Content Management**: Dynamic editing of page titles, descriptions, and social media links via the admin panel.
- **Booking System**: Forms on service pages, weekly availability grid, and admin management of bookings.
- **Post System**: Creation of text, image, and video posts with commenting functionality. Posts are filterable by service type in the Media gallery.
- **Drag & Drop Section Reordering**: Admins can rearrange homepage sections using intuitive drag-and-drop controls with persistent ordering stored in the database.
- **SEO**: Comprehensive meta tags (title, description, keywords, Open Graph, Twitter cards).

### Backend Architecture

**Technology Stack**: Node.js with Express framework (CommonJS).

**API Structure**: RESTful API with modular route handlers for bookings, admin, and chat.
- **Database**: PostgreSQL for users, posts, comments, likes, bookings, products, cart_items, orders, order_items, user_activity, job_applications, and page_sections.
- **Session Management**: Production-ready PostgreSQL session store (connect-pg-simple) with secure cookies and session-based admin authentication.
- **User Management**: API for user registration, login, logout, and session handling.
- **Admin Authentication**: Session-based admin verification system using access code (4922) with backend enforcement.
- **E-commerce**: API routes for products, cart operations, orders, and Stripe payment processing.
- **Activity Tracking**: Logs key user actions (register, login, posts, comments, likes, bookings) to a PostgreSQL table.
- **Patch Management**: Secure system for applying JSON-formatted code modifications (create, update, delete files) with path validation, directory traversal prevention, automatic backups, rollback capabilities, and detailed history tracking. Protected directories include `node_modules`, `.git`, and `backend/data`.

### Microservices Architecture

**Chatbot Service**: Separate Python Flask application providing AI chat functionality.

**Service Communication**: The Node.js backend acts as a reverse proxy, forwarding frontend chat requests to the Python Flask service.

### Admin Panel Features (Access Code: 4922)

- **Content Management**: Edit page content, social media links, and reset to defaults.
- **Post Management**: Create, edit, delete posts with image/video support, and manage comments.
- **Booking Management**: View, track, mark as completed, and delete service bookings.
- **E-commerce Management**: Full CRUD for products, inventory management.
- **User Activity Analytics**: Dashboard with traffic analytics, real-time activity logs, top pages, and 30-day statistics.
- **Patch Management**: Apply patches, view history, and rollback changes securely.
- **Section Reordering**: Drag-and-drop interface to rearrange homepage sections with persistent database storage (enabled after admin authentication).

## External Dependencies

### Third-Party NPM Packages

**Backend**:
- `express` (v4.18.2)
- `cors` (v2.8.5)
- `axios` (v1.6.7)
- `dotenv` (v16.4.1)
- `connect-pg-simple` (for PostgreSQL session store)

**Frontend**:
- `react` (v18.2.0)
- `react-dom` (v18.2.0)
- `react-router-dom` (v6.22.0)
- `vite` (v5.1.0)
- `@vitejs/plugin-react` (v4.2.1)
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (drag-and-drop functionality)

### Python Dependencies

- `flask` (v3.0.2)
- `flask-cors` (v4.0.0)
- `python-dotenv` (v1.0.1)
- `openai` (v1.12.0)

### External Services

- **OpenAI API**: Integrated with the Python chatbot service for AI functionality.
- **Stripe**: Payment gateway for e-commerce transactions.

### Port Allocation

- Frontend (Vite): Port 5000
- Backend (Express): Port 3000
- Chatbot Service (Flask): Port 5001