# Proyecto 1 - Calculadora IMC  
**Cátedra:** Programación Avanzada  
**Carrera:** Ingeniería en Sistemas de Información (UTN FRVM)  
**Entrega 1** – 08/09/2025  

---

## 📌 Descripción
Este proyecto consiste en una **aplicación web para calcular el Índice de Masa Corporal (IMC)**.  
El sistema incluye:  

- **Frontend:** React + Vite (TypeScript).  
- **Backend:** NestJS (TypeScript).  
- **Infraestructura:** Servidor en Digital Ocean (Ubuntu 24.04.3 LTS), Nginx como proxy inverso y gestor de dominios con Cloudflare.  

El objetivo principal de esta entrega fue **desplegar la aplicación en un entorno accesible públicamente**, documentando el proceso y aplicando buenas prácticas de despliegue.  

---

## 🎯 Objetivo de la entrega
- Configuración del servidor de hosting.  
- Integración entre frontend y backend.  
- Documentación del proceso de despliegue.  
- Configuración de dominios y subdominios.  
- Implementación de un plan inicial de mantenimiento del servicio.  

---

# Guía de Despliegue - Calculadora IMC

## ⚙️ Guía de despliegue paso a paso

### 1. Preparación local
```bash
# Clonar repositorios
git clone https://github.com/Programacion-Avanzada-UTN-FRVM/2025_proyecto1_front_imc
git clone https://github.com/Programacion-Avanzada-UTN-FRVM/2025_proyecto1_back_imc

# Instalar dependencias
cd frontend && npm install
cd backend && npm install
```

### 2. Configuración del servidor
1. Crear un **Droplet en Digital Ocean** con Ubuntu 24.04.3 LTS.  
2. Conectarse por SSH:  
   ```bash
   ssh root@<IP_DEL_DROPLET>
   ```
3. Instalar **Node.js y npm**.  
4. Instalar **Nginx** como servidor web y proxy inverso.  

### 3. Configuración de dominios
- Configurar DNS en **Cloudflare** con registros A que apunten al Droplet:  
  - `avanzada-front.probit.com.ar` → frontend  
  - `avanzada-back.probit.com.ar` → backend  

### 4. Despliegue de la aplicación
```bash
# Clonar repos en el servidor
cd /var/www/
git clone <repo_frontend>
git clone <repo_backend>

# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
```

- Configurar **Nginx**:  
  - Frontend → servir estáticos de `dist/`.  
  - Backend → proxy inverso a `localhost:3000`.  

### 5. Mantenimiento del servicio
- Instalar **PM2**:  
  ```bash
  npm install -g pm2
  pm2 start dist/main.js --name backend
  pm2 save
  pm2 startup
  ```
- Instalar certificados HTTPS con **Certbot**.  

---

## 🚧 Problemas frecuentes y soluciones

| Problema | Causa | Solución |
|----------|--------|----------|
| El frontend no carga rutas internas | React con Vite requiere fallback a `index.html` | Configurar en `nginx.conf` la directiva `try_files $uri $uri/ /index.html;` |
| El backend se cae al cerrar la sesión SSH | El proceso queda atado a la sesión | Ejecutar con **PM2** para mantenerlo en ejecución |
| Error de comunicación front ↔ back | CORS no configurado o puertos incorrectos | Habilitar CORS en el backend (`app.enableCors()`) y revisar configuración de proxy en Nginx |
| HTTPS no funciona | Falta de certificado SSL | Instalar y configurar **Certbot** con `nginx` plugin |

---

## 👨‍💻 Equipo
- **Liendo, Alejo** – Legajo 15074 – alejoliendo2004@gmail.com  
- **Lucarelli, Bruno** – Legajo 14988 – brunolucarelli5@gmail.com  
- **Magni, Gastón** – Legajo 14991 – gastonmagni@hotmail.com  
- **Mosconi, Ignacio** – Legajo 15288 – ignamosconi@gmail.com  
- **Terreno, Valentino** – Legajo 15079 – ninot2016@gmail.com  

**Docente:** Ing. Juan Vanzetti  

---

## 📚 Bibliografía
- [Nginx Docs](https://nginx.org/en/docs/)  
- [Vite - Build for Production](https://vite.dev/guide/build.html#building-for-production)  
- [NestJS Deployment](https://docs.nestjs.com/deployment)  
- [Certbot - HTTPS Certificates](https://certbot.eff.org/instructions?ws=nginx&os=snap)  

---
