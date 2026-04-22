# Coolify Deployment Guidelines for Samyak.org

This guide outlines the steps to successfully deploy the **samyak.org** Next.js application using Coolify with the provided Docker and Docker Compose configuration.

## Prerequisites

- A running Coolify instance.
- Access to your GitHub repository (`samyakv2`).
- Your production environment variables (e.g., `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).

## 1. Project Setup in Coolify

1. Log in to your Coolify dashboard.
2. Go to your **Project** and select your **Environment** (e.g., Production).
3. Click on **Add New Resource** and choose **Application**.
4. Select your GitHub integration (Private or Public Repository).
5. Choose the `Nolimitslarrat/samyakv2` repository and the `main` branch.

## 2. Configuration

Once the repository is linked, configure the deployment settings:

- **Build Pack:** Choose **Docker Compose** as the build pack. Coolify will automatically read the `docker-compose.yml` file in the root of the repository.
- **Base Directory:** `/` (root)
- **Docker Compose File:** `docker-compose.yml`

## 3. Environment Variables

Before deploying, you must configure the environment variables required by the application.

1. Navigate to the **Environment Variables** tab in your Coolify application settings.
2. Add all necessary variables from your local `.env` file. Do **NOT** copy development URLs (like localhost).
   
   **Key Variables Required:**
   - `DATABASE_URL`: Your production PostgreSQL database connection string.
   - `NEXTAUTH_URL`: The public URL of your deployed application (e.g., `https://samyak.org`).
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth encryption.
   - Any other API keys configured in your local environment.

## 4. Prisma Database Migrations

The provided `Dockerfile` includes `npx prisma generate` to build the Prisma client during the image build phase. However, **it does not automatically run database migrations** (`npx prisma migrate deploy`). 

To migrate your production database:
1. **Manual Execution (Recommended):** Run the migration command from your local machine, pointing to your production database URL.
   ```bash
   DATABASE_URL="your_production_db_url_here" npx prisma migrate deploy
   ```
2. **Via Coolify Terminal:** Once the app container is running, open the Coolify terminal for your application service and execute:
   ```bash
   npx prisma migrate deploy
   ```

## 5. Deployment

1. Once the environment variables are set, click the **Deploy** button.
2. Coolify will fetch the code, build the Next.js multi-stage Docker image, and spin up the container.
3. You can monitor the build logs in the **Deployments** tab.

## 6. Domain Configuration

1. After a successful deployment, navigate to the **Configuration** tab.
2. Under **Domains**, specify your custom domain (e.g., `https://samyak.org`).
3. Make sure your DNS records (A/CNAME) at your domain registrar are pointing to your Coolify server's public IP address.
4. Coolify will automatically provision an SSL certificate via Let's Encrypt for your domain.

## Troubleshooting

- **Database Connection Errors:** Verify that your Coolify server's IP address is whitelisted if you are using an external managed database (like Supabase, Neon, or Render).
- **500 Errors on Authentication:** Double-check that your `NEXTAUTH_URL` exactly matches the custom domain you configured in Coolify, and that your `NEXTAUTH_SECRET` is set.
- **Prisma Client Issues:** The Dockerfile explicitly copies the generated Prisma client into the standalone Next.js build. If the app complains about missing models, ensure `output: 'standalone'` remains in your `next.config.js`.
