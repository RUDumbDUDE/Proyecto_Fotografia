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
// 4. INICIALIZACIÓN GLOBAL (EVENTOS)
// =========================================

// Ejecutar funciones principales cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    iniciarRuleta();
    renderizarCategorias();
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
// 5. MODO OSCURO INTELIGENTE
// =========================================
const btnTema = document.getElementById('toggle-tema');
const iconoLuna = document.getElementById('icono-luna');
const iconoSol = document.getElementById('icono-sol');
const body = document.body;

// Función que aplica o quita el modo oscuro visualmente
function aplicarTema(esOscuro) {
    if (esOscuro) {
        body.classList.add('dark-mode');
        if(iconoLuna && iconoSol) {
            iconoLuna.style.display = 'none';
            iconoSol.style.display = 'block';
        }
    } else {
        body.classList.remove('dark-mode');
        if(iconoLuna && iconoSol) {
            iconoLuna.style.display = 'block';
            iconoSol.style.display = 'none';
        }
    }
}

// Función que decide qué tema poner al abrir la página
function inicializarTema() {
    // 1. ¿El usuario ya guardó una preferencia antes en nuestro sitio?
    const temaGuardado = localStorage.getItem('mapard-tema');

    if (temaGuardado) {
        // Respetamos su elección manual
        aplicarTema(temaGuardado === 'dark');
    } else {
        // 2. Si es su primera vez, revisamos el reloj de su computadora
        const horaActual = new Date().getHours();
        // Definimos que de 19:00 (7 PM) a 05:59 AM es de noche
        const esDeNoche = horaActual >= 19 || horaActual < 6;
        
        aplicarTema(esDeNoche);
    }
}

// Evento al presionar el botón del Sol/Luna
if (btnTema) {
    btnTema.addEventListener('click', () => {
        // Verificamos en qué modo estamos actualmente
        const estaOscuro = body.classList.contains('dark-mode');
        
        // Lo cambiamos al opuesto
        aplicarTema(!estaOscuro);
        
        // Guardamos su decisión en la memoria de su navegador
        localStorage.setItem('mapard-tema', !estaOscuro ? 'dark' : 'light');
    });
}