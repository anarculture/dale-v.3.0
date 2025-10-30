# Deployment en Vercel - Dale Rides Platform

Vercel es la plataforma recomendada para deployment del frontend Next.js de Dale Rides Platform. Ofrece deploys automáticos, CDN global, y optimizaciones específicas para Next.js.

## ✅ Prerequisites

- [x] Cuenta en [Vercel](https://vercel.com) (gratuita)
- [x] Repositorio de código en GitHub, GitLab, o Bitbucket
- [x] Variables de entorno configuradas
- [x] Proyecto Supabase configurado

## 🚀 Deploy Rápido

### 1. Desde GitHub (Recomendado)

```bash
# 1. Conectar tu repo a Vercel
# Ir a https://vercel.com/new y seleccionar "Import Git Repository"
# Seleccionar tu repo de Dale Platform

# 2. Configurar el proyecto
Project Name: dale-frontend
Root Directory: ./ (root del repo)
Build Command: npm run build (automático)
Output Directory: .next (automático)
Install Command: npm install (automático)
```

### 2. Desde CLI de Vercel

```bash
# 1. Instalar CLI de Vercel
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

## ⚙️ Configuración Detallada

### Archivo `vercel.json`

El archivo `vercel.json` ya está configurado en el proyecto con:

```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "@google-maps-api-key"
  }
}
```

### Configuración de Variables de Entorno

1. **En el Dashboard de Vercel**:
   ```
   Project Settings > Environment Variables
   ```

2. **Variables Requeridas**:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API Key de Google Maps | ✅ |
| `NODE_ENV` | production | ✅ |
| `NEXT_PUBLIC_API_URL` | URL del backend API | ✅ |

3. **Configurar Environment**:
   - **Production**: Variables reales de producción
   - **Preview**: Variables de staging/testing
   - **Development**: Variables locales

### Configuración de Dominio Personalizado

1. **En Vercel Dashboard**:
   ```
   Project Settings > Domains
   ```

2. **Agregar Dominio**:
   ```
   tu-dominio.com
   www.tu-dominio.com
   ```

3. **Configurar DNS** (en tu proveedor de dominio):
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### Configuración de Build

El build se configura automáticamente, pero puedes personalizar:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev"
}
```

## 🔒 Configuración de Seguridad

### Headers de Seguridad

Ya configurados en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.googleapis.com"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Edge Functions

Configuración de edge functions en `vercel.json`:

```json
{
  "functions": {
    "frontend/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 📊 Monitoreo y Analytics

### Analytics de Vercel

```bash
# Habilitar en Dashboard
Project Settings > Analytics
```

### Sentry Integration

1. **Instalar Sentry**:
```bash
cd frontend
npm install @sentry/nextjs
```

2. **Configurar**:
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🔄 CI/CD con GitHub Actions

### Workflow de Deploy Automático

```yaml
# .github/workflows/vercel-deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build
        run: |
          cd frontend
          npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🌐 Configuración Multi-Entorno

### Environments

```bash
# Development
vercel dev

# Preview (staging)
vercel

# Production
vercel --prod
```

### Variables por Entorno

```bash
# Production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

## 🐛 Troubleshooting

### Build Failures

**Problema**: `Build failed`
```bash
# Solución: Verificar build localmente
cd frontend
npm run build

# Verificar logs de build
vercel logs --follow
```

### Environment Variables

**Problema**: Variables no cargadas
```bash
# Verificar configuración
vercel env ls

# Re-deploy para recargar variables
vercel --prod
```

### DNS Issues

**Problema**: Dominio no resuelve
```bash
# Verificar DNS
nslookup tu-dominio.com

# Flush DNS cache
sudo dscacheutil -flushcache
```

### Performance Issues

**Problema**: Site lento
```bash
# Verificar Analytics en Vercel
# Project Settings > Analytics

# Optimizar imágenes
# Usar next/image component

# Optimizar bundle
# npm run analyze
```

## 📈 Optimizaciones Específicas

### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: [
      'sydhgjtsgqyglqulxfvh.supabase.co',
      'tu-storage-bucket.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
};
```

### Bundle Analysis

```bash
# Analizar bundle
cd frontend
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build
```

### Edge Runtime

```javascript
// API Routes en Edge
export const runtime = 'edge';

export async function GET(request) {
  return new Response('Hello from the Edge!');
}
```

## 🔗 Links Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Edge Functions](https://vercel.com/docs/edge-network/edge-functions)

## 📞 Soporte

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

---

**Última actualización**: Diciembre 2024
**Compatible con**: Next.js 14+, Vercel CLI v34+
