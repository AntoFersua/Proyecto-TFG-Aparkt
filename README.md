<p align="center">
  <img src="app/views/assets/imagotipoAparkt.png" alt="Aparkt Logo" width="400"/>
</p>

<h1 align="center">🚗 APARKT</h1>

<p align="center">
  <strong>Encuentra aparcamiento en vía pública mediante colaboración ciudadana</strong>
  <br>
  <em>Find on-street parking through citizen collaboration</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-en%20desarrollo-yellow?style=flat-square&logo=statuspage" alt="Estado">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&logo=open-source-initiative" alt="Licencia">
  <img src="https://img.shields.io/badge/PHP-8.x-777BB4?style=flat-square&logo=php" alt="PHP">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Mapbox-GL%20JS-000000?style=flat-square&logo=mapbox" alt="Mapbox">
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript" alt="JavaScript">
</p>

---

## 📋 Tabla de Contenidos / Table of Contents

- [📖 Sobre el Proyecto](#-sobre-el-proyecto)
- [✨ Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación](#️-instalación)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🌐 API Endpoints](#-api-endpoints)
- [👥 Equipo](#-equipo)
- [📄 Licencia](#-licencia)

---

## 📖 Sobre el Proyecto

**Aparkt** es un Trabajo de Fin de Grado (TFG) que consiste en una plataforma colaborativa para la **búsqueda de aparcamientos en vía pública en tiempo real**.

Los usuarios pueden:
- Registrar plazas de aparcamiento libres y ocupadas en un **mapa interactivo**
- Obtener **puntos y recompensas** por contribuir
- Gestionar sus **vehículos** y preferencias
- Disfrutar de una experiencia **multilingüe** (Español, English, Français, Deutsch)
- Usar **modo oscuro** para una experiencia visual óptima

> *"La comunidad encuentra el mejor sitio para aparcar."*

---

## ✨ Características

### 🗺️ Mapa Interactivo
- Renderizado 3D con **Mapbox GL JS** (proyección globo)
- Geocodificación inversa: haz clic en cualquier punto del mapa y obtén la dirección
- Búsqueda de direcciones con autocompletado
- Marcadores personalizados para usuarios y anunciantes
- Zonas coloreadas (rojo/verde) para estado de las plazas
- Centrado en **Teatinos, Málaga** (ampliable a más ciudades)

### 👤 Sistema de Usuarios
- Registro multi-paso con validación cliente/servidor
- Inicio de sesión seguro con sesiones PHP
- Recuperación y cifrado de contraseñas (`password_hash` / `password_verify`)
- Regeneración de sesión post-login
- Perfil de usuario con puntuación

### 🚙 Gestión de Vehículos
- Registro de vehículos (turismo, ranchera, todoterreno, monovolumen, furgoneta, otro)
- Clasificación por tamaño (pequeño, mediano, grande)
- Asociación de vehículos a plazas de aparcamiento

### 🅿️ Gestión de Plazas de Aparcamiento
- CRUD completo de plazas (`PlazaAparcamientoController`)
- Almacenamiento espacial con tipo `POINT` de MySQL
- Filtros por zona, usuario y estado (ocupado/libre)
- Reporte en tiempo real del estado de cada plaza

### ⭐ Sistema de Puntuación
- **+100 pts** por crear una plaza
- **+50 pts** por ocupar una plaza
- **+150 pts** por liberar una plaza
- Historial completo de puntuaciones
- Las puntuaciones nunca pueden ser negativas
- Modal interactivo para consultar puntos y recompensas

### 🌙 Modo Oscuro
- Alternancia manual con iconos sol/luna
- Persistencia en `localStorage`
- Sigue la preferencia del sistema por defecto
- Variables CSS personalizadas para cada tema

### 🌐 Internacionalización (i18n)
- **4 idiomas** soportados:
  - 🇪🇸 Español
  - 🇬🇧 English
  - 🇫🇷 Français
  - 🇩🇪 Deutsch
- Traducciones en `translations.json` (814+ entradas)
- Selector de idioma modal
- Persistencia en `localStorage`
- Atributos `data-i18n` en toda la interfaz

### 📱 Diseño Responsive
- Enfoque *mobile-first*
- Breakpoints en 768px y 900px
- Contenedores tipo "teléfono" para login/signup

### 🎬 Animaciones
- **GSAP** + **ScrollTrigger** para animaciones fluídas al hacer scroll
- Carrusel **OwlCarousel2** en la landing page
- Transiciones suaves entre secciones

---

## 🛠️ Tecnologías

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" width="16" height="16"> **PHP** | 8.x | Lenguaje principal, sin frameworks |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="16" height="16"> **MySQL** | 8.0 | Base de datos con soporte espacial (`POINT`) |
| **PDO** | — | Conexión segura a la base de datos |
| **Apache** | — | Servidor web (XAMPP) |
| **Sessions** | — | Autenticación y manejo de sesiones |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="16" height="16"> **JavaScript** | ES6 (Módulos) | Lógica de interfaz y componentes Web |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="16" height="16"> **HTML5** | — | Estructura semántica |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="16" height="16"> **CSS3** | — | Estilos con variables CSS y temas |

### Librerías Externas (CDN)

| Librería | Propósito |
|---|---|
| [**Mapbox GL JS**](https://docs.mapbox.com/mapbox-gl-js/) v3.20.0 | Mapa interactivo 3D con proyección globo |
| [**Turf.js**](https://turfjs.org/) | Análisis geoespacial (círculos, buffers, cálculo de distancias) |
| [**GSAP**](https://gsap.com/) + ScrollTrigger | Animaciones y efectos al hacer scroll |
| [**OwlCarousel2**](https://owlcarousel2.github.io/) | Carrusel de imágenes en la landing page |
| [**jQuery**](https://jquery.com/) 3.7.1 | Soporte para OwlCarousel2 |
| [**JustValidate**](https://just-validate.dev/) | Validación de formularios en cliente |
| [**Google Fonts (Roboto)**](https://fonts.google.com/specimen/Roboto) | Tipografía principal |

---

## 📁 Estructura del Proyecto

```
📦 APARKT
├── 📄 .env                          # Variables de entorno (API keys)
├── 📄 .env.example                  # Plantilla para .env
├── 📄 aparktbd.sql                  # Esquema completo de la BD
├── 📄 pachage.json                  # (reservado para futuras dependencias npm)
│
├── 📁 app/
│   ├── 📁 config/
│   │   └── config.php               # Endpoint público para API keys
│   ├── 📁 controllers/              # Controladores PHP
│   │   ├── LoginController.php      #   Inicio de sesión
│   │   ├── SignupController.php     #   Registro de usuarios
│   │   ├── Logout.php               #   Cierre de sesión
│   │   ├── MeController.php         #   Estado de sesión
│   │   ├── VehiculoController.php   #   CRUD de vehículos
│   │   └── PlazaAparcamientoController.php  # CRUD de plazas
│   ├── 📁 models/                   # Modelos de datos
│   │   ├── Conexion.php             #   Conexión PDO a MySQL
│   │   ├── Configuracion.php        #   Lectura de .env
│   │   ├── Model.php                #   Modelo base
│   │   ├── Usuario.php              #   Usuarios
│   │   ├── Vehiculo.php             #   Vehículos
│   │   ├── plazaAparcamiento.php    #   Plazas de aparcamiento
│   │   ├── Zona.php                 #   Zonas geográficas
│   │   ├── SistemaPuntuacion.php    #   Sistema de puntos
│   │   ├── Cupon.php                #   (stub) Cupones
│   │   ├── EmpresaColaboradora.php  #   (stub) Empresas
│   │   ├── Notificacion.php         #   (stub) Notificaciones
│   │   └── PagoSuscripcion.php      #   (stub) Pagos
│   ├── 📁 routes/                   # (reservado)
│   ├── 📁 services/                 # (reservado)
│   └── 📁 views/
│       ├── 📁 aparkt/               # Landing page principal
│       ├── 📁 index/                # Página del mapa
│       ├── 📁 login/                # Página de inicio de sesión
│       ├── 📁 signup/               # Página de registro
│       ├── 📁 components/           # Web Components reutilizables
│       │   ├── Header.js            #   Cabecera
│       │   ├── Footer.js            #   Pie de página
│       │   ├── PerfilUsuario.js     #   Perfil de usuario
│       │   ├── ModalAparcamiento.js #   Modal de plazas
│       │   ├── Modalpuntos.js       #   Modal de puntos
│       │   └── ModalIdioma.js       #   Selector de idioma
│       └── 📁 assets/
│           ├── 📄 translations.json # Traducciones (ES/EN/FR/DE)
│           ├── 🖼️ imagotipoAparkt.png
│           ├── 🖼️ isotipoAparkt.png
│           ├── 🖼️ fondoAparkt.png
│           ├── 📁 imgCarrusel/      # Imágenes del carrusel
│           └── 📁 video/            # Vídeo corporativo
│
├── 📁 DESIGN-TEST/                  # Prototipos de diseño (HTML/CSS)
├── 📁 config/                       # (reservado)
├── 📁 middlewares/                  # (reservado)
├── 📁 public/                       # (reservado)
├── 📁 tests/                        # (reservado)
└── 📁 utils/                        # (reservado)
```

---

## ⚙️ Instalación

### Prerrequisitos

- **XAMPP** (o cualquier servidor Apache + PHP 8.x + MySQL)
- Extensión PHP `pdo_mysql` habilitada
- Una clave de API de **Mapbox** ([gratuita en mapbox.com](https://account.mapbox.com/auth/signup/))

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/aparkt/aparkt.git

# 2. Entrar en la carpeta del proyecto
cd Aparkt

# 3. Configurar las variables de entorno
cp .env.example .env
# Edita .env y añade tu clave de Mapbox:
# MAPS_API_KEY=pk.tu_clave_aqui
```

### Configuración de la Base de Datos

1. Abre **phpMyAdmin** o tu cliente MySQL favorito
2. Crea una nueva base de datos (ej: `aparktbd`)
3. Importa el archivo `aparktbd.sql`:

```bash
mysql -u root -p aparktbd < aparktbd.sql
```

4. Configura la conexión editando `app/models/Conexion.php` con tus credenciales

### Despliegue

Coloca la carpeta del proyecto en el directorio `htdocs` de XAMPP:

```bash
# Ejemplo en Windows
C:\xampp\htdocs\Aparkt
```

Accede vía navegador a:

```
http://localhost/Aparkt/app/views/aparkt/aparkt.html
```

> **Nota:** El proyecto usa exclusivamente librerías CDN, por lo que **no requiere** `npm install` ni `composer install`.

---

## 🗄️ Base de Datos

El esquema completo se encuentra en [`aparktbd.sql`](aparktbd.sql) e incluye las siguientes tablas:

| Tabla | Descripción |
|---|---|
| `Usuario` | Usuarios registrados (nombre, email, contraseña, puntuación, suscripción) |
| `Vehiculo` | Vehículos asociados a usuarios (tipo, tamaño) |
| `PlazaAparcamiento` | Plazas con ubicación espacial `POINT`, estado, zona, usuario |
| `Zona` | Zonas geográficas con geometría espacial |
| `SistemaPuntuacion` | Historial de puntos ganados por cada usuario |
| `Cupon` | Cupones de descuento de empresas colaboradoras |
| `EmpresaColaboradora` | Empresas asociadas al sistema de recompensas |
| `Notificacion` | Notificaciones push internas para usuarios |
| `PagoSuscripcion` | Pagos de suscripciones premium |

---

## 🌐 API Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `app/controllers/SignupController.php` | Registro de nuevo usuario |
| `POST` | `app/controllers/LoginController.php` | Inicio de sesión |
| `GET` | `app/controllers/Logout.php` | Cierre de sesión |
| `GET` | `app/controllers/MeController.php` | Verificar sesión y obtener datos del usuario |
| `POST` | `app/controllers/VehiculoController.php` | Registrar un vehículo |
| `GET/POST/PUT/DELETE` | `app/controllers/PlazaAparcamientoController.php` | CRUD de plazas de aparcamiento |
| `GET` | `app/config/config.php` | Obtener clave de Mapbox (JSON) |

---

## 👥 Equipo

| Miembro | Rol |
|---|---|
| **Antonio** | Desarrollo backend y frontend |
| **Adrián** | Desarrollo frontend y diseño |
| **Celia** | Base de datos y documentación |
| **Noemi** | Diseño UX/UI y testing |

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  <sub>Hecho con ❤️ por el equipo Aparkt · Málaga, España</sub>
  <br>
  <sub>Proyecto de Trabajo de Fin de Grado · 2026</sub>
</p>
