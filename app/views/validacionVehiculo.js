// Validation de vehiculo usando la librería JustValidate
window.inicializarValidacionVehiculo = function () {
  let form = document.getElementById("formVehiculo");
  if (!form) return;
  if (form.dataset.validacionVehiculoInicializada === "true") return;
  form.dataset.validacionVehiculoInicializada = "true";

  let validator = new window.JustValidate(form, {
    errorFieldCssClass: "error-field",
    errorLabelCssClass: "error-mensaje",
  });

  validator.addField("#tipoVehiculo", [
      {
        rule: "required",
        errorMessage: "Selecciona un tipo de vehículo",
      },
    ], {
    errorsContainer: "#error-tipoVehiculo",
  });


    validator.addField("#tamanoVehiculo", [
      {
        rule: "required",
        errorMessage: "Selecciona un tamaño",
      },
    ],{
      errorsContainer: "#error-tamanoVehiculo",
    });

    validator.onSuccess(function (event) {
      event.preventDefault();
      let tipoVehiculo = document.getElementById("tipoVehiculo").value;
      let tamanoVehiculo = document.getElementById("tamanoVehiculo").value;

      const datos = {
        tipoVehiculo: tipoVehiculo,
        tamano: tamanoVehiculo,
      };

      console.log("Enviando:", datos);

      function obtenerRutaBase() {
        const ruta = window.location.pathname;
        if (ruta.includes("/app/views/")) {
          const parteDespuesDeViews = ruta.split("/app/views/")[1];
          const profundidad = parteDespuesDeViews ? parteDespuesDeViews.split("/").filter(p => p).length : 0;
          return "../".repeat(profundidad);
        }
        if (ruta.includes("/app/")) return "./";
        return "./";
      }

      const rutaBase = obtenerRutaBase();
      fetch(rutaBase + "controllers/VehiculoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(datos),
      })
        .then((respuesta) => {
          console.log("Status:", respuesta.status);
          return respuesta.text();
        })
        .then((texto) => {
          console.log("Respuesta:", texto);
          return JSON.parse(texto);
        })
        .then((data) => {
          if (data.status === "ok") {
             Swal.fire({ icon: 'success', title: data.mensaje, timer: 1500, showConfirmButton: false });
            document.getElementById("formVehiculo").reset();
          } else if (data.errores) {
             Swal.fire({ icon: 'error', title: Object.values(data.errores).join("\n"), timer: 3000, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: data.mensaje || "Error al registrar vehículo", timer: 3000, showConfirmButton: false });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
           Swal.fire({ icon: 'error', title: "Error de conexión: " + error.message, timer: 3000, showConfirmButton: false });
        });
    });

  return validator;
};
