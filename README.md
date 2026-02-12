# 🚀 Cloudflare CRM

A full-stack Customer Relationship Management system built on Cloudflare's edge platform in a single evening. Demonstrates the power of Cloudflare Workers, D1 database, and global edge computing.

![CRM Dashboard](https://img.shields.io/badge/Cloudflare-Workers-orange) ![D1 Database](https://img.shields.io/badge/Database-D1-blue) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## ✨ Features

- **Contact Management** - Store and manage customer contacts with email, phone, and company associations
- **Company Tracking** - Organize contacts by company with industry and website information
- **Deal Pipeline** - Track deals through stages (Lead → Qualified → Proposal → Closed)
- **Real-time Dashboard** - Live stats on contacts, companies, deals, and pipeline value
- **Global Edge Deployment** - Runs in 300+ cities worldwide with sub-50ms latency

## 🏗️ Architecture

**Frontend**: Single-page HTML application with vanilla JavaScript
**Backend**: Cloudflare Workers (TypeScript) - serverless API at the edge
**Database**: Cloudflare D1 - distributed SQL database
**Deployment**: Cloudflare Pages for static assets

### Tech Stack
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Language**: TypeScript
- **Database**: D1 (SQLite on edge)
- **API**: RESTful endpoints with CRUD operations
- **Deployment**: Wrangler CLI

## 🚀 Quick Start

### Prerequisites
- Node.js 16.17.0+
- Cloudflare account
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/kritsbhatia/cloudflare-crm.git
cd cloudflare-crm
```

2. Install dependencies
```bash
npm install
```

3. Create a D1 database
```bash
npx wrangler d1 create crm-db
```

4. Update `wrangler.jsonc` with your database ID

5. Apply database schema
```bash
npx wrangler d1 execute crm-db --local --file=./schema.sql
npx wrangler d1 execute crm-db --remote --file=./schema.sql
```

6. Run locally
```bash
npm run dev
```

Visit `http://localhost:8787`

### Deploy to Production
```bash
npm run deploy
```

Your CRM will be live at `https://YOUR-APP.workers.dev`

## 📊 Database Schema

**Companies**
- id, name, website, industry, created_at

**Contacts**
- id, first_name, last_name, email, phone, company_id, created_at

**Deals**
- id, company_id, title, value, stage, close_date, created_at

**Activities**
- id, contact_id, type, subject, notes, created_at

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List all companies |
| POST | `/api/companies` | Create company |
| GET | `/api/contacts` | List all contacts |
| POST | `/api/contacts` | Create contact |
| GET | `/api/deals` | List all deals |
| POST | `/api/deals` | Create deal |
| GET | `/api/dashboard` | Get dashboard stats |
| DELETE | `/api/{resource}/{id}` | Delete resource |

## 💰 Cost Analysis

**Free Tier Usage**:
- Workers: 100K requests/day
- D1: 5GB storage, 5M reads/day
- Bandwidth: Unlimited

**Estimated Production Cost**: $0-5/month for small business use

**vs Alternatives**:
- Heroku: ~$25/month
- AWS (EC2 + RDS): ~$50/month
- This solution: Free for most use cases

## 📝 What I Learned

### Developer Experience Wins
- **Setup to deployment**: < 1 hour
- **No infrastructure management**: Zero config for global distribution
- **Local dev parity**: `wrangler dev` mirrors production exactly
- **Instant deploys**: Live in seconds, not minutes

### Platform Strengths
- **Edge-first architecture**: Sub-50ms latency globally
- **Zero cold starts**: V8 isolates vs containers
- **Composable primitives**: Workers + D1 + R2 + AI with simple bindings
- **Generous free tier**: Actually usable for side projects

### Opportunities for Improvement
- **Auth story**: No built-in authentication solution
- **Observability**: Less mature than AWS CloudWatch
- **Multi-environment workflows**: Dev/staging/prod setup needs clearer docs
- **SSL provisioning**: Experienced edge case with workers.dev domain SSL handshake that required debugging

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

## 📄 License

MIT License - feel free to use this for learning or as a starter template

## 🔗 Links

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)

---

**Built with ☁️ Cloudflare Workers** | **Made in an evening to learn edge computing**