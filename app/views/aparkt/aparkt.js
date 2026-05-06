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
    botonLogout.addEventListener('click', () => {
      window.location.href = "../../controllers/Logout.php";
    });
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
      window.location.href = "../../login/login.html";
    });
  }
}

document.addEventListener('DOMContentLoaded', iniciarPagina);

export { usuarioActual };