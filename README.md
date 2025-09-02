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

## ⚙️ Proceso de despliegue
1. **Preparación inicial**  
   - Fork y clonación de repositorios.  
   - Instalación de dependencias.  

2. **Servidor y dominios**  
   - Creación de Droplet en Digital Ocean.  
   - Configuración de DNS en Cloudflare.  
   - Subdominios:  
     - Frontend: `https://avanzada-front.probit.com.ar`  
     - Backend: `https://avanzada-back.probit.com.ar`  

3. **Despliegue**  
   - Compilación de frontend (`npm run build`).  
   - Compilación de backend (`npm run build`).  
   - Configuración de Nginx para servir el frontend y actuar como proxy inverso para el backend.  

4. **Mantenimiento**  
   - Uso de **PM2** para mantener el backend en ejecución permanente.  
   - Configuración de reinicio automático.  
   - Certificados HTTPS con **Certbot**.  

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
