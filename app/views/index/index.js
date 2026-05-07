import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';
import "../components/header.js";
import "../components/PerfilUsuario.js";
import "../components/ModalAparcamiento.js";

let usuarioActual = null;

window.addEventListener("DOMContentLoaded", async function () {
  await iniciarAuth({
    alLoguearse: (usuario) => {
      usuarioActual = usuario;
      configurarUIUsuarioLogueado(usuario);
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    }
  });

  fetch("../../config/config.php")
    .then(function (response) {
      console.log("Status:", response.status);
      return response.json();
    })
    .then(function (data) {
      mapboxgl.accessToken = data.MAPS_API_KEY;

      const mapa = new mapboxgl.Map({
        container: "mapa",
        style: "mapbox://styles/mapbox/standard",
        projection: "globe",
        zoom: 15,
        center: [-4.475468174458712, 36.72410119432091]
      });

      mapa.on("style.load", function () {
        mapa.setFog({});
      });

      mapa.on("load", function () {
        mapa.addControl(new mapboxgl.NavigationControl());

        function estadoAparcamiento(longitudX, latitudY, radioCirculo, idSource, idCapa, colorRelleno, colorBorde) {
          const centro = [longitudX, latitudY];
          const radio = radioCirculo;
          const opciones = {
            steps: 64,
            units: 'meters',
            properties: {}
          };
          const circulo = turf.circle(centro, radio, opciones);
          mapa.addSource(idSource, {
            type: 'geojson',
            data: circulo
          });
          mapa.addLayer({
            id: idCapa,
            type: 'fill',
            source: idSource,
            layout: {
              visibility: 'none'
            },
            paint: {
              'fill-color': colorRelleno,
              'fill-outline-color': colorBorde
            }
          });
          return {
            sourceID: idSource,
            layerID: idCapa
          };
        }

        const zona1 = estadoAparcamiento(-4.476059, 36.718963, 100, "zona1", "zona1-fill", "rgba(255, 0, 0, 0.3)", "red");

        const zona2 = estadoAparcamiento(-4.476059, 36.72896, 500, "zona2", "zona2-fill", "rgba(255, 0, 0, 0.3)", "red");

        let arrayEstadosAparcamientos = [zona1, zona2];

        function cambiarEstado() {
          for (let i = 0; i < arrayEstadosAparcamientos.length; i++) {
            let estado = mapa.getLayoutProperty(arrayEstadosAparcamientos[i].layerID, 'visibility');

            if (estado === 'visible') {
              mapa.setLayoutProperty(arrayEstadosAparcamientos[i].layerID, 'visibility', 'none');
              botonEstadosAparcamientos.textContent = "Mostrar estados aparcamientos";
            } else {
              mapa.setLayoutProperty(arrayEstadosAparcamientos[i].layerID, 'visibility', 'visible');
              botonEstadosAparcamientos.textContent = "Ocultar estados aparcamientos";
            }
          }

        }
        let botonEstadosAparcamientos = document.querySelector("#mostrarEstadosAparcamientos");
        botonEstadosAparcamientos.addEventListener("click", cambiarEstado);

        const aparcamiento1 = estadoAparcamiento(-4.478995, 36.719671, 3, "aparcamiento1", "aparcamiento1-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento2 = estadoAparcamiento(-4.478964, 36.719724, 3, "aparcamiento2", "aparcamiento2-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento3 = estadoAparcamiento(-4.478932, 36.719775, 3, "aparcamiento3", "aparcamiento3-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento4 = estadoAparcamiento(-4.478893, 36.719831, 3, "aparcamiento4", "aparcamiento4-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento5 = estadoAparcamiento(-4.478849, 36.719893, 3, "aparcamiento5", "aparcamiento5-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento6 = estadoAparcamiento(-4.478809, 36.719951, 3, "aparcamiento6", "aparcamiento6-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento7 = estadoAparcamiento(-4.478773, 36.720014, 3, "aparcamiento7", "aparcamiento7-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento8 = estadoAparcamiento(-4.478735, 36.720075, 3, "aparcamiento8", "aparcamiento8-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento9 = estadoAparcamiento(-4.478698, 36.720135, 3, "aparcamiento9", "aparcamiento9-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento10 = estadoAparcamiento(-4.478652, 36.720199, 3, "aparcamiento10", "aparcamiento10-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento11 = estadoAparcamiento(-4.478620, 36.720259, 3, "aparcamiento11", "aparcamiento11-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento12 = estadoAparcamiento(-4.478586, 36.720321, 3, "aparcamiento12", "aparcamiento12-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento13 = estadoAparcamiento(-4.478549, 36.720377, 3, "aparcamiento13", "aparcamiento13-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento14 = estadoAparcamiento(-4.478893, 36.719831, 3, "aparcamiento14", "aparcamiento14-fill", "rgba(255, 0, 0, 0.3)", "red");

        const aparcamiento15 = estadoAparcamiento(-4.478381, 36.720620, 3, "aparcamiento15", "aparcamiento15-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento16 = estadoAparcamiento(-4.478348, 36.720672, 3, "aparcamiento16", "aparcamiento16-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento17 = estadoAparcamiento(-4.478305, 36.720726, 3, "aparcamiento17", "aparcamiento17-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento18 = estadoAparcamiento(-4.478275, 36.720781, 3, "aparcamiento18", "aparcamiento18-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento19 = estadoAparcamiento(-4.478243, 36.720835, 3, "aparcamiento19", "aparcamiento19-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento20 = estadoAparcamiento(-4.478201, 36.720897, 3, "aparcamiento20", "aparcamiento20-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento21 = estadoAparcamiento(-4.478166, 36.720953, 3, "aparcamiento21", "aparcamiento21-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento22 = estadoAparcamiento(-4.478113, 36.7201023, 3, "aparcamiento22", "aparcamiento22-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento23 = estadoAparcamiento(-4.478120, 36.721014, 3, "aparcamiento23", "aparcamiento23-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento24 = estadoAparcamiento(-4.478085, 36.721070, 3, "aparcamiento24", "aparcamiento24-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento25 = estadoAparcamiento(-4.478042, 36.721132, 3, "aparcamiento25", "aparcamiento25-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento26 = estadoAparcamiento(-4.478005, 36.721189, 3, "aparcamiento26", "aparcamiento26-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento27 = estadoAparcamiento(-4.477965, 36.721239, 3, "aparcamiento27", "aparcamiento27-fill", "rgba(0, 255, 0, 0.3)", "green");

        let arrayAparcamientos = [aparcamiento1, aparcamiento2, aparcamiento3, aparcamiento4, aparcamiento5, aparcamiento6, aparcamiento7, aparcamiento8, aparcamiento9,
          aparcamiento10, aparcamiento11, aparcamiento12, aparcamiento13, aparcamiento14, aparcamiento15, aparcamiento16, aparcamiento17, aparcamiento18, aparcamiento19,
          aparcamiento20, aparcamiento21, aparcamiento22, aparcamiento23, aparcamiento24, aparcamiento25, aparcamiento26, aparcamiento27];

        function cambiarVisibilidadPlazas() {
          for (let i = 0; i < arrayAparcamientos.length; i++) {
            let estadoPlazas = mapa.getLayoutProperty(arrayAparcamientos[i].layerID, 'visibility');

            if (estadoPlazas === 'visible') {
              mapa.setLayoutProperty(arrayAparcamientos[i].layerID, 'visibility', 'none');
              botonAparcamientos.textContent = "Mostrar aparcamientos";
            } else {
              mapa.setLayoutProperty(arrayAparcamientos[i].layerID, 'visibility', 'visible');
              botonAparcamientos.textContent = "Ocultar aparcamientos";
            }
          }

        }
        let botonAparcamientos = document.querySelector("#mostrarAparcamientos");
        botonAparcamientos.addEventListener("click", cambiarVisibilidadPlazas);

        function abrirModalAparcamiento() {
          const modalExistente = document.querySelector("modal-aparcamiento");
          if (modalExistente) {
            modalExistente.remove();
          }
          const modal = document.createElement("modal-aparcamiento");
          document.body.appendChild(modal);
        }

        arrayAparcamientos.forEach(aparcamiento => {
          mapa.on('click', aparcamiento.layerID, (e) => {
            e.preventDefault();
            abrirModalAparcamiento();
          });
          mapa.on('mouseenter', aparcamiento.layerID, () => {
            mapa.getCanvas().style.cursor = 'pointer';
          });
          mapa.on('mouseleave', aparcamiento.layerID, () => {
            mapa.getCanvas().style.cursor = '';
          });
        });

      });

      function obtenerDireccionDeCoordenadas(e) {
        const longitud = e.lngLat.lng;
        const latitud = e.lngLat.lat;

        fetch(
          "https://api.mapbox.com/search/geocode/v6/reverse?longitude=" +
          longitud +
          "&latitude=" +
          latitud +
          "&access_token=" +
          mapboxgl.accessToken,
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (datos) {
            const address =
              datos.features[0]?.properties?.full_address ||
              datos.features[0]?.properties?.name ||
              "Dirección no encontrada";
            alert(
              "Coordenadas: " +
              longitud.toFixed(6) +
              ", " +
              latitud.toFixed(6) +
              "\nDirección: " +
              address,
            );
          })
          .catch(function (error) {
            alert(
              "Coordenadas: " +
              longitud.toFixed(6) +
              ", " +
              latitud.toFixed(6) +
              "\nError al obtener dirección",
            );
          });
      }

      function ModalAparcamiento() {
        const modal = document.createElement("modal-aparcamiento");
        document.body.appendChild(modal);
      }

      mapa.on("click", ModalAparcamiento);

      function buscarLugar(inputBusqueda) {
        const searchText = inputBusqueda.value;
        fetch(
          "https://api.mapbox.com/search/geocode/v6/forward?q=" +
          encodeURIComponent(searchText) +
          "&access_token=" +
          mapboxgl.accessToken,
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (datos) {
            const feature = datos.features[0];
            if (feature) {
              const longitudNuevaBusqueda = feature.geometry.coordinates[0];
              const latitudNuevaBusqueda = feature.geometry.coordinates[1];

              mapa.flyTo({
                center: [longitudNuevaBusqueda, latitudNuevaBusqueda],
                essential: true,
              });
            } else {
              alert("No se encontraron resultados para: " + searchText);
            }
          })
          .catch(function (error) {
            alert("Error al obtener coordenadas para: " + searchText);
          });
      }

      let formulario = document.querySelector("form");
      formulario.addEventListener("submit", enviarFormulario);
      function enviarFormulario(evento) {
        let input = document.querySelector("#busqueda");
        if (input.value.length != 0) {
          buscarLugar(input);
        }
        evento.preventDefault();
      }

      function crearPopupTituloParrafo(titulo, parrafo) {
        const popupTituloParrafo = new mapboxgl.Popup().setHTML(
          "<h3>" + titulo + "</h3><p>" + parrafo + "</p>",
        );

        return popupTituloParrafo;
      }

      const popupAnuncianteCasaLola = crearPopupTituloParrafo(
        "Casa Lola",
        "El mejor restaurante de la zona.",
      );
      const popupAnuncianteCasaPaco = crearPopupTituloParrafo(
        "Casa Paco",
        "El mejor restaurante de la zona.",
      );

      function crearPopupTitulo(titulo) {
        const popupTitulo = new mapboxgl.Popup().setHTML(
          "<h3>" + titulo + "</h3>",
        );

        return popupTitulo;
      }

      const popupUsuarioCasa = crearPopupTitulo("Mi Casa");
      const popupUsuarioColegio = crearPopupTitulo("Mi Cole");

      function crearPopupTexto(texto) {
        const popupTexto = new mapboxgl.Popup().setText(texto);

        return popupTexto;
      }

      const popupUsuarioUbicacion = crearPopupTexto("Mi ubi");

      function añadirMarcadorBasico(longitudX, latitudY, popup) {
        const marker = new mapboxgl.Marker({
          color: '#005a60',
          scale: 1,
          className: 'estadoVisualMarker',
        })
          .setLngLat([longitudX, latitudY])
          .setPopup(popup)
          .addTo(mapa);
        return marker;
      }

      const marcaUbi = añadirMarcadorBasico(-4.47234, 36.72372, popupUsuarioUbicacion);
      const marcaCasa = añadirMarcadorBasico(-4.47504, 36.72472, popupUsuarioCasa);
      const marcaCole = añadirMarcadorBasico(-4.47204, 36.71872, popupUsuarioColegio);

      let arrayMarcadoresUsurio = [marcaUbi, marcaCasa, marcaCole];

      let estadoMostar;
      function cambiarVisibilidadMarkUsuario() {
        if (botonMarcadoresUsuario.textContent == "Mostrar marcadores usuario") {
          estadoMostar = true;
        } else {
          estadoMostar = false;
        }
        for (let i = 0; i < arrayMarcadoresUsurio.length; i++) {
          if (estadoMostar) {
            arrayMarcadoresUsurio[i].removeClassName('estadoVisualMarker');
            if (i == (arrayMarcadoresUsurio.length - 1)) {
              botonMarcadoresUsuario.textContent = "Ocultar marcadores usuario";
            }
          } else {
            arrayMarcadoresUsurio[i].addClassName('estadoVisualMarker');
            if (i == (arrayMarcadoresUsurio.length - 1)) {
              botonMarcadoresUsuario.textContent = "Mostrar marcadores usuario";
            }
          }
        }

      }
      let botonMarcadoresUsuario = document.querySelector("#mostrarMarcadoresUsuario");
      botonMarcadoresUsuario.addEventListener("click", cambiarVisibilidadMarkUsuario);

      function añadirMarcadorPersonalizado(longitudX, latitudY, popup) {
        const anunciante = document.createElement('div');
        anunciante.className = 'custom-marker';
        anunciante.innerHTML = `<img src="../assets/imagotipoAparkt.png" alt="anunciante" style="width:60px;height:60px;display:block;">`;

        const markerAnunciante = new mapboxgl.Marker({
          className: 'estadoVisualMarker',
          element: anunciante,
          anchor: 'bottom'
        })
          .setLngLat([longitudX, latitudY])
          .setPopup(popup)
          .addTo(mapa);
        return markerAnunciante;
      }

      const marcaCasaLola = añadirMarcadorPersonalizado(-4.480782, 36.717794, popupAnuncianteCasaLola);
      const marcaCasaPaco = añadirMarcadorPersonalizado(-4.480700, 36.720100, popupAnuncianteCasaPaco);

      let arrayMarcadoresPersonalizados = [marcaCasaLola, marcaCasaPaco];

      let estadoMostarPersonalizados;
      function cambiarVisibilidadMarkPersonalizado() {
        if (botonMarcadoresAnunciante.textContent == "Mostrar marcadores anunciantes") {
          estadoMostarPersonalizados = true;
        } else {
          estadoMostarPersonalizados = false;
        }
        for (let i = 0; i < arrayMarcadoresPersonalizados.length; i++) {
          if (estadoMostarPersonalizados) {
            arrayMarcadoresPersonalizados[i].removeClassName('estadoVisualMarker');
            if (i == (arrayMarcadoresPersonalizados.length - 1)) {
              botonMarcadoresAnunciante.textContent = "Ocultar marcadores anunciantes";
            }
          } else {
            arrayMarcadoresPersonalizados[i].addClassName('estadoVisualMarker');
            if (i == (arrayMarcadoresPersonalizados.length - 1)) {
              botonMarcadoresAnunciante.textContent = "Mostrar marcadores anunciantes";
            }
          }
        }

      }
      let botonMarcadoresAnunciante = document.querySelector("#mostrarMarcadoresAnunciante");
      botonMarcadoresAnunciante.addEventListener("click", cambiarVisibilidadMarkPersonalizado);

    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
});

function configurarUIUsuarioLogueado(usuario) {
  console.log('Usuario logueado:', usuario);

  const perfilBtn = document.getElementById('perfilUsuario');
  if (perfilBtn) {
    perfilBtn.addEventListener('click', () => {
      const banner = document.getElementById('bannerUsuario');
      if (banner) {
        banner.classList.add('abierto');
      }
    });
  }

  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => cerrarSesion());
  }
}

function configurarUIUsuarioNoLogueado() {
  console.log('Usuario no logueado');

  const perfilBtn = document.getElementById('perfilUsuario');
  if (perfilBtn) {
    perfilBtn.addEventListener('click', () => {
      window.location.href = "../login/login.html";
    });
  }
}
