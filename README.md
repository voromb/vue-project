# vue-project
# Cártel de Coches - Gestión de Reclamaciones

Aplicación SPA desarrollada en **Vue.js 3** para gestionar las reclamaciones de clientes afectados por el cártel de fabricantes de coches en España (2006–2013).

## Descripción

El proyecto se basa en el caso real del Cártel de Coches, donde fabricantes intercambiaron información para fijar precios, afectando a millones de usuarios. La aplicación permite registrar clientes afectados, sus vehículos y gestionar el estado de sus reclamaciones.

## Funcionalidades

- **Registro de Clientes**: formulario con validación de DNI, email y teléfono.
- **Registro de Vehículos**: formulario con selects dependientes de marca/modelo, vinculado a un cliente existente.
- **Panel de Administración**: dashboard protegido con login para ver clientes, filtrar por estado, cambiar estados y consultar vehículos asociados.
- **Componentes reutilizables**: InputText, SelectField, ButtonPrimary, ModalConfirm.

## Tecnologías

- Vue.js 3 (Composition API + `<script setup>`)
- Vue Router 4
- Vite
- Google Sheets + Google Apps Script (base de datos simulada)

## Instalación

```bash
git https://github.com/voromb/vue-project.git
cd vue-project
npm install
npm run dev
```

## Estructura del proyecto

```
src/
├── components/
│   ├── InputText.vue
│   ├── SelectField.vue
│   ├── ButtonPrimary.vue
│   └── ModalConfirm.vue
├── views/
│   ├── Home.vue
│   ├── RegistroCliente.vue
│   ├── RegistroVehiculo.vue
│   ├── AdminPanel.vue
│   └── Login.vue
├── router/
│   └── index.js
├── services/
│   ├── api.js
│   └── auth.js
├── App.vue
├── main.js
└── style.css
```

## Acceso al panel de administración

- **Usuario**: admin
- **Contraseña**: admin123

## Autores

- Xavi & Voro — Desarrollo y documentación