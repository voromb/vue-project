## MailHog + Backend de Email

Este proyecto usa **MailHog** como servidor SMTP de desarrollo para capturar y visualizar correos sin enviarlos realmente.

La lógica de negocio principal (Google Sheets / Google Apps Script) **no se ha modificado**; solo se ha añadido un pequeño backend para el envío de emails.

---

### 1. Componentes implicados

- **MailHog**
  - SMTP: `localhost:1025`
  - Web UI: `http://localhost:8025`

- **Backend de email (Node + Express + Nodemailer)**
  - Código en: `server/index.js`
  - Dependencias: `express`, `cors`, `nodemailer` (definidas en `server/package.json`)
  - Puerto por defecto: `4000`
  - Endpoint principal:
    - `POST /email/send`
    - Cuerpo JSON:
      - `to` (string) – destinatario
      - `subject` (string) – asunto
      - `text` (string) – cuerpo del mensaje en texto plano

- **Frontend (Vue + Vite)**
  - Configuración de proxy en `vite.config.ts`
    - `'/email-api'` → `http://localhost:4000`
  - Servicios que llaman al backend de email:
    - `src/services/mailService.js` → notificación de cambio de estado
    - `src/services/api.js` → simulación de correo al registrar un nuevo cliente

---

### 2. Flujo de envío de correos en desarrollo

1. El usuario realiza alguna acción en la app:
   - Cambia el estado de un cliente en `AdminPanel.vue`.
   - Registra un nuevo cliente en `RegistroCliente.vue`.

2. El frontend llama a los servicios:
   - `enviarNotificacionCambioEstado` (`src/services/mailService.js`)
   - `enviarSimulacionEmail` (función interna en `src/services/api.js`)

3. Estos servicios hacen una petición HTTP **desde el navegador** a:
   - `POST /email-api/email/send`

4. Vite redirige esa petición (proxy) al backend Node:
   - `http://localhost:4000/email/send`

5. El backend (`server/index.js`), usando **Nodemailer**, envía el correo vía SMTP a MailHog:
   - Host: `localhost`
   - Puerto: `1025`

6. MailHog lo almacena y muestra en su interfaz web:
   - `http://localhost:8025`

---

### 3. Cómo arrancar todo en local

1. **Arrancar MailHog**  
   Ejemplo con Docker:

   ```bash
   docker run --rm -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

2. **Arrancar el backend de email**

   Desde la carpeta `server`:

   ```bash
   cd server
   npm install
   npm start
   ```

   - Escucha en `http://localhost:4000`.
   - Usa por defecto `SMTP_HOST=localhost` y `SMTP_PORT=1025` (MailHog).

3. **Arrancar el frontend (Vite + Vue)**

   Desde la raíz del proyecto Vue (donde está `vite.config.ts`):

   ```bash
   npm install
   npm run dev
   ```

   - Normalmente en `http://localhost:5173`.
   - Las peticiones a `/email-api/...` se redirigen al backend de email.

4. **Probar el envío de correos**

   - Cambia el estado de un cliente en el panel de administración.
   - O registra un nuevo cliente.
   - Abre `http://localhost:8025` (MailHog) y comprueba que aparecen los correos.

---

### 4. Variables de entorno (opcional)

El backend de email acepta estas variables:

- `PORT` – Puerto HTTP del backend (por defecto `4000`).
- `SMTP_HOST` – Host del servidor SMTP (por defecto `localhost`).
- `SMTP_PORT` – Puerto del servidor SMTP (por defecto `1025`).
- `SMTP_USER`, `SMTP_PASS` – Credenciales SMTP (no necesarias para MailHog).

Ejemplo:

```bash
PORT=4000 SMTP_HOST=localhost SMTP_PORT=1025 npm start
```

---

### 5. Notas importantes

- **Google Sheets / Apps Script**:  
  La URL de la API (`API_URL` en `src/services/api.js`) no se ha tocado; solo se han añadido llamadas adicionales al backend de email tras operaciones exitosas.

- **Producción**:  
  Este flujo está pensado para **entorno de desarrollo** con MailHog.  
  En producción tendrías que:
  - Cambiar la configuración SMTP del backend de email a tu proveedor real.
  - O integrar el envío de correos directamente en tu backend de producción.

