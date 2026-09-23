# clean-orders-api 📦

A pure Hexagonal / Clean Architecture implementation using TypeScript and Fastify. This project demonstrates how to cleanly decouple enterprise domain logic, application use cases, and infrastructure adapters for an Orders domain.

## Architecture

The project adheres to strict Ports and Adapters (Hexagonal Architecture) design principles without framework leaks inside inner layers. This ensures the domain core is fully testable and decoupled from external technologies:

```text
src/
  ├── domain/         # (Core) Value Objects, Entities, Domain Events, and Domain Errors
  ├── application/    # (Use Cases) Application use cases, DTOs, and Port Interfaces
  ├── infraestructure/# (Adapters) Fastify HTTP controllers, in-memory repositories, and real services
  ├── composition/    # (Composition Root) Single container where dependencies are assembled
  ├── shared/         # Functional Result<T, E> types and common utility definitions
  └── main.ts         # Application entry point and graceful server lifecycle bootstrap
```

## Technologies & Design Patterns

- **Language & Runtime**: TypeScript (ESM modules), Node.js
- **HTTP Engine**: Fastify
- **Tactical Domain-Driven Design (DDD)**:
  - Aggregate Root (`Order`)
  - Strongly typed Value Objects (`OrderId`, `SKU`, `Quantity`, `Money`, `Currency`)
  - Domain Events (`OrderCreated`, `ItemAddedToOrder`)
- **Functional Error Handling**: Explicit discriminated union `Result<T, E>` (`Success<T>` / `Failure<E>`) avoiding uncontrolled exceptions.
- **Testing**: Vitest with isolated in-memory unit tests.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AntonioHellin/clean-orders.git
   cd clean-orders
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

### Running Locally

- **Development mode** (with Hot Reloading via `tsx`):
  ```bash
  npm run dev
  ```
- **Type checking & compilation**:
  ```bash
  npm run build
  ```
- **Production mode**:
  ```bash
  npm start
  ```

The server listens on port `3000` by default (or the configured `PORT` environment variable).

## Testing

Execute the automated Vitest test suite:
```bash
# Single test run
npm test

# Watch mode
npm run test:watch
```

## API Usage Examples

### 1. Create an Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId": "ORDER-123", "customerId": "CUST-456"}'
```

**Expected Response**:
```json
{
  "message": "Order created successfully",
  "orderId": "ORDER-123"
}
```

### 2. Add an Item to an Order
```bash
curl -X POST http://localhost:3000/api/v1/orders/ORDER-123/items \
  -H "Content-Type: application/json" \
  -d '{"sku": "LAPTOP", "quantity": 2}'
```

**Expected Response**:
```json
{
  "message": "Item added to order successfully",
  "orderId": "ORDER-123",
  "item": {
    "sku": "LAPTOP",
    "quantity": 2
  }
}
```

## License

Proprietary / All Rights Reserved.