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
var flag_noVuelo ;
var dist ;
var n_trip_cab ;
var flag_dist_larga ;

function asignarTripulantes(codigoVuelo) {
  // Codifique aquí !!!!
  // Buscar el vuelo por su código - recorrer vector vuelos. Si no encuentra el vuelo devolver código 1
  for (const i in vuelos){
    for (const j of i){
      if(codigoVuelo == i.codigo){
        flag_noVuelo = 1;
        dist = i.distancia ;
        n_trip_cab = i.nTripulantesCabina ;
        if (dist > 3000) {
          flag_dist_larga = 1 ;
        }
      } 
    }
  }

  if (flag_noVuelo != 1) {
    return 1;
  }
  var capitan = buscarTripulante("CAPT") ;
  var primer_oficial = buscarTripulante("FO") ;
  var segundo_oficial ;
  
  if(capitan){
    tripulantesAsignados.append(capitan) ;
  }
  else {
    return 2 ;
  }
  if(primer_oficial){
    tripulantesAsignados.append(primer_oficial) ;
  }
  else {
    return 3 ;
  }
  if (flag_dist_larga == 1){
    segundo_oficial = buscarTripulante("SO") ;
    if(segundo_oficial){
      tripulantesAsignados.append(segundo_oficial) ;
    }
    else{
      return 4 ;
    }
  }

  var tripulantes_cabina ;
  for (n_trip_cab; n_trip_cab>0;n_trip_cab--){
    tripulantes_cabina = buscarTripulante("FA") ;
    

  }


 


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

var tripulante ;
var tripulante_n = [] ;
function buscarTripulante(cargo) {
  // Codifique aquí !!!!
  /* Recorrer vector 'tripulantes'
     - Comprobar si el tripulante actual tiene el cargo indicado en 'cargo'
     - Seleccionarlo sólo si no ha sido ya seleccionado como tripulante del vuelo
     - Devolver el tripulante seleccionado o nada si no existe un tripulante que cumpla los criterios
     */
  for (let i in tripulantes){
    for (let j of i){
      if(cargo == i.cargo){
        tripulante = i.j ;
        return tripulante_n.append(tripulante) ;
      }
    }
  }

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

  // Implemente la comprobación del resultado devuelto y genere el 'texto' de salida apropiado
  // Codifique aquí !!!!
  switch(resultado) {
    case 1: 
      print('Vuelo no encontrado (${codigoVuelo} no registrado en el sistema)');
      break;
    case 2:
      print('CAPT no disponible para el vuelo ${codigoVuelo}');
      break;
    case 3:
      print('FO no disponible para el vuelo ${codigoVuelo}');
      break;
    case 4:
      print('SO no disponible para el vuelo ${codigoVuelo}');
      break;
    case 5:
      print('No hay suficiente FA disponibles para el vuelo ${codigoVuelo}');
      break;
    case 10:
      print('Tripulación asignada directamente al vuelo ${codigoVuelo}');
      break;
  }

  mostrarResultado(codigo);
}

function interfazCalcularCosteOperacion() {
  // Codifique aquí !!!!!

  // Finalmente se genera el 'texto' de salida
  mostrarResultado(texto);
}

function interfazConsultarTripulantes() {
  // Codifique aquí !!!!

  // Finalmente se genera el 'texto' de salida
  mostrarResultado(texto);
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
