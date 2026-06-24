import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Carta } from './index'; // Ajusta la ruta si tu tipo Carta está en otro archivo
import Cartadetalle from './CartaProyecto'; // El mismo componente que usas en Home

export const GenerarCartaIA = () => {
  const [cardPrompt, setCardPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaGenerada, setCartaGenerada] = useState<Carta | null>(null);
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
          id: data.id || Date.now(),
          nombre: data.nombre || 'Hechicero sin nombre',
          categoria: data.categoria || 'Grado 4',
          descripcion: data.descripcion || 'Sin descripción.',
          imagen: data.pictureUrl || data.imagen || '/imagenes/placeholder.png',
          ritual: data.ritual || 'Desconocido',
          ataque: data.ataque || 0,
          defensa: data.defensa || 0,
          clan: data.clan || 'Sin clan',
          hp: data.hp || 100,
};

      setCartaGenerada(carta);
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
              <h3 className="text-xl font-bold text-center text-purple-300 mb-6 flex items-center justify-center gap-2">
                <span className="text-2xl">🃏</span> Carta Generada
              </h3>
              <div className="flex justify-center">
                <div className="w-full max-w-[240px]">
                  <Cartadetalle
                    carta={cartaGenerada}
                    seleccionada={false}
                    onEliminar={handleEliminarDummy}
                    onActualizar={handleActualizarDummy}
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Puedes guardar esta carta desde la sección "Crear Carta" o volver a generar otra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerarCartaIA;