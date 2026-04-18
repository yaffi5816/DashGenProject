# DashGen WebAPI

REST API built with **ASP.NET Core 9** and **C#**.

## Architecture

The project is structured in **3 layers**:

- **Application** – Controllers and entry point
- **Services** – Business logic
- **Repositories** – Data access

The layers are connected via **Dependency Injection** to achieve **decoupling** (separation of concerns), allowing async operations and improved scalability.

## Key Technologies

| Technology | Purpose |
|---|---|
| Entity Framework Core (Database First) | ORM for async database access |
| AutoMapper | DTO ↔ Entity mapping |
| NLog | Logging library |
| DotNetEnv | Configuration via `appSettings` and `.env` files |

## Design Patterns

- **DTO Layer** – Sits between the controllers and the service/repository layers to remove circular dependencies and decouple layers. DTOs are implemented as `records` for cleaner and more efficient data transfer with AutoMapper.
- **Error Handling Middleware** – All unhandled exceptions are caught and logged via NLog.
- **Rating Middleware** – Validates and stores ratings per transaction.

## Configuration

- Sensitive settings (e.g. Gemini API key) are stored in `.env` and loaded at startup.
- App configuration is managed via `appsettings.json`.

## CORS

Configured to allow requests from `http://localhost:4200` (Angular frontend).

## Testing

Unit tests were written using **testi** and **tset** frameworks.  
> ⚠️ The name of the second test framework is not remembered at this time.
