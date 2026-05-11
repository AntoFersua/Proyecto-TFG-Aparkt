// Importamos componentes
import '../components/Header.js';
import '../components/PerfilUsuario.js';
import '../components/Footer.js';

import { iniciarAuth, cerrarSesion } from '../auth.js';
import { cargarTraducciones, aplicarTraducciones, t } from '../translator.js';

async function iniciarPagina() {
  await iniciarAuth({
    alLoguearse: () => {
      const botonLogout = document.getElementById('logout');
      if (botonLogout) {
        botonLogout.addEventListener('click', () => cerrarSesion());
      }

      const botonPerfil = document.getElementById('perfilUsuario');
      console.log('signup.js - botonPerfil:', botonPerfil);
      if (botonPerfil) {
        botonPerfil.addEventListener('click', () => {
          console.log('signup.js - click en botonPerfil');
          const banner = document.getElementById('bannerUsuario');
          console.log('signup.js - banner:', banner);
          if (banner) {
            banner.classList.add('abierto');
          }
        });
      }
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    }
  });
}

function configurarUIUsuarioNoLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      window.location.href = "../login/login.html";
    });
  }
}

(async () => {
  await cargarTraducciones();
  aplicarTraducciones();
  iniciarPagina();
  inicializarTogglePassword();
})();

function inicializarTogglePassword() {
  // Toggle contraseña principal
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('inputContrasena');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      if (type === 'text') {
        togglePassword.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        togglePassword.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    });
  }

  // Toggle confirmar contraseña
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmarContrasena');

  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', () => {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);

      if (type === 'text') {
        toggleConfirmPassword.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        toggleConfirmPassword.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    });
  }
}

// Validación con JustValidate
document.addEventListener("DOMContentLoaded", function () {
  console.log("Inicializando JustValidate");

  const form = document.getElementById("formUsuario");
  if (!form) {
    console.log("Formulario no encontrado");
    return;
  }

  const validador = new JustValidate("#formUsuario", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  console.log("Validador creado:", validador);

  //NOMBRE
  validador.addField(
    "#inputNombre",
    [
      { rule: "required", errorMessage: t('signup.errorNombre') },
      { rule: "minLength", value: 2, errorMessage: t('signup.errorNombreMin') },
      { rule: "maxLength", value: 20, errorMessage: t('signup.errorNombreMax') },
      {
        rule: "custom",
        validator: (value) => {
          return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
        },
        errorMessage: t('signup.errorNombreLetras'),
      },
    ],
    {
      errorsContainer: "#error-nombre",
    },
  );

  //APELLIDOS
  validador.addField(
    "#inputApellidos",
    [
      { rule: "required", errorMessage: t('signup.errorApellidos') },
      { rule: "minLength", value: 2, errorMessage: t('signup.errorApellidosMin') },
      { rule: "maxLength", value: 50, errorMessage: t('signup.errorApellidosMax') },
      {
        rule: "custom",
        validator: (value) => {
          return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
        },
        errorMessage: t('signup.errorApellidosLetras'),
      },
    ],
    {
      errorsContainer: "#error-apellidos",
    },
  );

  // CIUDAD (select)
  /*validador.addField("#inputCiudad", [
    { rule: "required", errorMessage: t('signup.errorCiudad') },
  ], {
    errorsContainer: '#error-ciudad'
  });*/

  // EMAIL
  validador.addField(
    "#inputCorreo",
    [
      { rule: "required", errorMessage: t('signup.errorEmail') },
      { rule: "email", errorMessage: t('signup.errorEmailInvalido') },
    ],
    {
      errorsContainer: "#error-email",
    },
  );

  //TELÉFONO
  validador.addField(
    "#inputTelefono",
    [
      {
        rule: "custom",
        validator: (value) => {
          return /^\d{9,15}$/.test(value);
        },
        errorMessage: t('signup.errorTelefono'),
      },
    ],
    {
      errorsContainer: "#error-telefono",
    },
  );

  // CONTRASEÑA
  validador.addField(
    "#inputContrasena",
    [
      {
        rule: "required",
        errorMessage: t('signup.errorPassword'),
      },
      {
        rule: "custom",
        validator: (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/.test(
            value,
          );
        },
        errorMessage: t('signup.errorPasswordComplejidad'),
      },
    ],
    {
      errorsContainer: "#error-contrasena",
    },
  );

  // CONFIRMAR CONTRASEÑA
  validador.addField(
    "#confirmarContrasena",
    [
      { rule: "required", errorMessage: t('signup.errorConfirmar') },
      {
        validator: (value, fields) => {
          return value === fields["#inputContrasena"].elem.value;
        },
        errorMessage: t('signup.errorCoincidir'),
      },
    ],
    {
      errorsContainer: "#error-confirmarContrasena",
    },
  );

  //ACEPTAR TERMINOS
  validador.addField(
    "#aceptarTerminos",
    [
      {
        rule: "required",
        errorMessage: t('signup.errorTerminos'),
      },
    ],
    {
      errorsContainer: "#error-aceptarTerminos",
    },
  );

  // SUBMIT
  validador.onSuccess((event) => {
    event.preventDefault();

    const datos = {
      nombre: document.getElementById("inputNombre").value.trim(),
      apellido: document.getElementById("inputApellidos").value.trim(),
      ciudad: document.getElementById("inputCiudad").value,
      telefono: document.getElementById("inputTelefono")?.value.trim() || "",
      email: document.getElementById("inputCorreo").value.trim(),
      contrasena: document.getElementById("inputContrasena").value,
      confirmarContrasena: document.getElementById("confirmarContrasena").value,
      aceptarTerminos: document.getElementById("aceptarTerminos").checked,
    };

    fetch("../../controllers/SignupController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = "../login/login.html";
        } else {
          alert(data.mensaje || t('signup.errorRegistro'));
        }
      })
      .catch((err) => {
        console.error(err);
        alert(t('signup.errorConexion'));
      });
  });
});
