/** INICIO DECLARACIÓN DE VARIABLES GLOBALES **/

// Array de palos
let palos = ["corazones", "picas", "rombos", "treboles"];

// Array de número de cartas
//let numeros = ["as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jota", "reina", "rey"];
let numeros = ["as", "jota", "reina", "rey"];
// Paso (top y left) en píxeles de una carta a la anterior en un mazo
let paso = 3;

// Tapetes
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial     = document.getElementById("cont_inicial");
let cont_sobrantes   = document.getElementById("cont_sobrantes");
let cont_receptor1   = document.getElementById("cont_receptor1");
let cont_receptor2   = document.getElementById("cont_receptor2");
let cont_receptor3   = document.getElementById("cont_receptor3");
let cont_receptor4   = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("cont_movimientos");

// Tiempo
let cont_tiempo  = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos     = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/** FIN DECLARACIÓN DE VARIABLES GLOBALES **/

// Rutina asociada a botón reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego debería comenzar al cargar la página: no se debe esperar a pulsar el botón de Reiniciar
comenzar_juego();

// Desarrollo del comienzo de juego
function comenzar_juego() {

	//limpiamos el tapete_inicial
	let hijos = tapete_inicial.children; // Obtener todos los hijos del tapete
	for (let i = hijos.length - 1; i >= 0; i--) {
		if (!hijos[i].classList.contains("contador")) {
		tapete_inicial.removeChild(hijos[i]); // Eliminar todo lo que no sea el contador
		}
	}

	eliminarSrcDeTapetes();

  mazo_inicial = [];
  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < numeros.length; j++) {
      let carta = document.createElement("img");
      carta.setAttribute("src", "img/baraja/" + numeros[j] + "-" + palos[i] + ".png");
      carta.setAttribute("id", numeros[j] + "-" + palos[i]);
      carta.setAttribute("data-nombre", palos[i]);

      if (palos[i] == "corazones" || palos[i] == "rombos") {
        carta.setAttribute("data-color", "rojo");
      } else {
        carta.setAttribute("data-color", "negro");
      }
      mazo_inicial.push(carta);
    }
  }

  // Barajar
  barajar(mazo_inicial);

  // Cargar el tapete inicial
  cargar_tapete_inicial(mazo_inicial);

  // Puesta a cero de contadores de mazos
  set_contador(cont_sobrantes, 0);
  set_contador(cont_receptor1, 0);
  set_contador(cont_receptor2, 0);
  set_contador(cont_receptor3, 0);
  set_contador(cont_receptor4, 0);
  set_contador(cont_movimientos, 0);

  // Arrancar el conteo de tiempo
  arrancar_tiempo();
}

// Arrancar temporizador
function arrancar_tiempo() {
  if (temporizador) clearInterval(temporizador);

  let hms = function () {
    let seg = Math.trunc(segundos % 60);
    let min = Math.trunc((segundos % 3600) / 60);
    let hor = Math.trunc((segundos % 86400) / 3600);
    let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
      + ":" + ((min < 10) ? "0" + min : "" + min)
      + ":" + ((seg < 10) ? "0" + seg : "" + seg);
    set_contador(cont_tiempo, tiempo);
    segundos++;
  };
  segundos = 0;
  hms(); // Primera visualización 00:00:00
  temporizador = setInterval(hms, 1000); // hms() será invocado cada segundo
}

// Función para barajar el mazo
function barajar(mazo) {
  for (let i = 0; i < mazo.length; i++) {
    let j = Math.floor(Math.random() * mazo.length);
    let aux = mazo[i];
    mazo[i] = mazo[j];
    mazo[j] = aux;
  }
}

// Función para cargar el tapete inicial
function cargar_tapete_inicial(mazo) {
  for (let i = 0; i < mazo.length; i++) {
    tapete_inicial.appendChild(mazo[i]);
    mazo[i].style.width = "50px";
    mazo[i].style.position = "absolute";
    mazo[i].style.left = paso * i + "px";
    mazo[i].style.top = paso * i + "px";
    mazo[i].setAttribute("draggable", true); // Hacer la carta arrastrable
    mazo[i].addEventListener('dragstart', (e) => iniciar_arrastre(e, mazo[i])); // Iniciar el arrastre
  }
  actualizarCartasArrastrables();
  set_contador(cont_inicial, mazo.length);
}

function actualizarCartasArrastrables() {
	let cartas = tapete_inicial.children;

	// Recorremos todas las cartas en el tapete inicial
	for (let i = 0; i < cartas.length; i++) {
	  let carta = cartas[i];

	  // Si es la última carta, permitir que sea arrastrable
	  if (i === cartas.length - 1) {
		carta.setAttribute("draggable", true);
		carta.addEventListener('dragstart', (e) => iniciar_arrastre(e, carta)); // Iniciar el arrastre
	  } else {
		carta.setAttribute("draggable", false); // Deshabilitar el arrastre para otras cartas
	  }
	}
  }

// Función de arrastre (inicia el proceso)
function iniciar_arrastre(e, carta) {
  e.dataTransfer.setData('text', carta.id);
}

// Habilitar los tapetes de receptor para que reciban cartas
habilitar_soltar(tapete_receptor1);
habilitar_soltar(tapete_receptor2);
habilitar_soltar(tapete_receptor3);
habilitar_soltar(tapete_receptor4);
habilitar_soltar(tapete_sobrantes);

// Función para permitir soltar en el tapete de receptor
function habilitar_soltar(tapete) {
  tapete.addEventListener('dragover', (e) => e.preventDefault());
  tapete.addEventListener('drop', (e) => soltar_en_receptor(e, tapete));
}

// Función para soltar cartas en los tapetes de receptores

function soltar_en_receptor(e, tapete) {
	e.preventDefault();
	let cartaId = e.dataTransfer.getData('text');
	let carta = document.getElementById(cartaId);

	// Identificar el tapete de origen (de donde viene la carta)
	let tapeteOrigen = carta.parentNode; // El tapete de donde estaba la carta

	// Verificar cuántas cartas ya hay en el tapete y colocarlas una encima de la otra
	let numeroCartasDestino = tapete.children.length;

	// Se ajusta la posición para que las cartas se apilen centradas
	carta.style.position = "absolute";
	carta.style.top = (tapete.offsetHeight / 2 - carta.offsetHeight / 2)+ "px"; // Apilar las cartas con 20px de separación
	carta.style.left = (tapete.offsetWidth / 2 - carta.offsetWidth / 2) + "px"; // Centrar la carta

	// Mover la carta al tapete de destino
	tapete.appendChild(carta);

	// Actualizar el contador de cartas en el tapete de origen (restar 1 carta)
	actualizarContadores(tapeteOrigen, tapete);

	// Actualizar el contador de movimientos
	inc_contador(cont_movimientos);
	actualizarCartasArrastrables();

  }

  // Función para actualizar los contadores de cartas de los tapetes
function actualizarContadores(tapeteOrigen, tapeteDestino) {
	// Restar 1 del contador del tapete de origen
	let contadorOrigen = obtenerContador(tapeteOrigen);
	set_contador(contadorOrigen, +contadorOrigen.innerHTML - 1);

	// Sumar 1 al contador del tapete de destino
	let contadorDestino = obtenerContador(tapeteDestino);
	set_contador(contadorDestino, +contadorDestino.innerHTML + 1);
  }

// Función para obtener el contador de un tapete
function obtenerContador(tapete) {
	if (tapete === tapete_inicial) {
	  return cont_inicial;
	} else if (tapete === tapete_sobrantes) {
	  return cont_sobrantes;
	} else if (tapete === tapete_receptor1) {
	  return cont_receptor1;
	} else if (tapete === tapete_receptor2) {
	  return cont_receptor2;
	} else if (tapete === tapete_receptor3) {
	  return cont_receptor3;
	} else if (tapete === tapete_receptor4) {
	  return cont_receptor4;
	}
	return null;
}

function eliminarSrcDeTapetes() {
	// Seleccionar todos los tapetes
	let tapetes = [
	  document.getElementById("receptor1"),
	  document.getElementById("receptor2"),
	  document.getElementById("receptor3"),
	  document.getElementById("receptor4"),
	  document.getElementById("sobrantes")
	];

	// Iterar sobre cada tapete
	tapetes.forEach(tapete => {
	  // Obtener todas las imágenes dentro del tapete
	  let imgElements = tapete.getElementsByTagName("img");

	  // Eliminar el atributo src de cada imagen
	  for (let i = 0; i < imgElements.length; i++) {
		imgElements[i].removeAttribute("src");
	  }
	});
  }

// Función para ajustar el contador al valor especificado
function set_contador(contador, valor) {
	contador.innerHTML = valor;
  }

  // Función para incrementar el contador de movimientos
  function inc_contador(contador) {
	contador.innerHTML = +contador.innerHTML + 1;
  }