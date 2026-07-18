import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Carta } from './index';
import Cartadetalle from './CartaProyecto';

const PROMPT_EXAMPLES = [
  'Un hechicero oscuro de grado especial que domina cuchillas etéreas y se mueve como una sombra.',
  'Una maldición ancestral con piel de piedra, fuerza descomunal y un aura letal que consume energía.',
  'Un usuario de barras de energía con técnicas curativas y ataques de luz purificadora.',
];

export const GenerarCartaIA = () => {
  const API_URL = import.meta.env.VITE_EDUCA_API_URL;
  const [cardPrompt, setCardPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaGenerada, setCartaGenerada] = useState<Carta | null>(null);
  const [purged, setPurged] = useState(false);
  const navigate = useNavigate();

  const generarCarta = async () => {
    if (!cardPrompt.trim()) {
      setError('Por favor, escribe una descripción para la carta.');
      return;
    }

    setLoading(true);
    setError(null);
    setCartaGenerada(null);

    try {
      const response = await fetch('https://educapi-v2.onrender.com/ai/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'usersecretpasskey': 'Gabr686940RE',
        },
        body: JSON.stringify({
          globalContext:
            'Eres un asistente experto diseñando cartas para un juego de mesa de Jujutsu Kaisen. Debes generar estadísticas de combate, nivel de poder y una descripción de su técnica maldita basada en el prompt del usuario.',
          cardPrompt: cardPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} - Verifica el token o tu conexión.`);
      }

      const data = await response.json();

      // Mapeamos la respuesta a un objeto de tipo Carta
      // Ajusta estos campos según lo que devuelva realmente tu API
      const carta: Carta = {
          id: data.idCard ? parseInt(data.idCard, 10) : Date.now(),
          nombre: data.name || data.nombre || 'Hechicero sin nombre',
          serie: (data.attributes?.serie || data.serie) ?? 'Jujutsu Kaisen',
          categoria: (data.attributes?.categoria || data.categoria) ?? 'Grado 4',
          descripcion: data.description || data.descripcion || 'Sin descripción.',
          imagen: data.pictureUrl || data.imagen || '/imagenes/placeholder.png',
          ritual: (data.attributes?.ritual || data.ritual) ?? 'Desconocido',
          ataque: data.attack || data.ataque || 0,
          defensa: data.defense || data.defensa || 0,
          clan: (data.attributes?.clan || data.clan) ?? 'Sin clan',
          hp: data.lifePoints || data.hp || 100,
          voz: (data.attributes?.voiceUrl || data.voz) ?? '',
      };

      setCartaGenerada(carta);
      setPurged(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al generar la carta.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Funciones dummy para Cartadetalle (no necesitamos eliminar/actualizar aquí)
const handleEliminarDummy = (_id: number) => {
  void _id; // Marca el parámetro como usado intencionalmente
};

const handleActualizarDummy = (_carta: Carta) => {
  void _carta; // Ídem
};

const seleccionarEjemplo = (texto: string) => {
  setCardPrompt(texto);
  setError(null);
};


const purgarCarta = async () => {
  if (!cartaGenerada) return;
  const cartaAEliminar = cartaGenerada;

  if (!API_URL) {
    setCartaGenerada(null);
    setCardPrompt('');
    setError(null);
    setPurged(true);
    return;
  }

  try {
    const response = await fetch(`${API_URL}card/${cartaAEliminar.id}`, {
      method: 'DELETE',
      headers: { usersecretpasskey: 'Gabr686940RE' },
    });

    if (!response.ok) {
      console.error('Error al purgar la carta en el servidor:', response.status, await response.text());
      setError('No se pudo purgar la carta del mazo. Intenta nuevamente.');
      return;
    }

    setCartaGenerada(null);
    setCardPrompt('');
    setError(null);
    setPurged(true);
  } catch (err) {
    console.error('No se pudo purgar la carta en el servidor:', err);
    setError('Ocurrió un error al purgar la carta. Verifica tu conexión.');
  }
};

const irAlMazo = () => {
  if (!cartaGenerada || purged) return;
  navigate('/');
};

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050508] text-gray-200 p-6 overflow-hidden">
      {/* Efectos de luces de fondo (igual que en Home) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-950/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Botón de regreso */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-5 py-2.5 bg-black/40 border border-white/10 hover:border-red-500/40 hover:bg-red-950/40 rounded-xl backdrop-blur-sm transition-all duration-300 text-gray-400 hover:text-red-400 font-bold text-xs uppercase tracking-widest shadow-lg"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform duration-300 text-lg leading-none">
          ←
        </span>
        Salir
      </button>

      <div className="w-full max-w-2xl relative z-10">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-purple-400 to-red-600">
              Generar Carta con IA
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">
            Invoca una nueva maldición o hechicero
          </p>
        </div>

        {/* Contenedor del formulario */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {/* Textarea */}
          <label className="block mb-3 text-sm font-bold text-gray-300 uppercase tracking-wider">
            Descripción de la carta
          </label>
          <textarea
            className="w-full p-4 bg-black/60 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 resize-none transition-all duration-300"
            rows={4}
            placeholder="Ej: Un hechicero de grado especial del clan Gojo con dominio impecable del Infinito..."
            value={cardPrompt}
            onChange={(e) => setCardPrompt(e.target.value)}
            disabled={loading}
          />

          <div className="mt-4 text-xs text-gray-400 uppercase tracking-[0.25em] text-center">
            Usa un prompt claro para generar una carta balanceada y visualmente llamativa.
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-3 mb-4 text-[11px] uppercase tracking-[0.3em] text-slate-300 font-semibold">
              <span className="text-purple-300">Prompts sugeridos</span>
              <span className="text-slate-500">Toca para copiar</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROMPT_EXAMPLES.map((example, index) => {
                const selected = cardPrompt.trim() === example;
                return (
                  <button
                    key={example}
                    type="button"
                    onClick={() => seleccionarEjemplo(example)}
                    className={`group relative rounded-3xl border p-4 text-left transition-all duration-300 ${
                      selected
                        ? 'border-purple-500/70 bg-purple-950/90 shadow-[0_0_25px_rgba(139,92,246,0.35)]'
                        : 'border-white/10 bg-slate-950/80 hover:border-purple-500/50 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Ejemplo {index + 1}</span>
                      {selected && (
                        <span className="text-[10px] uppercase tracking-[0.35em] text-emerald-300">Seleccionado</span>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-slate-100">{example}</p>
                    <span className="pointer-events-none absolute top-4 right-4 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Copiar
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-400">
            <span>{cardPrompt.trim().length} caracteres</span>
            <button
              type="button"
              onClick={() => setCardPrompt('')}
              disabled={loading || !cardPrompt.trim()}
              className="text-amber-300 hover:text-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Limpiar prompt
            </button>
          </div>

          {/* Botón de generar */}
          <button
            onClick={generarCarta}
            disabled={loading || !cardPrompt.trim()}
            className={`mt-5 w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              loading || !cardPrompt.trim()
                ? 'bg-gray-800 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-red-700 to-purple-700 hover:from-red-600 hover:to-purple-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Manifestando energía maldita...
              </span>
            ) : (
              '🤖 Generar Carta'
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm text-center backdrop-blur-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Resultado: Carta visual en lugar de JSON */}
          {cartaGenerada && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <h3 className="text-xl font-bold text-center text-purple-300 mb-6 flex flex-col items-center gap-3">
                <span className="text-2xl">🃏</span>
                <span>Carta generada por IA</span>
              </h3>

              <div className="grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr] items-start">
                <div className="w-full mx-auto max-w-[280px]">
                  <Cartadetalle
                    carta={cartaGenerada}
                    seleccionada={false}
                    ocultarBotones
                    onEliminar={handleEliminarDummy}
                    onActualizar={handleActualizarDummy}
                  />
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
                      Detalles generados
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                      <div className="rounded-2xl bg-black/30 p-3">
                        <div className="text-[10px] uppercase text-gray-400 mb-2">Ataque</div>
                        <div className="text-xl font-black text-white">{cartaGenerada.ataque}</div>
                      </div>
                      <div className="rounded-2xl bg-black/30 p-3">
                        <div className="text-[10px] uppercase text-gray-400 mb-2">Defensa</div>
                        <div className="text-xl font-black text-white">{cartaGenerada.defensa}</div>
                      </div>
                      <div className="rounded-2xl bg-black/30 p-3">
                        <div className="text-[10px] uppercase text-gray-400 mb-2">Vida</div>
                        <div className="text-xl font-black text-white">{cartaGenerada.hp}</div>
                      </div>
                      <div className="rounded-2xl bg-black/30 p-3">
                        <div className="text-[10px] uppercase text-gray-400 mb-2">Categoría</div>
                        <div className="text-xl font-black text-white">{cartaGenerada.categoria}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Guía de guardado</div>
                    <p className="text-sm leading-relaxed text-slate-300">
                      Si te gusta esta carta, guárdala directamente en el grimorio y vuelve al inicio.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={irAlMazo}
                      disabled={purged}
                      className={`w-full py-3 rounded-2xl font-bold uppercase tracking-[0.15em] text-sm shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all duration-300 ${purged ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-white/10' : 'bg-gradient-to-r from-purple-700 to-blue-600 text-white hover:scale-[1.02]'}`}
                    >
                      Ir al mazo
                    </button>
                    <button
                      type="button"
                      onClick={purgarCarta}
                      className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 text-slate-200 font-bold uppercase tracking-[0.15em] text-sm shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                      Purgar Carta
                    </button>
                  </div>
                  {purged && (
                    <p className="text-center text-sm text-rose-300 mt-2">
                      Carta purgada. No se agregará al mazo ni podrá editarse.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GenerarCartaIA;