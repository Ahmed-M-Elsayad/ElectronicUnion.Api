![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

# Electronic Union Team — Website & AI Backend

Bilingual (AR/EN) landing page and ASP.NET Core Web API for the **Electronic Union Team** at KFS Higher Institute of Engineering & Technology.

> 🔗 **Live site:** [https://ahmed-m-elsayad.github.io/Electronics/](https://ahmed-m-elsayad.github.io/Electronics/)

## Architecture

| Layer    | Technology                                               |
| -------- | -------------------------------------------------------- |
| Frontend | HTML5, CSS3, Vanilla JS (GitHub Pages)                   |
| Backend  | ASP.NET Core 8 Web API                                   |
| AI       | Google Gemini, accessed only through a server-side proxy |

The browser never sees the Gemini API key. All AI requests go through the backend, which validates and forwards them.

## Project Structure

```text
ElectronicUnion.Api/
├── Configuration/   # Options pattern
├── Contracts/       # Interfaces (DIP)
├── Controllers/     # API endpoints
├── Extensions/      # DI helpers
├── Middleware/      # Error handling
├── Models/          # DTOs
├── Services/        # Business logic
├── Validators/      # Input validation
└── Frontend/        # Static site (GitHub Pages)
```

## Security

- API key stored in **User Secrets** (development) and **environment variables** (production). Never committed.
- **CSP** and **SRI** on the frontend.
- **CORS** restricted to the configured frontend origin(s) only.
- **Server-side validation** of user input (length, control characters).
- **Error-handling middleware** that never leaks internals.
- **Swagger disabled** outside the Development environment.
- `.gitignore` blocks `appsettings.Development.json` and other local files.

## Configuration

| Key                     | Description                      | Example                          |
| ----------------------- | -------------------------------- | -------------------------------- |
| `GeminiSettings:ApiKey` | Gemini API key (**secret**)      | _set via User Secrets / env var_ |
| `Cors:AllowedOrigins`   | Allowed frontend origins (array) | `https://your-user.github.io`    |

In environment variables (Azure App Service, MonsterASP, Docker), use a double underscore instead of a colon:

```text
GeminiSettings__ApiKey=YOUR_KEY
Cors__AllowedOrigins__0=https://your-user.github.io
```

## API Endpoints

| Method | Route       | Description                           |
| ------ | ----------- | ------------------------------------- |
| POST   | `/api/chat` | Send a prompt, receive a Gemini reply |

Swagger UI is available in Development only: `https://localhost:7001/swagger`

## Local Development

### Backend

```bash
cd ElectronicUnion.Api
dotnet user-secrets set "GeminiSettings:ApiKey" "YOUR_KEY"
dotnet run
```

### Frontend

```bash
cd Frontend
npx serve .
```

Then open `http://localhost:3000` (or whichever port `serve` reports).

## Deployment

### Frontend

- **GitHub Pages**: hosting `Frontend/` from the `main` branch. `_headers` is **not** supported by GitHub Pages, so the CSP is declared via `<meta http-equiv="Content-Security-Policy">` in `index.html`.
- **Cloudflare Pages** (alternative): supports `_headers` for real HTTP security headers.

### Backend (Azure App Service / MonsterASP)

User Secrets work **only in local development**. In production:

1. Set `GeminiSettings__ApiKey` in the host's **Application settings / Environment variables**.
2. Set `Cors__AllowedOrigins__0` to your deployed frontend URL.
3. Set `ASPNETCORE_ENVIRONMENT=Production` so Swagger stays disabled.
4. Make sure `API_BASE_URL` in `Frontend/js/data.js` points to your deployed backend.

## Contact

- **GitHub:** [Ahmed-M-Elsayad](https://github.com/Ahmed-M-Elsayad)
- **LinkedIn:** [Ahmed Mohamed Saber](https://www.linkedin.com/in/ahmed-mohamed-ahmed-saber-abdelhamid-b46249324)
- **Live Site:** [https://ahmed-m-elsayad.github.io/Electronics/](https://ahmed-m-elsayad.github.io/Electronics/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
