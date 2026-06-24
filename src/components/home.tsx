import { useMemo, useState } from 'react';
import type { Carta } from './index';
import Cartadetalle from './CartaProyecto';
import { Link } from 'react-router';

const Home = ({ cartas, onEliminar, onActualizar }: { cartas: Carta[]; onEliminar: (id: number) => void; onAñadirCarta: (carta: Carta) => void; onActualizar: (carta: Carta) => void; }) => {
    const [busqueda, setBusqueda] = useState('');
    
    const cartasfiltradas = useMemo(() => {
    const term = busqueda.toLowerCase();
    return cartas.filter(carta => {
    const nombre = (carta.nombre || '').toLowerCase();
    const categoria = (carta.categoria || '').toLowerCase();
    return nombre.includes(term) || categoria.includes(term);
    });
}, [busqueda, cartas]);

    return (
        <div className="flex flex-col min-h-screen bg-[#050508] text-gray-200 relative overflow-hidden">
            {/* Efectos de luces de fondo (Energía Maldita de fondo) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-950/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-950/10 rounded-full blur-[140px] pointer-events-none" />

            {/* HEADER CORREGIDO & REDISTRIBUIDO */}
            <header className="z-50 sticky top-0 bg-[#07070a]/60 backdrop-blur-2xl border-b border-purple-500/15 px-4 md:px-8 py-4 mb-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-7xl mx-auto flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    
                    {/* Brand / Logo (Bloque aislado para evitar colisiones con el texto) */}
                    <div className="flex items-center gap-3.5 justify-center sm:justify-start flex-shrink-0">
                        <img 
                            src="/imagenes/Logo.png" 
                            alt="Logo" 
                            className="h-11 md:h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                        />
                        <div className="flex flex-col">
                            <h1 className="text-lg md:text-xl font-black text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-400">
                                Jujutsu Kaisen
                            </h1>
                            <span className="text-[9px] text-purple-400 font-bold tracking-[0.35em] uppercase mt-0.5">Decks & Cards</span>
                        </div>
                    </div>

                    {/* Buscador Central Estilizado (No colapsa con el título) */}
                    <div className="w-full max-w-md mx-auto xl:mx-4 relative group">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar hechicero o grado..."
                            className="w-full p-2.5 pl-4 pr-10 rounded-xl bg-black/40 border border-white/5 text-white placeholder-gray-500 outline-none text-xs transition-all duration-300 focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
                        />
                        <div className="absolute right-4 top-3 text-gray-500 pointer-events-none text-xs group-focus-within:text-purple-400 transition-colors">
                            🔍
                        </div>
                    </div>

                    {/* Botones de Acción de Navegación Uniformes */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 w-full xl:w-auto">
                        <Link to="/crear-carta" className="w-[calc(50%-6px)] sm:w-auto">
                            <button className="w-full sm:px-4 py-2.5 bg-white/[0.02] hover:bg-purple-950/20 border border-white/5 hover:border-purple-500/30 text-white text-[11px] font-bold rounded-xl tracking-widest uppercase transition-all duration-200 active:scale-95 whitespace-nowrap">
                                🃏 Crear Carta
                            </button>
                        </Link>
                        
                        <Link to="/generar-carta-ia" className="w-[calc(50%-6px)] sm:w-auto">
                            <button className="w-full sm:px-4 py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-bold rounded-xl tracking-widest uppercase transition-all duration-200 active:scale-95 whitespace-nowrap">
                                🤖 Crear con IA
                            </button>
                        </Link>
                        
                        <Link to="/seleccionar-cartas" className="w-full sm:w-auto">
                            <button className="w-full sm:px-5 py-2.5 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white text-[11px] font-black rounded-xl tracking-widest uppercase transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.15)] hover:shadow-[0_0_20px_rgba(147,51,234,0.35)] whitespace-nowrap">
                                ⚔️ Iniciar Batalla
                            </button>
                        </Link>
                    </div>

                </div>
            </header>

            {/* SECCIÓN PRINCIPAL DEL GRID OPTIMIZADO */}
            <main className="z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1">
                {cartasfiltradas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center animate-in fade-in duration-500">
                        {cartasfiltradas.map((carta) => (
                            <div key={carta.id} className="w-full max-w-[240px]">
                                <Cartadetalle 
                                    carta={carta} 
                                    seleccionada={false} 
                                    onEliminar={onEliminar} 
                                    onActualizar={onActualizar} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-black/20 border border-white/5 rounded-2xl backdrop-blur-sm max-w-md mx-auto shadow-inner">
                        <span className="text-3xl mb-3">🔮</span>
                        <p className="text-gray-400 text-center font-medium text-xs tracking-wide px-4">
                            No se encontraron rastros de energía maldita para
                        </p>
                        <p className="text-purple-400 font-bold text-sm mt-1.5 italic truncate max-w-xs px-4">
                            "{busqueda}"
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;