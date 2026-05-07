import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';
import "../components/header.js";
import "../components/PerfilUsuario.js";
import "../components/Modalpuntos.js";
import '../components/Footer.js';

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Inicializando Login");

  await iniciarAuth({
    alLoguearse: (usuario) => {
      usuarioActual = usuario;
      configurarUIUsuarioLogueado();
      inicializarFormulario();
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
      inicializarFormulario();
    }
  });
});

function configurarUIUsuarioLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  const banner = document.getElementById('bannerUsuario');
  
  if (botonPerfil && banner) {
    botonPerfil.addEventListener('click', () => {
      banner.classList.toggle('abierto');
    });
  }

  const botonLogout = document.getElementById('logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', () => cerrarSesion());
  }
}

function configurarUIUsuarioNoLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      alert("Ya estás en la página de inicio de sesión");
    });
  }
}

function inicializarFormulario() {
  // Inicializar JustValidate
  const validador = new JustValidate("#loginForm", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  // EMAIL
  validador.addField("#email", [
    {
      rule: "required",
      errorMessage: "El email es obligatorio",
    },
  ], {
    errorsContainer: "#error-email",
  });

  // PASSWORD
  validador.addField("#password", [
    {
      rule: "required",
      errorMessage: "La contraseña es obligatoria",
    },
  ], {
    errorsContainer: "#error-password",
  });

  // SUBMIT
  validador.onSuccess((event) => {
    event.preventDefault();

    const datos = {
      usuario: document.querySelector("#email").value.trim(),
      contrasena: document.querySelector("#password").value.trim(),
    };

    fetch("../../controllers/LoginController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = '../aparkt/aparkt.html';
        } else {
          alert("Error en el login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error de conexión");
      });
  });
}

