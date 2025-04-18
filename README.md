# AUNTY'S COMFORT FOOD LIMITED - Restaurant Management System

A comprehensive restaurant management system with three core modules:
- Point of Sale (POS) System
- Inventory Management
- Accounting Module

## Technical Stack

### Backend
- FastAPI for REST API endpoints
- PostgreSQL for primary database
- Redis for caching and performance optimization
- JWT authentication with role-based access control
- Asynchronous processing for reporting and background tasks
- WebSockets for real-time updates (kitchen display, order status)

### Frontend
- React with functional components and hooks
- Redux for state management
- React Query for data fetching with caching
- Tailwind CSS for responsive UI design
- Progressive Web App (PWA) features for offline functionality
- Service Workers for background syncing
- IndexedDB for client-side data storage

## Repository Structure
```
restaurant-management-system/
├── backend/                # FastAPI backend
├── frontend/               # React frontend
├── shared/                 # Shared types and utilities
├── migrations/             # Database migrations
├── scripts/                # Development and deployment scripts
└── docker/                 # Docker configuration
```

## Core Modules

### 1. Point of Sale (POS) System
- Touch-friendly order creation interface
- Menu management with categories, items, and modifiers
- Real-time order transmission to kitchen display
- Order status tracking and modification
- Multiple payment methods (M-Pesa, cash, cards)
- Receipt generation (print and digital)
- End-of-day reporting
- Table management or takeaway/delivery options
- Offline capabilities

### 2. Inventory Management
- Ingredient and supplies database
- Recipe management with automatic inventory deduction
- Stock control with minimum threshold alerts
- Expiration date tracking
- Wastage recording with reason codes
- Purchase order generation
- Supplier management
- Receiving and returns processing
- Inventory valuation

### 3. Accounting Module
- Integration with POS for sales accounting
- Expense management with categorization
- Cash management and reconciliation
- Financial reporting (P&L, balance sheet, cash flow)
- Tax calculation and reporting
- Budget tracking and variance analysis
- Multi-level approval workflow
- Audit trails for all financial transactions

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm/yarn/pnpm
- Python 3.10+
- PostgreSQL 14+
- Redis 6+

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kipngetich98/hotel-terry-system.git
   cd hotel-terry-system
   ```

2. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start with Docker Compose (recommended)**
   ```bash
   docker-compose up -d
   ```
   This will start the PostgreSQL database, Redis, backend API, and frontend development server.

4. **Manual Setup (alternative)**
   
   For Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -e .
   uvicorn app.main:app --reload --port 8000
   ```
   
   For Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Deployment

1. **Build Docker images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Database Migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

For more detailed instructions, see:
- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

## Environment Variables

See the example environment files for a complete list of required variables:
- [Backend Environment Variables](./backend/.env.example)
- [Frontend Environment Variables](./frontend/.env.example)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
