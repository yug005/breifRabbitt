# 🐇 BriefRabbit

**AI-powered Sales Dataset Analyst & Executive Summary Generator**

BriefRabbit is an enterprise-grade web application designed to help business leaders easily extract actionable insights from raw sales data. By simply uploading a CSV or XLSX dataset, the application asynchronously parses the data, runs statistical analyses, interfaces with an AI (Groq or Gemini), and generates a professional, C-suite ready executive summary that can be previewed or instantly dispatched via email.

---

## 🎯 Project Overview

- **Purpose**: Automate the generation of executive-level sales summaries from raw tabular data.
- **Workflow**: 
  1. User uploads a sales dataset (`.csv` or `.xlsx`).
  2. The system queues an asynchronous pipeline job.
  3. The file is validated, parsed, and scrubbed.
  4. An analysis engine calculates KPIs (revenue, means, outliers, missing values).
  5. The AI constructs an executive summary containing Performance Overview, Key Insights, Anomalies/Risks, and Strategic Recommendations.
  6. The client can preview the Markdown summary via the job status endpoint before it is sent.
  7. The summary is emailed securely using SMTP or Resend.

---

## 🏗️ System Architecture

The application adopts a Clean MVC pattern on the backend, ensuring a clear separation of concerns, testability, and isolated service dependencies.

```text
Client (React/Vite) 
  └─ POST /upload
       ├─ Middleware (Auth, Rate Limiting, File Validation)
       └─ Controller (Job Store creation)
            └─ Asynchronous Pipeline Orcrestrator
                 ├─ 1. Parser (PapaParse/SheetJS)
                 ├─ 2. Analysis Engine 
                 ├─ 3. AI Summarizer (Groq / Gemini)
                 └─ 4. Email Service (Nodemailer / Resend)
```

The system is decoupled so the frontend polls the `GET /status/:jobId` endpoint to retrieve real-time progress for each autonomous pipeline step.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: TailwindCSS
- **State Management & Network**: React Hooks, Axios

### Backend
- **Runtime**: Node.js (v20)
- **Framework**: Express.js
- **File Parsing**: PapaParse (CSV), SheetJS (XLSX)
- **AI Integration**: Native Fetch API integrating with Groq & Google Gemini
- **Email Delivery**: Nodemailer, Resend SDK
- **Logging**: Winston (Structured logging with Request IDs)
- **Documentation**: Swagger UI / OpenAPI 3.0 via `swagger-jsdoc`

### DevOps
- **Containerization**: Docker (multi-stage Alpine builds)
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (Lint, Test, Docker smoke testing)

---

## 📚 API Documentation

A fully interactive Swagger UI is built into the application. Once the server is running, navigate to:
**http://localhost:8000/docs**

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/upload` | Upload a dataset (max 5MB) and an email address. Creates a tracking job. | `X-API-Key` |
| `GET` | `/api/v1/status/:jobId` | Poll the status of the pipeline and retrieve the final AI summary. | `X-API-Key` |
| `GET` | `/api/v1/health` | Comprehensive health check returning service statuses. | None |

*Tip: The root path (`/`) also automatically redirects to the OpenAPI documentation.*

---

## 🔒 Security Measures

BriefRabbit is hardened for production environments through multiple defensive layers:

1. **Strict File Validation**: Enforced at the middleware level (Multer); accepts strictly `.csv` or `.xlsx` MIME types and signatures.
2. **Payload Limits**: Hard limit of 5MB per upload to prevent DoS via exhaustion.
3. **Input Sanitization**: Email addresses are stripped of trailing spaces and coerced to lowercase formats before regex validation.
4. **Header Obfuscation**: Uses `Helmet` for CSP directives, preventing MIME sniffing, and obscuring X-Powered-By banners.
5. **Rate Limiting**: Generalized API rate limit, paired with an aggressive `uploadRateLimiter` (max 5 uploads per minute) specifically on the `/upload` path over IP tracking.
6. **Authentication**: Edge validation via `X-API-Key` interceptors.
7. **Environment Isolation**: `.env` configurations are stringently checked at startup. Attempting to start in `production` without necessary vars triggers a crash loop to prevent insecure operation.

---

## 🐳 Running with Docker

The application uses an optimized, rootless, multi-stage Alpine Dockerfile. 

### Quick Start
```bash
# 1. Clone the repository and configure API keys
cp backend/.env.example backend/.env

# 2. Start the full application stack
docker-compose up --build -d
```
The Docker network will resolve:
- Frontend: `http://localhost:5173`
- Backend / Swagger: `http://localhost:8000`

---

## ⚙️ Environment Variables

The backend relies on the following configurations mapped through `src/config/env.js`:

```env
# Server
NODE_ENV=production
PORT=8000
API_KEY=your-secure-api-key    # Mandatory

# Security & Uploads
ALLOWED_ORIGINS=http://localhost:5173
MAX_FILE_SIZE_MB=5

# LLM Providers (Pick "groq" or "gemini")
LLM_PROVIDER=groq
GROQ_API_KEY=xxx
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-2.0-flash

# Email configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mailer@briefrabbit.com
SMTP_PASSWORD=secret
```

---

## 🚀 Deployment Instructions

### Deploying the Backend
1. Ensure your hosting provider (e.g., Render, AWS ECS, DigitalOcean App Platform) supports standard Docker containers.
2. Connect the repository and set the root context to the `./backend` directory.
3. Supply all environment variables securely via the platform's Secret Manager.
4. The deployment mechanism will run the lightweight image as a non-root `appuser`. The included `HEALTHCHECK` command natively verifies stability via `wget` pings.

### Deploying the Frontend
1. The Vite-based React application can be statically rendered and hosted on Vercel, Netlify, or AWS S3/Cloudfront.
2. Set the `VITE_API_URL` to point to your live backend domain (e.g., `https://api.briefrabbit.com`).
3. Push to `main`; the CI pipeline will validate the build.

---
*Developed for intelligent, expedited data-driven decisions.*
