/** INICIO DECLARACIÓN DE VARIABLES GLOBALES **/

// Array de palos
let palos = ["corazones", "picas", "rombos", "treboles"];

// Array de número de cartas
//let numeros = ["as", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jota", "reina", "rey"];
let numeros = [ "reina", "rey"];
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

			tapete_inicial.removeChild(hijos[i]); // Eliminar tod lo que no sea el contador
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
    mazo[i].addEventListener('dragstart', (e) => iniciar_arrastre(e)); // Iniciar el arrastre
  }
  actualizarCartasArrastrables();
  set_contador(cont_inicial, mazo.length);
}

function actualizarCartasArrastrables() {
	let cartas = tapete_inicial.children;

	// Recorremos todas las cartas en el tapete inicial
	for (let i = 0; i < cartas.length; i++) {
	  let carta = cartas[i];
      console.log('Actualizando carta', carta);

	  // Si es la última carta, permitir que sea arrastrable
	  if (i === cartas.length - 1) {
		carta.setAttribute("draggable", true);
		carta.addEventListener('dragstart', (e) => iniciar_arrastre(e)); // Iniciar el arrastre
	  } else {
		carta.setAttribute("draggable", false); // Deshabilitar el arrastre para otras cartas
	  }
	}
  }

// Función de arrastre (inicia el proceso)
function iniciar_arrastre(e) {
  const carta = e.target;
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
    let tapeteOrigen = carta.parentNode;

    // Si el tapete de destino es el tapete de sobrantes, no hay restricciones
    if (tapete === tapete_sobrantes) {
		if(tapeteOrigen=== tapete_inicial){
        // Ajustar posición de la carta en el tapete de sobrantes
        carta.style.position = "absolute";
        carta.style.top = (tapete.offsetHeight / 2 - carta.offsetHeight / 2) + "px";
        carta.style.left = (tapete.offsetWidth / 2 - carta.offsetWidth / 2) + "px";

        // Mover la carta al tapete de sobrantes
        tapete.appendChild(carta);

        // Actualizar los contadores
        actualizarContadores(tapeteOrigen, tapete);

        // Quitar la carta del mazo de origen y agregarla al mazo de sobrantes
        let mazoOrigen = obtenerMazoDeTapete(tapeteOrigen);
        let mazoDestino = obtenerMazoDeTapete(tapete);
        actualizarMazos(mazoOrigen, mazoDestino, carta);

        // Incrementar el contador de movimientos
        inc_contador(cont_movimientos);

        // Actualizar las cartas arrastrables

        verificarYReiniciarTapeteInicial();
		actualizarCartasArrastrables();
        return;
    	}
	}

    // Obtener información de la carta que se intenta mover
    let valorCarta = carta.getAttribute("id").split("-")[0]; // Obtener el número o nombre (as, jota, etc.)
    let colorCarta = carta.getAttribute("data-color");

    // Determinar el mazo de origen basado en el tapete de origen
    let mazoOrigen = obtenerMazoDeTapete(tapeteOrigen);
    let mazoDestino = obtenerMazoDeTapete(tapete);

    // Obtener la última carta del tapete de destino (si existe)
    let ultimaCartaDestino = tapete.lastElementChild;
    if (ultimaCartaDestino) {
        let valorUltimaCarta = ultimaCartaDestino.getAttribute("id").split("-")[0];
        let colorUltimaCarta = ultimaCartaDestino.getAttribute("data-color");

        // Verificar si la carta puede ser colocada
        if (!puedeColocarCarta(valorUltimaCarta, colorUltimaCarta, valorCarta, colorCarta)) {
			// Si el tapete de origen es uno de los tapetes receptores, no se puede mover
			if (tapeteOrigen === tapete_receptor1 || tapeteOrigen === tapete_receptor2 || tapeteOrigen === tapete_receptor3 || tapeteOrigen === tapete_receptor4) {
				alert("No se puede mover una carta desde un tapete receptor.");
				return;
			}

            alert("Movimiento inválido. Las cartas deben estar en orden decreciente y alternando colores.");
            return;
        }
    } else {
        // Si no hay cartas en el receptor, la primera debe ser un Rey
        if (valorCarta !== "rey") {
			// Si el tapete de origen es uno de los tapetes receptores, no se puede mover
			if (tapeteOrigen === tapete_receptor1 || tapeteOrigen === tapete_receptor2 || tapeteOrigen === tapete_receptor3 || tapeteOrigen === tapete_receptor4) {
				alert("No se puede mover una carta desde un tapete receptor.");
				return;
			}

            alert("Movimiento inválido. El receptor debe comenzar con un Rey.");
            return;
        }
    }

	// Si el tapete de origen es uno de los tapetes receptores, no se puede mover
	if (tapeteOrigen === tapete_receptor1 || tapeteOrigen === tapete_receptor2 || tapeteOrigen === tapete_receptor3 || tapeteOrigen === tapete_receptor4) {
		alert("No se puede mover una carta desde un tapete receptor.");
		return;
	}

    // Ajustar posición de la carta en el receptor
    carta.style.position = "absolute";
    carta.style.top = (tapete.offsetHeight / 2 - carta.offsetHeight / 2) + "px";
    carta.style.left = (tapete.offsetWidth / 2 - carta.offsetWidth / 2) + "px";

    // Mover la carta al tapete de destino
    tapete.appendChild(carta);

    // Actualizar los contadores
    actualizarContadores(tapeteOrigen, tapete);

    // Quitar la carta del mazo de origen y agregarla al mazo de destino
    actualizarMazos(mazoOrigen, mazoDestino, carta);

    // Incrementar el contador de movimientos
    inc_contador(cont_movimientos);

    // Actualizar las cartas arrastrables
	verificarYReiniciarTapeteInicial();
    actualizarCartasArrastrables();

    setTimeout(finJuego, 10);
}

// Función para obtener el mazo correspondiente al tapete
function obtenerMazoDeTapete(tapete) {
    // Revisar los tapetes y devolver el mazo correcto según el tapete de origen o destino
    if (tapete === tapete_inicial) {
        return mazo_inicial; // Mazo de cartas del tapete inicial
    } else if (tapete === tapete_sobrantes) {
        return mazo_sobrantes; // Mazo de cartas del tapete sobrante
    } else if (tapete === tapete_receptor1) {
        return mazo_receptor1; // Mazo correspondiente al primer receptor
    } else if (tapete === tapete_receptor2) {
        return mazo_receptor2; // Mazo correspondiente al segundo receptor
    } else if (tapete === tapete_receptor3) {
        return mazo_receptor3; // Mazo correspondiente al tercer receptor
    } else if (tapete === tapete_receptor4) {
        return mazo_receptor4; // Mazo correspondiente al cuarto receptor
    }
    return []; // Si no es ninguno de los tapetes definidos, devolvemos un array vacío
}


function actualizarMazos(mazoOrigen, mazoDestino, carta) {
    // Verificar que la carta es un objeto válido antes de intentar manipularla
    if (!carta || !carta.id) {
        console.error("La carta no es válida o no tiene un ID", carta);
        return; // Salir si la carta no es válida
    }

    // Eliminar la carta del mazo de origen si está allí
    let indice = mazoOrigen.indexOf(carta);
    if (indice !== -1) {
        mazoOrigen.splice(indice, 1); // Elimina la carta del mazo de origen
    }

    // Agregar la carta al mazo de destino
    mazoDestino.push(carta); // Agrega la carta al mazo de destino

    // Verificar si la carta fue correctamente movida
    console.log("Carta movida", carta);
}

// Función para verificar si se puede colocar una carta en el receptor
function puedeColocarCarta(valorUltima, colorUltima, valorActual, colorActual) {
    // Orden esperado de los valores de cartas
    let ordenValores = ["rey", "reina", "jota", "10", "9", "8", "7", "6", "5", "4", "3", "2", "as"];

    // Obtener los índices de los valores de las cartas
    let indiceUltima = ordenValores.indexOf(valorUltima);
    let indiceActual = ordenValores.indexOf(valorActual);

    // Verificar las condiciones:
    // 1. El valor actual debe ser inmediatamente menor que el de la última carta.
    // 2. El color debe ser diferente.
    return indiceActual === indiceUltima + 1 && colorUltima !== colorActual;
}

  // Función para actualizar los contadores de cartas de los tapetes
  function actualizarContadores(tapeteOrigen, tapeteDestino) {
	let contadorOrigen = obtenerContador(tapeteOrigen);
	if (contadorOrigen) {
	  set_contador(contadorOrigen, +contadorOrigen.innerHTML - 1);
	} else {
	  console.error('No se pudo obtener el contador de origen');
	}

	let contadorDestino = obtenerContador(tapeteDestino);
	if (contadorDestino) {
	  set_contador(contadorDestino, +contadorDestino.innerHTML + 1);
	} else {
	  console.error('No se pudo obtener el contador de destino');
	}
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
	  // Seleccionar todas las cartas del tapete actual y eliminarlas del DOM
	  let cartas = tapete.querySelectorAll("img");
	  // Eliminamos cada carta de las cartas del tapete
	  cartas.forEach(carta => {
		carta.remove();
	  });

	});
  }

  function verificarYReiniciarTapeteInicial() {
	// Obtener los valores de los contadores directamente desde los elementos del DOM
	let contadorInicial = parseInt(cont_inicial.innerHTML); // Contador del tapete inicial
	let contadorSobrantes = parseInt(cont_sobrantes.innerHTML); // Contador del tapete sobrante

	// Verificar si el tapete inicial está vacío y si el tapete sobrante tiene cartas
	if (contadorInicial === 0 && contadorSobrantes > 0) {
	  // Barajar las cartas del tapete sobrante
	  barajar(mazo_sobrantes);

	  mazo_inicial= mazo_sobrantes;

	  // Colocar las cartas barajadas en el tapete inicial
	  cargar_tapete_inicial(mazo_inicial);


	  // Limpiar el tapete sobrante
	  mazo_sobrantes = [];
	  cont_sobrantes.innerHTML= 0;
	  return

	  // Actualizar los contadores de los tapetes

	}
}

function finJuego() {
	let contadorInicial = parseInt(cont_inicial.innerHTML); // Contador del tapete inicial
	let contadorSobrantes = parseInt(cont_sobrantes.innerHTML); // Contador del tapete sobrante
	if (contadorInicial === 0 && contadorSobrantes === 0) {
		let tiempo_final = detener_tiempo(); // Detiene el tiempo y obtiene los segundos transcurridos
		let movimientos = parseInt(cont_movimientos.innerHTML); // Obtiene el número de movimientos

		alert(`Fin del juego\nTiempo transcurrido: ${tiempo_final-1} segundos\nNúmero de movimientos: ${movimientos}`);
	}
}




function detener_tiempo() {
  if (temporizador) {
    clearInterval(temporizador); // Detiene el temporizador
  }
  return segundos; // Devuelve el valor actual de la cuenta de segundos
}


// Función para ajustar el contador al valor especificado
function set_contador(contador, valor) {
	contador.innerHTML = valor;
  }

  // Función para incrementar el contador de movimientos
  function inc_contador(contador) {
	contador.innerHTML = +contador.innerHTML + 1;
  }