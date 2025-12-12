let modelo;

// CARGAR MODELO
async function cargarModelo() {
    modelo = await tf.loadGraphModel('tfjs_model_precio/model.json');
    console.log("Modelo cargado correctamente.");
}

cargarModelo();

// HACER PREDICCIÓN
async function predecir() {
    if (!modelo) {
        alert("El modelo aún no se ha cargado.");
        return;
    }

    const precio = parseFloat(document.getElementById("precio").value);

    if (isNaN(precio)) {
        alert("Ingresa un precio válido.");
        return;
    }

    // Crear tensor 1x1
    const entrada = tf.tensor2d([precio], [1, 1]);

    const prediccion = modelo.predict(entrada);
    const valor = (await prediccion.data())[0];

    document.getElementById("resultado").innerText =
        valor > 0.5
        ? "Resultado: BARATO (1)"
        : "Resultado: CARO (0)";
}
