# Overview

Check-List é uma aplicação web baseada em Flask que permite aos usuários criar e gerenciar listas pessoais com temas de cores pastéis. A aplicação apresenta autenticação de usuário através do sistema OAuth do Replit, permitindo aos usuários criar, organizar e acompanhar suas tarefas em uma interface visualmente atraente. Os usuários podem criar múltiplas listas com diferentes temas de cores (rosa, roxo, azul, verde, amarelo) e gerenciar itens da lista com acompanhamento de conclusão. Interface totalmente em português brasileiro com design responsivo para dispositivos móveis.

# User Preferences

Preferred communication style: Simple, everyday language.
Language: Portuguese (Brazilian) - all UI text and interface must be in Portuguese.
Features requested: Image support for checklist items, responsive mobile design.
Nome alterado de "Listas Fofinhas" para "Check-List".
Funcionalidade de imagens removida devido a erros.
Ícone personalizado adicionado à navbar.
Footer atualizado para "Feito com café" e cores verde ajustadas para tom menos vibrante.

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