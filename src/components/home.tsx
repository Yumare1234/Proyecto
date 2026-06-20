import { useMemo, useState } from 'react';
import type { Carta } from './index';
import Cartadetalle from './CartaProyecto';
import { Link } from 'react-router';

const Home = ({ cartas, onEliminar, onActualizar }: { cartas: Carta[]; onEliminar: (id: number) => void; onAñadirCarta: (carta: Carta) => void; onActualizar: (carta: Carta) => void; }) => {
    const [busqueda, setBusqueda] = useState('');
    
    const cartasfiltradas = useMemo(() => {
        const term = busqueda.toLowerCase();
        return cartas.filter(carta => 
            carta.nombre.toLowerCase().includes(term) || 
            carta.categoria.toLowerCase().includes(term)
        );
    }, [busqueda, cartas]);

    return (
        <div className="flex flex-col min-h-screen bg-[#07070a] text-gray-200 relative overflow-hidden">
            {/* Efectos de luces de fondo (Energía Maldita de fondo) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            {/* HEADER PREMIUM & RESPONSIVO */}
            <header className="z-10 sticky top-0 bg-black/40 backdrop-blur-xl border-b border-purple-500/20 px-4 md:px-8 py-4 mb-10 shadow-2xl transition-all">
                <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                        <img src="/imagenes/Logo.png" alt="Logo" className="h-12 md:h-14 w-auto object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-purple-400">
                                Jujutsu Kaisen
                            </h1>
                            <span className="text-[10px] text-purple-400 font-bold tracking-[0.3em] uppercase mt-[-2px]">Decks & Cards</span>
                        </div>
                    </div>

                    {/* Buscador Estilizado */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 relative group">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar hechicero o grado..."
                            className="w-full p-3 pl-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 outline-none text-sm transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 group-hover:border-white/20"
                        />
                        <div className="absolute right-4 top-3.5 text-gray-500 pointer-events-none text-xs group-focus-within:text-purple-400 font-bold">
                            🔍
                        </div>
                    </div>

                    {/* Botones de Acción de Navegación */}
                    <div className="flex items-center justify-center gap-4 w-full lg:w-auto">
                        <Link to="/crear-carta" className="w-1/2 lg:w-auto">
                            <button className="w-full lg:px-6 py-3 bg-white/5 hover:bg-purple-900/30 border border-white/10 hover:border-purple-500/40 text-white text-xs font-bold rounded-xl tracking-widest uppercase transition-all duration-300 active:scale-95 whitespace-nowrap">
                                🃏 Crear Carta
                            </button>
                        </Link>
                        <Link to="/generar-carta-ia" className="w-1/2 lg:w-auto">
                            <button className="w-full bg-red-700 hover:bg-red-600 lg:px-6 py-3 bg-white/5 hover:bg-purple-900/30 border border-white/10 hover:border-purple-500/40 text-white text-xs font-bold rounded-xl tracking-widest uppercase transition-all duration-300 active:scale-95 whitespace-nowrap">
                                🤖 Crear Carta con IA
                            </button>
                        </Link>
                        <Link to="/seleccionar-cartas" className="w-1/2 lg:w-auto">
                            <button className="w-full lg:px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white text-xs font-black rounded-xl tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:shadow-[0_0_25px_rgba(147,51,234,0.45)] whitespace-nowrap">
                                ⚔️ Iniciar Batalla
                            </button>
                        </Link>
                    </div>

                </div>
            </header>

            {/* SECCIÓN PRINCIPAL DEL GRID */}
            <main className="z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1">
    {cartasfiltradas.length > 0 ? (
        /* Cambiamos el contenedor del hover a las propiedades nativas de la carta o eliminamos el div restrictivo */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center animate-fade-in">
            {cartasfiltradas.map((carta) => (
                <Cartadetalle 
                    key={carta.id}
                    carta={carta} 
                    seleccionada={false} 
                    onEliminar={onEliminar} 
                    onActualizar={onActualizar} 
                />
            ))}
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-white/5 rounded-2xl backdrop-blur-sm max-w-lg mx-auto">
            <span className="text-4xl mb-3">🔮</span>
            <p className="text-gray-400 text-center font-medium text-sm">
                No se encontraron rastros de energía maldita para
            </p>
            <p className="text-purple-400 font-bold text-base mt-1 italic">
                "{busqueda}"
            </p>
        </div>
    )}
</main>
        </div>
    );
};

export default Home;