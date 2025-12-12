let modelo;
const rutasPosibles = [
    'tfjs_model_precio/model.json',
    'tfjs_model_precio/content/tfjs_model_precio/model.json'
];

// Elementos UI
const estado = document.getElementById('estado');

// CARGAR MODELO
async function cargarModelo() {
    estado.innerText = 'Cargando modelo...';
    for (const ruta of rutasPosibles) {
        try {
            modelo = await tf.loadGraphModel(ruta);
            console.log('Modelo cargado correctamente desde:', ruta);
            estado.innerText = 'Modelo cargado.';

            const btnLocal = document.getElementById('btnPredecir');
            if (btnLocal) {
                btnLocal.disabled = false;
                btnLocal.removeEventListener('click', predecir);
                btnLocal.addEventListener('click', predecir);
            }
            return;
        } catch (e) {
            console.warn('No se pudo cargar desde', ruta, e.message || e);
        }
    }
    estado.innerText = 'Error: no se pudo cargar el modelo.';
}

cargarModelo();

// HACER PREDICCIÓN
async function predecir() {
    if (!modelo) {
        alert('El modelo aún no se ha cargado.');
        return;
    }

    // 👉 AHORA SE USA EL PRECIO TOTAL
    const precioTotal = parseFloat(document.getElementById('precio_total').value);

    if (isNaN(precioTotal)) {
        alert('Ingresa un precio total válido.');
        return;
    }

    try {
        const valor = await tf.tidy(() => {
            const entrada = tf.tensor2d([precioTotal], [1, 1]);
            const pred = modelo.predict(entrada);
            return pred.dataSync()[0];
        });

        document.getElementById('resultado').innerText =
            valor > 0.5 ? 'Resultado: BARATO (1)' : 'Resultado: CARO (0)';
    } catch (err) {
        console.error('Error en predicción:', err);
        alert('Ocurrió un error al realizar la predicción.');
    }
}
