# Smart Study Companion - AI-Powered Focus & Wellness Assistant

## Overview

The Smart Study Companion is a React-based web application designed to help students maintain focus during study sessions through real-time webcam monitoring and gentle nudging. The application detects focus states (focused, drowsy, distracted, stressed) using browser-based webcam analysis and provides contextual feedback to improve productivity. Built with privacy-first principles, all processing happens locally in the browser without storing or transmitting personal data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Charts**: Chart.js for focus timeline visualization
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API server
- **Session Management**: In-memory storage (MemStorage) for development with interface for future database integration
- **API Structure**: RESTful endpoints for session management (`/api/sessions`) and event tracking (`/api/sessions/:id/events`)
- **Development Server**: Custom Vite integration with HMR support

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Database Schema**: 
  - `users` table for authentication
  - `sessions` table for study session tracking
  - `sessionEvents` table for focus state transitions
- **Current Implementation**: In-memory storage for development
- **Production Ready**: Configured for Neon Database (PostgreSQL)

### Privacy & Detection System
- **Local Processing**: Mock detection service simulates AI analysis without actual video processing
- **Camera Access**: WebRTC API for browser-based webcam access with user consent
- **No Data Persistence**: Video/audio streams are processed in real-time without storage
- **Focus States**: Four detection states (FOCUSED, DROWSY, DISTRACTED, STRESSED) with confidence scoring

### Component Architecture
- **Modular Design**: Reusable UI components (CameraFeed, StatusPanel, FocusChart, etc.)
- **Hook-based Logic**: Custom hooks for camera management, session handling, and state management
- **Real-time Updates**: WebRTC integration with periodic detection intervals
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Security & Consent
- **Privacy Modal**: Mandatory consent flow before camera access
- **Local-only Processing**: No external API calls for detection
- **Camera Controls**: User can start/stop monitoring at any time
- **Transparent Policies**: Comprehensive SAFETY.md documentation

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+, React DOM, TypeScript support
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS for utility-first styling

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM
- **Session Storage**: connect-pg-simple for PostgreSQL session management
- **Validation**: Zod for runtime type validation and schema parsing

### Development Tools
- **Build System**: Vite with React plugin and ESBuild for production
- **Development**: Replit integration with runtime error overlay
- **TypeScript**: Full TypeScript configuration with path mapping
- **Charts**: Chart.js for data visualization

### Browser APIs
- **WebRTC**: getUserMedia for camera access
- **Canvas API**: For potential video frame processing (currently mocked)
- **Local Storage**: For user preferences and consent state

### Optional Integrations
- **Future AI Processing**: Architecture supports integration with computer vision libraries
- **Database Migration**: Drizzle Kit for schema management and migrations
- **Production Deployment**: Express.js server with static file serving
