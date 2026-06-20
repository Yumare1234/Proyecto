import { useState } from 'react';

export const GenerarCartaIA = () => {
  // 1. Definición de los estados requeridos
  const [cardPrompt, setCardPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaGenerada, setCartaGenerada] = useState<Record<string, unknown> | null>(null);

  // 2. Función para manejar la petición POST
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
          'usersecretpasskey': 'Gabr686940RE' 
        },
        body: JSON.stringify({
          globalContext: "Eres un asistente experto diseñando cartas para un juego de mesa de Jujutsu Kaisen. Debes generar estadísticas de combate, nivel de poder y una descripción de su técnica maldita basada en el prompt del usuario.",
          cardPrompt: cardPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} - Verifica el token o tu conexión.`);
      }

      const data = await response.json();
      setCartaGenerada(data); // Guardamos la respuesta exitosa
      
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">Generar Carta con IA</h1>
        
        {/* Textarea para el prompt */}
        <label className="block mb-2 text-sm font-semibold text-slate-300">
          ¿Qué tipo de hechicero o maldición deseas crear?
        </label>
        <textarea
          className="w-full p-4 mb-6 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={5}
          placeholder="Ej: Un hechicero de grado 1 del clan Zenin con una técnica de restricción celestial..."
          value={cardPrompt}
          onChange={(e) => setCardPrompt(e.target.value)}
          disabled={loading}
        />

        {/* Botón de Generar */}
        <button
          onClick={generarCarta}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
            loading 
              ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
              : 'bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]'
          }`}
        >
          {loading ? 'Manifestando energía maldita...' : 'Generar carta'}
        </button>

        {/* Manejo de Errores */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Respuesta Exitosa */}
        {cartaGenerada && (
          <div className="mt-6 p-6 bg-slate-900 border border-green-500 rounded-lg">
            <h2 className="text-xl font-bold mb-3 text-green-400">¡Carta Creada!</h2>
            <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(cartaGenerada, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerarCartaIA;