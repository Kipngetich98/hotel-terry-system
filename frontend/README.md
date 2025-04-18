# AUNTY'S COMFORT FOOD LIMITED - Frontend Application

This is the frontend application for the AUNTY'S COMFORT FOOD LIMITED restaurant management system. It provides a user interface for the POS, Inventory Management, and Accounting modules.

## Technology Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Query**: Data fetching with caching
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vite**: Fast build tool and development server
- **PWA**: Progressive Web App features for offline functionality
- **IndexedDB**: Client-side storage for offline data

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Access the application**
   - Open http://localhost:8080 in your browser

### Building for Production

1. **Create a production build**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Preview the production build locally**
   ```bash
   npm run preview
   # or
   yarn preview
   # or
   pnpm preview
   ```

### Docker Setup

1. **Build and start the container**
   ```bash
   docker build -t restaurant-frontend .
   docker run -p 8080:8080 restaurant-frontend
   ```

2. **Using Docker Compose (from root directory)**
   ```bash
   docker-compose up -d frontend
   ```

## Application Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx   # Main layout component
│   │   ├── Navbar.tsx   # Top navigation bar
│   │   ├── Sidebar.tsx  # Side navigation menu
│   │   └── modals/      # Modal components
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Login page
│   │   ├── Dashboard.tsx # Dashboard page
│   │   ├── POS.tsx      # Point of Sale page
│   │   ├── Inventory.tsx # Inventory management page
│   │   ├── Accounting.tsx # Accounting page
│   │   └── Settings.tsx # Settings page
│   ├── store/           # Redux store
│   │   ├── index.ts     # Store configuration
│   │   └── slices/      # Redux slices
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   │   ├── logger.ts    # Logging utility
│   │   └── errorHandler.ts # Error handling utility
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env.example         # Example environment variables
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Key Features

### 1. Point of Sale (POS)
- Touch-friendly order creation interface
- Menu management with categories and items
- Multiple payment methods (M-Pesa, cash, cards)
- Offline order processing
- Receipt generation

### 2. Inventory Management
- Inventory item management
- Supplier management
- Purchase order creation and tracking
- Stock level monitoring

### 3. Accounting
- Transaction management
- Expense tracking
- Financial reporting
- Cash flow management

## Component Structure

### Core Components

#### Layout Components
- `Layout`: Main layout wrapper with sidebar and navbar
- `Sidebar`: Navigation sidebar with menu items
- `Navbar`: Top navigation bar with user info and actions

#### Authentication Components
- `Login`: Login form with authentication
- `ProtectedRoute`: Route wrapper for authenticated routes

#### POS Components
- `POS`: Main POS interface
- `MpesaPaymentModal`: M-Pesa payment processing
- `CashPaymentModal`: Cash payment processing

#### Inventory Components
- `Inventory`: Inventory management interface
- `ItemModal`: Add/edit inventory items
- `SupplierModal`: Add/edit suppliers
- `DeleteConfirmationModal`: Confirm deletion

#### Accounting Components
- `Accounting`: Accounting interface
- `TransactionModal`: Add/edit transactions
- `ExpenseModal`: Add/edit expenses

## State Management

The application uses Redux Toolkit for state management with the following slices:

- `authSlice`: Authentication state
- `uiSlice`: UI state (sidebar, modals, offline status)
- `menuSlice`: Menu items and categories
- `orderSlice`: Current order and order history
- `inventorySlice`: Inventory items and suppliers
- `accountingSlice`: Transactions and expenses

## Offline Functionality

The application supports offline functionality using:

- Service Workers for caching assets
- IndexedDB for local data storage
- Background sync for syncing data when online

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Authentication
VITE_AUTH_STORAGE_KEY=restaurant_auth

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PWA=true

# M-Pesa Integration
VITE_MPESA_PAYBILL_NUMBER=123456
VITE_MPESA_CALLBACK_URL=/api/v1/mpesa/callback

# Logging
VITE_LOG_LEVEL=info
VITE_ENABLE_REMOTE_LOGGING=false
VITE_REMOTE_LOGGING_URL=

# Application Settings
VITE_APP_NAME=Aunty's Comfort Food
VITE_COMPANY_NAME=AUNTY'S COMFORT FOOD LIMITED
VITE_CURRENCY=KES
VITE_TAX_RATE=0.16
```

## Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linting
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

For production deployment, make sure to:

1. Set secure environment variables
2. Build the application with `npm run build`
3. Serve the static files from the `dist` directory
4. Configure proper caching headers for assets
5. Set up a service worker for offline functionality

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
