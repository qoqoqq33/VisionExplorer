# VisionExplorer Deployment Guide

This guide explains how to deploy VisionExplorer to production using Vercel for the frontend and Render for the backend.

## Deployment Architecture

- **Frontend**: React app hosted on Vercel
- **Backend**: Express.js API hosted on Render
- **Communication**: CORS-enabled API communication between platforms

## Prerequisites

- GitHub repository with your code
- Vercel account (free tier available)
- Render account (free tier available)
- Environment variables configured

## Frontend Deployment (Vercel)

### 1. Prepare Vercel Configuration

The project includes a `vercel.json` file that:

- Builds the frontend from the `visionexplorer-frontend` directory
- Configures SPA routing for React Router
- Sets up proper headers for static assets

### 2. Deploy to Vercel

1. **Connect to Vercel**:

   ```bash
   npx vercel
   ```

2. **Configure Build Settings**:

   - Framework: Vite
   - Root Directory: `visionexplorer-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

### 3. Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Select the VisionExplorer repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `visionexplorer-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

## Backend Deployment (Render)

### 1. Prepare Backend

The project includes:

- `Dockerfile` for containerized deployment
- `render.yaml` for Render configuration
- Environment variable support

### 2. Deploy to Render

1. **Via Render Dashboard**:

   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Select the VisionExplorer repository
   - Configure:
     - Root Directory: `visionexplorer-backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   TILES_DIRECTORY=./tiles
   MAX_ZOOM_LEVEL=18
   TILE_SIZE=256
   ```

### 3. Alternative: Deploy via render.yaml

The included `render.yaml` file can be used for Infrastructure as Code deployment:

```bash
# Push your code to GitHub, then Render will auto-deploy
git push origin main
```

## Environment Variables Setup

### Frontend (.env)

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (.env)

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-url.vercel.app
TILES_DIRECTORY=./tiles
MAX_ZOOM_LEVEL=18
TILE_SIZE=256
```

## Post-Deployment Configuration

### 1. Update CORS Settings

After deploying both services:

1. Get your Vercel frontend URL
2. Update the `CORS_ORIGIN` environment variable in Render
3. Restart the Render service

### 2. Update API URL

1. Get your Render backend URL
2. Update the `VITE_API_URL` environment variable in Vercel
3. Redeploy the Vercel frontend

## Testing Deployment

### 1. Frontend Tests

- Visit your Vercel URL
- Check that the viewer loads
- Verify UI components work
- Test responsiveness

### 2. Backend Tests

- Visit `https://your-backend-url.onrender.com/api/health`
- Check tile serving: `https://your-backend-url.onrender.com/api/tiles/0/0/0.png`
- Verify CORS headers in browser dev tools

### 3. Integration Tests

- Open frontend and check browser console for API errors
- Test image loading and viewer functionality
- Verify timeline and annotation features

## Monitoring and Logs

### Vercel

- View deployment logs in Vercel dashboard
- Check function logs for any runtime errors
- Monitor performance metrics

### Render

- View service logs in Render dashboard
- Monitor CPU and memory usage
- Check health check status

## Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Verify `CORS_ORIGIN` matches your Vercel URL exactly
   - Include protocol (https://) in the URL
   - Restart Render service after changing environment variables

2. **Build Failures**:

   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

3. **API Connection Issues**:

   - Verify `VITE_API_URL` is correct
   - Check that backend is healthy at `/api/health`
   - Ensure backend is deployed and running

4. **Missing Tiles**:
   - Verify tile directory exists in backend
   - Check tile serving endpoints
   - Review file permissions if using Docker

## Performance Optimization

### Frontend

- Images are optimized during build
- Static assets are cached by Vercel CDN
- Gzip compression enabled

### Backend

- Keep-alive connections enabled
- Proper caching headers for tiles
- Environment-based configuration

## Security Considerations

- CORS properly configured for production domains
- Environment variables used for sensitive configuration
- HTTPS enforced on both platforms
- No sensitive data in client-side code

## Scaling

### Vercel

- Automatically scales based on traffic
- Edge network provides global CDN
- Free tier includes generous limits

### Render

- Free tier includes 750 hours/month
- Paid plans offer guaranteed uptime
- Auto-scaling based on CPU usage

## Backup and Recovery

- All code stored in GitHub repository
- Environment variables documented
- Deployment configurations in version control
- Database-free architecture simplifies recovery

## Cost Considerations

### Free Tier Limits

- **Vercel**: 100GB bandwidth, 6,000 build minutes
- **Render**: 750 hours/month, 512MB RAM, shared CPU

### Monitoring Usage

- Check dashboard metrics regularly
- Set up usage alerts if available
- Plan upgrades based on traffic growth
