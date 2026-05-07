/**
 * auth.js - Funciones de autenticación para el frontend
 *
 * Este archivo centraliza toda la lógica de autenticación del frontend.
 * Permite verificar si el usuario está logueado, obtener sus datos,
 * y controlar la visibilidad de elementos según el estado de sesión.
 *
 * Se usa en todas las páginas que necesitan verificar la sesión del usuario.
 */

// FUNCIONES AUXILIARES
function obtenerRutaBase() {
  const ruta = window.location.pathname;
  // Si está en /app/views/login/ o /app/views/signup/ o /app/views/aparkt/ o /app/views/index/
  if (ruta.includes('/app/views/login/') || ruta.includes('/app/views/signup/') || ruta.includes('/app/views/aparkt/') || ruta.includes('/app/views/index/')) {
    return '../../';
  }
  // Si está en /app/views/ (index)
  return './';
}

function obtenerRutaCompleta(rutaRelativa) {
  return obtenerRutaBase() + rutaRelativa;
}

// CONSTANTES Y VARIABLES

// Variable para almacenar en memoria el usuario actual (cache)
let usuarioCache = null;

// Variable para almacenar la sesión actual (cache)
let sesionActual = null;

// FUNCIÓN PRINCIPAL: Obtener sesión

/**
 * Hace fetch al endpoint de sesión para verificar si el usuario está logueado.
 *
 */
export async function obtenerSesion() {
  try {
    const rutaBase = obtenerRutaBase();
    const endpoint = rutaBase + "controllers/MeController.php";
    console.log("Ruta base:", rutaBase);
    console.log("Endpoint:", endpoint);

    // Fetch al endpoint con credentials: 'include' para enviar cookies de sesión
    const respuesta = await fetch(endpoint, {
      credentials: "include", // MUY IMPORTANTE por las cookies de sesión
    });

    // Si el servidor devuelve error (404, 500, etc.), lanzar excepción
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }

    // Convertir respuesta a JSON
    const datos = await respuesta.json();
    console.log("Session response:", datos);

    // Guardar en cache el usuario si está logueado
    usuarioCache = datos.logueado ? datos.usuario : null;
    sesionActual = datos;

    // Devolver solo logueado y usuario
    return {
      logueado: datos.logueado,
      usuario: datos.usuario,
    };
  } catch (error) {
    // Si hay error de red o del servidor
    console.error("Error de sesion:", error);
    usuarioCache = null;
    sesionActual = false;
    // Devolver usuario no logueado por seguridad
    return sesionActual;
  }
}

// FUNCIÓN: Requiere autenticación (redirige si no está logueado)
/**
 * Verifica la sesión y si no está logueado, redirige a la página de login.
 */
export async function requiereAuth(
  urlRedireccionParam = null,
) {
  const urlRedireccion = urlRedireccionParam || obtenerRutaBase() + "login/login.html";
  
  const sesion = await obtenerSesion();

  // Si no está logueado, redirigir al login
  if (!sesion.logueado) {
    window.location.href = urlRedireccion;
    return null;
  }

  // Si está logueado, devolver los datos del usuario
  return sesion.usuario;
}

// FUNCIÓN: Obtener usuario actual (desde cache)
/**
 * Devuelve el usuario cacheado (sin hacer fetch).
 *
 */
export function obtenerUsuario() {
  return usuarioCache;
}

// FUNCIÓN: ¿Está logueado?
/**
 * Simple comprobacion de si el usuario está logueado
 *
 */
export function estaLogueado() {
  return usuarioCache !== null;
}

// FUNCIÓN: Ocultar elemento si no está logueado
/**
 * Añade la clase 'hidden' al elemento si el usuario NO está logueado.
 * Sirve para mostrar elementos solo a usuarios NO logueados (ej: botón Login).
 *
 */
export function ocultarSiNoLogueado(elemento) {
  if (!usuarioCache) {
    elemento.classList.add("hidden");
  }
}

// FUNCIÓN: Mostrar elemento si está logueado
/**
 * Añade o quita la clase 'hidden' según si el usuario está logueado.
 * Sirve para mostrar elementos solo a usuarios logueados (ej: perfil).
 *
 */
export function mostrarSiLogueado(elemento) {
  if (usuarioCache) {
    elemento.classList.remove("hidden");
  } else {
    elemento.classList.add("hidden");
  }
}

// FUNCIÓN: Inicializar UI según autenticación
/**
 * Busca todos los elementos con atributo data-auth y los muestra/oculta
 * según el estado de sesión.
 *
 * Uso en HTML: <button data-auth="hide">Login</button>
 *              <button data-auth="show">Perfil</button>
 */
export function inicializarUIAuth() {
  // Buscar todos los elementos con data-auth="show" o data-auth="hide"
  const elementosAuth = document.querySelectorAll("[data-auth]");

  elementosAuth.forEach((el) => {
    const accion = el.dataset.auth;

    if (accion === "show") {
      // Mostrar solo si está logueado
      mostrarSiLogueado(el);
    } else if (accion === "hide") {
      // Ocultar si está logueado (mostrar si no lo está)
      ocultarSiNoLogueado(el);
    }
  });
}

// FUNCIÓN PRINCIPAL: Inicializar autenticación en una página
/**
 * Función principal que inicializa toda la lógica de sesión.
 * Llama a obtenerSesion, actualiza la UI, y ejecuta callbacks según corresponda.
 *
 */
export async function iniciarAuth(opciones = {}) {
  // Desestructurar opciones con valores por defecto
  const {
    alLoguearse = null, // Función a ejecutar si está logueado
    alNoLoguearse = null, // Función a ejecutar si NO está logueado
    requiereAuth = false, // Por defecto no requiere autenticación obligatoria
    urlRedireccion: urlRedireccionParam = null, // URL de login por defecto (se calcula automáticamente)
  } = opciones;

  // Calcular url de login según la profundidad
  let urlRedireccion = urlRedireccionParam || obtenerRutaBase() + "login/login.html";

  // Obtener sesión del servidor
  const sesion = await obtenerSesion();

  // Si está logueado
  if (sesion.logueado) {
    // Guardar usuario en cache
    usuarioCache = sesion.usuario;

    // Actualizar UI (elementos con data-auth)
    inicializarUIAuth();

    // Ejecutar callback si existe
    if (alLoguearse) {
      alLoguearse(usuarioCache);
    }
  }
  // Si NO está logueado
  else {
    // Si requiereAuth es true, redirigir al login
    if (requiereAuth) {
      window.location.href = urlRedireccion;
      return;
    }

    // Ejecutar callback si existe
    if (alNoLoguearse) {
      alNoLoguearse();
    }
  }
}

// FUNCIÓN: Cerrar sesión
/**
 * Redirige al archivo PHP que destruye la sesión y cierra sesión.
 *
 */
export function cerrarSesion() {
  const rutaBase = obtenerRutaBase();
  const urlLogout = rutaBase + "controllers/Logout.php";
  console.log("Logout URL:", urlLogout);
  window.location.href = urlLogout;
}
