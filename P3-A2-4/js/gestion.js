// Código inicial práctica - Tecnologías Emergentes
// Autora: M. García Valls
// Versión: Inicial v0.01

var vuelosAsignados = []; // Vector global de vuelos que tienen tripulación asignada

// Función para registrar un nuevo vuelo (Ya implementada)
document
  .getElementById("formAltaVuelo")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    var codigoVuelo = document.getElementById("codigoVuelo").value;
    var distancia = parseInt(document.getElementById("distancia").value);
    var mtow = parseInt(document.getElementById("mtow").value);
    var mfc = parseInt(document.getElementById("mfc").value);
    var nCabina = parseInt(document.getElementById("nCabina").value);
    var nVuelo = parseInt(document.getElementById("nVuelo").value);

    // Comprobar si el vuelo ya existe
    if (vuelos.find((v) => v.codigo === codigoVuelo)) {
      alert("El vuelo ya existe.");
      return;
    }

    // Crear y agregar nuevo vuelo
    var nuevoVuelo = {
      codigo: codigoVuelo,
      distancia: distancia,
      mtow: mtow,
      mfc: mfc,
      nTripulantesCabina: nCabina,
      nTripulantesVuelo: nVuelo,
    };
    vuelos.push(nuevoVuelo);
    alert("Vuelo registrado exitosamente.");
  });

// *** Funciones que implementan la parte de lógica de aplicación ***/
//
//

function ordenarVuelosPorDistancia() {
  // Ya implementada
  for (var i = 0; i < vuelos.length - 1; i++) {
    for (var j = 0; j < vuelos.length - i - 1; j++) {
      if (vuelos[j].distancia > vuelos[j + 1].distancia) {
        var temp = vuelos[j];
        vuelos[j] = vuelos[j + 1];
        vuelos[j + 1] = temp;
      }
    }
  }
  console.log(vuelos);
}

// Función asignarTripulantes devuelve códigos:
// 1 si vuelo no encontrado
// 2 si no hay CAPT disponible
// 3 si no hay FO disponible
// 4 si no hay SO disponible
// 5 si no hay FA disponible (no suficientes FAs)
// 10 si se han asignado correctamente (código de éxito)

var tripulantesAsignados = []; // vector de tripulantes asignados hasta el momento al vuelo actual
function asignarTripulantes(codigoVuelo) {
  // Codifique aquí !!!!
  // Buscar el vuelo por su código - recorrer vector vuelos. Si no encuentra el vuelo devolver código 1
    var vuelo = null;
    for (let i in vuelos) {  // recorremos el vector de vuelos
        if (codigoVuelo === vuelos[i].codigo) {   // === compara valor y tipo
            vuelo = vuelos[i];
            break; // Salimos bucle si se encuentra
        }
    }
    if (!vuelo) {
        return 1; // Código 1: vuelo no encontrado
    }

    var tripulantesAsignados = [] ;
    // Cada vuelo tiene asignado una distancia y un número de tripulantes
    var {distancia, nTripulantesCabina} = vuelo;
    // Larga distancia si distancia es > 3000 km
    var largaDistancia = distancia > 3000;

    // Asignamos capitán al vuelo usando la función buscarTripulante
    var capitan = buscarTripulante("CAPT");
    if (!capitan){
        return 2 ;    // Código 2: CAPT no disponible
    } else {
        tripulantesAsignados.push(capitan) ;
    }

    // Asignamos primer oficial al vuelo usando la función buscarTripulante
    var primerOficial = buscarTripulante("FO");
    if (!primerOficial){
        return 3 ;    // Código 3: FO no disponible
    } else {
        tripulantesAsignados.push(primerOficial) ;
    }

    // Asignamos segundo oficial al vuelo si es de larga distancia
    if (largaDistancia){
        var segundoOficial = buscarTripulante("SO");
        if (!segundoOficial){
            return 4 ;    // Código 4: SO no disponible
        } else {
            tripulantesAsignados.push(segundoOficial) ;
        }
    }

    for (let i = 0; i < nTripulantesCabina; i++){
      var fa = buscarTripulante("FA");
      if (!fa){
          return 5 ;    // Código 5: No suficientes FAs disponibles
      } else {
          tripulantesAsignados.push(fa) ;
      }
    }



    // Asignamos FAs al vuelo
    /*for (let i = 0; i < nTripulantesCabina; i++){
        var fa = buscarTripulante("FA");
        if (!fa){
            return 5 ;    // Código 5: No suficientes FAs disponibles
        } else {
            tripulantesAsignados.push(fa) ;
        }
    }*/

    // Si llegamos aquí es que se han asignado correctamente los tripulantes
    vuelosAsignados.push({
        codigoVuelo: codigoVuelo,
        tripulantes: tripulantesAsignados.map(t => t.id)
    });
    for (let vuelo of vuelosAsignados) {
      // Imprimimos el código del vuelo y los tripulantes para verificar la estructura
      console.log(`Código del vuelo: ${vuelo.codigoVuelo}`);
      console.log(`Tripulantes del vuelo: ${vuelo.tripulantes}`);
    }
    console.log(tripulantesAsignados);


    return 10;

}
  // Asignar tripulación
  /* En vuelos de corta o media distancia 1CAPT + 1FO + nFA:
      - Buscar un CAPT usando la función 'buscarTripulante("CAPT")'
         x Si no lo encuentra devuelva código apropiado (2 en este caso)
         x Si lo encuentra almacenarlo en vector 'tripulantesAsignados'
      - Buscar resto (FO y FAs)
         x etc.
      - Si la asignación se ha completado, devolver código de éxito
    */
  /* En vuelos de larga distancia 1CAPT + 1FO + 1SO + nFA:
      - Buscar un CAPT usando la función 'buscarTripulante("CAPT")'
         x Si no lo encuentra devuelva código apropiado (2 en este caso)
         x Si lo encuentra almacenarlo en vector 'tripulantesAsignados'
      - Buscar resto (FO, SO y FAs)
         x etc.
      - Si la asignación se ha completado, devolver código de éxito
    */

function buscarTripulante(cargo) {
    console.log('Cargo buscado:', cargo);

    for (let tripulante of tripulantes) {
        // Solo buscamos tripulantes con el cargo deseado y sin problemas de disciplina.
        if (tripulante.cargo === cargo && !tripulante.comDisciplina) {
            console.log(`Verificando tripulante con ID: ${tripulante.id}`);
            console.log('Tripulantes asignados:', tripulantesAsignados);

            // Verificar si el tripulante ya está asignado al vuelo.
            if (!tripulantesAsignados.includes(tripulante.id)) {
                console.log(`Tripulante con ID: ${tripulante.id} no está asignado a ningún vuelo.`);

                // Agregar el tripulante a la lista de asignados.
                tripulantesAsignados.push(tripulante.id);

                // Retornar el tripulante encontrado.
                return tripulante;
            } else {
                console.log(`Tripulante con ID: ${tripulante.id} ya está asignado a otro vuelo.`);
            }
        }
    }

    console.log("No se encontró ningún tripulante disponible.");
    return null;
}


function calcularCosteOperacion(codigoVuelo, precioCombustiblePorLitro) {
  var vuelo = null;

  // Codifique aquí !!!!

  // Buscar el vuelo por su código iterando sobre 'vuelos'

  // Establezca el consumo base por kilómetro de vuelo según los parámetros indicados

  // Establecer penalización por peso

  // Calcular el consumo por kilómetro

  // Calcular 'consumoTotal' como el producto del consumo por kilómetro y la distancia de vuelo

  // Redondee a 2 decimales (Math.round())

  // Comprobar si consumo total supera MFC y avisar en su caso

  // Calcular 'costeTotal' como consumo por precio (redondee a 2 decimales)

  // Devuelva el 'texto' con la información del coste y consumo total de combustible en el vuelo
}

// Función que devuelve la lista de tripulantes de un vuelo asignado
// Devuelve un array de tripulantes o un código 1 (indica 'no hay tripulantes asignados')

function consultarTripulantes(codigoVuelo) {
  var vuelo;
  var trip;
  console.log(vuelosAsignados)
  for (let i in vuelosAsignados) {  // recorremos el vector de vuelos
    if (codigoVuelo === vuelosAsignados[i].codigoVuelo) {   // === compara valor y tipo
        vuelo = vuelosAsignados[i];
        trip = vuelosAsignados[i].tripulantes;
        break; // Salimos bucle si se encuentra
    }
  }
  if (!vuelo) {
    return 1; // Código 1: vuelo no encontrado
  }
  else{
    return trip;}

  // Codifique aquí !!!!
}

// **** Funciones de interfaz ****
//
// Obtienen los datos de las funciones que contienen la lógica
// Muestran esos datos en la ventana del navegador (zona 'resultados')

function interfazOrdenarPorDistancia() {
  // Ya implementada
  ordenarVuelosPorDistancia();

  let listaHTML = "<p>Vuelos por distancia:</p>";
  listaHTML += '<ul style="list-style-type: none; padding: 0;">'; // Lista sin viñetas

  for (let i = 0; i < vuelos.length; i++) {
    listaHTML += `<li>Código: ${vuelos[i].codigo}; Distancia: ${vuelos[i].distancia} Kms</li>`;
  }

  listaHTML += "</ul>";
  mostrarResultadoHTML(listaHTML);
}

function interfazAsignarTripulantes() {
  var codigoVuelo = prompt("Introduce el código de vuelo:");
  var resultado = asignarTripulantes(codigoVuelo);
  var mensaje;


  // Implemente la comprobación del resultado devuelto y genere el 'texto' de salida apropiado
  // Codifique aquí !!!!
  switch(resultado) {
    case 1:
            mensaje = `Vuelo no encontrado (el vuelo ${codigoVuelo} no está registrado en el sistema)`;
            break;
        case 2:
            mensaje = `CAPT no disponible para el vuelo ${codigoVuelo}`;
            break;
        case 3:
            mensaje = `FO no disponible para el vuelo ${codigoVuelo}`;
            break;
        case 4:
            mensaje = `SO no disponible para el vuelo ${codigoVuelo}`;
            break;
        case 5:
            mensaje = `No hay suficientes FA disponibles para el vuelo ${codigoVuelo}`;
            break;
        case 10:
            mensaje = `Tripulación asignada correctamente al vuelo ${codigoVuelo}`;
            break;
        //default:
            //mensaje = "Error desconocido";
    }

  mostrarResultado(mensaje);
}

function interfazCalcularCosteOperacion() {
  // Codifique aquí !!!!!

  // Finalmente se genera el 'texto' de salida
  mostrarResultado(texto);
}

function interfazConsultarTripulantes() {
  var codigoVuelo = prompt("Introduce el código de vuelo:");
  var resultado = consultarTripulantes(codigoVuelo);
  var mensaje;

  if(resultado==1){
    mensaje = `Vuelo no encontrado (el vuelo ${codigoVuelo} no está registrado en el sistema)`;

  }
  else{
    mensaje = `Tripulantes del vuelo ${codigoVuelo}: ${resultado} `;

  }




  mostrarResultado(mensaje);

}

// Función para mostrar el resultado (ya implementada)
function mostrarResultado(texto) {
  borrarResultados(); // Borra lo anterior
  document.getElementById("resultadoTexto").innerText = texto; // Escribe el texto de salida en la zona resultados
}

// Función para mostrar el resultado HTML en la zona "resultadoHTML" (ya implementada)
function mostrarResultadoHTML(htm) {
  borrarResultados();
  document.getElementById("resultadoHTML").innerHTML = htm;
}

// Función para borrar resultados (ya implementada)
function borrarResultados() {
  document.getElementById("resultadoTexto").innerText = "";
  document.getElementById("resultadoHTML").innerHTML = "";
}
