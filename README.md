# Business IT - Prueba tecnica (Headless Architecture)

## Introducción

Tal como dice en el documento se pide combinar CMS Drupal como un backend con el plugin de web
services RESTFUL API y hacer que un frontend consuma esta API, aparte de montar la infrastructura (Servidor Linux) Que contenga instalado el Drupal o bueno Contenga el Backend.
Aparte se pide personalizar Drupal con un tema personalizado desde 0, el cual yo impplemente tanto en la interfaz administratva de Drupal como en la interfaz de usuario o el Frontend integrado del CMS, se pide administracion de roles y usuarios basicos por lo cual se creo un rol Admin RESTFUL que es el encargado de la configuracion de la API, asi mismo se creo un usuario y se le asigno este rol.
Como se menciona mas adelante, la prueba pide que se creen tipos de contenidos y campos por lo cual use como contexto como si fuese una aplicacion para una empresa inmobiliaria la cual quiere mostrar sus productos y sus agentes inmobiliarios.

# GUIA/INFORME TÉCNICO

Este proyecto es una solución técnica completa para una plataforma inmobiliaria, implementada bajo una arquitectura desacoplada (Headless). Combina la robustez de **Drupal 10** como gestor de contenidos (Backend) y la velocidad de **Next.js** para la interfaz de usuario (Frontend).

## Tabla de Contenidos
1. [Visión General de la Arquitectura](#visión-general-de-la-arquitectura)
2. [Fase 1: Infraestructura y Sistema Operativo](#1-infraestructura-y-sistema-operativo)
  - [1.1 Especificaciones del Entorno Virtualizado](#11-especificaciones-del-entorno-virtualizado)
  - [1.2 Gestión de Identidad y Accesos](#12-gestión-de-identidad-y-accesos)
  - [1.3 Stack Tecnológico (LAMP)](#13-stack-tecnológico-lamp)
  - [1.4 Seguridad y Persistencia de Datos](#14-seguridad-y-persistencia-de-datos)
  - [1.5 Estructura de Archivos y Permisos](#15-estructura-de-archivos-y-permisos)
3. [Fase 2: Backend - Drupal (Gestión de Contenido)](#2-backend---drupal-gestión-de-contenido)
  - [2.1 Estrategia de Instalación](#21-estrategia-de-instalación)
  - [2.2 Configuración del Servidor Web (Virtual Host)](#22-configuración-del-servidor-web-virtual-host)
  - [2.3 Despliegue y Configuración Inicial](#23-despliegue-y-configuración-inicial)
  - [2.4 Arquitectura de Contenidos (Content Modeling)](#24-arquitectura-de-contenidos-content-modeling)
  - [2.5 Desarrollo de Tema Personalizado ("Inmobiliaria Aceternity")](#25-desarrollo-de-tema-personalizado-inmobiliaria-aceternity)
4. [Fase 3: API REST (Exposición de Datos)](#3-api-rest-exposición-de-datos)
  - [3.1 Stack de Servicios Web](#31-stack-de-servicios-web)
  - [3.2 Definición de Endpoints](#32-definición-de-endpoints)
  - [3.3 Normalización de Datos (Data Normalization)](#33-normalización-de-datos-data-normalization)
  - [3.4 Seguridad y Acceso](#34-seguridad-y-acceso)
  - [3.5 Ejemplo de Payload (Respuesta JSON)](#35-ejemplo-de-payload-respuesta-json)
  - [3.6 Seguridad de la API (CORS & Hardening)](#36-seguridad-de-la-api-cors--hardening)
5. [Fase 4: Frontend - Next.js (Cliente)](#4-frontend---nextjs-cliente)
  - [4.1 Stack Tecnológico](#41-stack-tecnológico)
  - [4.2 Estructura del Proyecto](#42-estructura-del-proyecto)
  - [4.3 Decisiones Técnicas Clave](#43-decisiones-técnicas-clave)
  - [4.4 Configuración de Despliegue](#44-configuración-de-despliegue)
  - [Instalación](#instalación)

---

## Visión General de la Arquitectura

El sistema se diseñó para simular un entorno de producción real, separando la lógica de negocio de la capa de presentación.

* **Servidor:** Máquina Virtual Linux simulando un entorno on-premise.
* **Backend:** Drupal 10 (API First).
* **Frontend:** Next.js (React Framework) con Tailwind CSS.
* **Comunicación:** API RESTful (JSON).

---

## 1. Infraestructura y Sistema Operativo

Se ha completado la fase de aprovisionamiento del servidor, estableciendo una base sólida y segura para el despliegue de la arquitectura desacoplada.

### 1.1 Especificaciones del Entorno Virtualizado
* **Hipervisor:** Oracle VirtualBox.
* **Sistema Operativo:** Ubuntu Server 24.04 LTS (Noble Numbat). Se seleccionó una versión LTS para asegurar soporte extendido y estabilidad en producción.
* **Topología de Red:** Adaptador en modo **Puente (Bridged Adapter)**.
    * *Impacto Técnico:* Permite que el servidor obtenga una dirección IP única (`192.168.1.x`) dentro de la red local, facilitando la comunicación real con el frontend y simulando un acceso vía intranet.

### 1.2 Gestión de Identidad y Accesos
* **Acceso Remoto:** Se implementó `openssh-server` para administración remota segura.
* **Política de Usuarios:** Usuario administrador (`erick`) con privilegios `sudo`, manteniendo deshabilitado el acceso directo a `root` para auditoría y seguridad.

### 1.3 Stack Tecnológico (LAMP)
Entorno optimizado para Drupal 10/11 y API REST.

* **Servidor Web (Apache 2.4):** Configurado con `mod_rewrite` habilitado para URLs amigables (Clean URLs) y enrutamiento de endpoints JSON.
* **Base de Datos (MySQL 8.0):** Compatible con tipos de datos JSON nativos.
* **Lenguaje (PHP 8.3):** Instalado con extensiones críticas: `gd`, `xml`, `mbstring`, `curl`, `zip`, `json`, `opcache` y `uploadprogress`.

### 1.4 Seguridad y Persistencia de Datos
* **Hardening MySQL:** Eliminación de usuarios anónimos y deshabilitación de root remoto.
* **Segregación:** Base de datos dedicada (`db_inmobiliaria`) con cotejamiento `utf8mb4_unicode_ci` y usuario exclusivo (`admin_inmo`).

### 1.5 Estructura de Archivos y Permisos
* **Directorio Raíz:** `/var/www/html/web_inmobiliaria`.
* **Permisos:** Máscara `775` con propiedad para el usuario `erick` y grupo `www-data`, garantizando escritura controlada para el servidor web sin comprometer la seguridad.

---

## 2. Backend - Drupal (Gestión de Contenido)

Para la implementación del CMS, se utilizó **Composer**, alineándose con los estándares modernos de desarrollo PHP y las mejores prácticas de seguridad.

### 2.1 Estrategia de Instalación
* **Método:** `composer create-project drupal/recommended-project`
* **Justificación Técnica:**
    * **Seguridad:** Sitúa el núcleo y librerías fuera del directorio público (`/web`), reduciendo la superficie de ataque.
    * **Mantenibilidad:** Facilita la gestión automatizada de dependencias y parches.

### 2.2 Configuración del Servidor Web (Virtual Host)
Se reconfiguró Apache para servir la aplicación desde el subdirectorio público `/web`.

```apache
<Directory /var/www/html/web_inmobiliaria/web>
    AllowOverride All
    Require all granted
</Directory>
```
**Impacto:** Habilita `mod_rewrite` necesario para el enrutamiento de Symfony y la seguridad por directorio (`.htaccess`).

### 2.3 Despliegue y Configuración Inicial

**Gestión de Configuración (`settings.php`):** Se realizó la configuración manual del archivo de settings debido a las restricciones de permisos de escritura, inyectando las credenciales de base de datos de forma segura.

**Identidad del Sitio:** "Portal Inmobiliario Business IT".

**Regionalización:** Español / America/Guayaquil.

**Cuenta Administrativa:** Usuario erick (Correo: erickalexander713@gmail.com Contraseña: Admin.2026!).

### 2.4 Arquitectura de Contenidos (Content Modeling)

Se diseñó una arquitectura de información relacional para demostrar capacidades avanzadas, superando el requisito básico de tipos de contenido planos.

#### A. Tipo de Contenido: "Inmueble" (Entidad Principal)
Producto core del negocio.

- `field_precio` (Decimal): Precisión de 2 decimales.
- `field_foto_principal` (Imagen): Soporte optimizado.
- `field_estado` (Lista): Lógica de negocio (Venta/Alquiler).
- `field_ciudad` (Texto): Ubicación.
- `field_fecha_disponibilidad` (Fecha): Control temporal.
- `field_agente_responsable` (Entity Reference): Relación dinámica que vincula la propiedad con un Agente específico.

#### B. Tipo de Contenido: "Agente" (Entidad Relacional)
Gestión independiente de la fuerza de ventas.

- Campos: Foto de perfil, WhatsApp y Email.
- **Ventaja:** Al consumir la API, permite traer objetos anidados (Casa + Datos del Vendedor) en una sola consulta.

#### C. Tipo de Contenido: "Banner Home" (Gestión Frontend)
Estructura para cumplir el requisito de "Contenido gestionado por CMS". Permite al administrador cambiar la imagen principal y textos de la portada sin tocar código.

### 2.5 Desarrollo de Tema Personalizado ("Inmobiliaria Aceternity")

Cumpliendo con el requisito técnico de no utilizar temas base (como **Bootstrap** o **Bartik**), se desarrolló un tema desde cero orientado a una experiencia de usuario dual (Administración vs. Cliente).

- **Nombre del Tema:** `inmo_theme`
- **Ruta:** `/web/themes/custom/inmo_theme`
- **Tecnologías:** HTML5, Twig (motor de plantillas), CSS3 nativo (Grid/Flexbox) y Tailwind CSS (vía CDN para prototipado rápido y sistema de diseño).

#### A. Arquitectura de Plantillas "Híbrida"
Se implementó una lógica de renderizado condicional en Twig para separar visualmente el entorno de gestión del entorno público sin necesidad de módulos externos.

**Diseño de Administración (Backend UI):**

- Panel lateral (Sidebar) color Verde Corporativo (`#007a6c`) con navegación manual y acceso a herramientas de gestión.
- Visibilidad restringida mediante Bloques y Roles: El bloque de menú solo es renderizado si el usuario tiene el rol de `Administrator`.

**Diseño Público (Frontend UI):**

- Diseño minimalista, fondo blanco y navegación superior (Navbar).
- Hero Section: Implementado en `page--front.html.twig` con imagen de fondo oscura y tipografías modernas ("Epilogue" y "Manrope").

#### B. Estrategia de Archivos Twig

- `inmo_theme.info.yml`: Definición del tema y regiones (Sidebar, Content, Header).
- `page--front.html.twig`: Plantilla exclusiva para la ruta `/` (Home). Elimina wrappers administrativos e inyecta el diseño de portada.
- `page.html.twig`: Plantilla maestra lógica. Detecta la presencia del bloque de administración para decidir si renderizar el layout de "Dashboard" o el layout de "Página Interna".

#### C. Integración con Drupal Views

El tema no solo estiliza la estructura, sino que transforma la salida de datos de **Drupal Views**:

- **Grid de Propiedades:** Se utilizó CSS Grid para transformar listas no ordenadas en tarjetas (Cards) responsivas con efectos de elevación (Hover).
- **Sección de Agentes:**
    - Selector CSS específico: Se implementó la clase `.vista-agentes` para aislar estilos.
    - Estilización: Transformación de imágenes rectangulares a avatares circulares perfectos (`border-radius: 50%`) y centrado de contenido para la presentación del equipo.

D. Sistema de Diseño (Tailwind Config)
Se configuró una paleta de colores personalizada extendiendo la configuración de Tailwind:

brand: #007a6c (Verde Business IT - Color Primario).

text-main: #1e293b (Gris Oscuro/Azulino para textos de alta lectura).

bg-body: #f8fafc (Blanco humo para fondos que no cansan la vista).

## 3. API REST (Exposición de Datos)

Siguiendo el requerimiento de arquitectura desacoplada, se implementó una estrategia **API First**. Drupal actúa únicamente como repositorio de contenidos, exponiendo la información a través de endpoints RESTful para ser consumidos por el cliente Next.js.

### 3.1 Stack de Servicios Web
Se habilitaron los módulos del núcleo (Core) necesarios para la serialización y exposición de datos, evitando dependencias de terceros innecesarias:
* [cite_start]**RESTful Web Services:** Motor base para la creación de recursos REST[cite: 30].
* **Serialization:** Permite la transformación de entidades de base de datos a formatos portables (JSON/XML).
* [cite_start]**Views Data Export:** Utilizado para personalizar la salida de los endpoints y asegurar la estructura requerida[cite: 33].

### 3.2 Definición de Endpoints
[cite_start]Se configuraron dos rutas principales bajo el prefijo `/api/v1/` para mantener un versionado semántico y ordenado[cite: 42]:

| Recurso | Método | Endpoint (Ruta) | Descripción |
| :--- | :---: | :--- | :--- |
| **Inmuebles** | `GET` | `/api/v1/inmuebles` | Listado completo de propiedades con sus detalles y agente asignado. |
| **Agentes** | `GET` | `/api/v1/agentes` | Información de contacto y perfil del equipo de ventas. |

### 3.3 Normalización de Datos (Data Normalization)
[cite_start]Para cumplir con el requisito de "Datos bien normalizados" [cite: 43] y facilitar la integración con React, se configuró la salida de Drupal Views para entregar **JSON Puro (Raw Data)** en lugar de HTML renderizado.

**Optimizaciones realizadas:**
1.  [cite_start]**Formato de Salida:** Se forzó el formato `JSON` en la configuración de serialización[cite: 36].
2.  **Limpieza de Campos (Field Flattening):**
    * **Imágenes:** Se configuró el formateador como **"URL a la imagen"** (Image URL). Esto entrega una cadena de texto limpia (`/sites/default/files/...`) en lugar de una etiqueta HTML `<img>` completa, permitiendo al Frontend usar componentes optimizados como `Next/Image`.
    * **Referencias:** Los vínculos (como el Agente Responsable) se entregan como texto plano o IDs, eliminando los enlaces `<a>` automáticos de Drupal.
    * **IDs:** Se expuso el `nid` (Node ID) para ser utilizado como `key` única en el renderizado de listas en React.

### 3.4 Seguridad y Acceso
* [cite_start]**Autenticación:** Se configuró el acceso público controlado para métodos `GET` (Lectura)[cite: 40].
* **Permisos:** Se asignó el permiso *"Ver contenido publicado"* a la ruta de la API, permitiendo que el Frontend consuma los datos sin exponer rutas administrativas ni permitir métodos de escritura (`POST`, `PATCH`, `DELETE`) anónimos.

### 3.5 Ejemplo de Payload (Respuesta JSON)
[cite_start]Estructura real obtenida del endpoint de Inmuebles[cite: 34]:

```json
[
  {
    "nid": "2",
    "title": "Casa de Lujo en Manta",
    "field_precio": "150000.00",
    "field_ciudad": "Manta",
    "field_estado": "En Venta",
    "field_foto_principal": "/sites/default/files/inmuebles/fotos/casa-moderna.jpg",
    "field_agente_responsable": "Erick Chavarrea"
  }
]
```

### 3.6 Seguridad de la API (CORS & Hardening)
Cumpliendo con el requisito de **"Acceso público controlado"**, se implementó una política de seguridad a nivel de servidor (Hardening) utilizando el módulo **CORS (Cross-Origin Resource Sharing)** nativo de Drupal.

**Estrategia de Seguridad Implementada:**
En lugar de bloquear la lectura de datos (lo cual afectaría el SEO y la UX), se restringieron los "Verbos HTTP" permitidos. Esto asegura que la API sea estrictamente de **solo lectura**.

**Configuración en `services.yml`:**
Se modificó el archivo de servicios del núcleo para inyectar las siguientes reglas de cabecera:

```yaml
cors.config:
  enabled: true
  allowedHeaders: ['*']
  allowedMethods: ['GET']  # <--- SEGURIDAD CRÍTICA: Bloqueo de POST/DELETE/PUT
  allowedOrigins: ['*']    # Permite el consumo desde el Frontend desacoplado (Next.js)
  exposedHeaders: false
  maxAge: false
  supportsCredentials: false
```
**Justificación Técnica:**

- `allowedMethods: ['GET']`: Esta directiva actúa como un firewall de aplicación. Incluso si un atacante descubriera la ruta de la API, cualquier intento de modificar, inyectar o borrar datos (Peticiones POST, DELETE, PUT) será rechazado automáticamente por el servidor con un error **405 Method Not Allowed**.
- `allowedOrigins: ['*']`: Habilita la comunicación fluida con la aplicación Next.js sin importar si se despliega en Vercel, Netlify o un servidor local, eliminando errores de bloqueo de origen cruzado en el navegador del cliente.

## 4. Frontend - Next.js (Cliente)

Para la capa de presentación se implementó una arquitectura moderna basada en **Next.js 15** (App Router), priorizando el rendimiento mediante renderizado del lado del servidor (SSR) y una separación estricta de responsabilidades.

### 4.1 Stack Tecnológico

- **Framework:** Next.js 15.1 (App Router & Server Components)
- **Lenguaje:** TypeScript (Tipado estricto para interfaces de datos)
- **Estilos:** Tailwind CSS (Utility-first framework)
- **Iconografía:** Tabler Icons React
- **Comunicación:** Fetch API nativa implementada bajo el patrón de Servicios

### 4.2 Estructura del Proyecto

El código fuente se organizó modularmente para asegurar escalabilidad y mantenibilidad:

- `src/app/`: Directorio principal del App Router. Contiene las rutas de la aplicación (`/`, `/propiedades`, `/agentes`) y sus respectivos layouts.
- `src/components/`: Elementos de interfaz reutilizables, separados en componentes de UI puros y componentes funcionales (ej. `properties-grid.tsx` para filtrado en cliente).
- `src/services/`: Capa de abstracción para la comunicación con Drupal. Centraliza las llamadas fetch, manejo de errores y transformación de respuestas.
- `src/types/`: Definiciones de TypeScript (Interfaces) que modelan los datos esperados desde el Backend (ej. Inmueble, Agente, DrupalNode).

```bash
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing Page (SSR)
│   ├── layout.tsx          # Layout principal (Fuentes, Metadatos)
│   ├── propiedades/        # Módulo de Catálogo
│   │   ├── page.tsx        # Listado general
│   │   └── [id]/           # Ruta dinámica para detalles de inmueble
│   └── agentes/            # Módulo de Equipo Comercial
├── components/
│   ├── ui/                 # Componentes reutilizables (Navbar, Cards, Fondos)
│   └── properties-grid.tsx # Componente Cliente (Filtros y Buscador)
├── services/               # Capa de Abstracción de Datos
│   ├── inmuebles.service.ts # Lógica de fetch a Drupal (Propiedades)
│   └── agentes.service.ts   # Lógica de fetch a Drupal (Agentes)
└── types/                  # Definiciones de Interfaces (Inmueble, Agente, DrupalNode)
```

### 4.3 Decisiones Técnicas Clave

**Server-Side Rendering (SSR):**
- Se aprovechó la arquitectura de Server Components de Next.js. Las páginas principales realizan la obtención de datos (fetching) directamente en el servidor antes de enviar el HTML al cliente.
- **Optimización SEO:** El contenido llega indexable a los motores de búsqueda, crucial para un portal inmobiliario.
- **Rendimiento (LCP):** Se elimina la latencia de "cargas en cascada" típica de las SPAs tradicionales, mejorando el tiempo de carga inicial.
- **Seguridad:** La lógica de conexión y las rutas internas de la API de Drupal no son expuestas al navegador del cliente.

**Manejo de Rutas Dinámicas (Next.js 15):**
- Para la página de detalle de propiedad (`/propiedades/[id]`), se implementó el manejo asíncrono de parámetros requerido por la versión 15 del framework, asegurando compatibilidad y estabilidad futura.

**TypeScript**

```typescript
// Implementación de Params asíncronos
interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetallePage({ params }: Props) {
  const { id } = await params;
  const inmueble = await InmueblesService.getById(id);
  // ... lógica de renderizado
}
```

### Arquitectura de Servicios

Se abstrajo la comunicación con la API REST de Drupal mediante clases de servicio estáticas (`InmueblesService`, `AgentesService`). Esto desacopla los componentes de React de la fuente de datos, permitiendo:

- **Tipado Centralizado:** Validación de interfaces TypeScript en un solo punto.
- **Mantenibilidad:** Facilidad para modificar endpoints o lógica de negocio sin alterar la interfaz de usuario.
- **Reutilización:** Los mismos métodos de obtención de datos se utilizan tanto en las páginas de listado como en los detalles y destacados.

### 4.4 Configuración de Despliegue

La aplicación requiere la configuración de variables de entorno para establecer la comunicación con el Backend.

**Archivo `.env.local`:**

```env
# Dirección IP o Dominio del servidor Drupal (Backend)
NEXT_PUBLIC_DRUPAL_API_URL=http://192.168.1.103
```

El servidor de desarrollo se inicia mediante el siguiente comando:

```bash
npm run dev
```

Esto expone la interfaz en el puerto `3000` y conecta al servidor Drupal a través de la red local configurada en la infraestructura virtual.

## 4.5 Instalación

Sigue estos pasos para levantar el entorno de desarrollo local:

1. **Clonar el repositorio e instalar dependencias:**
  ```bash
  git clone <URL_DEL_REPOSITORIO>
  cd frontend-inmobiliaria
  npm install
  ```
2. **Configurar Variables de Entorno:** Renombrar el archivo `.env.example` a `.env.local` y configurar la IP del servidor backend (Drupal):
  ```env
  # Apunta a la IP de la máquina virtual o servidor Drupal
  NEXT_PUBLIC_DRUPAL_API_URL=http://192.168.1.103
  ```
3. **Iniciar el Servidor de Desarrollo:**
  ```bash
  npm run dev
  ```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)


## 5. Instalación y Reconstrucción del Entorno (Backend)

Este repositorio sigue las mejores prácticas de desarrollo en Drupal, versionando únicamente la configuración, el código personalizado y las dependencias, excluyendo el núcleo (Core) y librerías de terceros.

Para levantar una instancia local funcional utilizando estos archivos, siga estos pasos:

### 5.1 Preparación del Proyecto

El directorio `Backend-Drupal/` contiene los archivos esenciales. Si desea reconstruir el sitio desde cero:

1. Instale una instancia limpia de Drupal 10 vía Composer o utilice el archivo `composer.json` provisto:
  ```bash
  composer install
  ```
2. Ubique los archivos personalizados en los directorios correctos de su instalación Drupal:
  - **Tema:** Mueva la carpeta `backend/inmo_theme` a `/web/themes/custom/`.
  - **Configuración:** Mueva la carpeta `backend/config_sync` a una ruta accesible (ej. `/sites/default/files/config_sync`) y asegúrese de que `settings.php` apunte a ella.

### 5.2 Instalación del Sitio

Realice la instalación estándar de Drupal conectando su base de datos local:

```bash
vendor/bin/drush site:install standard --db-url=mysql://usuario:password@localhost/db_name --site-name="Business IT"
```

### 5.3 Importación de Configuración y Estilos

Una vez instalado el sitio base, inyecte la configuración del proyecto (Tipos de contenido, Vistas y Campos) y active el tema:

- **Sincronizar UUID (Opcional):** Si está restaurando sobre una base de datos nueva, asegúrese de que el UUID del sistema coincida con el de los archivos de configuración `system.site.yml`.

- **Importar Configuración:**
  ```bash
  vendor/bin/drush config:import -y
  ```
- **Activar Tema y Limpiar Caché:**
  ```bash
  vendor/bin/drush theme:enable inmo_theme
  vendor/bin/drush config:set system.theme default inmo_theme -y
  vendor/bin/drush cr
  ```

### 5.4 Verificar API

El backend estará listo para servir datos al frontend en: [http://localhost/api/v1/inmuebles?_format=json](http://localhost/api/v1/inmuebles?_format=json)


# 6 Entrega y Enlaces
En cumplimiento con los requisitos de entrega de la prueba técnica, se adjuntan los recursos necesarios para la validación de la solución.

## 6.1 Repositorio de Código (Monorepo)
El código fuente completo (Backend Configuration + Frontend Next.js) se encuentra alojado en GitHub:

[INSERTAR LINK DE TU GITHUB AQUÍ]

## 6.2 Máquina Virtual (Opcional)
Para facilitar la revisión del entorno de servidor configurado (Ubuntu + Apache + MySQL + Drupal live), se adjunta el enlace a la Máquina Virtual exportada (.ova):

[INSERTAR LINK DE GOOGLE DRIVE/ONEDRIVE AQUÍ]

## 6.3 Autor
Nombre: Erick Alexander Chavarrea Macias

Rol: Desarrollador Fullstack

Puesto a postular: Desarrollador Drupal/Software Development Consultant (CMS Drupal)

Fecha: Enero 2026