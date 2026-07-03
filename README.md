# Shop.co Product Catalogue & Quote Generator

MERN assignment project for browsing products, adding them to cart, creating quotes, printing quote summaries, and optionally syncing products/quotes with Zoho CRM.

## Tech Stack

- React + Vite
- Tailwind CSS
- Axios
- Node.js + Express
- MongoDB + Mongoose
- Zoho CRM API

## Features

- Login and signup before accessing catalogue, cart, or quotes
- Product catalogue with category/type filter
- Product detail page
- Cart with quantity update and remove action
- Quote creation from cart items
- Quote list and printable quote detail
- Zoho CRM product fetch and quote sync through backend

## Project Structure

```txt
Shop.co 3
├── backend
│   ├── controller
│   ├── data
│   ├── database
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── Dockerfile
│   └── index.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── utils
│   └── Dockerfile
└── docker-compose.yml
```

## Local Setup

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open:

```txt
http://localhost:5173
```

Backend runs on:

```txt
http://localhost:5002
```

## Environment Variables

Backend `.env`:

```env
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/shopco_quote_task
PORT=5002
JWT_SECRET=replace_with_a_strong_secret

USE_ZOHO=false
ZOHO_REFRESH_TOKEN=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
ZOHO_API_BASE_URL=https://www.zohoapis.in
ZOHO_CRM_BASE_URL=https://crm.zoho.in
ZOHO_DEALER_ID=
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5002/api
```

Do not commit real `.env` files.

## Zoho CRM Setup

Keep `USE_ZOHO=false` for normal local testing with Mongo/sample products.

For Zoho CRM:

1. Create a Zoho API Console client.
2. Use these scopes:

```txt
ZohoCRM.modules.products.READ,ZohoCRM.modules.quotes.ALL,ZohoCRM.coql.READ
```

3. Generate a grant code with offline access.
4. Exchange the code for a refresh token:

```bash
curl --request POST "https://accounts.zoho.in/oauth/v2/token" \
  --data "grant_type=authorization_code" \
  --data "client_id=YOUR_CLIENT_ID" \
  --data "client_secret=YOUR_CLIENT_SECRET" \
  --data "redirect_uri=YOUR_REDIRECT_URI" \
  --data "code=YOUR_GRANT_CODE"
```

5. Put `refresh_token`, client ID, client secret, and API domain in `backend/.env`.
6. Set `USE_ZOHO=true`.
7. Restart the backend.

Use `.com` Zoho URLs only if your CRM account is on the US data center:

```env
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_BASE_URL=https://www.zohoapis.com
ZOHO_CRM_BASE_URL=https://crm.zoho.com
```

## Docker

Run the full app with MongoDB:

```bash
docker compose up --build
```

Docker starts:

- Frontend: `http://localhost`
- Backend: proxied through `/api`
- MongoDB: internal Docker service

Docker reads backend environment variables from `backend/.env`. Keep real secrets on the server only, not in GitHub.

## EC2 Deployment

1. Launch an Ubuntu EC2 instance.
2. In the security group, allow inbound ports:

```txt
22  SSH
80  HTTP
```

3. SSH into the instance:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

4. Install Docker and Docker Compose V2:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker
```

5. Clone and run the project:

```bash
git clone https://github.com/stymrj/shopco-quote-generator.git
cd shopco-quote-generator
cp backend/.env.production.example backend/.env
nano backend/.env
docker compose up -d --build
```

For EC2 live Zoho deployment, fill these values in `backend/.env`:

```env
CLIENT_URL=http://YOUR_EC2_PUBLIC_IP
PORT=5002
JWT_SECRET=replace_with_a_strong_secret
USE_ZOHO=true
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
ZOHO_API_BASE_URL=https://www.zohoapis.in
ZOHO_CRM_BASE_URL=https://crm.zoho.in
ZOHO_DEALER_ID=
```

Docker Compose uses the internal MongoDB container with `mongodb://mongo:27017/shopco_quote_task`.

6. Open the app:

```txt
http://YOUR_EC2_PUBLIC_IP
```

Useful server commands:

```bash
docker compose ps
docker compose logs -f backend
docker compose down
```

## Main APIs

```txt
POST   /api/signup
POST   /api/login
GET    /api/me
POST   /api/logout

GET    /api/products
GET    /api/products/types
GET    /api/products/:id
GET    /api/products/:id/photo
POST   /api/products/seed

POST   /api/quotes
GET    /api/quotes
GET    /api/quotes/:id
```

## Interview Explanation

- React components are separated into pages and reusable UI components.
- Frontend API calls are kept in `frontend/src/api.js` using Axios.
- Authentication uses JWT stored in an HTTP-only cookie.
- Protected Express routes use `isLoggedIn` middleware.
- Product APIs read from Zoho CRM when `USE_ZOHO=true`; otherwise they use MongoDB and bundled sample products.
- Quote creation saves the quote in MongoDB and syncs to Zoho Quotes when Zoho is enabled.
- The quote detail page uses `window.print()` for printable order summaries.
