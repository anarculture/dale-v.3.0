# Dockerfile para Frontend Next.js - Dale Rides Platform
# Usando multi-stage build para optimización de tamaño

# Stage 1: Build stage
FROM node:18-alpine as builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación
RUN pnpm build

# Stage 2: Runtime stage
FROM node:18-alpine as runtime

# Instalar dependencias del sistema runtime
RUN apk add --no-cache curl

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de build desde builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Cambiar ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Variables de entorno para runtime
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Metadata
LABEL maintainer="Dale Team" \
      version="1.0.0" \
      description="Frontend Next.js para plataforma de rides Dale" \
      node.version="18"