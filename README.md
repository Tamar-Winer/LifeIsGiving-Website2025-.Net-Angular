<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,50:8b5cf6,100:a855f7&height=200&section=header&text=LifeIsGiving&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=Charity%20Lottery%20Platform&descAlignY=60&descSize=22&animation=fadeIn" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=8B5CF6&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=80&lines=Full-Stack+Charity+Lottery+Platform;ASP.NET+Core+8+%2B+Angular+21;Donors+%C2%B7+Tickets+%C2%B7+Live+Draws+%C2%B7+Winners)](https://git.io/typing-svg)

<br/>

[![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG_21-DD0031?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Entity Framework](https://img.shields.io/badge/EF_Core_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://learn.microsoft.com/ef/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## 📖 Overview

**LifeIsGiving** is a sophisticated, full-stack charity lottery platform where the community comes together — **Donors** contribute prizes they care about, **Buyers** purchase raffle tickets for a chance to win, and **Admins** orchestrate live lottery draws with animated spinning wheels, confetti celebrations, and winner reveals.

> The more tickets a buyer holds for a prize, the greater their odds — making every purchase feel meaningful and exciting.

<img width="1917" height="913" alt="20260521012715839" src="https://github.com/user-attachments/assets/a74f8d0f-2059-469d-a3ce-01f65180716b" />

### How It Works

```
 🎁 Donor submits a prize
        │
        ▼
 🛒 Buyers purchase tickets (quantity = probability weight)
        │
        ▼
 🎡 Admin triggers live lottery draw (animated wheel + confetti)
        │
        ▼
 🏆 Winner is revealed — prize locked, no further tickets sold
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛍️ For Buyers
- Browse a rich prize catalog with **search, filter & sort**
- View detailed prize pages with donor info
- **Shopping cart** backed by server-side draft purchases
- One-click **checkout** to complete all pending items
- Full **purchase history** view

</td>
<td width="50%">

### 🎁 For Donors
- Personal donor profile
- View all contributed prizes and their status
- Track which prizes have already been drawn

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Security & Auth
- **JWT Bearer Tokens** with 8-hour expiry
- Role claims enforced on every API endpoint
- **ASP.NET Identity** password hashing
- Angular `AuthInterceptor` auto-attaches tokens
- CORS locked to frontend origin

</td>
<td width="50%">

### 🧑‍💼 For Admins
- Full **prize & donor CRUD** + image uploads
- **Live lottery draw** — weighted random, spin animation, confetti
- **Revenue reports** with per-prize breakdowns
- **Winners report** — full historical lottery results
- **Total income** dashboard
- Advanced **filtering** by name, email, or prize

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Angular 21 SPA                              │
│                        localhost:4200                               │
│                                                                     │
│  Standalone Components · Signals · RxJS · HTTP Interceptor          │
│  PrimeNG UI · PrimeFlex Grid · canvas-confetti                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  REST + JSON  ·  JWT Bearer
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                    ASP.NET Core 8 REST API                          │
│                        localhost:5006                               │
│                                                                     │
│  Controllers → Services → Repositories → EF Core → SQL Server      │
│  Swagger UI  ·  JWT Auth  ·  CORS  ·  Static Files                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                          SQL Server                                 │
│                       LifeIsGivingDB                                │
│          Users · Prizes · Purchases · Winnings                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Patterns
| Pattern | Implementation |
|---|---|
| Repository Pattern | All DB queries behind `IRepository<T>` interfaces |
| Service Layer | Business logic in dedicated service classes |
| DTO Pattern | Separate request/response shapes from EF entities |
| Dependency Injection | ASP.NET Core built-in DI (scoped lifetime) |

### Frontend Patterns
| Pattern | Implementation |
|---|---|
| Standalone Components | Zero NgModules — modern Angular architecture |
| Angular Signals | Fine-grained reactivity for cart, auth, donor state |
| HTTP Interceptor | Auto-attaches `Authorization: Bearer` on every request |
| Reactive Forms | Full client-side validation before API calls |

---

## 🛠️ Tech Stack

### Backend

<div align="center">

| | Technology | Version | Role |
|---|---|---|---|
| <img src="https://img.shields.io/badge/-512BD4?style=flat&logo=dotnet&logoColor=white" height="20"/> | [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) | 8.0 | Web API framework |
| <img src="https://img.shields.io/badge/-239120?style=flat&logo=csharp&logoColor=white" height="20"/> | [C#](https://learn.microsoft.com/en-us/dotnet/csharp/) | 12 | Server-side language |
| <img src="https://img.shields.io/badge/-512BD4?style=flat&logo=dotnet&logoColor=white" height="20"/> | [Entity Framework Core](https://learn.microsoft.com/ef/core/) | 8.x | ORM & migrations |
| <img src="https://img.shields.io/badge/-CC2927?style=flat&logo=microsoftsqlserver&logoColor=white" height="20"/> | [SQL Server](https://www.microsoft.com/sql-server) | 2019+ | Relational database |
| <img src="https://img.shields.io/badge/-000000?style=flat&logo=jsonwebtokens&logoColor=white" height="20"/> | [JWT Bearer Auth](https://jwt.io/) | 8.0.0 | Stateless authentication |
| <img src="https://img.shields.io/badge/-85EA2D?style=flat&logo=swagger&logoColor=black" height="20"/> | [Swagger / Swashbuckle](https://swagger.io/) | 6.4.0 | API docs & testing UI |
| <img src="https://img.shields.io/badge/-EA4335?style=flat&logo=gmail&logoColor=white" height="20"/> | [Gmail SMTP](https://support.google.com/mail) | — | Email notifications |

</div>

### Frontend

<div align="center">

| | Technology | Version | Role |
|---|---|---|---|
| <img src="https://img.shields.io/badge/-DD0031?style=flat&logo=angular&logoColor=white" height="20"/> | [Angular](https://angular.dev/) | 21.0.6 | SPA framework |
| <img src="https://img.shields.io/badge/-3178C6?style=flat&logo=typescript&logoColor=white" height="20"/> | [TypeScript](https://www.typescriptlang.org/) | 5.9.2 | Client-side language |
| <img src="https://img.shields.io/badge/-DD0031?style=flat&logo=primeng&logoColor=white" height="20"/> | [PrimeNG](https://primeng.org/) | 21.0.2 | Rich UI component library |
| <img src="https://img.shields.io/badge/-38B2AC?style=flat&logo=css3&logoColor=white" height="20"/> | [PrimeFlex](https://primeflex.org/) | 4.0.0 | CSS flexbox grid system |
| <img src="https://img.shields.io/badge/-B7178C?style=flat&logo=reactivex&logoColor=white" height="20"/> | [RxJS](https://rxjs.dev/) | 7.8.0 | Reactive programming |
| <img src="https://img.shields.io/badge/-DD0031?style=flat&logo=angular&logoColor=white" height="20"/> | [Angular Signals](https://angular.dev/guide/signals) | built-in | Fine-grained reactive state |
| <img src="https://img.shields.io/badge/-FFCA28?style=flat&logo=javascript&logoColor=black" height="20"/> | [canvas-confetti](https://www.kirilv.com/canvas-confetti/) | 1.9.4 | Winner celebration effects |
| <img src="https://img.shields.io/badge/-6E9F18?style=flat&logo=vitest&logoColor=white" height="20"/> | [Vitest](https://vitest.dev/) | 4.0.8 | Unit testing framework |
| <img src="https://img.shields.io/badge/-FFCB3B?style=flat&logo=esbuild&logoColor=black" height="20"/> | [esbuild](https://esbuild.github.io/) | via CLI 21 | High-performance bundler |

</div>

---

## 📁 Project Structure

<details>
<summary><b>🖥️ Backend — ASP.NET Core 8</b></summary>

```
server-Api/LifeIsGiving-Website2025/LifeIsGiving-Website2025/
│
├── 📂 Controller/
│   ├── AuthController.cs          # POST /login → JWT token
│   ├── UserController.cs          # User CRUD, role-based queries
│   ├── PrizeController.cs         # Prize CRUD + image upload
│   ├── PurchasesController.cs     # Cart management, checkout, reports
│   └── WinningController.cs       # Lottery draw, winners, revenue
│
├── 📂 Models/
│   ├── User.cs
│   ├── Prize.cs
│   ├── Purchase.cs
│   ├── Winning.cs
│   └── Enums/
│       ├── UserRole.cs            # Donor=1, Admin=2, Buyer=3
│       ├── PrizeCategory.cs       # Toys, Electronics, Fashion...
│       ├── PurchaseStatus.cs      # Draft=0, Completed=1
│       └── WinningStatus.cs       # beforeLottery, afterLottery
│
├── 📂 Dtos/                       # Request & response shapes
├── 📂 Data/
│   └── AppDbContext.cs            # EF Core context + seed
├── 📂 Services/                   # Business logic
├── 📂 Repositories/               # Data access layer
├── 📂 Interfaces/                 # DI contracts
├── 📂 Migrations/                 # EF Core migration history
├── 📂 wwwroot/uploads/            # Uploaded prize images (static)
├── Program.cs                     # App bootstrap & DI wiring
└── appsettings.json
```

</details>

<details>
<summary><b>🌐 Frontend — Angular 21</b></summary>

```
client-Angular/LifeIsGiving-Angular/src/app/
│
├── 📂 components/
│   ├── 📂 auth/
│   │   ├── login/                 # Login form with validation
│   │   └── register/              # Registration form
│   │
│   ├── 📂 prizes/
│   │   ├── prize-list/            # 🏠 Main catalog — search, filter, sort
│   │   ├── prize-details/         # Single prize with buy button
│   │   └── prize-edit-form/       # Admin create/edit dialog
│   │
│   ├── 📂 cart/
│   │   └── cart-page/             # Cart items, quantity, checkout
│   │
│   ├── 📂 manager/ (Admin only)
│   │   ├── donor-list/            # Donor management table
│   │   ├── add-donor/             # Create donor form
│   │   ├── purchase-list/         # Purchase history
│   │   ├── lottery/               # 🎡 Spin wheel + confetti reveal
│   │   └── admin-reports/         # Revenue & sales reports
│   │
│   ├── navbar/                    # Navigation + cart badge + user menu
│   └── about/                     # About page
│
├── 📂 core/
│   ├── 📂 services/
│   │   ├── auth-service.ts        # Login, logout, JWT parsing, isAdmin()
│   │   ├── prize-service.ts       # Prize CRUD + image upload
│   │   ├── cart-service.ts        # Signal-based cart state + checkout
│   │   ├── purchase-service.ts    # Purchase report queries
│   │   ├── users.ts               # Donor management + RxJS stream
│   │   └── winning-service.ts     # Lottery run, winners, income
│   │
│   ├── 📂 models/                 # TypeScript interfaces
│   │   ├── User.ts
│   │   ├── Prize.ts
│   │   ├── CartItem.ts
│   │   └── Donor.ts
│   │
│   └── 📂 interceptors/
│       └── auth.interceptor.ts    # Auto-inject JWT on every request
│
├── app.routes.ts                  # Route table
├── app.config.ts                  # DI providers & PrimeNG setup
└── app.ts                         # Root component with Toast + Navbar
```

</details>

---

## 🗄️ Database Schema

<details>
<summary><b>View full schema</b></summary>

### Users
| Column | Type | Constraints |
|---|---|---|
| Id | `int` | PK, auto-increment |
| UserName | `nvarchar(50)` | Unique, required |
| Name | `nvarchar(50)` | Required |
| Email | `nvarchar(100)` | Required |
| Password | `nvarchar(256)` | Hashed (ASP.NET Identity) |
| Phone | `nvarchar(20)` | |
| Address | `nvarchar(100)` | |
| Role | `int` | Donor=1 · Admin=2 · Buyer=3 |

### Prizes
| Column | Type | Constraints |
|---|---|---|
| Id | `int` | PK, auto-increment |
| Name | `nvarchar(100)` | Required |
| Description | `nvarchar(500)` | |
| Category | `int` | Toys · Electronics · Fashion · Cosmetics · Home · Experiences |
| Price | `decimal(18,2)` | Ticket price |
| ImageUrl | `nvarchar(200)` | Nullable |
| DonorId | `int` | FK → Users |
| CanPurchase | `bit` | `false` after lottery draw |

### Purchases
| Column | Type | Constraints |
|---|---|---|
| Id | `int` | PK, auto-increment |
| UserId | `int` | FK → Users |
| PrizeId | `int` | FK → Prizes |
| Quantity | `int` | Number of tickets |
| PriceAtPurchase | `decimal(18,2)` | Captured at buy time (immutable) |
| Status | `int` | Draft=0 · Completed=1 |
| CreatedAt | `datetime2` | UTC |

> Index on `(UserId, Status)` for fast cart queries.

### Winnings
| Column | Type | Constraints |
|---|---|---|
| Id | `int` | PK, auto-increment |
| PrizeId | `int` | FK → Prizes (Restrict delete) |
| WinnerUserId | `int` | FK → Users (Cascade delete) |
| LotteryDate | `datetime2` | |
| WinningStatus | `int` | beforeLottery / afterLottery |

### Entity Relationships
```
Users ──< Prizes (donated)
Users ──< Purchases >── Prizes
Users ──< Winnings >── Prizes
```

</details>

---

## 🔌 API Reference

> Base URL: `http://localhost:5006/api`  
> Swagger UI: `http://localhost:5006/swagger`

<details>
<summary><b>🔑 Auth</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/Auth/login` | Public | Returns JWT token + role |

**Request body:**
```json
{ "userName": "string", "password": "string" }
```
**Response:**
```json
{ "token": "eyJ...", "role": "Admin" }
```

</details>

<details>
<summary><b>👤 Users</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/User` | Public | Register new user |
| `GET` | `/User` | Admin | Get all users |
| `GET` | `/User/{id}` | Authenticated | Get user by ID |
| `GET` | `/User/by-role/{role}` | Admin | Filter users by role |
| `GET` | `/User/buyers` | Admin | All buyers |
| `GET` | `/User/donors` | Public | All donors |
| `GET` | `/User/donors/{id}` | Public | Donor + their prizes |
| `PUT` | `/User/{id}` | Authenticated | Update user |
| `DELETE` | `/User/{id}` | Authenticated | Delete user |
| `GET` | `/User/filteringBy` | Admin | Filter by name/email/prize |

</details>

<details>
<summary><b>🎁 Prizes</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/Prize` | Public | All prizes — `?search=` |
| `GET` | `/Prize/{id}` | Public | Single prize |
| `POST` | `/Prize` | Admin | Create prize |
| `PUT` | `/Prize/{id}` | Admin | Update prize |
| `DELETE` | `/Prize/{id}` | Admin | Delete prize |
| `GET` | `/Prize/search` | Public | `?prizeName=&donorName=&exactBuyers=` |
| `POST` | `/Prize/upload` | Admin | Upload image → returns `{ url }` |

</details>

<details>
<summary><b>🛒 Purchases</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/Purchases` | Admin | All purchases |
| `GET` | `/Purchases/{id}` | Authenticated | Single purchase |
| `POST` | `/Purchases` | Buyer | Add to cart (creates Draft) |
| `PUT` | `/Purchases/{id}` | Buyer | Update cart item |
| `DELETE` | `/Purchases/{id}` | Buyer | Remove from cart |
| `GET` | `/Purchases/draft` | Buyer | Current user's cart |
| `GET` | `/Purchases/completed` | Authenticated | History — `?userId=` |
| `POST` | `/Purchases/complete/{id}` | Buyer | Checkout single item |
| `GET` | `/Purchases/admin/report` | Admin | Revenue report — `?prizeId=&sortBy=` |

</details>

<details>
<summary><b>🎡 Lottery</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/Winning/run/{prizeId}` | Admin | Execute weighted-random draw |
| `GET` | `/Winning/winners-report` | Public | All historical winners |
| `GET` | `/Winning/total-income` | Admin | Total revenue |
| `GET` | `/Winning/check/{prizeId}` | Public | Is this prize already drawn? |

</details>

---

## 👥 User Roles & Permissions

<div align="center">

| Feature | 🛍️ Buyer | 🎁 Donor | 🧑‍💼 Admin |
|---|:---:|:---:|:---:|
| Browse prizes | ✅ | ✅ | ✅ |
| View prize details | ✅ | ✅ | ✅ |
| View winners report | ✅ | ✅ | ✅ |
| Add to cart / checkout | ✅ | ❌ | ❌ |
| View own purchases | ✅ | ❌ | ✅ |
| Create / edit prizes | ❌ | ❌ | ✅ |
| Upload prize images | ❌ | ❌ | ✅ |
| Manage donors | ❌ | ❌ | ✅ |
| Run lottery draw | ❌ | ❌ | ✅ |
| View revenue reports | ❌ | ❌ | ✅ |

</div>

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Link |
|---|---|---|
| .NET SDK | 8.0+ | [Download](https://dotnet.microsoft.com/download/dotnet/8.0) |
| SQL Server | 2019+ | [Download](https://www.microsoft.com/sql-server) |
| Node.js | 20+ | [Download](https://nodejs.org/) |
| Angular CLI | 21 | `npm install -g @angular/cli@21` |

---

### 🖥️ Backend Setup

```bash
# Navigate to the API project
cd server-Api/LifeIsGiving-Website2025/LifeIsGiving-Website2025

# Restore NuGet packages
dotnet restore

# Apply database migrations
dotnet ef database update

# Start the API
dotnet run
```

> API running at `http://localhost:5006`  
> Swagger UI at `http://localhost:5006/swagger`

---

### 🌐 Frontend Setup

```bash
# Navigate to the Angular project
cd client-Angular/LifeIsGiving-Angular

# Install dependencies
npm install

# Start the dev server
ng serve
```

> App running at `http://localhost:4200`

---

## ⚙️ Configuration

### `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LifeIsGivingDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_AT_LEAST_32_CHARS",
    "ExpiryMinutes": 480
  },
  "EmailSettings": {
    "From": "your-email@gmail.com",
    "Password": "your-gmail-app-password"
  }
}
```

> **Gmail setup:** Enable 2FA → Google Account → Security → App Passwords → Generate one for this app.

### `environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5006'
};
```

---

## 🔐 Authentication Flow

```
   Client                              Server
     │                                    │
     │── POST /api/Auth/login ───────────►│
     │   { userName, password }           │ Validates password hash
     │                                    │ Builds JWT (userId, role)
     │◄── { token, role } ───────────────│
     │                                    │
     │  localStorage.token = token        │
     │                                    │
     │── GET /api/Prize ────────────────►│
     │   Authorization: Bearer <token>    │ Validates JWT signature
     │                                    │ Extracts role claim
     │◄── [...prizes] ───────────────────│
```

Token expiry: **8 hours** (configurable). On expiry → redirect to `/login`.

---

## 🎡 Lottery Algorithm

The draw uses **weighted random selection** — buyers with more tickets have proportionally higher odds:

```
1. Fetch all Completed purchases for the prize
2. Sum total tickets: e.g., Alice=5, Bob=3, Carol=2 → total=10
3. Pick random index: rand(0..9)
   - 0–4 → Alice wins  (50%)
   - 5–7 → Bob wins    (30%)
   - 8–9 → Carol wins  (20%)
4. Set prize.CanPurchase = false  →  no more tickets sold
5. Save Winning record to DB
6. Client plays spin animation → confetti celebration 🎉
```

> A prize **cannot be drawn twice** — the endpoint rejects the request if a Winning record already exists.

---

## 🧪 Testing

### Backend

```bash
cd server-Api/LifeIsGiving-Website2025/LifeIsGiving.Tests
dotnet test
```

### Frontend

```bash
cd client-Angular/LifeIsGiving-Angular
npm test
```

Frontend tests use **Vitest 4** + **jsdom**. All 15+ components and 6 services have `.spec.ts` coverage stubs.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:a855f7,50:8b5cf6,100:6366f1&height=120&section=footer&animation=fadeIn" width="100%"/>

**Built with ❤️ using**

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet)
[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-DD0031?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org/)

</div>
