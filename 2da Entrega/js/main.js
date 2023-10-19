const tema1 = {
    nombre: "Historia",
    preguntas: [
        { id: 1, pregunta: "¿Quién fue el primer presidente de los Estados Unidos?", puntaje: 20, respuesta: "George Washington" },
        { id: 2, pregunta: "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?", puntaje: 40, respuesta: "1776" },
        { id: 3, pregunta: "¿Cuál fue la dinastía que gobernó Rusia desde el siglo XVII hasta principios del siglo XX?", puntaje: 60, respuesta: "Romanov" },
        { id: 4, pregunta: "¿Quién fue el líder de la Revolución Cubana?", puntaje: 80, respuesta: "Fidel Castro" },
        { id: 5, pregunta: "¿Qué evento marcó el inicio de la Primera Guerra Mundial?", puntaje: 100, respuesta: "Asesinato de Francisco Fernando" }
    ]
};

const tema2 = {
    nombre: "Ciencia",
    preguntas: [
        { id: 6, pregunta: "¿Cuál es la fórmula química del agua?", puntaje: 20, respuesta: "H2O" },
        { id: 7, pregunta: "¿Quién propuso la teoría de la relatividad?", puntaje: 40, respuesta: "Albert Einstein" },
        { id: 8, pregunta: "¿Cuál es el planeta más grande del sistema solar?", puntaje: 60, respuesta: "Júpiter" },
        { id: 9, pregunta: "¿Qué gas compone la mayor parte de la atmósfera terrestre?", puntaje: 80, respuesta: "Nitrógeno" },
        { id: 10, pregunta: "¿Qué científico descubrió la estructura del ADN?", puntaje: 100, respuesta: "James Watson y Francis Crick" }
    ]
};

const tema3 = {
    nombre: "Geografía",
    preguntas: [
        { id: 11, pregunta: "¿Cuál es el río más largo del mundo?", puntaje: 20, respuesta: "Nilo" },
        { id: 12, pregunta: "¿En qué continente se encuentra Australia?", puntaje: 40, respuesta: "Oceanía" },
        { id: 13, pregunta: "¿Cuál es la capital de Canadá?", puntaje: 60, respuesta: "Ottawa" },
        { id: 14, pregunta: "¿Qué país se conoce como 'la tierra del sol naciente'?", puntaje: 80, respuesta: "Japón" },
        { id: 15, pregunta: "¿Cuál es el país más grande del mundo en términos de área?", puntaje: 100, respuesta: "Rusia" }
    ]
};

const tema4 = {
    nombre: "Deportes",
    preguntas: [
        { id: 16, pregunta: "¿En qué deporte se utiliza una raqueta para golpear una pelota?", puntaje: 20, respuesta: "Tenis" },
        { id: 17, pregunta: "¿Cuál es el deporte más popular en Brasil?", puntaje: 40, respuesta: "Fútbol" },
        { id: 18, pregunta: "¿Cuál es el evento deportivo conocido como 'la carrera más grande del mundo'?", puntaje: 60, respuesta: "Tour de Francia" },
        { id: 19, pregunta: "¿En qué deporte se anota un touchdown?", puntaje: 80, respuesta: "Fútbol americano" },
        { id: 20, pregunta: "¿Cuál es el equipo de fútbol con más Copas del Mundo ganadas?", puntaje: 100, respuesta: "Brasil" }
    ]
};

const temas = [tema1, tema2, tema3, tema4];

// Comienzo un objeto que guardara las preguntas ya realizadas
const preguntasRealizadas = {};

// Función para jugar para un solo jugador
function jugarParaUnJugador() {
    const jugador = prompt("Por favor, ingresa tu nombre:");
    let puntaje = 0;
    let continuarJugando = true;

    while (continuarJugando) {
        // Mostramos las tematicas disponibles
        alert(`Temáticas disponibles:\n1. Historia\n2. Ciencia\n3. Geografía\n4. Deportes`);
        const temaElegido = parseInt(prompt(`${jugador}, elige una temática (1-4):`));

        //Validamos que haya elegido una tematica correcta
        if (temaElegido < 1 || temaElegido > 4) {
            alert("Elección de temática no válida. Inténtalo de nuevo.");
            continue;
        }

        // Buscamos la tematica correspondiente
        const tema = temas[temaElegido - 1];

        
        alert(`Excelente, ${jugador}. Ahora elige una pregunta de la temática "${tema.nombre}" escribiendo el número correspondiente.`);
        
        // Mostrar las preguntas disponibles para elegir
        let opcionesPreguntas = "Preguntas disponibles:\n";
        for (let pregunta of tema.preguntas) {
            if (!preguntasRealizadas[pregunta.id]) {
                opcionesPreguntas += `${pregunta.id}. ${pregunta.pregunta} (${pregunta.puntaje} puntos)\n`;
            }
        }

        let preguntaElegida;
        let seleccionValida = false;

        // Validacion de la eleccion de pregunta
        while (!seleccionValida) {
            preguntaElegida = parseInt(prompt(opcionesPreguntas));
            
            if (isNaN(preguntaElegida)) {
                alert("Elección de pregunta no válida o ya realizada. Inténtalo de nuevo.");
            } else {
                seleccionValida = true;
            }
        }

        // Marcamos la pregunta realizada
        preguntasRealizadas[preguntaElegida] = true;

        // Obtener la pregunta seleccionada
        const pregunta = tema.preguntas.find(pregunta => pregunta.id === preguntaElegida);

        // Hacer la pregunta al jugador
        const respuesta = prompt(`${jugador}, elige la pregunta (${pregunta.id}) por ${pregunta.puntaje} puntos:\n${pregunta.pregunta}`);

        // Verificar la respuesta
        if (respuesta && respuesta.toLowerCase() === pregunta.respuesta.toLowerCase()) {
            puntaje += pregunta.puntaje;
            alert(`¡Has respondido correctamente y ahora tienes ${puntaje} puntos!`);
        } else {
            alert(`Respuesta incorrecta. No sumas puntos.`);
        }

        continuarJugando = confirm("¿Quieres seguir jugando?");
    }

    alert(`¡Gracias por jugar, ${jugador}! Tu puntaje final es de ${puntaje} puntos.`);
}

jugarParaUnJugador();