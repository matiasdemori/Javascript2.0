const temas = [
    {
        nombre: "Historia",
        preguntas: [
            { id: 1, pregunta: "¿Quién fue el primer presidente de los Estados Unidos?", puntaje: 20, respuesta: "George Washington" },
            { id: 2, pregunta: "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?", puntaje: 40, respuesta: "1776" },
            { id: 3, pregunta: "¿Cuál fue la dinastía que gobernó Rusia desde el siglo XVII hasta principios del siglo XX?", puntaje: 60, respuesta: "Romanov" },
            { id: 4, pregunta: "¿Quién fue el líder de la Revolución Cubana?", puntaje: 80, respuesta: "Fidel Castro" },
            { id: 5, pregunta: "¿Qué evento marcó el inicio de la Primera Guerra Mundial?", puntaje: 100, respuesta: "Asesinato de Francisco Fernando" }
        ]
    },
    {
        nombre: "Ciencia",
        preguntas: [
            { id: 6, pregunta: "¿Cuál es la fórmula química del agua?", puntaje: 20, respuesta: "H2O" },
            { id: 7, pregunta: "¿Quién propuso la teoría de la relatividad?", puntaje: 40, respuesta: "Albert Einstein" },
            { id: 8, pregunta: "¿Cuál es el planeta más grande del sistema solar?", puntaje: 60, respuesta: "Júpiter" },
            { id: 9, pregunta: "¿Qué gas compone la mayor parte de la atmósfera terrestre?", puntaje: 80, respuesta: "Nitrógeno" },
            { id: 10, pregunta: "¿Qué científico descubrió la estructura del ADN?", puntaje: 100, respuesta: "James Watson y Francis Crick" }
        ]
    },
    {
        nombre: "Matemáticas",
        preguntas: [
            { id: 11, pregunta: "¿Cuál es el teorema de Pitágoras?", puntaje: 20, respuesta: "a² + b² = c²" },
            { id: 12, pregunta: "¿Cuál es el logaritmo natural de 1?", puntaje: 40, respuesta: "0" },
            { id: 13, pregunta: "¿Cuál es el valor de la constante de Euler (e)?", puntaje: 60, respuesta: "2.71828" },
            { id: 14, pregunta: "¿Cuál es el quinto número primo?", puntaje: 80, respuesta: "11" },
            { id: 15, pregunta: "¿Cuál es el volumen de una esfera con radio r?", puntaje: 100, respuesta: "(4/3)πr³" }
        ]
    },
    {
        nombre: "Deportes",
        preguntas: [
            { id: 16, pregunta: "¿En qué deporte se utiliza una raqueta para golpear una pelota?", puntaje: 20, respuesta: "Tenis" },
            { id: 17, pregunta: "¿Cuál es el deporte más popular en Brasil?", puntaje: 40, respuesta: "Fútbol" },
            { id: 18, pregunta: "¿Cuál es el evento deportivo conocido como 'la carrera más grande del mundo'?", puntaje: 60, respuesta: "Tour de Francia" },
            { id: 19, pregunta: "¿En qué deporte se anota un touchdown?", puntaje: 80, respuesta: "Fútbol americano" },
            { id: 20, pregunta: "¿Cuál es el equipo de fútbol con más Copas del Mundo ganadas?", puntaje: 100, respuesta: "Brasil" }
        ]
    }
];

let jugador;
let puntaje = 0;
let preguntasRestantes = 0;
let juegoIniciado = false;

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

function iniciarJuego() {
    jugador = prompt("Por favor, ingresa tu nombre:");
    actualizarMejorPuntaje();

    habilitarPuntajes();

    for (const tema of temas) {
        for (const pregunta of tema.preguntas) {
            pregunta.realizada = false;
        }
    }

    preguntasRestantes = 20;
    puntaje = 0;
    juegoIniciado = true;

    jugarSiguientePregunta();
}

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

function actualizarMejorPuntaje() {
    const mejorPuntajeElement = document.getElementById('mejorPuntaje');
    const mejorPuntajeGuardado = localStorage.getItem('mejorPuntaje');
    if (mejorPuntajeGuardado) {
        mejorPuntajeElement.textContent = mejorPuntajeGuardado;
    }
}

function elegirPregunta(temaNombre, puntos) {
    if (!juegoIniciado) {
        return;
    }

    const tema = temas.find(t => t.nombre === temaNombre);
    const pregunta = tema.preguntas.find(p => p.puntaje === puntos);

    if (!pregunta || pregunta.realizada) {
        alert("Pregunta no válida o ya realizada. Elije otra.");
        return;
    }

    pregunta.realizada = true;
    preguntasRestantes--;

    const puntajeElement = document.querySelector(`#${temaNombre.toLowerCase()} .puntaje[data-puntos="${puntos}"]`);
    puntajeElement.innerHTML = '&#10006';
    puntajeElement.classList.add('cruz');

    const respuesta = prompt(`${jugador}, elige la pregunta por ${puntos} puntos:\n${pregunta.pregunta}`);

    if (respuesta && respuesta.toLowerCase() === pregunta.respuesta.toLowerCase()) {
        puntaje += puntos;
        alert(`¡Respuesta correcta! Ahora tienes ${puntaje} puntos.`);
    } else {
        alert("Respuesta incorrecta. No ganas puntos.");
    }

    if (preguntasRestantes > 0) {
        const continuar = confirm("¿Quieres seguir jugando?");
        if (continuar) {
            jugarSiguientePregunta();
        } else {
            terminarJuego();
        }
    } else {
        terminarJuego();
    }
}

function jugarSiguientePregunta() {
    if (juegoIniciado) {
        alert(`Elige una pregunta por temática y puntaje.`);
    }
}

function terminarJuego() {
    if (juegoIniciado) {
        juegoIniciado = false;
        alert(`¡Gracias por jugar, ${jugador}! Tu puntaje final es de ${puntaje} puntos.`);

        const mejorPuntajeGuardado = localStorage.getItem('mejorPuntaje');
        if (!mejorPuntajeGuardado || puntaje > parseInt(mejorPuntajeGuardado)) {
            localStorage.setItem('mejorPuntaje', puntaje);
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

function reiniciarJuego() {
    const reiniciar = confirm("¿Deseas reiniciar el juego?");
    if (reicniar) {
        iniciarJuego();
    }
}
