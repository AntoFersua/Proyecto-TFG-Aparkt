import {
  obtenerSesion,
  iniciarAuth,
  obtenerUsuario,
  cerrarSesion,
} from "../auth.js";
import "../components/Header.js";
import "../components/PerfilUsuario.js";
import "../components/ModalAparcamiento.js";
import { cargarTraducciones, aplicarTraducciones, t } from '../translator.js';

let usuarioActual = null;
let idUsuarioActual = null;

window.addEventListener("DOMContentLoaded", async function () {
  
  // Botón de lupa para interactividad
  const btnLupa = document.getElementById('btn-lupa');
  const menuInteractividad = document.getElementById('menu-interactividad');
  
  if (btnLupa && menuInteractividad) {
    btnLupa.addEventListener('click', (e) => {
      e.stopPropagation();
      btnLupa.classList.toggle('active');
      menuInteractividad.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      btnLupa.classList.remove('active');
      menuInteractividad.classList.remove('active');
    });

    menuInteractividad.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  await cargarTraducciones();
  aplicarTraducciones();
  // Verificar sesión
  await iniciarAuth({
    alLoguearse: async (usuario) => {
      await configurarUIUsuarioLogueado(usuario);
    },
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    },
  });

  //console.log("Usuario actual en DOMContentLoaded:", idUsuarioActual);

  // Cargar mapa
  fetch("../../config/config.php")
    .then(function (response) {
      //Mostrar mensaje y convertir la respuesta en JSON
      console.log("Status:", response.status);
      return response.json();
    })
    .then(function (data) {
      //Token
      mapboxgl.accessToken = data.MAPS_API_KEY;

      //Mapa
      const mapa = new mapboxgl.Map({
        //id del div donde se carga el mapa
        container: "mapa",
        style: "mapbox://styles/mapbox/standard",
        //Globo terráqueo
        projection: "globe",
        zoom: 15,
        //Coordenadas Teatinos
        center: [-4.478687, 36.720945],
      });

      //Cuando el estilo del mapa se carga, se establece la niebla por defecto
      mapa.on("style.load", function () {
        mapa.setFog({});
      });

      //Cuando el mapa termina de cargar
      mapa.on("load", function () {
        mapa.addControl(new mapboxgl.NavigationControl());

        //Indicar estado de aparcamiento
        function estadoAparcamiento(
          longitudX,
          latitudY,
          radioCirculo,
          idSource,
          idCapa,
          colorRelleno,
          colorBorde,
        ) {
          //Coordenada de la señal
          const centro = [longitudX, latitudY];
          //Radio del circulo en metros
          const radio = radioCirculo;
          const opciones = {
            //Numero de pts del circulo
            steps: 64,
            units: "meters",
            properties: {},
          };
          //crear el circulo
          const circulo = turf.circle(centro, radio, opciones);
          //Añadir datos geograficos al mapa en forma de geojson
          mapa.addSource(idSource, {
            type: "geojson",
            data: circulo,
          });
          //Añadir capa visual al mapa
          mapa.addLayer({
            //identificador de la capa
            id: idCapa,
            //de tipo poligono con relleno
            type: "fill",
            //enlazar con la fuente zona
            source: idSource,
            //controlar el estado de visibilidad inicial
            layout: {
              visibility: "none",
            },
            paint: {
              "fill-color": colorRelleno,
              "fill-outline-color": colorBorde,
            },
          });
          return {
            sourceID: idSource,
            layerID: idCapa,
          };
        }

        const zona1 = estadoAparcamiento(
          -4.476059,
          36.718963,
          100,
          "zona1",
          "zona1-fill",
          "rgba(255, 0, 0, 0.3)",
          "red",
        );

        //eliminar layer y luego source
        //mapa.removeLayer(zona1.layerID);
        //mapa.removeSource(zona1.sourceID);

        const zona2 = estadoAparcamiento(
          -4.478242,
          36.720887,
          180,
          "zona2",
          "zona2-fill",
          "rgba(0, 255, 0, 0.3)", 
          "green"
        );

        const zona3 = estadoAparcamiento(
          -4.473810,
          36.720816,
          140,
          "zona3",
          "zona3-fill",
          "rgba(0, 255, 0, 0.3)", 
          "green"
        );

        const zona4 = estadoAparcamiento(
          -4.475607,
          36.723248,
          160,
          "zona4",
          "zona4-fill",
          "rgba(255, 0, 0, 0.3)",
          "red"
        );

        const zona5 = estadoAparcamiento(
          -4.483850,
          36.721974,
          200,
          "zona5",
          "zona5-fill",
          "rgba(255, 0, 0, 0.3)",
          "red"
        );

        const zona6 = estadoAparcamiento(
          -4.479964,
          36.723565,
          100,
          "zona6",
          "zona6-fill",
          "rgba(255, 165, 0, 0.3)", 
          "orange"
        );

        const zona7 = estadoAparcamiento(
          -4.482157,
          36.719429,
          100,
          "zona7",
          "zona7-fill",
          "rgba(255, 165, 0, 0.3)", 
          "orange"
        );


        //array con todas las zonas de estados creadas
        let arrayEstadosAparcamientos = [zona1, zona2, zona3, zona4, zona5, zona6, zona7];

        function cambiarEstado() {
          //recorrer el array arrayEstadosAparcamientos
          for (let i = 0; i < arrayEstadosAparcamientos.length; i++) {
            //obtener la visibilidad actual del elemento
            let estado = mapa.getLayoutProperty(
              arrayEstadosAparcamientos[i].layerID,
              "visibility",
            );

            //si es visible, ocualtar estados y cambiar mensaje
            if (estado === "visible") {
              mapa.setLayoutProperty(
                arrayEstadosAparcamientos[i].layerID,
                "visibility",
                "none",
              );
              botonEstadosAparcamientos.querySelector("span").textContent =
                "Mostrar estados aparcamientos";
            } else {
              mapa.setLayoutProperty(
                arrayEstadosAparcamientos[i].layerID,
                "visibility",
                "visible",
              );
              botonEstadosAparcamientos.querySelector("span").textContent =
                "Ocultar estados aparcamientos";
            }
          }
        }
        //Obtener el botón de ver estados
        let botonEstadosAparcamientos = document.querySelector(
          "#mostrarEstadosAparcamientos",
        );
        //Aplicar listener
        botonEstadosAparcamientos.addEventListener("click", cambiarEstado);

        /*
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
        const aparcamiento22 = estadoAparcamiento(-4.478120, 36.721014, 3, "aparcamiento22", "aparcamiento22-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento23 = estadoAparcamiento(-4.478085, 36.721070, 3, "aparcamiento23", "aparcamiento23-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento24 = estadoAparcamiento(-4.478042, 36.721132, 3, "aparcamiento24", "aparcamiento24-fill", "rgba(0, 255, 0, 0.3)", "green");
        const aparcamiento25 = estadoAparcamiento(-4.478005, 36.721189, 3, "aparcamiento25", "aparcamiento25-fill", "rgba(255, 0, 0, 0.3)", "red");
        const aparcamiento26 = estadoAparcamiento(-4.477965, 36.721239, 3, "aparcamiento26", "aparcamiento26-fill", "rgba(0, 255, 0, 0.3)", "green");
*/      
        let estadoOcupacion; //variable que se usará para determinar el estado de la plaza de aparacmiento en función de su color de estado
        // Función para abrir el modal del aparcamiento
        async function abrirModalAparcamiento() {
          //busca si existe un modal de aparcamiento en el DOM
          const modalExistente = document.querySelector("modal-aparcamiento");
          //Si existe, lo elimina para que no haya duplicados
          if (modalExistente) {
            modalExistente.remove();
          }
          //crear un elemento de modal-aparcamiento
          const modal = document.createElement("modal-aparcamiento");
          //asignar estado de la plaza para en función del estado actual de la plaza se enseña un botón u otro, de esta forma se le pasa el valor al modal
          modal.estadoOcupacionPlaza = estadoOcupacion; 
          //ENVIAR POR PARAMETRO?????????????????????????????''
          //añade el modal al body
          document.body.appendChild(modal);
          //retorna la promesa una vez que el modal haya sido cerrado
          return await modal.resultado;
        }

        function actualizarOcupacionPlazas() {
          //obtener datos de la BBDD desde PlazaAparcamientoController.php
          fetch("../../controllers/PlazaAparcamientoController.php")
            .then(function (response) {
               //sacar el estado de la respuesta 
              console.log("Status:", response.status);
              //convertir la respuesta a json
              return response.json();
            })
            .then(function (data) {
              //si el estado es correcto
              if (data.status === "ok") {
                //obtener los datos de las plazas
                const plazasEspecificadas = data.data;
                //recorrer datos del id de la capa y ocupación de cada plaza y guardar en variables 
                plazasEspecificadas.forEach(function (plaza) {
                  let capaIDPlaza = plaza.capaID;
                  let ocupadoPlaza = plaza.ocupado;
                  let colorRellenoPlaza;
                  let colorBordePlaza;
                  //determinar el color segun el estado de ocupación, verde está libre y rojo está ocupado
                  if (ocupadoPlaza == 0) {
                    colorRellenoPlaza = "rgba(0, 255, 0, 0.3)";
                    colorBordePlaza = "green";
                  } else {
                    colorRellenoPlaza = "rgba(255, 0, 0, 0.3)";
                    colorBordePlaza = "red";
                  }
                  //actualizar los colores del estado de las plazas en el mapa
                  mapa.setPaintProperty(capaIDPlaza, 'fill-color', colorRellenoPlaza);
                  mapa.setPaintProperty(capaIDPlaza, 'fill-outline-color', colorBordePlaza);
                });

              }

            })
            .catch(function (err) {
              console.error("Error al actualizar el estado de ocupación de las plazas:", err);
            });
        }

        //crear array de aparcamientos
        let arrayAparcamientos = [];
        //obtener datos de la BBDD desde PlazaAparcamientoController.php
        fetch("../../controllers/PlazaAparcamientoController.php")
          .then(function (response) {
            //sacar el estado de la respuesta
            console.log("Status:", response.status);
            //convertir la respuesta a json
            return response.json();
          })
          .then(function (data) {
            //si el estado es correcto
            if (data.status === "ok") {
              //obtener los datos de las plazas
              const plazas = data.data;

              //recorrer datos de cada plaza y guardar en variables
              plazas.forEach(function (plaza) {
                let longitudPlaza = plaza.longitud;
                let latitudPlaza = plaza.latitud;
                let radioPlaza = plaza.tamano;
                let sourceIDPlaza = plaza.sourceID;
                let capaIDPlaza = plaza.capaID;
                let ocupadoPlaza = plaza.ocupado;
                let colorRellenoPlaza;
                let colorBordePlaza;

                //determinar el color segun el estado de ocupación, verde está libre y rojo está ocupado
                if (ocupadoPlaza == 0) {
                  colorRellenoPlaza = "rgba(0, 255, 0, 0.3)";
                  colorBordePlaza = "green";
                } else {
                  colorRellenoPlaza = "rgba(255, 0, 0, 0.3)";
                  colorBordePlaza = "red";
                }

                //representar aparcamientos
                //valores de la función a llamar --> longitudX, latitudY, radioCirculo, idSource, idCapa, colorRelleno, colorBorde
                let aparcamiento = estadoAparcamiento(
                  longitudPlaza,
                  latitudPlaza,
                  radioPlaza,
                  sourceIDPlaza,
                  capaIDPlaza,
                  colorRellenoPlaza,
                  colorBordePlaza,
                );

                //añadir aparcamientos al array
                arrayAparcamientos.push(aparcamiento);
              });
              //console.log(arrayAparcamientos); //0: {sourceID: 'aparcamiento1', layerID: 'aparcamiento1-fill'}...

              //Acceder a un indicador de aparcamiento, cuando se hace click en una capa concreta
              arrayAparcamientos.forEach((parking) => {
                //si se hace click en una capa concreta de aparcamiento
                mapa.on("click", parking.layerID, async (e) => {
                  e.preventDefault();
                  //console.log(parking.layerID);
                  //e.features permite acceder a las propiedades geográficas del objeto e y obtener el idSource y el idCapa
                  console.log(e.features);
                  console.log(e.features[0]["source"]);
                  //guardar valor del aparcamiento seleccionado antes del await, los datos del objeto se limpian
                  let aparcamientoSeleccionado = e.features[0]["source"];

                  //guardar valor del color del estado 
                  let colorEstado = e.features[0]["layer"]["paint"]["fill-color"];
                  console.log(colorEstado); //da un objeto ar {r: 0, g: 1, b: 0, a: 0.3}, la r o la g varian en funcion del estado del aparcamiento
                  estadoOcupacion = (colorEstado.g == 1) ? 0 : 1; //0 es libre y 1 es ocupado

                  //abrir el modal y esperar la respuesta del usuario y guardarla, la acción será ocupar o liberar
                  let accion = await abrirModalAparcamiento();
                  console.log(accion);

                  // Cambiar cursor al pasar por encima
                  mapa.on("mouseenter", parking.layerID, () => {
                    mapa.getCanvas().style.cursor = "pointer";
                  });
                  mapa.on("mouseleave", parking.layerID, () => {
                    mapa.getCanvas().style.cursor = "";
                  });

                  //si se confirma la ocupacion
                  /*let accionBotonLiberar = document.querySelector("#botonLiberarPlaza").value;
                  let accionBotonOcupar = document.querySelector("#botonOcuparPlaza").value;

                  let accion2;
                  if(accionBotonLiberar == "accionSeleccionadaLiberar"){
                    accion2 = liberar;
                    console.log("boton ocupar accion " + accionBotonOcupar);
                    console.log("boton liberr accion " + accionBotonLiberar);
                    console.log(accion2); 
                  }else if(accionBotonOcupar == "accionSeleccionadaOcupar"){
                    accion2 = ocupar;
                    console.log("boton ocupar accion " + accionBotonOcupar);
                    console.log("boton liberr accion " + accionBotonLiberar);
                    console.log(accion2); 
                  }*/
                  
                  
                  //si la acción es ocupar
                  if (accion == "ocupar") {
                    console.log("entrao ocupar");
                    //datos a enviar al backend
                    const datos = {
                      sourceID: aparcamientoSeleccionado,
                      action: accion,
                      usuarioID: idUsuarioActual,
                    };
                    console.log(datos);
                    //enviar datos al backend mediante POST en json
                    fetch(
                      "../../controllers/PlazaAparcamientoController.php?action=" +
                        accion,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datos),
                      },
                    )
                      //respuesta del backend, convertir la respuesta http a json
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        console.log(data.mensaje);
                        //si el status es ok
                        if (data.status === "ok") {
                          window.Swal.fire({ icon: 'success', title: data.mensaje, timer: 1500, showConfirmButton: false });
                          //llamar función de actualizarPlazas para cambiar el estado de ocupación (rojo o verde)
                          actualizarOcupacionPlazas(); 
                        } else {
                          //mostrar un mensaje del backend o uno por defecto
                          window.Swal.fire({ icon: 'error', title: data.mensaje || "Error al guardar el estado", timer: 3000, showConfirmButton: false });
                          console.log("Error");
                        }
                      })
                      //capturar errores
                      .catch((err) => {
                        console.error(err);
                        window.Swal.fire({ icon: 'error', title: "Error al guardar datos", timer: 3000, showConfirmButton: false });
                      });
                  } else if (accion == "liberar") {
                    console.log("entrao liberar");
                    //datos a enviar al backend
                    const datos = {
                      sourceID: aparcamientoSeleccionado,
                      action: accion,
                      //el dato de usuarioID se envia para futuros cambios, de momento no tiene importancia ya que al liberar la plaza, el usuario se va a poner a NULL ya que la plaza esta libre
                      usuarioID: idUsuarioActual,
                    };
                    console.log(datos);
                    //enviar datos al backend mediante POST en json
                    fetch(
                      "../../controllers/PlazaAparcamientoController.php?action=" +
                        accion,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datos),
                      },
                    )
                      //respuesta del backend, convertir la respuesta http a json
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        console.log(data.mensaje);
                        //si el status es ok
                        if (data.status === "ok") {
                          window.Swal.fire({ icon: 'success', title: data.mensaje, timer: 1500, showConfirmButton: false });
                          //llamar función de actualizarPlazas para cambiar el estado de ocupación (rojo o verde)
                          actualizarOcupacionPlazas(); 
                        } else {
                          //mostrar un mensaje del backend o uno por defecto
                          window.Swal.fire({ icon: 'error', title: data.mensaje || t('index.errorGuardarEstado'), timer: 3000, showConfirmButton: false });
                          console.log("Error");
                        }
                      })
                      //capturar errores
                      .catch((err) => {
                        console.error(err);
                        window.Swal.fire({ icon: 'error', title: t('index.errorGuardarDatos'), timer: 3000, showConfirmButton: false });
                      });
                  }
                });
              });
            }
          })
          //catch con errores de la petición inicial
          .catch(function (error) {
            console.log("Error:", error);
          });
        //modal creado , boton que llama a una funcion y esa funcion tiene el modal en funciones globales, importar modal al js
        //en caso de que sea null, se mete en el error igualemnte, recargar estacionamientos, en caso de que le de 2 veces a ocupado teniendo en cuenta la BBDD o el colorsss
        //pasar cambios, meter usuario  s
        //revidar php tema de BBDD aparkamiento
        //revisar puntuacion, revisar comentarios ok
        //////////////////QUITAR APARCAMIENTO 14 DE LA BBDD ESTA REPE CON EL 4

        /*mapa.addInteraction('click', {
                  type: 'click',
                  //indicar capa dónde se actúa
                  target: { layerId: 'aparcamiento1-fill' },
                  //target: { layerId: parking.layerID },
                  //cuando ocurre el evento se realiza la acción
                  handler: ({ feature }) => {
                    console.log(feature);
                    console.log(feature.source);
                  }
        });*/

        //array con todas los aparcamientos creados
        //posible mejorar accediendo a la BBDD guardando el idSource y añadirlo con for al array
        /*
        let arrayAparcamientos = [aparcamiento1, aparcamiento2, aparcamiento3, aparcamiento4, aparcamiento5, aparcamiento6, aparcamiento7, aparcamiento8, aparcamiento9,
          aparcamiento10, aparcamiento11, aparcamiento12, aparcamiento13, aparcamiento14, aparcamiento15, aparcamiento16, aparcamiento17, aparcamiento18, aparcamiento19,
          aparcamiento20, aparcamiento21, aparcamiento23, aparcamiento24, aparcamiento25, aparcamiento26, aparcamiento27]; 

*/
        function cambiarVisibilidadPlazas() {
          //recorrer el array arrayAparcamientos
          for (let i = 0; i < arrayAparcamientos.length; i++) {
            //obtener la visibilidad actual del elemento
            let estadoPlazas = mapa.getLayoutProperty(
              arrayAparcamientos[i].layerID,
              "visibility",
            );

            //si es visible, ocualtar estados y cambiar mensaje
            if (estadoPlazas === "visible") {
              mapa.setLayoutProperty(
                arrayAparcamientos[i].layerID,
                "visibility",
                "none",
              );
              botonAparcamientos.querySelector("span").textContent = "Mostrar aparcamientos";
            } else {
              mapa.setLayoutProperty(
                arrayAparcamientos[i].layerID,
                "visibility",
                "visible",
              );
              botonAparcamientos.querySelector("span").textContent = "Ocultar aparcamientos";
            }
          }
        }
        //Obtener el botón de ver estados
        let botonAparcamientos = document.querySelector(
          "#mostrarAparcamientos",
        );
        //Aplicar listener
        botonAparcamientos.addEventListener("click", cambiarVisibilidadPlazas);

        /*
         function ModalAparcamiento() {
            const modal = document.createElement("modal-aparcamiento");
            document.body.appendChild(modal);
          }

          mapa.on("click", ModalAparcamiento);
*/
          //mapa.on("click", obtenerDireccionDeCoordenadas);

      });

      //Obtener las coordenadas y la dirección de una ubi específica
      function obtenerDireccionDeCoordenadas(e) {
        //Obtener latitud y longitud, se accede mediante las propiedades del objeto. e.lngLat da latitud y longitud juntas
        const longitud = e.lngLat.lng;
        const latitud = e.lngLat.lat;

        //Obtener la dirección a partir de las coordenadas mediante la API de geocoding inverso de Mapbox
        fetch(
          "https://api.mapbox.com/search/geocode/v6/reverse?longitude=" +
            longitud +
            "&latitude=" +
            latitud +
            "&access_token=" +
            mapboxgl.accessToken,
        )
          .then(function (response) {
            //Convertir la respuesta en JSON
            return response.json();
          })
          //Procesar datos obtenidos
          .then(function (datos) {
            /*Se obtiene el nombre del lugar completo con calle, provincia y país o solo el nombre de la calle o un nombre de la calle o un mensaje por defecto.
                        Se accede al elemento 0 del array features de datos, si existe se accede a properties, si existe se accede a full_address en caso de que no se sigue con name...
                        console.log(datos);*/
            const address =
              datos.features[0]?.properties?.full_address ||
              datos.features[0]?.properties?.name ||
              t('index.direccionNoEncontrada');
              window.Swal.fire({
              icon: 'info',
              html: "Coordenadas: " + longitud.toFixed(6) + ", " + latitud.toFixed(6) + "<br>Dirección: " + address,
              confirmButtonText: 'OK'
            });
          })
          //En caso de error
          .catch(function (error) {
            window.Swal.fire({
              icon: 'warning',
              html: "Coordenadas: " + longitud.toFixed(6) + ", " + latitud.toFixed(6) + "<br>Error al obtener dirección",
              confirmButtonText: 'OK'
            });
          });
      }

      //Redirigir el mapa a la nueva ubicación
      function buscarLugar(inputBusqueda) {
        //Obtener el texto de la barra de navegación de búsqueda
        const searchText = inputBusqueda.value;
        //Llamada a la API de geocoding directo de Mapbox, uso de encodeURIComponent para evitar carácteres raros en URL
        fetch(
          "https://api.mapbox.com/search/geocode/v6/forward?q=" +
            encodeURIComponent(searchText) +
            "&access_token=" +
            mapboxgl.accessToken,
        )
          .then(function (response) {
            //Convertir la respuesta en JSON
            return response.json();
          })
          //Procesar datos obtenidos
          .then(function (datos) {
            const feature = datos.features[0];
            //si feature tiene datos
            if (feature) {
              //Obtener coordenadas de longitud y latitud
              const longitudNuevaBusqueda = feature.geometry.coordinates[0];
              const latitudNuevaBusqueda = feature.geometry.coordinates[1];

              //Mover la ubicación del mapa con la función flyto
              mapa.flyTo({
                center: [longitudNuevaBusqueda, latitudNuevaBusqueda],
                essential: true, //Asegura que la animación se realice
              });
            } else {
              window.Swal.fire({ icon: 'warning', title: t('index.sinResultados').replace('{query}', searchText), timer: 3000, showConfirmButton: false });
            }
          })
          //En caso de error
          .catch(function (error) {
            window.Swal.fire({ icon: 'error', title: "Error al obtener coordenadas para: " + searchText, timer: 3000, showConfirmButton: false });
          });
      }

      //Obtener el formulario de realizar una búsqueda
      let formulario = document.querySelector("#form-busqueda");
      //Aplicar listener en caso de que sea enviado
      if (formulario) {
        formulario.addEventListener("submit", enviarFormulario);
      }

      //Escuchar evento de búsqueda desde el header
      document.addEventListener('buscarDireccion', function(e) {
        buscarLugar({ value: e.detail.direccion });
      });
      //Evento es un objeto
      function enviarFormulario(evento) {
        //Obtener el input
        let input = document.querySelector("#busqueda");
        //Si no está vacio se llama a la función
        if (input.value.length != 0) {
          buscarLugar(input);
        }
        //Parar para no recargar la página
        evento.preventDefault();
      }
      //formulario.removeEventListener("click", enviarFormulario);

      //Crear popup con titulo y texto
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

      //Forma sin función
      /*const popupAnuncianteCasaLola = new mapboxgl.Popup()
            .setHTML('<h3>Casa Lola</h3><p>El mejor restaurante de la zona.</p>');*/

      //Crear popup con solo titulo
      function crearPopupTitulo(titulo) {
        const popupTitulo = new mapboxgl.Popup().setHTML(
          "<h3>" + titulo + "</h3>",
        );

        return popupTitulo;
      }

      const popupUsuarioCasa = crearPopupTitulo("Mi Casa");
      const popupUsuarioColegio = crearPopupTitulo("Mi Cole");

      //Crear popup con solo texto
      function crearPopupTexto(texto) {
        const popupTexto = new mapboxgl.Popup().setText(texto);

        return popupTexto;
      }

      const popupUsuarioUbicacion = crearPopupTexto("Mi ubi");

      //Forma sin función
      /*const popupUsuarioUbicacion = new mapboxgl.Popup()
            .setText('Mi ubi');*/

      //añadir marcador basico
      function añadirMarcadorBasico(longitudX, latitudY, popup) {
        const marker = new mapboxgl.Marker({
          color: "#005a60",
          scale: 1,
          className: "estadoVisualMarker",
          //arrastrable
          //draggable: true
        })
          //Asignar coordenadas
          .setLngLat([longitudX, latitudY])
          //Crear un popup que indique info del marcador
          .setPopup(popup) //.setPopup(new mapboxgl.Popup().setText('Aquí hay un parking'))
          //Añadir al mapa
          .addTo(mapa); //se usa el encadenamiento de métodos porque cada método devuelve el propio objeto this, es igual que hacer marker.addTo(mapa)
        return marker;
      }

      //crear marcadores
      const marcaUbi = añadirMarcadorBasico(
        -4.47234,
        36.72372,
        popupUsuarioUbicacion,
      );
      const marcaCasa = añadirMarcadorBasico(
        -4.47504,
        36.72472,
        popupUsuarioCasa,
      );
      const marcaCole = añadirMarcadorBasico(
        -4.47204,
        36.71872,
        popupUsuarioColegio,
      );
      //marcaUbi.remove();

      //array con todas los marcadores del usuario creados
      let arrayMarcadoresUsurio = [marcaUbi, marcaCasa, marcaCole];

      //función mostrar/ocultar marcadores
      let estadoMostar;
      function cambiarVisibilidadMarkUsuario() {
        //semáforo para indicar si se debe de añadir o eliminar la clase según el textContent
        if (
          botonMarcadoresUsuario.querySelector("span").textContent == "Mostrar marcadores usuario"
        ) {
          estadoMostar = true;
        } else {
          estadoMostar = false;
        }
        //recorrer el array arrayMarcadoresUsurio
        for (let i = 0; i < arrayMarcadoresUsurio.length; i++) {
          //si no son visibles los marcadores, mostrar y cambiar el mensaje a ocultar
          if (estadoMostar) {
            arrayMarcadoresUsurio[i].removeClassName("estadoVisualMarker");
            //si es el último elemento
            if (i == arrayMarcadoresUsurio.length - 1) {
              botonMarcadoresUsuario.querySelector("span").textContent = "Ocultar marcadores usuario";
            }
          } else {
            arrayMarcadoresUsurio[i].addClassName("estadoVisualMarker");
            if (i == arrayMarcadoresUsurio.length - 1) {
              botonMarcadoresUsuario.querySelector("span").textContent = "Mostrar marcadores usuario";
            }
          }
        }
      }
      //Obtener el botón de ver estados
      let botonMarcadoresUsuario = document.querySelector(
        "#mostrarMarcadoresUsuario",
      );
      //Aplicar listener
      botonMarcadoresUsuario.addEventListener(
        "click",
        cambiarVisibilidadMarkUsuario,
      );

      //añadir marcador Personalizado Logo
      function añadirMarcadorPersonalizado(longitudX, latitudY, popup) {
        const anunciante = document.createElement("div");
        anunciante.className = "custom-marker";
        anunciante.innerHTML = `<img src="../assets/imagotipoAparkt.webp" alt="anunciante" style="width:60px;height:60px;display:block;">`;

        const markerAnunciante = new mapboxgl.Marker({
          className: "estadoVisualMarker",
          element: anunciante,
          anchor: "bottom", //se centra lo de abajo
        })
          .setLngLat([longitudX, latitudY])
          .setPopup(popup)
          .addTo(mapa);
        return markerAnunciante;
      }

      const marcaCasaLola = añadirMarcadorPersonalizado(
        -4.480782,
        36.717794,
        popupAnuncianteCasaLola,
      );
      const marcaCasaPaco = añadirMarcadorPersonalizado(
        -4.4807,
        36.7201,
        popupAnuncianteCasaPaco,
      );
      //marcaCasaLola.remove();

      //array con todas los marcadores personalizados creados
      let arrayMarcadoresPersonalizados = [marcaCasaLola, marcaCasaPaco];

      //función mostrar/ocultar marcadores
      let estadoMostarPersonalizados;
      function cambiarVisibilidadMarkPersonalizado() {
        //semáforo para indicar si se debe de añadir o eliminar la clase según el textContent
        if (
          botonMarcadoresAnunciante.querySelector("span").textContent ==
          "Mostrar marcadores anunciantes"
        ) {
          estadoMostarPersonalizados = true;
        } else {
          estadoMostarPersonalizados = false;
        }
        //recorrer el array arrayMarcadoresPersonalizados
        for (let i = 0; i < arrayMarcadoresPersonalizados.length; i++) {
          //si no son visibles los marcadores, mostrar y cambiar el mensaje a ocultar
          if (estadoMostarPersonalizados) {
            arrayMarcadoresPersonalizados[i].removeClassName(
              "estadoVisualMarker",
            );
            //si es el último elemento
            if (i == arrayMarcadoresPersonalizados.length - 1) {
              botonMarcadoresAnunciante.querySelector("span").textContent =
                "Ocultar marcadores anunciantes";
            }
          } else {
            arrayMarcadoresPersonalizados[i].addClassName("estadoVisualMarker");
            if (i == arrayMarcadoresPersonalizados.length - 1) {
              botonMarcadoresAnunciante.querySelector("span").textContent =
                "Mostrar marcadores anunciantes";
            }
          }
        }
      }
      //Obtener el botón de ver estados
      let botonMarcadoresAnunciante = document.querySelector(
        "#mostrarMarcadoresAnunciante",
      );
      //Aplicar listener
      botonMarcadoresAnunciante.addEventListener(
        "click",
        cambiarVisibilidadMarkPersonalizado,
      );
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
});

async function configurarUIUsuarioLogueado(usuario) {
  // console.log("Usuario logueado:", usuario);

  idUsuarioActual = await obtenerIdUsuario();

  //console.log("ID Usuario actual:", idUsuarioActual);

  // Botón de perfil - abrir banner
  const perfilBtn = document.getElementById("perfilUsuario");

  if (perfilBtn) {
    perfilBtn.addEventListener("click", () => {
      const banner = document.getElementById("bannerUsuario");
      if (banner) {
        banner.classList.add("abierto");
      }
    });
  }

  // Buscamos el contenedor existente
  const contenedor = document.getElementById("menu-interactividad");

  function crearBotonConIcono(id, texto, svgHTML) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.innerHTML = svgHTML + '<span>' + texto + '</span>';
    return btn;
  }

  const iconoAparcamientos = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/></svg>';
  const iconoMarcadoresUsuario = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  const iconoMarcadoresAnunciante = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  // BOTÓN: Mostrar aparcamientos
  const btnAparcamientos = crearBotonConIcono("mostrarAparcamientos", "Mostrar aparcamientos", iconoAparcamientos);

  // BOTÓN: Mostrar marcadores usuario
  const btnMarcadoresUsuario = crearBotonConIcono("mostrarMarcadoresUsuario", "Mostrar marcadores usuario", iconoMarcadoresUsuario);

  // BOTÓN: Mostrar marcadores anunciantes
  const btnMarcadoresAnunciante = crearBotonConIcono("mostrarMarcadoresAnunciante", "Mostrar marcadores anunciantes", iconoMarcadoresAnunciante);

  // Añadir al contenedor existente
  contenedor.appendChild(btnAparcamientos);
  contenedor.appendChild(btnMarcadoresUsuario);
  contenedor.appendChild(btnMarcadoresAnunciante);

  // Logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => cerrarSesion());
  }
}

function configurarUIUsuarioNoLogueado() {
  console.log("Usuario no logueado");

  const perfilBtn = document.getElementById("perfilUsuario");
  if (perfilBtn) {
    perfilBtn.addEventListener("click", () => {
      window.location.href = "../login/login.html";
    });
  }
}

async function obtenerIdUsuario() {
  const usuario = await obtenerSesion();
  return usuario.usuario_id;
}