# Overview

Cute Checklists is a Flask-based web application that allows users to create and manage personal checklists with pastel color themes. The application features user authentication through Replit's OAuth system, enabling users to create, organize, and track their tasks in a visually appealing interface. Users can create multiple checklists with different color themes (pink, purple, blue, green, yellow) and manage checklist items with completion tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Web Framework
- **Flask**: Core web framework handling routing, templating, and request processing
- **Flask-SQLAlchemy**: ORM layer for database operations with declarative base model structure
- **Flask-Login**: Session management and user authentication state
- **Flask-Dance**: OAuth2 integration specifically configured for Replit authentication

## Database Design
- **SQLAlchemy ORM**: Object-relational mapping with declarative base classes
- **User Model**: Core user entity with profile information (email, names, profile image)
- **OAuth Model**: Handles OAuth tokens and browser session keys for Replit authentication
- **Checklist Model**: User-owned checklists with color themes and timestamps
- **ChecklistItem Model**: Individual tasks within checklists with completion status
- **Cascading Deletes**: Automatic cleanup of related records when parent entities are deleted

## Authentication & Authorization
- **Replit OAuth**: Integrated authentication using Replit's OAuth2 provider
- **Custom Storage**: UserSessionStorage class for managing OAuth tokens per browser session
- **Session Management**: Persistent sessions with browser session key tracking
- **Route Protection**: Decorator-based authentication requirements for protected endpoints

## Frontend Architecture
- **Server-Side Rendering**: Jinja2 templating with Flask for dynamic HTML generation
- **Bootstrap 5**: Responsive CSS framework for mobile-first design
- **Custom CSS**: Pastel color scheme with CSS custom properties and gradients
- **Font Awesome**: Icon library for UI elements
- **Vanilla JavaScript**: Client-side interactivity for animations and form enhancements

## Application Structure
- **Modular Design**: Separated concerns with distinct files for models, routes, and authentication
- **Configuration Management**: Environment-based configuration for database and session secrets
- **Error Handling**: Custom 403 error pages with user-friendly messaging
- **Logging**: Debug-level logging for development and troubleshooting

# External Dependencies

## Authentication Services
- **Replit OAuth Provider**: Primary authentication mechanism using OAuth2 flow
- **JWT**: JSON Web Token handling for secure authentication tokens

## Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **SQLAlchemy Connection Pooling**: Pre-ping and connection recycling for reliability

## Frontend Libraries
- **Bootstrap 5.3.0**: CSS framework from CDN for responsive design
- **Font Awesome 6.4.0**: Icon library from CDN
- **Google Fonts (Nunito)**: Custom typography from Google Fonts CDN

## Infrastructure
- **ProxyFix Middleware**: Werkzeug middleware for handling proxy headers in deployment
- **Environment Variables**: Configuration through SESSION_SECRET and DATABASE_URL