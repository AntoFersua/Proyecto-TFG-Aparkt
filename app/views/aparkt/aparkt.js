// Importamos componenetes
import '../components/header.js';
import '../components/Footer.js';
import '../components/Modalpuntos.js';

import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';

let usuarioActual = null;

async function iniciarPagina() {
  await iniciarAuth({
    alLoguearse: (usuario) => {
      usuarioActual = usuario;
      configurarUIUsuarioLogueado(usuario);
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    }
  });
}

function configurarUIUsuarioLogueado(usuario) {
  const botonLogout = document.getElementById('logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', () => cerrarSesion());
  }

  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      const banner = document.getElementById('bannerUsuario');
      if (banner) {
        banner.classList.add('abierto');
      }
    });
  }

  const nombreUsuario = usuario.nombre || usuario.name || usuario.email || 'Usuario';
  console.log(`Bienvenido, ${nombreUsuario}`);
}

function configurarUIUsuarioNoLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      const ruta = window.location.pathname;
      const rutaBase = ruta.includes("/Proyecto-TFG-Aparkt/") ? "/Proyecto-TFG-Aparkt" : "";
      window.location.href = rutaBase + "/app/views/login/login.html";
    });
  }
}

document.addEventListener('DOMContentLoaded', iniciarPagina);

export { usuarioActual };