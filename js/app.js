const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => { 
    formulario.addEventListener('submit', buscarClima);
    formulario.reset();

    // Muestra el clima almacenado en el Storage
    while(resultado) {
        let datos = JSON.parse(localStorage.getItem('resultado'));
        mostrarClima(datos)
        break;
    }
})

function buscarClima(e) {
    e.preventDefault();

    // Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === ''){
        // Hubo un error
        mostrarError()
        return;
    }

        // Libreria SweetAlert2
    function mostrarError() {
        Swal.fire({
        icon: 'error',        
        text: 'Ambos campos son obligatorios'}
        )
    }

    // Consultar la API
    consultarAPI(ciudad, pais);    
}

function consultarAPI(ciudad, pais){
    const appID = 'c44c2359dd36f323d66551a9b935416c';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    Spinner(); // Muestra un spinner de carga
    
    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(datos => {        
        // Limpiar HTML previo
        limpiarHTML()

        if (datos.cod === '404') {
            errorCiudad();
            return;
        }

            
        function sincronizarStorage() {
            localStorage.setItem('resultado', JSON.stringify(datos))    
        }

        sincronizarStorage();

        // Imprime la respuesta en el HTML
        mostrarClima(datos);
        }
    )
}


function errorCiudad() {
    const alerta = document.querySelector('.bg-red-100'); 

    if(!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">"Ciudad no encontrada"</span>
        `

        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove()
        }, 3000);
        
    }
}

function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`
    tempMaxima.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad); 
    resultadoDiv.appendChild(actual); 
    resultadoDiv.appendChild(tempMaxima); 
    resultadoDiv.appendChild(tempMin); 

    resultado.appendChild(resultadoDiv)
    formulario.reset();    

}


// función para transformar los grados 
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function Spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML=`
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(divSpinner);
}