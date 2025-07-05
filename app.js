const API = 'http://localhost:3000/emociones'; 
const form = document.getElementById('mood-form');
const calendario = document.getElementById('calendario');
const graficoCanvas = document.getElementById('graficoEmociones');
const toast = document.getElementById('toast');
const modal = document.getElementById('modal');
const modalContenido = document.getElementById('modal-contenido');
const estadoVacio = document.getElementById('estado-vacio');
const tituloMes = document.getElementById('titulo-mes');
const btnAnterior = document.getElementById('mes-anterior');
const btnSiguiente = document.getElementById('mes-siguiente');

let chart;
let emocionesGlobales = [];
let fechaActual = new Date();

// Emotional recommendations per type
const recomendacionesPorEmocion = {
  feliz: [
    "Comparte tu alegría con alguien hoy.",
    "Guarda este momento en tu memoria.",
    "Haz algo creativo mientras te sientes bien."
  ],
  triste: [
    "Abraza tu tristeza con paciencia.",
    "Habla con alguien de confianza.",
    "Escribe lo que sientes, te ayudará a soltar."
  ],
  ansioso: [
    "Haz una pausa, respira profundo tres veces.",
    "Camina un poco, mueve tu cuerpo.",
    "Recuerda: esto pasará, como todo en la vida."
  ],
  enojado: [
    "Cuenta hasta 10 y observa tu emoción sin juicio.",
    "Descansa antes de responder.",
    "Date permiso para expresar lo que sientes sanamente."
  ],
  calmado: [
    "Disfruta esta calma. Haz algo que te guste.",
    "Medita unos minutos o escucha música suave.",
    "Haz una lista de gratitud."
  ]
};

// Show recommendation based on emotion
function mostrarRecomendacion(tipo) {
  const lista = recomendacionesPorEmocion[tipo];
  if (!lista || lista.length === 0) return;
  const mensaje = lista[Math.floor(Math.random() * lista.length)];
  mostrarToast(`💡 Consejo: ${mensaje}`);
}

// Toast message
function mostrarToast(mensaje, tipo = 'success') {
  toast.textContent = mensaje;
  toast.style.backgroundColor = tipo === 'error' ? '#e53935' : '#4caf50';
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 10000);
}

// Fetch emotions from API
async function obtenerEmociones() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    emocionesGlobales = data;
    renderizarCalendario(fechaActual);
    actualizarGrafico(data);
    estadoVacio.style.display = data.length ? 'none' : 'block';
  } catch (err) {
    mostrarToast('Error al cargar emociones', 'error');
  }
}

// Render calendar view
function renderizarCalendario(fecha) {
  calendario.innerHTML = '';
  const year = fecha.getFullYear();
  const month = fecha.getMonth();
  const diasMes = new Date(year, month + 1, 0).getDate();
  const primerDiaSemana = new Date(year, month, 1).getDay();

  if (tituloMes) {
    tituloMes.textContent = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  const grid = document.createElement('div');
  grid.classList.add('calendario-grid');

  for (let i = 0; i < primerDiaSemana; i++) {
    grid.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= diasMes; d++) {
    const dia = document.createElement('div');
    dia.classList.add('calendario-dia');
    const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const emocionesDia = emocionesGlobales.filter(e => e.fecha === fechaStr);
    dia.innerHTML = `<strong>${d}</strong>` +
      (emocionesDia.length ? `<div class="emoji">${emocionesDia.map(e => emojiPorTipo(e.tipo)).join(' ')}</div>` : '');

    if (emocionesDia.length) {
      dia.classList.add('con-emocion');
      dia.title = 'Haz clic para ver tus emociones de este día';
      dia.addEventListener('click', () => mostrarModalEmociones(fechaStr, emocionesDia));
    } else {
      dia.classList.add('sin-emocion');
      dia.title = 'Este día no tiene emociones registradas';
    }

    grid.appendChild(dia);
  }

  calendario.appendChild(grid);
}

// Show modal with emotions for selected day
function mostrarModalEmociones(fecha, emociones) {
  modalContenido.innerHTML = `
    <span id="modal-cerrar" class="cerrar">&times;</span>
    <h3>🌈 Emociones registradas el ${fecha}</h3>
    ${emociones.map(e => `
      <div class="modal-entrada">
        <p>${emojiPorTipo(e.tipo)} <strong>${e.tipo}</strong></p>
        <input type="text" id="nota-${e.id}" value="${e.nota || ''}" placeholder="Tu nota aquí...">
        <div class="botonera">
          <button onclick="actualizarNota('${e.id}')" class="btn-actualizar">📝 Actualizar nota</button>
          <button onclick="eliminarEntrada('${e.id}')" class="btn-eliminar">❌ Eliminar emoción</button>
        </div>
      </div>`).join('')}
  `;
  modal.style.display = 'flex';
  document.getElementById('modal-cerrar').onclick = () => modal.style.display = 'none';
}

// Emoji for each emotion
function emojiPorTipo(tipo) {
  const mapa = {
    feliz: '😊', triste: '😢', ansioso: '😰', enojado: '😡', calmado: '😌'
  };
  return mapa[tipo] || '🙂';
}

// Submit new emotion
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nueva = {
    fecha: document.getElementById('fecha').value,
    tipo: document.getElementById('tipo').value,
    nota: document.getElementById('nota').value
  };

  if (!nueva.fecha || !nueva.tipo) {
    mostrarToast('Por favor completa todos los campos obligatorios', 'error');
    return;
  }

  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    form.reset();
    obtenerEmociones();
    mostrarToast('Emoción registrada con cariño 💖');
    mostrarRecomendacion(nueva.tipo); 
  } catch {
    mostrarToast('Error al guardar emoción', 'error');
  }
});

// Delete emotion entry
async function eliminarEntrada(id) {
  if (confirm('¿Seguro que deseas eliminar esta emoción?')) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      obtenerEmociones();
      modal.style.display = 'none';
      mostrarToast('Tu emoción fue retirada con éxito, ¡mañana será un mejor día 🌈!');
    } catch {
      mostrarToast('Error al eliminar', 'error');
    }
  }
}

// Update emotion note
async function actualizarNota(id) {
  const nota = document.getElementById(`nota-${id}`).value;
  try {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota })
    });
    obtenerEmociones();
    modal.style.display = 'none';
    mostrarToast('Tu nota fue actualizada con cariño 💌');
  } catch {
    mostrarToast('Error al actualizar nota', 'error');
  }
}

// Draw chart with emotion frequency
function actualizarGrafico(emociones) {
  const conteo = emociones.reduce((acc, emo) => {
    acc[emo.tipo] = (acc[emo.tipo] || 0) + 1;
    return acc;
  }, {});

  const tipos = ['feliz', 'triste', 'ansioso', 'enojado', 'calmado'];
  const data = tipos.map(t => conteo[t] || 0);
  const colores = ['#FFEB3B', '#90CAF9', '#FFB74D', '#EF5350', '#A5D6A7'];

  if (chart) chart.destroy();

  chart = new Chart(graficoCanvas, {
    type: 'bar',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Frecuencia emocional',
        data,
        backgroundColor: colores
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Navigation between months
btnAnterior.addEventListener('click', () => {
  fechaActual.setMonth(fechaActual.getMonth() - 1);
  renderizarCalendario(fechaActual);
});

btnSiguiente.addEventListener('click', () => {
  fechaActual.setMonth(fechaActual.getMonth() + 1);
  renderizarCalendario(fechaActual);
});

// Initial load
obtenerEmociones();
window.eliminarEntrada = eliminarEntrada;
window.actualizarNota = actualizarNota;

