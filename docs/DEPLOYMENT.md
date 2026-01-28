# Deployment Guide

This document provides instructions for deploying the Indian Wedding Biodata Generator to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Docker Deployment](#docker-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure:

1. **Build succeeds locally**
   ```bash
   npm run build
   ```

2. **No linting errors**
   ```bash
   npm run lint
   ```

## Deployment Options

| Platform | Ease | Features | Free Tier |
|----------|------|----------|-----------|
| Vercel | ⭐⭐⭐⭐⭐ | Native Next.js, Edge, Analytics | Yes |
| Netlify | ⭐⭐⭐⭐ | Easy deploy, Forms, Functions | Yes |
| Docker | ⭐⭐⭐ | Full control, Any host | N/A |
| Self-hosted | ⭐⭐ | Maximum control | N/A |

## Vercel Deployment

Vercel is the recommended platform as it's created by the Next.js team.

### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub/GitLab repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto-detected)

3. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed

## Netlify Deployment

### Via Netlify UI

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add Netlify Plugin**
   
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

### Via CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start application
CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  biodata-generator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Next.js Output Configuration

Update `next.config.ts` for standalone output:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... other config
};

export default nextConfig;
```

### Build and Run

```bash
# Build image
docker build -t biodata-generator .

# Run container
docker run -p 3000:3000 biodata-generator

# Or with docker-compose
docker-compose up -d
```

## Self-Hosted Deployment

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Create PM2 Config**
   
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'biodata-generator',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/app',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
       },
     }],
   };
   ```

4. **Start Application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/biodata`:

```nginx
server {
    listen 80;
    server_name biodata.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name biodata.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/biodata.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/biodata.yourdomain.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## Environment Variables

### Required Variables

None required - the application works entirely client-side.

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Site base URL | - |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |

### Setting Environment Variables

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_BASE_URL
```

**Netlify:**
Go to Site settings → Environment variables

**Docker:**
```bash
docker run -e NEXT_PUBLIC_BASE_URL=https://example.com biodata-generator
```

## Performance Optimization

### 1. Enable Caching Headers

In `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Image Optimization

- Use WebP format for backgrounds
- Compress images before adding to public folder
- Use next/image for automatic optimization

### 3. Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true npm run build"
```

### 4. CDN Configuration

For static assets, consider using a CDN:
- Vercel: Built-in Edge Network
- Netlify: Built-in CDN
- Self-hosted: CloudFlare, AWS CloudFront

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard for:
- Web Vitals monitoring
- Error tracking
- Performance insights

### Self-Hosted Monitoring

Consider:
- Sentry for error tracking
- Google Analytics for usage
- Uptime Robot for availability

## Troubleshooting

### Build Failures

**Error: "Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Out of memory"**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Runtime Issues

**PDF generation fails**
- Check font URLs are accessible
- Verify @react-pdf/renderer version compatibility

**localStorage errors**
- Check browser storage quota
- Verify user hasn't disabled storage

### Performance Issues

**Slow initial load**
- Enable static generation where possible
- Check bundle size with analyzer
- Verify images are optimized

### SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew
sudo systemctl reload nginx
```

## Rollback Procedures

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker

```bash
# List images
docker images

# Run previous version
docker run -p 3000:3000 biodata-generator:previous-tag
```

### Git-based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or deploy specific commit
git checkout [commit-hash]
# Trigger new deployment
```
