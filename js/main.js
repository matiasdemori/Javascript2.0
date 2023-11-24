// En un principio declaro la ruta del archivo JSON local que se va a solicitar. Luego inicializo una variable temas como un array vacío. Esta variable se usará para almacenar los datos obtenidos del archivo JSON después de la solicitud fetch. Realizo una solicitud utilizando fetch a la URL especificada. Encadeno un then para manejar la respuesta de la solicitud fetch. Si la respuesta no es exitosa (!response.ok), se lanza un error.  Convierto la respuesta de la solicitud en un objeto. Este método retorna una promesa que resuelve con los datos del archivo JSON. Encadeno otro then que recibe los datos del archivo JSON. Estos datos se asignan a la variable temas. Por ultimo con el catch si hay un error en la solicitud, se mostrará un mensaje de error en la consola.

const urlArchivoJSON = './js/preguntas.json';
let temas = [];

fetch(urlArchivoJSON)
  .then(response => {
    
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }

    return response.json();
  })
  .then(data => {

    temas = data;
   
  })
  .catch(error => {
    console.error('Error de fetch:', error);
  });

// Se declaran varias variables globales (jugador, puntaje, preguntasRestantes y juegoIniciado) que se utilizan para mantener el estado del juego, el puntaje del jugador, el número de preguntas restantes y si el juego ha iniciado o no.

let jugador;
let puntaje = 0;
let preguntasRestantes = 0;
let juegoIniciado = false;

// Establezco un evento que controla el comportamiento del botón cuando se hace clic, iniciando o reiniciando el juego según el estado actual del juego, posterior a ello llamo a la función actualizar el mejor puntaje al cargar la página.

document.addEventListener('DOMContentLoaded', function () {
    const boton = document.getElementById('boton');
    boton.addEventListener('click', () => {
        if (juegoIniciado) {
            reiniciarJuego();
        } else {
            iniciarJuego();
        }
    });

    actualizarMejorPuntaje();
});

// Con laa función iniciarJuego preparo el juego para iniciar solicitando el nombre del jugador, inicializo las variables, marco todas las preguntas como no realizadas, habilito la interacción con los puntajes y comienza la secuencia de preguntas del juego.

function iniciarJuego() {
    Swal.fire({
        title: 'Ingresa tu nombre:',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: 'Confirmar',
        showLoaderOnConfirm: true,
        preConfirm: (nombre) => {
            jugador = nombre;
            actualizarMejorPuntaje();
            preguntasRestantes = 20;
            puntaje = 0;
            juegoIniciado = true;
            habilitarPuntajes();
            jugarSiguientePregunta();
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}

// Con la funcion habilitarPuntajes recorro todos los elementos que contiene la clase puntaje, extrae los atributos data-tema y data-puntos y los almaceno en las variables tema y puntos, respectivamente, para cada uno de estos elementos.

// Posterior a ello busco el objeto de tema correspondiente al tema del puntaje y luego busco la pregunta dentro de ese tema que tenga el mismo puntaje que el valor almacenado en la variable puntos. Esto permite identificar la pregunta asociada al puntaje dentro del tema correcto en la estructura de datos del juego.

// Por ultimo esta la sección de código que gestiona la representación visual y la interactividad de los elementos de puntaje en función de si la pregunta asociada a ese puntaje ya ha sido respondida o no.

function habilitarPuntajes() {
    const puntajes = document.querySelectorAll('.puntaje');
    puntajes.forEach(function (puntaje) {
        const tema = puntaje.getAttribute('data-tema');
        const puntos = parseInt(puntaje.getAttribute('data-puntos'));
        const temaObj = temas.find(t => t.nombre === tema);
        const pregunta = temaObj.preguntas.find(p => p.puntaje === puntos);

        if (pregunta.realizada) {
            puntaje.innerHTML = puntos.toString();
            puntaje.classList.remove('cruz');
        } else {
            puntaje.addEventListener('click', function () {
                elegirPregunta(tema, puntos);
            });
        }
    });
}

// Con la función actualizarMejorPuntaje actualizo el contenido de un elemento HTML con ID 'mejorPuntaje' en la página web, utilizando el valor almacenado bajo la clave 'mejorPuntaje' en el localStorage si ese valor existe.

function actualizarMejorPuntaje() {
    const mejorPuntajeElement = document.getElementById('mejorPuntaje');
    const mejorJugadorElement = document.getElementById('mejorJugador');
    const puntajeMaximoGuardado = JSON.parse(localStorage.getItem('puntajeMaximo'));

    if (puntajeMaximoGuardado) {
        mejorPuntajeElement.textContent = puntajeMaximoGuardado.puntaje;
        mejorJugadorElement.textContent = puntajeMaximoGuardado.nombre;
    }
}

// Al comienzo con la funcion verifico si el juego está iniciado, luego busco la pregunta correspondiente al tema y puntaje proporcionados, y si esa pregunta es válida y aún no ha sido respondida, la marco como realizada y disminuyo el contador de preguntas restantes en el juego.

// La segunda parte de la funcion actualiza la interfaz gráfica para reflejar visualmente que se ha seleccionado un puntaje determinado.A continuacion solicita al jugador que responda a la pregunta asociada a ese puntaje, verificando si la respuesta es correcta para incrementar el puntaje del jugador.

// Por ultimo permite al jugador decidir si desea continuar jugando después de responder una pregunta. Si quedan preguntas restantes y el jugador elige continuar, se presentará la siguiente pregunta. Si no quedan más preguntas o el jugador decide no continuar, el juego terminará y se mostrarán los resultados finales.

function elegirPregunta(temaNombre, puntos) {
    if (!juegoIniciado) {
        return;
    }

    const tema = temas.find(t => t.nombre === temaNombre);
    const pregunta = tema.preguntas.find(p => p.puntaje === puntos);

    if (!pregunta || pregunta.realizada) {
        Swal.fire({
            icon: 'error',
            title: 'Pregunta no válida o ya realizada. Elije otra.',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    pregunta.realizada = true;
    preguntasRestantes--;

    Swal.fire({
        title: `${jugador}, elige la pregunta por ${puntos} puntos:`,
        text: pregunta.pregunta,
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Responder',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (respuesta) => {
            if (respuesta && respuesta.toLowerCase() === pregunta.respuesta.toLowerCase()) {
                puntaje += puntos;
                const puntajeElement = document.querySelector(`#${temaNombre.toLowerCase()} .puntaje[data-puntos="${puntos}"]`);
                puntajeElement.innerHTML = '&#10004';
                Swal.fire({
                    icon: 'success',
                    title: `¡Respuesta correcta! Ahora tienes ${puntaje} puntos.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                const puntajeElement = document.querySelector(`#${temaNombre.toLowerCase()} .puntaje[data-puntos="${puntos}"]`);
                puntajeElement.innerHTML = '&#10006';
                Swal.fire({
                    icon: 'error',
                    title: 'Respuesta incorrecta. No ganas puntos.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            if (preguntasRestantes > 0) {
                setTimeout(() => {
                    Swal.fire({
                        title: '¿Quieres seguir jugando?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            jugarSiguientePregunta();
                        } else {
                            terminarJuego();
                        }
                    });
                }, 1500);
            } else {
                setTimeout(() => {
                    terminarJuego();
                }, 1500);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}

// Esta función proporciona una notificación al jugador para indicar que puede seleccionar una pregunta por temática y puntaje cuando el juego está en curso.

function jugarSiguientePregunta() {
    if (juegoIniciado) {
        Swal.fire({
            title: 'Elige una pregunta por temática y puntaje.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
}

// Esta función se encarga de finalizar el juego, primero chequea que el juego este iniciado, y de estar iniciado lo coloca en false. Posterior a eso chequea el puntaje maximo y de haber sido superado guarda el puntaje más alto, actualizar la interfaz gráfica con el mejor puntaje y reiniciar las preguntas para un próximo juego.

function terminarJuego() {
    if (juegoIniciado) {
        juegoIniciado = false;
        Swal.fire({
            title: `¡Gracias por jugar, ${jugador}! Tu puntaje final es de ${puntaje} puntos.`,
            icon: 'info',
            confirmButtonText: 'OK'
        });

        const puntajeJugador = {
            nombre: jugador,
            puntaje: puntaje
        };

        const puntajeMaximoGuardado = JSON.parse(localStorage.getItem('puntajeMaximo'));
        if (!puntajeMaximoGuardado || puntaje > puntajeMaximoGuardado.puntaje) {
            localStorage.setItem('puntajeMaximo', JSON.stringify(puntajeJugador));
        }

        actualizarMejorPuntaje();

        const puntajes = document.querySelectorAll('.puntaje');
        puntajes.forEach(function (puntaje) {
            const tema = puntaje.getAttribute('data-tema');
            const puntos = parseInt(puntaje.getAttribute('data-puntos'));
            const temaObj = temas.find(t => t.nombre === tema);
            const pregunta = temaObj.preguntas.find(p => p.puntaje === puntos);

            puntaje.classList.remove('cruz');
            puntaje.innerHTML = puntos.toString();
            pregunta.realizada = false;
        });
    }
}

// Esta función solicita confirmación al jugador para reiniciar el juego y, si se confirma, llama a la función iniciarJuego() para comenzar nuevamente el juego desde el principio.

function reiniciarJuego() {
    Swal.fire({
        title: '¿Deseas reiniciar el juego?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            iniciarJuego();
        }
    });
}
