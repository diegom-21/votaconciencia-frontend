# Frontend de Administración - VotaConciencia

Este es el frontend de administración para la plataforma VotaConciencia. Proporciona una interfaz de usuario para la gestión de contenido, incluyendo candidatos, propuestas, recursos educativos y más.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- Backend de VotaConciencia en ejecución

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/votaconciencia.git
cd frontend/votaconcienciafront
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de configuración de ejemplo:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en el archivo `.env`:
```
VITE_API_URL=http://localhost:3000  # URL del backend
```

## Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción para Producción

Para crear una versión de producción:

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`.

## Variables de Entorno

- `VITE_API_URL`: URL base para las llamadas a la API del backend. Por defecto es `http://localhost:3000`.

## Tecnologías Principales

- React.js
- Vite
- Tailwind CSS
- Axios para llamadas a la API
- React Router para navegación

## Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
├── contexts/        # Contextos de React
├── hooks/          # Custom hooks
├── pages/          # Componentes de página
├── services/       # Servicios y llamadas a API
├── utils/          # Utilidades y helpers
├── App.jsx         # Componente principal
└── main.jsx        # Punto de entrada
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción

## Contribuir

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
