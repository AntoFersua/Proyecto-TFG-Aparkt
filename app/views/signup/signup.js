// Importamos componentes
import '../components/Header.js';
import '../components/PerfilUsuario.js';
import '../components/Footer.js';

import { iniciarAuth, cerrarSesion } from '../auth.js';

async function iniciarPagina() {
  await iniciarAuth({
    alLoguearse: () => {
      const botonLogout = document.getElementById('logout');
      if (botonLogout) {
        botonLogout.addEventListener('click', () => cerrarSesion());
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

iniciarPagina();

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
      { rule: "required", errorMessage: "El nombre es obligatorio" },
      { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
      { rule: "maxLength", value: 20, errorMessage: "Máximo 20 caracteres" },
      {
        rule: "custom",
        validator: (value) => {
          return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
        },
        errorMessage: "El nombre solo puede contener letras",
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
      { rule: "required", errorMessage: "El apellido es obligatorio" },
      { rule: "minLength", value: 2, errorMessage: "Mínimo 2 caracteres" },
      { rule: "maxLength", value: 50, errorMessage: "Máximo 50 caracteres" },
      {
        rule: "custom",
        validator: (value) => {
          return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value);
        },
        errorMessage: "El apellido solo puede contener letras",
      },
    ],
    {
      errorsContainer: "#error-apellidos",
    },
  );

  // CIUDAD (select)
  /*validador.addField("#inputCiudad", [
    { rule: "required", errorMessage: "Selecciona una ciudad" },
  ], {
    errorsContainer: '#error-ciudad'
  });*/

  // EMAIL
  validador.addField(
    "#inputCorreo",
    [
      { rule: "required", errorMessage: "El email es obligatorio" },
      { rule: "email", errorMessage: "Email inválido" },
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
        errorMessage: "El teléfono debe tener entre 9 y 15 números",
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
        errorMessage: "La contraseña es obligatoria",
      },
      {
        rule: "custom",
        validator: (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/.test(
            value,
          );
        },
        errorMessage:
          "La contraseña debe tener 6-15 caracteres, una mayúscula, una minúscula, un número y un símbolo",
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
      { rule: "required", errorMessage: "Repite la contraseña" },
      {
        validator: (value, fields) => {
          return value === fields["#inputContrasena"].elem.value;
        },
        errorMessage: "Las contraseñas no coinciden",
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
        errorMessage: "Debes aceptar los términos",
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
          alert(data.mensaje || "Error en el registro");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error de conexión");
      });
  });
});
