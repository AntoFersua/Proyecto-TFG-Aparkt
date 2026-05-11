// Importamos componenetes
import '../components/Header.js';
import '../components/Footer.js';
import '../components/Modalpuntos.js';
import '../components/PerfilUsuario.js';

import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';
import { cargarTraducciones, aplicarTraducciones } from '../translator.js';

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
  console.log('aparkt.js - botonPerfil:', botonPerfil);
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      console.log('aparkt.js - click en botonPerfil');
      const banner = document.getElementById('bannerUsuario');
      console.log('aparkt.js - banner:', banner);
      if (banner) {
        banner.classList.add('abierto');
      }
    });
  }

  const nombreUsuario = usuario.nombre || usuario.email || 'Usuario';
  console.log(`Bienvenido, ${nombreUsuario}`);
}

function configurarUIUsuarioNoLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      window.location.href = "../login/login.html";
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarTraducciones();
  aplicarTraducciones();
  iniciarPagina();
});

export { usuarioActual };