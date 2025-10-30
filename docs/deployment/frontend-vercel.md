# Frontend (Vercel)

## 🎯 Visión General

Vercel es la plataforma ideal para desplegar aplicaciones Next.js como Dale. Proporciona deployment automático desde Git, CDN global, optimizaciones automáticas y una experiencia de desarrollo excepcional.

## 📋 Prerrequisitos

Antes de desplegar, asegúrate de tener:

- [ ] ✅ Cuenta en [Vercel](https://vercel.com) (gratuita)
- [ ] ✅ Repositorio en GitHub/GitLab/Bitbucket
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Build exitoso en local (`npm run build`)

## 🚀 Deployment Paso a Paso

### 1. 🔗 Conectar Repositorio

#### Opción A: Desde el Dashboard de Vercel

1. **Acceder a Vercel**: Ve a [vercel.com](https://vercel.com) e inicia sesión
2. **Nuevo Proyecto**: Click en "New Project"
3. **Importar Git Repository**: 
   - Selecciona tu proveedor de Git (GitHub, GitLab, Bitbucket)
   - Autoriza acceso si es necesario
   - Selecciona tu repositorio `dale-app`
4. **Configurar Proyecto**:
   - **Project Name**: `dale-frontend` (o el nombre que prefieras)
   - **Framework Preset**: Next.js (detección automática)
   - **Root Directory**: `frontend/` (importante: no la raíz)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)
   - **Install Command**: `npm install` (automático)

#### Opción B: Desde GitHub

1. **Install Vercel GitHub App**: 
   - Ve a [Vercel for GitHub](https://github.com/apps/vercel)
   - Click "Install" para tu cuenta
   - Selecciona los repositorios

2. **Deploy**:
   - Ve al repositorio en GitHub
   - Click en "Actions" tab
   - Deploy se ejecutará automáticamente

### 2. ⚙️ Configuración de Variables de Entorno

Una vez importado el proyecto, configura las variables de entorno:

#### Variables de Entorno en Vercel

Ve a **Settings** → **Environment Variables** y añade:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
# Para desarrollo: http://localhost:8000
# Para producción: https://your-backend.railway.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

#### Protección de Variables

- ✅ **Privadas**: Solo accesible en el servidor
- ✅ **Sensibles**: Como API keys, protegidas automáticamente
- ✅ **Automatic**: Configuradas desde GitHub Secrets

### 3. 🚀 Deploy Inicial

1. **Deploy**: Click "Deploy" después de configurar las variables
2. **Build Process**: Vercel construye automáticamente:
   ```bash
   npm ci
   npm run build
   ```
3. **Preview URL**: Obtendrás una URL como `https://dale-frontend-xxx.vercel.app`
4. **Custom Domain**: (Opcional) Configurar dominio personalizado

### 4. 🌐 Configuración de Dominio Personalizado

#### Añadir Dominio

1. **Settings** → **Domains**
2. **Add Domain**: Introduce tu dominio (ej: `dale-app.com`)
3. **DNS Configuration**: Configura DNS:

```dns
# Registro A (apunta a Vercel)
A     @         76.76.19.61
AAAA  @         2606:4700:90:0:f22e:fbec:5bed:a9b9

# Registro CNAME (alternativa)
CNAME www       cname.vercel-dns.com
```

#### Configuración HTTPS

- ✅ **Automático**: Vercel proporciona SSL/TLS gratis
- ✅ **Let's Encrypt**: Renovación automática
- ✅ **HSTS**: Configuración de seguridad automática

## 🔧 Configuración Avanzada

### 📁 vercel.json Configuration

Crea `vercel.json` en el directorio `frontend/`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.dale-app.com/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "functions": {
    "src/pages/api/**/*.js": {
      "maxDuration": 10
    }
  },
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/backend/:path*",
      "destination": "https://api.dale-app.com/:path*"
    }
  ]
}
```

### 🔄 Git Integration

#### Deployment por Branch

```json
// .vercelignore (en frontend/)
# Solo deploy el frontend
frontend/
!frontend/**
```

#### Environment per Branch

| Branch | Environment | URL |
|--------|-------------|-----|
| `main` | Production | https://dale-app.com |
| `develop` | Preview | https://develop.dale-app.vercel.app |
| `feature/*` | Preview | https://feature-xxx.dale-app.vercel.app |

### 📊 Performance Optimization

#### Automatic Optimizations

Vercel aplica automáticamente:

- ✅ **Static Generation**: Páginas pre-renderizadas
- ✅ **Image Optimization**: WebP, lazy loading
- ✅ **Code Splitting**: Bundle optimization
- ✅ **CDN**: Edge locations globales
- ✅ **HTTP/2**: Push, server push
- ✅ **Compresión**: Gzip/Brotli automática

#### Manual Optimizations

```javascript
// next.config.js optimizaciones
const nextConfig = {
  // Compresión adicional
  compress: true,
  
  // Optimización de imágenes
  images: {
    domains: ['supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
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

module.exports = nextConfig;
```

## 🔍 Monitoreo y Analytics

### 📊 Vercel Analytics

1. **Enable Analytics**: Settings → Analytics
2. **Metrics Disponibles**:
   - Core Web Vitals (LCP, FID, CLS)
   - Page Views
   - Unique Visitors
   - Performance Scores

#### Configurar Analytics

```javascript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### 📈 Real User Monitoring (RUM)

```javascript
// lib/analytics.ts
export const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: eventName,
      ...properties
    });
  }
};

// Uso en componentes
const handleRideSearch = (filters) => {
  trackEvent('ride_search', {
    from_city: filters.from_city,
    to_city: filters.to_city,
    date: filters.date
  });
};
```

### 🚨 Error Tracking

#### Sentry Integration

```bash
# Instalar Sentry
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

```javascript
// sentry.server.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

## 🛡️ Seguridad

### 🔒 Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.supabase.co; font-src 'self';"
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 🔐 Environment Variables Security

#### Variables Públicas vs Privadas

```env
# Públicas (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Privadas (sin prefix)
SENTRY_DSN=https://xxx@sentry.io/xxx
ANALYTICS_ID=GA_xxx
```

#### Restringir Acceso

```bash
# Vercel CLI restrict environment
vercel env add NEXT_PUBLIC_API_URL production preview development
```

## 🔄 CI/CD con GitHub Actions

### .github/workflows/deploy-frontend.yml

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [main, develop]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  Deploy-Preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

  Deploy-Production:
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Configurar GitHub Secrets

1. **VERCEL_TOKEN**: 
   - Generar en [Vercel Account Settings](https://vercel.com/account/tokens)
   - Añadir en GitHub repository secrets

2. **VERCEL_ORG_ID** y **VERCEL_PROJECT_ID**:
   ```bash
   # Obtener IDs
   vercel link
   ```

## 🧪 Testing en Producción

### 🔍 Health Checks

```javascript
// pages/api/health.ts
export default function handler(req, res) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
}
```

### 🧪 Smoke Tests

```bash
#!/bin/bash
# tests/smoke-test.sh

echo "🏃‍♂️ Running smoke tests..."

# Test homepage
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.vercel.app)
if [ $STATUS -eq 200 ]; then
    echo "✅ Homepage is working"
else
    echo "❌ Homepage failed with status $STATUS"
    exit 1
fi

# Test API proxy
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.vercel.app/api/health)
if [ $STATUS -eq 200 ]; then
    echo "✅ API proxy is working"
else
    echo "❌ API proxy failed with status $STATUS"
    exit 1
fi

echo "✅ All smoke tests passed!"
```

## 📊 Performance Monitoring

### 🏎️ Core Web Vitals

```javascript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Enviar a Google Analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}

// Medir y enviar métricas
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 📈 Custom Metrics

```javascript
// Track ride booking conversion
const trackBookingConversion = (rideId) => {
  // Track start of booking process
  gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: 25.00,
    items: [{
      item_id: rideId,
      item_name: 'Ride Booking',
      category: 'Transportation',
      quantity: 1,
      price: 25.00
    }]
  });
};
```

## 🐛 Troubleshooting

### ❌ Common Issues

#### Build Failures

**Error**: `Build failed`

```bash
# Debug build locally
cd frontend
npm run build

# Check for TypeScript errors
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run build
```

#### Environment Variables Not Loading

**Problema**: Variables undefined en producción

```javascript
// Debug en _app.tsx
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Verificar en Vercel dashboard
// Settings → Environment Variables
```

#### CORS Errors

**Problema**: API calls blocked

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ];
},
```

#### Images Not Loading

**Problema**: Broken images

```javascript
// next.config.js
images: {
  domains: [
    'supabase.co',
    'your-project.supabase.co',
    'avatars.githubusercontent.com'
  ],
  formats: ['image/webp', 'image/avif']
}
```

### 🔍 Debug Commands

```bash
# Ver logs de build
vercel logs [deployment-url]

# Local development con producción
vercel dev

# Pull environment from Vercel
vercel env pull .env.local

# Inspect deployment
vercel inspect [deployment-url]
```

## ✅ Checklist de Deployment

Antes de considerar el deployment completo:

- [ ] ✅ **Vercel account** configurada y conectada
- [ ] ✅ **Git repository** integrado
- [ ] ✅ **Environment variables** configuradas
- [ ] ✅ **Build successful** en local
- [ ] ✅ **Domain configured** (opcional)
- [ ] ✅ **SSL certificate** activo
- [ ] ✅ **Performance metrics** dentro de rangos aceptables
- [ ] ✅ **Analytics** configurado
- [ ] ✅ **Error tracking** implementado
- [ ] ✅ **Health checks** funcionando
- [ ] ✅ **Smoke tests** pasando
- [ ] ✅ **CI/CD** pipeline configurado

## 🎯 Optimizaciones Adicionales

### 🚀 Advanced Performance

```javascript
// next.config.js
module.exports = {
  // Prioridades de recursos
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react']
  },
  
  // Compresión
  compress: true,
  
  // Service Worker para caching
  swcMinify: true,
  
  // Bundle analyzer (solo en desarrollo)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src')
      };
    }
    return config;
  }
};
```

### 📱 PWA Optimizations

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // Configuración adicional
  experimental: {
    pwa: true
  }
});
```

## 🎉 Post-Deployment

### 🔍 Monitoring Setup

1. **Vercel Dashboard**: Monitoreo de performance
2. **Google Analytics**: User behavior tracking
3. **Sentry**: Error monitoring
4. **Custom Monitoring**: Health checks automatizados

### 📊 Success Metrics

Métricas clave a monitorear:

- **Build Time**: < 5 minutos
- **First Contentful Paint**: < 2 segundos
- **Largest Contentful Paint**: < 2.5 segundos
- **Time to Interactive**: < 3 segundos
- **Core Web Vitals**: "Good" rating

### 🔄 Continuous Improvement

```javascript
// Optimizaciones continuas
const improvements = [
  'Bundle size reduction',
  'Image optimization',
  'Code splitting',
  'Caching strategies',
  'Performance monitoring'
];
```

---

## 📞 Soporte

¿Problemas con el deployment en Vercel?

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Discord](https://vercel.com/discord)
- 🐛 [GitHub Issues](https://github.com/dale/app/issues)

---

> **🚀 Tip**: Vercel es perfecto para Next.js y ofrece las mejores optimizaciones automáticas. Aprovecha el deployment continuo y las preview URLs para facilitar el review de features. ¡Happy deploying! ⚡