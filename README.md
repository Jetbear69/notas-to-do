
# Notas To-Do 📝

Este proyecto es una aplicación web de (To-Do) para gestionar notas personales con funcionalidades de organización, etiquetado y búsqueda,
el proyecto fue contruido gracias a el aprendizaje que obtuve en el bootcamp de Cilsa en el cual este es el proyecto final y estoy satisfecho hasta el momento de lo que logré,
ademas que seguiré realizando modificaciones adicionales en un futuro.

## Características ✨
- ✅ Autenticación de usuarios  
- 📝 Crear, editar y eliminar notas  
- 🏷️ Sistema de etiquetas  
- 📌 Fijar notas importantes  
- 🔍 Búsqueda avanzada  
- 📱 Diseño responsivo  
- ⚡ Actualizaciones en tiempo real  
- 🎯 Estados de tareas (Pendiente, Completado)  

## Tecnologías Utilizadas 🛠️

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JWT (JSON Web Tokens)  
- CORS  

### Frontend
- React.js  
- React Router  
- Axios  
- CSS/SCSS  

### Base de Datos
- MongoDB  

## Instalación 🚀

### Prerrequisitos
- Node.js (v14 o superior)  
- MongoDB  
- npm o yarn  

### Configuración del Backend
1. Clonar el repositorio  
   ```bash
   git clone <url-del-repositorio>
   ```
2. Instalar dependencias  
   ```bash
   cd backend
   npm install
   ```
3. Crear archivo `.env` en la raíz del backend  
   ```env
   ACCESS_TOKEN_SECRET=tu_token_secreto
   MONGODB_URI=tu_uri_de_mongodb
   ```
4. Iniciar el servidor  
   ```bash
   npm run dev
   ```

### Configuración del Frontend
1. Navegar al directorio del frontend  
   ```bash
   cd frontend
   npm install
   ```
2. Iniciar la aplicación  
   ```bash
   npm run dev
   ```

## Estructura de la API 📡

### Endpoints de Autenticación

| Método | Ruta           | Descripción          |
|--------|----------------|----------------------|
| POST   | /create-account | Registro de usuario  |
| POST   | /login          | Inicio de sesión     |
| GET    | /get-user       | Obtener datos del usuario |

### Endpoints de Notas

| Método | Ruta                        | Descripción              |
|--------|-----------------------------|--------------------------|
| POST   | /add-note                   | Crear nota               |
| PUT    | /edit-note/:noteId          | Editar nota              |
| GET    | /get-all-notes              | Listar notas             |
| DELETE | /delete-note/:noteId        | Eliminar nota            |
| GET    | /search-notes               | Buscar notas             |
| PUT    | /update-note-status/:id     | Actualizar estado        |

## Modelos de Datos 📊

### Usuario
```json
{
  "fullName": "String",
  "email": "String",
  "password": "String",
  "createOn": "Date"
}
```

### Nota
```json
{
  "title": "String",
  "content": "String",
  "tags": ["Array"],
  "userId": "ObjectId",
  "date": "Date",
  "isPinned": "Boolean",
  "isPending": "Boolean",
  "isCompleted": "Boolean",
  "status": "String"
}
```

## Estructura del Proyecto 📁

```plaintext
proyecto/
├── backend/
│   ├── models/
│   │   ├── user.model.js
│   │   └── note.model.js
│   ├── utilities/
│   ├── config.json
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

## Funcionalidades Principales 🎯

### Gestión de Usuarios
- Registro de nuevos usuarios  
- Inicio de sesión seguro  
- Autenticación mediante JWT  
- Protección de rutas  

### Gestión de Notas
- Creación de notas con título y contenido  
- Sistema de etiquetado  
- Estados múltiples (pendiente, completado)  
- Función de fijar notas importantes  
- Búsqueda por título, contenido o etiquetas  

## Seguridad 🔒
- Autenticación mediante JWT  
- Middleware de protección de rutas  
- Validación de datos en endpoints  
- Manejo seguro de contraseñas  
- Control de acceso basado en usuarios  

## Contribución 🤝

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:
1. Fork el proyecto  
2. Crea una nueva rama  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Realiza tus cambios  
4. Commit tus cambios  
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
5. Push a la rama  
   ```bash
   git push origin feature/AmazingFeature
   ```
6. Abre un Pull Request  

## Licencia 📄
Este proyecto está bajo la Licencia MIT - ver el archivo `LICENSE.md` para más detalles.

## Contacto 📧
Erick Oliver - [@0liver.dev](https://github.com/0liver.dev) - ohuamanm@gmail.com  
Link del Proyecto: [Enlace al repositorio](https://github.com/Jetbear69/notas-to-do)
---

⌨️ con ❤️ por Oliver.dev 😊
