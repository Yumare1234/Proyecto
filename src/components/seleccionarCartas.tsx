import { useState } from "react";
import type { Carta } from "./index";
import { Link, useNavigate } from "react-router"; 
import Cartadetalle from "./CartaProyecto";
import { LuSword } from "react-icons/lu";

// Actualizamos el tipo para incluir el cooldown
export type Movimiento = { id: string; nombre: string; danio: number; cooldown: number };

type Props = {
    mazo: Carta[];
};

function SeleccionarCartas({ mazo }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);
    const [listobatalla, setlistobatalla] = useState<boolean>(false);
    
    const [movimientosGlobales, setMovimientosGlobales] = useState<Record<number, Movimiento[]>>({});
    const [modalAbierto, setModalAbierto] = useState<number | null>(null);
    const [nombreMov, setNombreMov] = useState("");
    const [danioMov, setDanioMov] = useState<number>(0);

    const navigate = useNavigate();

    // Cálculos de balance para el modal actual
    const cartaModal = modalAbierto !== null ? mazo.find(c => c.id === modalAbierto) : null;
    const limiteMinimo = cartaModal ? Math.floor(cartaModal.ataque * 0.4) : 0;
    const limiteMaximo = cartaModal ? Math.floor(cartaModal.ataque + (cartaModal.defensa * 0.5)) : 100;

    const handleSeleccionarCarta = (carta: Carta) => {
        const isSelected1 = cartaSeleccionada1?.id === carta.id;
        const isSelected2 = cartaSeleccionada2?.id === carta.id;

        if (isSelected1) {
            setCartaSeleccionada1(null);
            setlistobatalla(false);
            return;
        }
        if (isSelected2) {
            setCartaSeleccionada2(null);
            setlistobatalla(false);
            return;
        }

        if (!cartaSeleccionada1) {
            setCartaSeleccionada1(carta);
            if (cartaSeleccionada2) setlistobatalla(true);
        } else if (!cartaSeleccionada2) {
            setCartaSeleccionada2(carta);
            setlistobatalla(true);
        }
    };

    const abrirModal = (e: React.MouseEvent, carta: Carta) => {
        e.stopPropagation();
        setModalAbierto(carta.id);
        
        // Sugerir un daño intermedio equilibrado al abrir el modal
        const minSugerido = Math.floor(carta.ataque * 0.4);
        const maxSugerido = Math.floor(carta.ataque + (carta.defensa * 0.5));
        setDanioMov(Math.floor((minSugerido + maxSugerido) / 2));
    };

    const agregarMovimiento = (idCarta: number) => {
        if (!nombreMov.trim() || !cartaModal) return;
        const actuales = movimientosGlobales[idCarta] || [];
        if (actuales.length >= 3) return; 

        // Forzar los límites de daño por si el usuario intenta excederse
        let danioFinal = danioMov;
        if (danioFinal < limiteMinimo) danioFinal = limiteMinimo;
        if (danioFinal > limiteMaximo) danioFinal = limiteMaximo;
        
        // Asignamos el cooldown progresivo (1, 2 o 3 dependiendo de cuántos lleve)
        const cooldownAsignado = actuales.length + 1;

        const nuevoMov: Movimiento = {
            id: Date.now().toString(),
            nombre: nombreMov,
            danio: danioFinal,
            cooldown: cooldownAsignado
        };

        setMovimientosGlobales({
            ...movimientosGlobales,
            [idCarta]: [...actuales, nuevoMov]
        });
        setNombreMov("");
        setDanioMov(Math.floor((limiteMinimo + limiteMaximo) / 2));
    };

    const eliminarMovimiento = (idCarta: number, idMov: string) => {
        const actuales = movimientosGlobales[idCarta] || [];
        // Al eliminar, mantenemos los movimientos pero en tu caso puede que el cooldown de los restantes quede "desordenado" (ej: si borran el 1, queda el 2 y el 3).
        // Si quisieras que se recalculen estrictamente, tendrías que mapear el arreglo resultante. Por ahora, se elimina y listo.
        setMovimientosGlobales({
            ...movimientosGlobales,
            [idCarta]: actuales.filter(m => m.id !== idMov)
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#0b0c10] text-white flex flex-col items-center py-8 px-4 relative overflow-hidden">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-5 py-2.5 bg-black/40 border border-white/10 hover:border-red-500/40 hover:bg-red-950/40 rounded-xl backdrop-blur-sm transition-all duration-300 text-gray-400 hover:text-red-400 font-bold text-xs uppercase tracking-widest shadow-lg"
            >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300 text-lg leading-none">
                    ←
                </span>
                Salir
            </button>

            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-950/20 rounded-full blur-[130px] pointer-events-none" />

            <div className="z-10 text-center mb-8 mt-4">
                <h1 className="text-3xl font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-md">
                    Selecciona tus Guerreros
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Elige los personajes que se enfrentarán en el campo de batalla
                </p>
            </div>

            <div className="z-10 w-full max-w-6xl flex-1 flex items-center justify-center px-2">
                {mazo && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
                        {mazo.map((carta) => {
                            const estaSeleccionada =
                                cartaSeleccionada1?.id === carta.id ||
                                cartaSeleccionada2?.id === carta.id;

                            return (
                                <div
                                    key={carta.id}
                                    className={`relative transform transition-all duration-300 rounded-2xl p-1 flex flex-col
                                        ${estaSeleccionada
                                            ? 'bg-gradient-to-b from-purple-500 to-blue-500 scale-105 shadow-[0_0_25px_rgba(147,51,234,0.5)]'
                                            : 'bg-white/5 hover:bg-white/10 hover:scale-102 border border-white/10'
                                        }
                                    `}
                                >
                                    <div className="bg-[#12131a]/95 backdrop-blur-md rounded-[14px] p-2 h-full flex flex-col">
                                        <div
                                            onClick={() => handleSeleccionarCarta(carta)}
                                            className="cursor-pointer flex-1"
                                        >
                                            <Cartadetalle
                                                carta={carta}
                                                seleccionada={estaSeleccionada}
                                                ocultarBotones={true}
                                            />
                                        </div>
                                        
                                        <button
                                            onClick={(e) => abrirModal(e, carta)}
                                            className="mt-3 w-full py-1.5 bg-purple-900/30 hover:bg-purple-800/60 border border-purple-500/30 rounded-lg text-[11px] text-purple-200 font-bold tracking-wider uppercase transition-colors"
                                        >
                                            + Movimientos ({(movimientosGlobales[carta.id] || []).length}/3)
                                        </button>
                                    </div>

                                    {estaSeleccionada && (
                                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 animate-pulse">
                                            Listo
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="z-20 mt-12 mb-4">
                <Link
                    to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
                    state={{ 
                        carta1: cartaSeleccionada1, 
                        carta2: cartaSeleccionada2,
                        movimientosCarta1: cartaSeleccionada1 
                            ? movimientosGlobales[cartaSeleccionada1.id] 
                            : undefined,
                        movimientosCarta2: cartaSeleccionada2 
                            ? movimientosGlobales[cartaSeleccionada2.id] 
                            : undefined
                    }}
                >
                    <button
                        className={`px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 flex items-center gap-2
                            ${!listobatalla ? 'opacity-40 cursor-not-allowed scale-100 shadow-none' : 'hover:scale-105 active:scale-95'}
                        `}
                        disabled={!listobatalla}
                    >
                        <LuSword size={28} className={listobatalla ? 'animate-bounce' : ''} />
                    </button>
                </Link>
            </div>

            {/* Modal de forja de movimientos */}
            {modalAbierto !== null && cartaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0b0c10] border border-purple-500/50 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(147,51,234,0.4)]">
                        <h2 className="text-xl font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 text-center">
                            Ataques de {cartaModal.nombre}
                        </h2>
                        
                        <div className="flex flex-col gap-3 mb-4">
                            <input 
                                type="text" 
                                placeholder="Nombre del ataque (Ej: Destello oscuro)" 
                                value={nombreMov}
                                onChange={(e) => setNombreMov(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase px-1">
                                    <span>Mín: {limiteMinimo}</span>
                                    <span>Máx: {limiteMaximo}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-gray-400">Daño:</span>
                                    <input 
                                        type="number" 
                                        min={limiteMinimo}
                                        max={limiteMaximo}
                                        value={danioMov}
                                        onChange={(e) => setDanioMov(Number(e.target.value))}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => agregarMovimiento(modalAbierto)}
                                disabled={(movimientosGlobales[modalAbierto]?.length || 0) >= 3 || !nombreMov.trim()}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md disabled:opacity-30 disabled:pointer-events-none mt-2 transition-all"
                            >
                                Añadir Ataque (Tendrá CD: {(movimientosGlobales[modalAbierto]?.length || 0) + 1})
                            </button>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            {(movimientosGlobales[modalAbierto] || []).map((m) => (
                                <div key={m.id} className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-purple-300 flex items-center gap-2">
                                            {m.nombre}
                                            <span className="text-[10px] bg-blue-900/50 text-blue-200 px-1.5 py-0.5 rounded border border-blue-500/30">
                                                CD: {m.cooldown}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Daño infligido: {m.danio}</p>
                                    </div>
                                    <button 
                                        onClick={() => eliminarMovimiento(modalAbierto, m.id)} 
                                        className="text-red-400 hover:text-red-300 font-bold px-3 py-1 bg-red-950/30 rounded-md transition-colors"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {(movimientosGlobales[modalAbierto] || []).length === 0 && (
                                <p className="text-xs text-center text-gray-500 italic py-4">No hay ataques personalizados. Máximo 3.</p>
                            )}
                        </div>

                        <button 
                            onClick={() => setModalAbierto(null)}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors text-gray-300"
                        >
                            Confirmar Formación
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeleccionarCartas;