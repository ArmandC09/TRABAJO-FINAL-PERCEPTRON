let modelo;
const rutasPosibles = [
    'tfjs_model_precio/model.json',
    'tfjs_model_precio/content/tfjs_model_precio/model.json'
];

// Elementos UI (se obtienen cuando se usan para evitar null si el DOM cambia)
const estado = document.getElementById('estado');

// CARGAR MODELO (intenta varias rutas y muestra estado)
async function cargarModelo() {
    estado.innerText = 'Cargando modelo...';
    for (const ruta of rutasPosibles) {
        try {
            modelo = await tf.loadGraphModel(ruta);
            console.log('Modelo cargado correctamente desde:', ruta);
            estado.innerText = 'Modelo cargado.';
            // Obtener botón en el momento de usarlo y adjuntar el event listener
            const btnLocal = document.getElementById('btnPredecir');
            if (btnLocal) {
                btnLocal.disabled = false;
                // Evitar añadir múltiples listeners
                btnLocal.removeEventListener('click', predecir);
                btnLocal.addEventListener('click', predecir);
            } else {
                console.warn('Botón `btnPredecir` no encontrado en DOM al cargar el modelo.');
                estado.innerText += ' (Botón no encontrado)';
            }
            return;
        } catch (e) {
            console.warn('No se pudo cargar desde', ruta, e.message || e);
        }
    }
    estado.innerText = 'Error: no se pudo cargar el modelo. Revisa la ruta y archivos en el servidor.';
}

cargarModelo();

// HACER PREDICCIÓN
async function predecir() {
    if (!modelo) {
        alert('El modelo aún no se ha cargado.');
        return;
    }

    const precio = parseFloat(document.getElementById('precio').value);

    if (isNaN(precio)) {
        alert('Ingresa un precio válido.');
        return;
    }

    try {
        // Crear tensor 1x1 y predecir con tidy para liberar memoria
        const valor = await tf.tidy(() => {
            const entrada = tf.tensor2d([precio], [1, 1]);
            const pred = modelo.predict(entrada);
            return pred.dataSync()[0];
        });

        document.getElementById('resultado').innerText =
            valor > 0.5 ? 'Resultado: BARATO (1)' : 'Resultado: CARO (0)';
    } catch (err) {
        console.error('Error en predicción:', err);
        alert('Ocurrió un error al realizar la predicción. Revisa la consola.');
    }
}
