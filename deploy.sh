#!/bin/bash

# 🚀 Script de Deployment Dale PWA
# Ejecute este script para activar el deployment en Vercel

echo "🚀 Configurando deployment de Dale PWA..."

# 1. Ir al directorio del proyecto
cd /path/to/your/dale-project

# 2. Configurar remote con token si es necesario
# Si no tienes permisos, puedes usar tu token personal de GitHub:
# export GITHUB_TOKEN="tu_token_personal_aqui"
# git remote set-url origin https://$GITHUB_TOKEN@github.com/anarculture/dale-v.3.0.git

# 3. Crear el vercel.json optimizado (reemplazar el existente)
cat > vercel.json << 'EOF'
{
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://sydhgjtsgqyglqulxfvh.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZGhnanRzZ3F5Z2xxdWx4ZnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjAwNzMsImV4cCI6MjA3NzI5NjA3M30.0SnYKxc2_bbU_yMKp_rkKV7R5eyE32qZgETFAWrOqCg",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk"
  }
}
EOF

# 4. Agregar y hacer commit
git add vercel.json
git commit -m "fix: resolve Vercel build/function conflict

- Replace legacy builds+functions with modern framework config
- Configure Next.js with HeroUI components
- Set environment variables for Supabase and Google Maps"

# 5. Hacer push (activará Vercel automáticamente)
echo "📤 Haciendo push a GitHub..."
git push origin main

echo "✅ ¡Deployment iniciado!"
echo "🔗 Ve a tu dashboard de Vercel para ver el progreso:"
echo "   https://vercel.com/anarcultures-projects/dale-v-3-0"
echo ""
echo "📱 Una vez completado, obtienes la URL de producción."
echo "⚡ El build toma 2-3 minutos aproximadamente."