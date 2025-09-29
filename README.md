<img width="1024" height="710" alt="imagen" src="https://github.com/user-attachments/assets/5a7864e0-7541-4eee-8c8a-d04f28578146" /># 📄 Calculadora IMC – Despliegue Frontend

Este documento describe los pasos reproducibles para desplegar el *frontend* de la aplicación *Calculadora IMC, desarrollado en **React + Vite*. También incluye información sobre la configuración de los gráficos y visualización de estadísticas.

---

## 🔧 Requisitos Previos

* Servidor con Ubuntu 24.04+
* Acceso SSH habilitado
* Node.js y npm instalados
* Nginx instalado y habilitado
* Dominio o subdominio configurado en DNS (por ejemplo, en Cloudflare)

---

## 🖥️ Paso 1 – Preparación Local

bash
git clone https://github.com/brunolucarelli5/2025_proyecto1_front_imc
cd 2025_proyecto1_front_imc
npm install
npm run build


Esto genera la carpeta dist/ lista para producción.

---

## 🌐 Paso 2 – Despliegue en el Servidor

1. Copiar la carpeta dist/ al servidor:

bash
scp -r dist/ root@<IP_DEL_DROPLET>:/var/www/frontend/


2. Configurar Nginx para servir los archivos estáticos:

nginx
server {
    listen 80;
    server_name avanzada-front.probit.com.ar;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}


3. Activar configuración y reiniciar Nginx:

bash
ln -s /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx


---

## 📊 Dashboard y Estadísticas

El *Dashboard* es el componente principal donde el usuario puede visualizar su historial de *IMC y peso* de manera gráfica y estadística.
<img width="1024" height="710" alt="imagen" src="https://github.com/user-attachments/assets/2b2a2062-da90-4deb-b8c4-25d7cf3a06e7" />

### Datos que muestra:

* *Evolución temporal* de IMC y peso mediante un *gráfico de líneas*.

  * Cada cálculo del historial se representa en el eje X por fecha (historiales.map(item => item.fecha_calculo)), y en el eje Y por IMC o peso.
  * Se utilizan ejes separados (y para IMC, y1 para peso) para mantener escalas independientes.
  * Los datasets tienen colores diferenciados y transparencia para mejorar la legibilidad.

* *Conteo de cálculos por categoría de IMC* mediante un *gráfico de barras*.

  * Categorías: Bajo peso, Normal, Sobrepeso y Obeso.
  * Cada barra representa la cantidad de cálculos por categoría.
  * Los valores se muestran como enteros para mayor claridad.
  * El dataset proviene del objeto categorias recibido del backend (categorias.cantBajoPeso, etc.).

* *Estadísticas agregadas* de IMC y peso:

  * Promedio y desviación estándar, accesibles desde estadisticasImc y estadisticasPeso.
  * Presentadas como texto en cards encima de los gráficos.

### Configuración de Chart.js:

* Los gráficos se construyen usando *react-chartjs-2* y Chart.js.
* Se registran escalas y elementos necesarios (CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend).
* Los gráficos son responsivos y mantienen la proporción definida (maintainAspectRatio: false).
* Los gráficos de líneas permiten interacción por índice (interaction: { mode: "index", intersect: false }).

---

## 🚧 Problemas Frecuentes

| Problema                              | Solución                                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| El frontend no carga rutas internas   | Usar try_files $uri $uri/ /index.html; en la configuración de Nginx                                     |
| HTTPS no funciona                     | Instalar y configurar Certbot con plugin Nginx                                                            |
| Gráficos no se muestran correctamente | Asegurarse que react-chartjs-2 y chart.js estén instalados y que los datos del backend sean correctos |

---

## 🌍 URL Desplegada

[https://avanzada-front.probit.com.ar](https://avanzada-front.probit.com.ar)
