// =========================================
// 1. SELECTORES GLOBALES
// =========================================
const imagenesGaleria = document.querySelectorAll('.grid-galeria img');
const modalImagen = document.getElementById('modal-imagen');
const imgAmpliada = document.getElementById('img-ampliada');
const botonCerrarGaleria = document.querySelector('.cerrar-modal');

const modalPrecios = document.getElementById('modal-precios');
const btnCerrarPrecios = document.querySelector('.cerrar-precios');
const tituloModal = document.getElementById('titulo-modal-precios');
const contenedorPaquetesDinamico = document.getElementById('contenedor-dinamico-precios');

const btnWhatsapp = document.querySelector('.btn-whatsapp');
const footer = document.querySelector('footer');
const contenedorCategorias = document.getElementById('grid-categorias');

// =========================================
// 2. BASE DE DATOS (DATA)
// =========================================
const categoriasServicios = [
    { id: 'xv-anos', titulo: 'XV Años', descripcion: 'Capturamos la magia, juventud y emoción de esta etapa inolvidable.' },
    { id: 'bodas', titulo: 'Bodas', descripcion: 'Documentamos tu gran día con un enfoque cinematográfico.' },
    { id: 'bautizos', titulo: 'Bautizos', descripcion: 'Recuerdos tiernos y puros del primer gran evento familiar.' },
    { id: 'cumpleanos', titulo: 'Cumpleaños', descripcion: 'Inmortalizamos la alegría de tus celebraciones.' },
    { id: 'casuales', titulo: 'Sesiones casuales', descripcion: 'Fotografía relajada y espontánea.' },
    { id: 'estudio', titulo: 'Sesiones en estudio', descripcion: 'Iluminación profesional y controlada.' },
    { id: 'artistico', titulo: 'Artístico', descripcion: 'Composiciones creativas y únicas.' },
    { id: 'corporativa', titulo: 'Corporativa', descripcion: 'Imagen profesional para tu marca.' },
    { id: 'producto', titulo: 'Producto', descripcion: 'Resaltamos los detalles de tus artículos.' },
    { id: 'gastronomica', titulo: 'Gastronómica', descripcion: 'Imágenes que despiertan el apetito.' },
    { id: 'tematico', titulo: 'Temático (Ocasional)', descripcion: 'Sesiones diseñadas a medida.' }
];

const baseDeDatosPaquetes = {
    'xv-anos': [
        { nombre: 'Básico', precio: '$5,000', detalles: ['2 horas', '50 fotos editadas'] },
        { nombre: 'Completo', precio: '$8,500', detalles: ['Día completo', 'Photobook'] }
    ],
    'bodas': [
        { nombre: 'Esencial', precio: '$12,000', detalles: ['6 horas', 'Galería digital'] },
        { nombre: 'Premium', precio: '$18,000', detalles: ['10 horas', 'Photobook de lujo'] }
    ]
};

// =========================================
// 3. FUNCIONES DE LÓGICA
// =========================================

function obtenerPaquetes(id) {
    return baseDeDatosPaquetes[id] || [
        { nombre: 'Paquete Estándar', precio: 'Cotizar', detalles: ['Servicio profesional', 'Edición premium'] }
    ];
}

function abrirModalPaquetes(id, titulo) {
    if (!modalPrecios) return;

    tituloModal.textContent = 'Paquetes para ' + titulo;
    contenedorPaquetesDinamico.innerHTML = '';

    const paquetes = obtenerPaquetes(id);

    paquetes.forEach((p, i) => {
        const clasePremium = i === 1 ? 'premium' : '';
        let detallesHTML = p.detalles.map(d => `<li>${d}</li>`).join('');

        contenedorPaquetesDinamico.innerHTML += `
            <article class="paquete ${clasePremium}">
                <h3>${p.nombre}</h3>
                <p class="precio">${p.precio}</p>
                <ul>${detallesHTML}</ul>
            </article>`;
    });

    modalPrecios.style.display = 'flex';
}

function renderizarCategorias() {
    if (!contenedorCategorias) return; // Si no existe (ej. en el index), no hace nada

    contenedorCategorias.innerHTML = ''; // Limpiar por seguridad
    categoriasServicios.forEach(cat => {
        const card = document.createElement('article');
        card.className = 'categoria-card';
        card.setAttribute('data-categoria', cat.id);
        card.innerHTML = `
            <h3>${cat.titulo}</h3>
            <p>${cat.descripcion}</p>
            <span class="btn-ver-paquetes">Ver Paquetes</span>
        `;
        card.addEventListener('click', () => abrirModalPaquetes(cat.id, cat.titulo));
        contenedorCategorias.appendChild(card);
    });
}

function iniciarRuleta() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return; // Si no hay slides (ej. en servicios.html), no hace nada

    let indiceActual = 0;

    setInterval(() => {
        slides[indiceActual].classList.remove('active');
        indiceActual = (indiceActual + 1) % slides.length;
        slides[indiceActual].classList.add('active');
    }, 4000);
}

// =========================================
// LÓGICA DEL BUSCADOR INTELIGENTE
// =========================================
function inicializarBuscador() {
    const inputBuscador = document.getElementById('buscador-servicios');
    const cajaResultados = document.getElementById('resultados-busqueda');

    if (!inputBuscador || !cajaResultados) return;

    // Detectar cada vez que el usuario teclea algo (con Debounce)
    let timeoutBuscador;
    inputBuscador.addEventListener('input', (e) => {
        clearTimeout(timeoutBuscador);
        timeoutBuscador = setTimeout(() => {
            const textoBuscado = e.target.value.toLowerCase().trim();
            cajaResultados.innerHTML = ''; // Limpiar resultados anteriores

            if (textoBuscado.length === 0) {
                cajaResultados.style.display = 'none';
                return;
            }

            // Magia: Buscar en nuestra base de datos coincidencias en título o descripción
            const coincidencias = categoriasServicios.filter(cat =>
                cat.titulo.toLowerCase().includes(textoBuscado) ||
                cat.descripcion.toLowerCase().includes(textoBuscado)
            );

            if (coincidencias.length > 0) {
                // Si hay coincidencias, dibujar los resultados
                coincidencias.forEach(cat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${cat.titulo}</strong>`; // Lo ponemos en negritas
                    li.addEventListener('click', () => {
                        // Al hacer clic, enviamos al usuario a la página de servicios con una variable en la URL
                        window.location.href = `servicios.html?paquete=${cat.id}`;
                    });
                    cajaResultados.appendChild(li);
                });
            } else {
                // Si no hay nada, mostramos el mensaje de error
                const li = document.createElement('li');
                li.textContent = 'No contamos con este servicio 😥';
                li.className = 'no-resultado';
                cajaResultados.appendChild(li);
            }

            cajaResultados.style.display = 'block';
        }, 300); // 300ms debounce
    });

    // Cerrar la cajita si el usuario hace clic en otra parte de la pantalla
    document.addEventListener('click', (e) => {
        if (!inputBuscador.contains(e.target) && !cajaResultados.contains(e.target)) {
            cajaResultados.style.display = 'none';
        }
    });
}

// =========================================
// ENRUTAMIENTO AUTOMÁTICO AL PAQUETE
// =========================================
function buscarPaqueteDesdeURL() {
    // Leemos la URL buscando el código (ej. ?paquete=bodas)
    const parametrosURL = new URLSearchParams(window.location.search);
    const paqueteBuscado = parametrosURL.get('paquete');

    if (paqueteBuscado) {
        // Buscamos la tarjeta en la pantalla
        const tarjetaEncontrada = document.querySelector(`.categoria-card[data-categoria="${paqueteBuscado}"]`);

        if (tarjetaEncontrada) {
            // 1. Deslizamos la pantalla automáticamente hasta la tarjeta
            tarjetaEncontrada.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 2. Le damos un destello naranja temporal para decirle al usuario "¡Es este!"
            tarjetaEncontrada.style.boxShadow = '0 0 30px var(--color-acento)';
            tarjetaEncontrada.style.borderColor = 'var(--color-acento)';

            setTimeout(() => {
                tarjetaEncontrada.style.boxShadow = '';
                tarjetaEncontrada.style.borderColor = '';
            }, 3000);

            // ¡Listo! Eliminamos el paso 3 que abría la ventana modal.
            // Ahora el usuario se queda viendo la tarjeta iluminada y decide si dar clic.
        }
    }
}

// =========================================
// 4. INICIALIZACIÓN GLOBAL (EVENTOS)
// =========================================

// Ejecutar funciones principales cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    manejarSplashScreen();
    inicializarTema();
    iniciarRuleta();
    renderizarCategorias();
    inicializarCarrusel();
    inicializarBuscador();
    buscarPaqueteDesdeURL();
});

// Eventos para cerrar Modales (Precios)
[btnCerrarPrecios, modalPrecios].forEach(el => {
    if (el) el.addEventListener('click', (e) => {
        if (e.target === el || el === btnCerrarPrecios) modalPrecios.style.display = 'none';
    });
});

// Eventos para Galería (Abrir y Cerrar)
if (modalImagen && imgAmpliada) {
    imagenesGaleria.forEach(img => img.addEventListener('click', () => {
        modalImagen.style.display = 'flex';
        imgAmpliada.src = img.src;
    }));
}

if (botonCerrarGaleria && modalImagen) {
    botonCerrarGaleria.addEventListener('click', () => {
        modalImagen.style.display = 'none';
    });

    modalImagen.addEventListener('click', (e) => {
        if (e.target === modalImagen) modalImagen.style.display = 'none';
    });
}

// Lógica del botón de WhatsApp flotante
if (btnWhatsapp && footer) {
    window.addEventListener('scroll', () => {
        const scrollAbajo = window.scrollY + window.innerHeight;
        const inicioFooter = document.documentElement.scrollHeight - footer.offsetHeight;

        if (scrollAbajo > inicioFooter) {
            btnWhatsapp.style.position = 'absolute';
            btnWhatsapp.style.bottom = (footer.offsetHeight + 20) + 'px';
        } else {
            btnWhatsapp.style.position = 'fixed';
            btnWhatsapp.style.bottom = window.innerWidth <= 768 ? '15px' : '30px';
        }
    });
}

// =========================================
// 5. MODO OSCURO INTELIGENTE (ACTUALIZADO)
// =========================================
const btnTema = document.getElementById('toggle-tema');
const iconoLuna = document.getElementById('icono-luna');
const iconoSol = document.getElementById('icono-sol');

// Seleccionamos la RAÍZ (html) en lugar del body para coincidir con el script del head
const raiz = document.documentElement;

function aplicarTema(esOscuro) {
    if (esOscuro) {
        raiz.classList.add('dark-mode'); // Cambiado de body a raiz
        if (iconoLuna && iconoSol) {
            iconoLuna.style.display = 'none';
            iconoSol.style.display = 'block';
        }
    } else {
        raiz.classList.remove('dark-mode'); // Cambiado de body a raiz
        if (iconoLuna && iconoSol) {
            iconoLuna.style.display = 'block';
            iconoSol.style.display = 'none';
        }
    }
}

function inicializarTema() {
    const temaGuardado = localStorage.getItem('mapard-tema');

    if (temaGuardado) {
        aplicarTema(temaGuardado === 'dark');
    } else {
        const horaActual = new Date().getHours();
        const esDeNoche = horaActual >= 19 || horaActual < 6;
        aplicarTema(esDeNoche);
    }
}

// Evento al presionar el botón
if (btnTema) {
    btnTema.addEventListener('click', () => {
        // Ahora verificamos la clase en la RAÍZ
        const estaOscuro = raiz.classList.contains('dark-mode');
        aplicarTema(!estaOscuro);
        localStorage.setItem('mapard-tema', !estaOscuro ? 'dark' : 'light');
    });
}

// =========================================
// 6.LÓGICA DEL CARRUSEL
// =========================================
function inicializarCarrusel() {
    const slider = document.getElementById('slider-galeria') || document.getElementById('grid-categorias');
    const btnPrev = document.getElementById('btn-prev-galeria');
    const btnNext = document.getElementById('btn-next-galeria');

    // Seguro para evitar bugs si el usuario hace muchos clics rápidos
    let enMovimiento = false;

    if (slider && btnPrev && btnNext) {

        // FLECHA DERECHA (Siguiente)
        btnNext.addEventListener('click', () => {
            const item = slider.firstElementChild;
            if (!item) return;
            const anchoTarjeta = item.clientWidth + 30; // 30 es el gap
            slider.scrollBy({ left: anchoTarjeta, behavior: 'smooth' });
        });

        // FLECHA IZQUIERDA (Atrás)
        btnPrev.addEventListener('click', () => {
            const item = slider.firstElementChild;
            if (!item) return;
            const anchoTarjeta = item.clientWidth + 30;
            slider.scrollBy({ left: -anchoTarjeta, behavior: 'smooth' });
        });
    }
}

// =========================================
// LÓGICA DEL SPLASH SCREEN (PRIMERA VISTA)
// =========================================
function manejarSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    const yaVisto = sessionStorage.getItem('mapard-splash-visto');

    if (yaVisto) {
        splash.style.display = 'none';
    } else {
        // --- INICIO DE LA COREOGRAFÍA ---

        // 1. El logo se queda solo por 1.5 segundos
        setTimeout(() => {
            // 2. Lanzamos el derrame de pintura (Paint Spill)
            splash.classList.add('splash-out');

            // 3. Esperamos a que la pintura cubra casi toda la pantalla (aprox 1s)
            // y lanzamos el FADE OUT final del contenedor completo
            setTimeout(() => {
                splash.classList.add('splash-hidden');

                // Marcamos como visto para que no se repita en esta sesión
                sessionStorage.setItem('mapard-splash-visto', 'true');

                // 4. Finalmente, quitamos el elemento del mapa para liberar memoria
                setTimeout(() => {
                    splash.style.display = 'none';
                }, 800); // Este tiempo debe coincidir con el transition del CSS

            }, 1000);

        }, 1500);
    }
}