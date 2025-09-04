# 📄 Calculadora IMC – Despliegue Frontend

Este documento describe los pasos reproducibles para desplegar el **frontend** de la aplicación **Calculadora IMC** desarrollado en React + Vite.

---

## 🔧 Requisitos Previos
- Servidor con Ubuntu 24.04+  
- Acceso SSH habilitado  
- Node.js y npm instalados  
- Nginx instalado y habilitado  
- Dominio o subdominio configurado en DNS (por ejemplo, en Cloudflare)

---

## 🖥️ Paso 1 – Preparación Local
```bash
git clone https://github.com/brunolucarelli5/2025_proyecto1_front_imc
cd 2025_proyecto1_front_imc
npm install
npm run build
```
Esto genera la carpeta `dist/` lista para producción.

---

## 🌐 Paso 2 – Despliegue en el Servidor

1. Copiar la carpeta `dist/` al servidor:
```bash
scp -r dist/ root@<IP_DEL_DROPLET>:/var/www/frontend/
```

2. Configurar Nginx para servir los archivos estáticos:
```nginx
server {
    listen 80;
    server_name avanzada-front.probit.com.ar;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Activar configuración y reiniciar Nginx:
```bash
ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🚧 Problemas Frecuentes

| Problema | Solución |
|---------|-----------|
| El frontend no carga rutas internas | Usar `try_files $uri $uri/ /index.html;` en la configuración de Nginx |
| HTTPS no funciona | Instalar y configurar Certbot con plugin Nginx |

---

## 🌍 URL Desplegada
[https://avanzada-front.probit.com.ar](https://avanzada-front.probit.com.ar)
