# AUNTY'S COMFORT FOOD LIMITED - Backend API

This is the backend API for the AUNTY'S COMFORT FOOD LIMITED restaurant management system. It provides endpoints for the POS, Inventory Management, and Accounting modules.

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Primary database for persistent storage
- **Redis**: Caching and performance optimization
- **SQLAlchemy**: ORM for database interactions
- **Alembic**: Database migration tool
- **Pydantic**: Data validation and settings management
- **JWT**: Authentication and authorization
- **WebSockets**: Real-time updates for kitchen display and order status

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Redis 6+

### Local Development Setup

1. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -e .
   # or
   poetry install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the development server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. **Access the API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Docker Setup

1. **Build and start the container**
   ```bash
   docker build -t restaurant-api .
   docker run -p 8000:8000 --env-file .env restaurant-api
   ```

2. **Using Docker Compose (from root directory)**
   ```bash
   docker-compose up -d backend
   ```

## API Documentation

The API is self-documented using OpenAPI (Swagger) and ReDoc. When the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

#### Authentication
- `POST /api/v1/login/access-token` - Get JWT access token
- `POST /api/v1/login/refresh-token` - Refresh JWT token
- `POST /api/v1/login/test-token` - Test if token is valid

#### Users
- `GET /api/v1/users/` - List users
- `POST /api/v1/users/` - Create user
- `GET /api/v1/users/{user_id}` - Get user details
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

#### Menu Items
- `GET /api/v1/menu-items/` - List menu items
- `POST /api/v1/menu-items/` - Create menu item
- `GET /api/v1/menu-items/{item_id}` - Get menu item details
- `PUT /api/v1/menu-items/{item_id}` - Update menu item
- `DELETE /api/v1/menu-items/{item_id}` - Delete menu item

#### Orders
- `GET /api/v1/orders/` - List orders
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/{order_id}` - Get order details
- `PUT /api/v1/orders/{order_id}` - Update order
- `DELETE /api/v1/orders/{order_id}` - Delete order

#### Inventory
- `GET /api/v1/inventory/` - List inventory items
- `POST /api/v1/inventory/` - Create inventory item
- `GET /api/v1/inventory/{item_id}` - Get inventory item details
- `PUT /api/v1/inventory/{item_id}` - Update inventory item
- `DELETE /api/v1/inventory/{item_id}` - Delete inventory item

#### Suppliers
- `GET /api/v1/suppliers/` - List suppliers
- `POST /api/v1/suppliers/` - Create supplier
- `GET /api/v1/suppliers/{supplier_id}` - Get supplier details
- `PUT /api/v1/suppliers/{supplier_id}` - Update supplier
- `DELETE /api/v1/suppliers/{supplier_id}` - Delete supplier

#### Accounting
- `GET /api/v1/transactions/` - List transactions
- `POST /api/v1/transactions/` - Create transaction
- `GET /api/v1/transactions/{transaction_id}` - Get transaction details
- `PUT /api/v1/transactions/{transaction_id}` - Update transaction
- `DELETE /api/v1/transactions/{transaction_id}` - Delete transaction

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# API Settings
API_V1_STR=/api/v1
PROJECT_NAME=Restaurant Management System
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
BACKEND_CORS_ORIGINS=["http://localhost:8080","http://localhost:3000"]

# PostgreSQL Database
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=restaurant_db
POSTGRES_PORT=5432

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# M-Pesa Integration
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=your-shortcode
MPESA_CALLBACK_URL=https://your-domain.com/api/v1/mpesa/callback
MPESA_ENVIRONMENT=sandbox  # or production

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py           # Dependency injection
│   │   └── v1/
│   │       ├── api.py        # API router
│   │       └── endpoints/    # API endpoints
│   ├── core/
│   │   ├── config.py         # Configuration
│   │   └── security.py       # Security utilities
│   ├── crud/                 # CRUD operations
│   ├── db/                   # Database setup
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   └── main.py               # Application entry point
├── migrations/               # Alembic migrations
├── tests/                    # Unit and integration tests
├── .env.example              # Example environment variables
├── Dockerfile                # Docker configuration
└── pyproject.toml            # Project dependencies
```

## Development Guidelines

### Code Style

We follow PEP 8 and use Black for code formatting:

```bash
# Install development dependencies
pip install -e ".[dev]"

# Format code
black app tests

# Run linting
flake8 app tests

# Run type checking
mypy app
```

### Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/
```

## Deployment

For production deployment, make sure to:

1. Set secure environment variables
2. Use a production-ready ASGI server like Uvicorn behind Nginx
3. Set up proper database backups
4. Configure Redis for caching
5. Set up monitoring and logging

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
