# Self-Hosted Deployment Guide (Zero Cloud Cost)

This guide explains how to host the **Medhen Beza Hospital Web Platform & CMS** entirely on self-hosted infrastructure (such as an on-premise hospital server or standard Ubuntu VPS) with **$0 in recurring SaaS or hosting fees**.

---

## 1. Architecture Overview

```
                      Internet
                         │
                 ┌───────▼───────┐
                 │  Caddy Proxy  │  (Port 80/443, Automatic Free Let's Encrypt SSL)
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │  Next.js 16   │  (Production Standalone Container)
                 └───────┬───────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
 ┌───────▼───────┐               ┌───────▼───────┐
 │ PostgreSQL 16 │               │ Uploads Vol.  │
 │  (Docker Vol) │               │(Local Backup) │
 └───────────────┘               └───────────────┘
```

- **Reverse Proxy:** Caddy handles reverse proxying, compression, and automatic Let's Encrypt SSL.
- **Application:** Next.js 16 (App Router + Turbopack) running in unprivileged Node 22 Alpine container.
- **Database:** PostgreSQL 16 running in a Docker container with persistent disk volume `mb_postgres_data`.
- **Media Storage:** Dual-mode pipeline: uses Cloudinary free package quotas when available, with automatic zero-cost fallback to `mb_uploads_data` volume.
- **Interactive Maps:** 100% free, community-powered OpenStreetMap (OSM) without Google Maps billing or API keys.

---

## 2. Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed on your host:
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```

### Step 1: Configure Environment Variables
Create or verify your `.env` file in the project root:
```env
# Database Credentials
POSTGRES_USER=medhen
POSTGRES_PASSWORD=YourStrongHospitalPassword2026!
POSTGRES_DB=medhin_beza_db

# Cloudinary (Optional - leave blank to save 100% locally to disk)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Public Site URL
NEXT_PUBLIC_SITE_URL=https://medhenbeza.com
```

### Step 2: Configure Domain in Caddyfile
Open `Caddyfile` and replace `:80` with your domain:
```caddy
medhenbeza.com, www.medhenbeza.com {
    encode gzip zstd
    reverse_proxy web:3000
}
```
*(If deploying on local hospital intranet without a domain, leave `:80`.)*

### Step 3: Build and Launch
```bash
docker compose up -d --build
```

### Step 4: Run Initial Prisma Migration & Seed
Run Prisma inside the running `web` container:
```bash
# Push database schema
docker compose exec web npx prisma db push

# Seed default admin accounts, clinical departments, and doctors
docker compose exec web npx prisma db seed
```

### Step 5: Verify Status
```bash
docker compose ps
```
The hospital portal will be live at `https://medhenbeza.com` (or `http://localhost`) with automatic SSL enabled!

---

## 3. Maintenance & Backup

### Backing up Database
```bash
docker compose exec -T db pg_dump -U medhen medhin_beza_db > backup_$(date +%Y%m%d).sql
```

### Backing up Uploaded Files
```bash
tar -czvf uploads_backup_$(date +%Y%m%d).tar.gz -C /var/lib/docker/volumes/medhen_uploads_data/_data .
```

### Updating to New Code
```bash
git pull
docker compose up -d --build
```
All database records and uploaded media will be completely preserved in their respective Docker volumes.
