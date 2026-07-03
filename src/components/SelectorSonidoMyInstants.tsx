import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiPlay, FiPause, FiCheck } from 'react-icons/fi';

type SonidoMyInstants = {
    id: number;
    name: string;
    sound: string;
};

type Props = {
    onSelect: (url: string) => void;
};

export function SelectorSonidoMyInstants({ onSelect }: Props) {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState<SonidoMyInstants[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [audioActual, setAudioActual] = useState<HTMLAudioElement | null>(null);
    const [sonidoReproduciendo, setSonidoReproduciendo] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce para la búsqueda
    useEffect(() => {
        if (!query.trim()) {
            setResultados([]);
            return;
        }

        const timer = setTimeout(() => {
            buscarSonidos(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const buscarSonidos = async (termino: string) => {
        setCargando(true);
        setError('');
        try {
            // En desarrollo usamos el proxy de Vite, en producción la API Route de Vercel
            const baseUrl = import.meta.env.PROD
                ? '/api/myinstants'
                : '/api/v1/instants';
            const url = `${baseUrl}?format=json&page=1&name=${encodeURIComponent(termino)}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.results) {
                setResultados(data.results);
            } else {
                setResultados([]);
                setError('No se encontraron sonidos.');
            }
        } catch (err) {
            console.error('Error al buscar en MyInstants:', err);
            setError('Error al conectar con el servidor.');
            setResultados([]);
        } finally {
            setCargando(false);
        }
    };

    const construirUrlSonido = (rutaRelativa: string) => {
        return `https://www.myinstants.com${rutaRelativa}`;
    };

    const togglePreview = (sonido: SonidoMyInstants) => {
        const url = construirUrlSonido(sonido.sound);

        if (sonidoReproduciendo === url && audioActual) {
            audioActual.pause();
            audioActual.currentTime = 0;
            setAudioActual(null);
            setSonidoReproduciendo(null);
            return;
        }

        if (audioActual) {
            audioActual.pause();
            audioActual.currentTime = 0;
        }

        const audio = new Audio(url);
        audio.volume = 0.7;
        audio.onended = () => {
            setSonidoReproduciendo(null);
            setAudioActual(null);
        };
        audio.play().catch(() => {
            setError('No se pudo reproducir la previsualización.');
        });
        setAudioActual(audio);
        setSonidoReproduciendo(url);
    };

    const seleccionarSonido = (sonido: SonidoMyInstants) => {
        const url = construirUrlSonido(sonido.sound);
        onSelect(url);
        setQuery('');
        setResultados([]);
    };



    return (
        <div className="space-y-3">
            {/* Campo de búsqueda */}
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar sonido en MyInstants (ej: yowai mo)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Indicador de carga */}
            {cargando && (
                <div className="text-center text-purple-400 text-sm animate-pulse">Buscando sonidos...</div>
            )}

            {/* Error */}
            {error && (
                <div className="text-red-400 text-sm">{error}</div>
            )}

            {/* Lista de resultados */}
            <div className="max-h-60 overflow-y-auto space-y-2">
                {resultados.map((sonido) => {
                    const urlSonido = construirUrlSonido(sonido.sound);
                    const estaReproduciendo = sonidoReproduciendo === urlSonido;
                    return (
                        <div
                            key={sonido.id}
                            className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-purple-500/50 transition-colors"
                        >
                            {/* Nombre del sonido */}
                            <span className="flex-1 text-white text-sm font-medium truncate">
                                {sonido.name}
                            </span>

                            {/* Botón de previsualización */}
                            <button
                                type="button"
                                onClick={() => togglePreview(sonido)}
                                className={`p-2 rounded-lg transition-colors ${estaReproduciendo
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                {estaReproduciendo ? <FiPause /> : <FiPlay />}
                            </button>

                            {/* Botón de seleccionar */}
                            <button
                                type="button"
                                onClick={() => seleccionarSonido(sonido)}
                                className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                                title="Usar este sonido"
                            >
                                <FiCheck />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Texto informativo */}
            <div className="text-xs text-slate-500 mt-2">
                ¿Tienes una URL directa? Puedes pegarla en el campo de abajo (alternativo):
            </div>
        </div>
    );
}