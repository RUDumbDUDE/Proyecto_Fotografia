// 1. SELECCIÓN DEL DOM (Buscamos los elementos en el HTML)
// Seleccionamos TODAS las imágenes dentro de la galería
const imagenes = document.querySelectorAll('.grid-galeria img'); 
// Seleccionamos la caja del modal y la imagen vacía que está adentro
const modal = document.getElementById('modal-imagen');
const imgAmpliada = document.getElementById('img-ampliada');
// Seleccionamos la "X" para cerrar
const botonCerrar = document.querySelector('.cerrar-modal');

// 2. LÓGICA DE ABRIR EL MODAL
// Usamos forEach para decirle a JS: "Por cada imagen que encontraste, haz esto..."
imagenes.forEach(imagen => {
    // Escucha cuando el usuario haga un 'click'
    imagen.addEventListener('click', () => {
        // Cambia el CSS del modal para que se vuelva visible (display: flex)
        modal.style.display = 'flex'; 
        // Toma la ruta (src) de la imagen pequeña que clickeamos y pónsela a la imagen gigante
        imgAmpliada.src = imagen.src; 
    });
});

// 3. LÓGICA DE CERRAR EL MODAL
// Cuando hagan clic en la "X"...
botonCerrar.addEventListener('click', () => {
    // Vuelve a ocultar el modal
    modal.style.display = 'none'; 
});

// Extra Premium: Cerrar el modal si el usuario hace clic fuera de la foto (en el fondo oscuro)
modal.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.style.display = 'none';
    }
});