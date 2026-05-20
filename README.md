# LifeIsGiving — Full-Stack Charity Lottery Platform

> A sophisticated, full-stack web application that powers a charity lottery ecosystem where donors contribute prizes, buyers purchase raffle tickets, and an admin orchestrates live lottery drawings with animated winner reveals.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo & Screenshots](#live-demo--screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [User Roles & Permissions](#user-roles--permissions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Authentication Flow](#authentication-flow)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Overview

**LifeIsGiving** is a fully-featured charity lottery platform built with **ASP.NET Core 8** on the server and **Angular 21** on the client. The platform supports three distinct user roles — **Donors**, **Buyers**, and **Admins** — each with a tailored experience.

Donors submit prizes they wish to contribute. Buyers browse those prizes, add them to a shopping cart, and purchase lottery tickets. The more tickets a buyer holds for a given prize, the higher their statistical chance of winning. Admins manage the entire platform lifecycle — from onboarding donors and curating prizes, to triggering live lottery draws with an animated spinning wheel and confetti celebration, and generating revenue and winner reports.

The system captures purchase prices at the moment of transaction, enforces role-based access control via JWT claims, and prevents double-draws by automatically locking prizes after a lottery completes.

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| ASP.NET Core | 8.0 | Web API framework |
| C# | 12 | Server-side language |
| Entity Framework Core | 8.x | ORM & database migrations |
| SQL Server | 2019+ | Relational database |
| JWT Bearer Auth | 8.0.0 | Stateless authentication |
| ASP.NET Identity PasswordHasher | — | Secure password hashing |
| Swagger / Swashbuckle | 6.4.0 | API documentation & testing UI |
| SMTP (Gmail) | — | Email notifications |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 21.0.6 | SPA framework |
| TypeScript | 5.9.2 | Client-side language |
| PrimeNG | 21.0.2 | Rich UI component library |
| PrimeFlex | 4.0.0 | CSS flexbox grid system |
| PrimeIcons | 7.0.0 | Icon library |
| RxJS | 7.8.0 | Reactive programming |
| Angular Signals | — | Fine-grained reactivity & state |
| canvas-confetti | 1.9.4 | Lottery winner celebration effect |
| Vitest | 4.0.8 | Unit testing framework |
| esbuild | — | High-performance bundler (via Angular CLI 21) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Angular 21 SPA                         │
│   Components · Services · Signals · HTTP Interceptor        │
│                    localhost:4200                            │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP (JSON) + JWT Bearer
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              ASP.NET Core 8 REST API                        │
│  Controllers → Services → Repositories → EF Core           │
│                    localhost:5006                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     SQL Server                              │
│        LifeIsGivingDB  (4 main tables)                      │
└─────────────────────────────────────────────────────────────┘
```

### Backend Design Patterns

- **Repository Pattern** — abstracts all database queries behind interfaces
- **Service Layer** — encapsulates business logic, coordinates repositories
- **DTO Pattern** — decouples internal entities from API contracts
- **Dependency Injection** — all services and repositories are scoped via ASP.NET Core's built-in DI container

### Frontend Design Patterns

- **Standalone Components** — zero NgModules, modern Angular architecture
- **Angular Signals** — reactive state without the boilerplate of BehaviorSubjects
- **HTTP Interceptor** — auto-attaches `Authorization: Bearer` header to every outgoing request
- **Reactive Forms** — full client-side validation before API calls

---

## Features

### For Buyers
- **Browse Prizes** — view the full prize catalog with search, filter by category, and sort by price
- **Prize Details** — detailed view of each prize with donor info and a buy button
- **Shopping Cart** — add prizes with quantities; cart persists as draft purchases on the server until checkout
- **Checkout** — confirm and complete all pending cart items in a single action
- **Purchase History** — review all past completed purchases

### For Donors
- **Donor Profile** — view their contributed prizes
- **Prize Submission** — (via Admin flow) contribute new prizes to the lottery

### For Admins
- **Prize Management** — full CRUD on prizes; upload prize images directly to the server
- **Donor Management** — add, edit, and remove donor accounts; advanced filtering by name, email, or prize
- **Purchase Reports** — tabular sales report filtered by prize with revenue breakdown
- **Lottery Drawing** — trigger a live weighted-random lottery draw per prize
  - Animated spinning wheel with sound effects
  - Canvas-confetti celebration on winner reveal
  - Automatic prize lock — buyers can no longer purchase after draw
  - Prevents double-draws with pre-draw validation
- **Winners Report** — view all historical lottery results
- **Revenue Dashboard** — total income from all completed purchases

### Security & Access Control
- JWT tokens with 8-hour expiry carry role claims (Admin / Buyer / Donor)
- Controller endpoints are decorated with `[Authorize(Roles = "...")]` guards
- Passwords are hashed using ASP.NET Identity's `PasswordHasher<T>`
- CORS locked to `http://localhost:4200` in development
- Angular interceptor ensures no unauthenticated API call is made

---

## Project Structure

```
Project-Api-Angular-2025/
│
├── server-Api/
│   └── LifeIsGiving-Website2025/
│       ├── LifeIsGiving-Website2025/          # Main API project
│       │   ├── Controller/
│       │   │   ├── AuthController.cs          # Login, token issuance
│       │   │   ├── UserController.cs          # User CRUD & role queries
│       │   │   ├── PrizeController.cs         # Prize CRUD & image upload
│       │   │   ├── PurchasesController.cs     # Cart, checkout, reports
│       │   │   └── WinningController.cs       # Lottery draw & winners
│       │   ├── Models/
│       │   │   ├── User.cs
│       │   │   ├── Prize.cs
│       │   │   ├── Purchase.cs
│       │   │   ├── Winning.cs
│       │   │   └── Enums/                     # UserRole, PrizeCategory, etc.
│       │   ├── Dtos/                          # Request & response shapes
│       │   ├── Data/
│       │   │   └── AppDbContext.cs            # EF Core DbContext
│       │   ├── Services/                      # Business logic
│       │   ├── Repositories/                  # Data access
│       │   ├── Interfaces/                    # Contracts for DI
│       │   ├── Migrations/                    # EF Core migration history
│       │   ├── wwwroot/uploads/               # Uploaded prize images
│       │   ├── Program.cs                     # App bootstrap & DI wiring
│       │   └── appsettings.json
│       └── LifeIsGiving.Tests/                # Unit test project
│
└── client-Angular/
    └── LifeIsGiving-Angular/
        └── src/app/
            ├── components/
            │   ├── auth/
            │   │   ├── login/                 # Login form
            │   │   └── register/              # Registration form
            │   ├── prizes/
            │   │   ├── prize-list/            # Main prize catalog page
            │   │   ├── prize-details/         # Single prize view
            │   │   └── prize-edit-form/       # Admin create/edit dialog
            │   ├── cart/
            │   │   └── cart-page/             # Cart & checkout
            │   ├── manager/
            │   │   ├── donor-list/            # Admin donor management
            │   │   ├── add-donor/             # Add new donor form
            │   │   ├── purchase-list/         # Purchase history
            │   │   ├── lottery/               # Lottery wheel & draw
            │   │   └── admin-reports/         # Revenue reports
            │   ├── navbar/                    # Top navigation bar
            │   └── about/                     # About page
            ├── core/
            │   ├── services/
            │   │   ├── auth-service.ts        # Login, logout, token parsing
            │   │   ├── prize-service.ts       # Prize API calls
            │   │   ├── cart-service.ts        # Cart state & checkout
            │   │   ├── purchase-service.ts    # Purchase report queries
            │   │   ├── users.ts               # User/donor management
            │   │   └── winning-service.ts     # Lottery & winners API
            │   ├── models/                    # TypeScript interfaces
            │   └── interceptors/
            │       └── auth.interceptor.ts    # Attaches JWT to requests
            ├── app.routes.ts                  # Route table
            └── app.config.ts                  # DI & provider setup
```

---

## Database Schema

### Users

| Column | Type | Notes |
|---|---|---|
| Id | int PK | Auto-increment |
| UserName | nvarchar(50) | Unique |
| Name | nvarchar(50) | |
| Email | nvarchar(100) | |
| Password | nvarchar(256) | Hashed |
| Phone | nvarchar(20) | |
| Address | nvarchar(100) | |
| Role | int | Donor=1, Admin=2, Buyer=3 |

### Prizes

| Column | Type | Notes |
|---|---|---|
| Id | int PK | Auto-increment |
| Name | nvarchar(100) | |
| Description | nvarchar(500) | |
| Category | int | Toys=1, Electronics=2, Fashion=3, Cosmetics=4, Home=5, Experiences=6 |
| Price | decimal(18,2) | Ticket price |
| ImageUrl | nvarchar(200) | Nullable |
| DonorId | int FK | → Users |
| CanPurchase | bit | Set to false after lottery draw |

### Purchases

| Column | Type | Notes |
|---|---|---|
| Id | int PK | Auto-increment |
| UserId | int FK | → Users |
| PrizeId | int FK | → Prizes |
| Quantity | int | Number of tickets |
| PriceAtPurchase | decimal(18,2) | Captured at buy time |
| Status | int | Draft=0, Completed=1 |
| CreatedAt | datetime2 | UTC |

Index: `(UserId, Status)`

### Winnings

| Column | Type | Notes |
|---|---|---|
| Id | int PK | Auto-increment |
| PrizeId | int FK | → Prizes (Restrict on delete) |
| WinnerUserId | int FK | → Users (Cascade on delete) |
| LotteryDate | datetime2 | |
| WinningStatus | int | beforeLottery / afterLottery |

### Entity Relationships

```
Users ──< Purchases >── Prizes ──< Winnings >── Users
Users ──< Prizes (donated)
```

---

## API Reference

All endpoints are prefixed with `http://localhost:5006/api`.  
Swagger UI is available at `http://localhost:5006/swagger` in development.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/Auth/login` | Public | Returns JWT token + role |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/User` | Public | Register new user |
| GET | `/User` | Admin | Get all users |
| GET | `/User/{id}` | Authenticated | Get user by ID |
| GET | `/User/by-role/{role}` | Admin | Filter users by role |
| GET | `/User/buyers` | Admin | All buyers |
| GET | `/User/donors` | Public | All donors |
| GET | `/User/donors/{id}` | Public | Donor with their prizes |
| PUT | `/User/{id}` | Authenticated | Update user |
| DELETE | `/User/{id}` | Authenticated | Delete user |
| GET | `/User/filteringBy` | Admin | Advanced filter by name/email/prize |

### Prizes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/Prize` | Public | All prizes, optional `?search=` |
| GET | `/Prize/{id}` | Public | Single prize |
| POST | `/Prize` | Admin | Create prize |
| PUT | `/Prize/{id}` | Admin | Update prize |
| DELETE | `/Prize/{id}` | Admin | Delete prize |
| GET | `/Prize/search` | Public | `?prizeName=&donorName=&exactBuyers=` |
| POST | `/Prize/upload` | Admin | Upload prize image, returns `{ url }` |

### Purchases

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/Purchases` | Admin | All purchases |
| GET | `/Purchases/{id}` | Authenticated | Single purchase |
| POST | `/Purchases` | Buyer | Add to cart (creates Draft) |
| PUT | `/Purchases/{id}` | Buyer | Update cart item |
| DELETE | `/Purchases/{id}` | Buyer | Remove from cart |
| GET | `/Purchases/draft` | Buyer | Current user's cart |
| GET | `/Purchases/completed` | Authenticated | Completed purchases, `?userId=` |
| POST | `/Purchases/complete/{id}` | Buyer | Checkout single item |
| GET | `/Purchases/admin/report` | Admin | Revenue report, `?prizeId=&sortBy=` |

### Lottery

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/Winning/run/{prizeId}` | Admin | Execute weighted-random draw |
| GET | `/Winning/winners-report` | Public | All historical winners |
| GET | `/Winning/total-income` | Admin | Total revenue across all purchases |
| GET | `/Winning/check/{prizeId}` | Public | Check if prize already drawn |

---

## User Roles & Permissions

| Feature | Buyer | Donor | Admin |
|---|:---:|:---:|:---:|
| Browse prizes | ✓ | ✓ | ✓ |
| View prize details | ✓ | ✓ | ✓ |
| Add to cart | ✓ | — | — |
| Checkout | ✓ | — | — |
| View own purchases | ✓ | — | ✓ |
| Create/edit prizes | — | — | ✓ |
| Upload prize images | — | — | ✓ |
| Manage donors | — | — | ✓ |
| Run lottery draw | — | — | ✓ |
| View revenue reports | — | — | ✓ |
| View winners report | ✓ | ✓ | ✓ |

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2019+](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)
- [Node.js 20+](https://nodejs.org/) and npm
- [Angular CLI 21](https://angular.dev/tools/cli)

```bash
npm install -g @angular/cli@21
```

---

### Backend Setup

```bash
# 1. Navigate to the API project
cd server-Api/LifeIsGiving-Website2025/LifeIsGiving-Website2025

# 2. Restore NuGet packages
dotnet restore

# 3. Update appsettings.json with your SQL Server connection string
#    (see Configuration section below)

# 4. Apply database migrations
dotnet ef database update

# 5. Run the API
dotnet run
```

The API will start on `http://localhost:5006`.  
Swagger UI: `http://localhost:5006/swagger`

---

### Frontend Setup

```bash
# 1. Navigate to the Angular project
cd client-Angular/LifeIsGiving-Angular

# 2. Install dependencies
npm install

# 3. Start the development server
ng serve
```

The app will open at `http://localhost:4200`.

---

## Configuration

### `appsettings.json` (Server)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LifeIsGivingDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "ExpiryMinutes": 480
  },
  "EmailSettings": {
    "From": "your-email@gmail.com",
    "Password": "your-gmail-app-password"
  }
}
```

> **Note:** Use a Gmail App Password (not your regular password). Enable 2FA on your Google account first, then generate an App Password under Google Account > Security.

### `environment.ts` (Client)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5006'
};
```

---

## Authentication Flow

```
1. User submits credentials → POST /api/Auth/login
2. Server validates password hash, issues signed JWT
3. JWT payload contains: userId, username, role
4. Client stores token in localStorage.token
5. AuthInterceptor reads token on every HTTP request
6. Adds header: Authorization: Bearer <token>
7. Server validates signature and extracts claims
8. [Authorize(Roles = "...")] restricts access accordingly
```

Token expiry is configurable (default: 8 hours). On expiry, the user is redirected to the login page.

---

## Lottery Algorithm

The lottery draw uses a **weighted random selection**:

1. All completed purchases for the target prize are fetched
2. Each buyer's total ticket quantity is summed
3. A random number is drawn from `[0, totalTickets)`
4. The winner is whoever holds the ticket at that index (proportional to quantity)
5. The prize's `CanPurchase` flag is set to `false` — no further ticket purchases allowed
6. The winning record is persisted in the `Winnings` table
7. The client plays a wheel-spin animation, then reveals the winner with canvas-confetti

A prize cannot be drawn twice — the endpoint returns an error if a winning record already exists.

---

## Testing

### Backend Tests

```bash
cd server-Api/LifeIsGiving-Website2025/LifeIsGiving.Tests
dotnet test
```

### Frontend Tests

```bash
cd client-Angular/LifeIsGiving-Angular
npm test
```

Frontend tests use **Vitest 4** with **jsdom** for DOM simulation. All components and services have corresponding `.spec.ts` test stubs.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is for educational and portfolio purposes.

---

<div align="center">
  Built with ASP.NET Core 8 · Angular 21 · SQL Server · PrimeNG
</div>
