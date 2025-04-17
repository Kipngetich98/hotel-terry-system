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
