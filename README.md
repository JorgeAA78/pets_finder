# Pet Finder App 🐾

Aplicación web para reportar y encontrar mascotas perdidas cerca de tu ubicación.

## 🌐 URLs de Producción

- **Web App**: [https://pet-finder-app.netlify.app](https://pet-finder-app.netlify.app)
- **Colección Postman API**: [https://documenter.getpostman.com/view/pet-finder-api](https://documenter.getpostman.com/view/pet-finder-api)

## 📋 Descripción

Pet Finder permite a los usuarios:
- Registrarse y crear una cuenta
- Reportar mascotas perdidas con foto y ubicación
- Ver mascotas perdidas cerca de su ubicación
- Reportar avistamientos de mascotas
- Recibir notificaciones por email cuando alguien vea su mascota

## 🛠️ Tecnologías

### Backend
- **Node.js** con **Express**
- **TypeScript**
- **Sequelize** (ORM) con **SQLite**
- **JWT** para autenticación
- **Algolia** para búsquedas geográficas
- **Cloudinary** para almacenamiento de imágenes
- **Resend** para envío de emails

### Frontend
- **TypeScript**
- **Parcel** (bundler)
- **SCSS** para estilos
- **Mapbox GL JS** para mapas

## 📁 Estructura del Proyecto

```
pet-finder/
├── be-src/                 # Backend
│   ├── controllers/        # Controladores MVC
│   │   ├── auth-controller.ts
│   │   ├── pets-controller.ts
│   │   └── reports-controller.ts
│   ├── db/                 # Base de datos
│   │   ├── connection.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Pet.ts
│   │   │   └── Report.ts
│   │   └── index.ts
│   ├── lib/                # Servicios externos
│   │   ├── algolia.ts
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   └── resend.ts
│   └── index.ts            # Entry point
├── fe-src/                 # Frontend
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la app
│   ├── styles/             # Estilos SCSS
│   ├── router.ts           # Router SPA
│   ├── state.ts            # Estado global
│   └── index.ts            # Entry point
├── public/                 # Archivos estáticos (generado)
├── .env.template           # Template de variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/pet-finder.git
cd pet-finder
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.template .env
# Editar .env con tus credenciales
```

4. Compilar frontend:
```bash
npm run build:fe
```

5. Iniciar servidor:
```bash
npm run dev
```

## 🔧 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: 3000) |
| `SECRET_KEY` | Clave secreta para JWT |
| `ALGOLIA_APP_ID` | ID de aplicación de Algolia |
| `ALGOLIA_API_KEY` | API Key de Algolia |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `RESEND_API_KEY` | API Key de Resend |
| `MAPBOX_ACCESS_TOKEN` | Token de acceso de Mapbox |

## 📡 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario actual |
| PUT | `/api/auth/profile` | Actualizar perfil |
| PUT | `/api/auth/password` | Cambiar contraseña |

### Mascotas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pets` | Listar mascotas perdidas |
| GET | `/api/pets/nearby` | Buscar mascotas cercanas |
| GET | `/api/pets/my-pets` | Mis mascotas reportadas |
| GET | `/api/pets/:id` | Obtener mascota por ID |
| POST | `/api/pets` | Reportar mascota perdida |
| PUT | `/api/pets/:id` | Actualizar mascota |
| DELETE | `/api/pets/:id` | Eliminar reporte |
| PUT | `/api/pets/:id/found` | Marcar como encontrada |

### Reportes de Avistamiento
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/reports` | Enviar reporte de avistamiento |
| GET | `/api/reports/pet/:petId` | Reportes de una mascota |

## 📱 Pantallas de la App

1. **Home** - Página principal con solicitud de ubicación
2. **Login/Register** - Autenticación de usuarios
3. **Mascotas perdidas** - Lista de mascotas cerca de ti
4. **Reportar mascota** - Formulario para reportar mascota perdida
5. **Mis reportes** - Lista de mascotas que has reportado
6. **Editar reporte** - Modificar información de mascota
7. **Mi perfil** - Datos personales y contraseña

## 🔒 Seguridad

- Las contraseñas se almacenan hasheadas con SHA-256
- Autenticación mediante JWT tokens
- Las API keys se almacenan en variables de entorno
- CORS habilitado para solicitudes cross-origin

## 📄 Licencia

MIT License

## 👤 Autor

Desarrollado como proyecto práctico por Jor Alt
