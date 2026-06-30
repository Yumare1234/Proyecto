import { useState } from "react";
import type { Carta } from "./index";
import { Link, useNavigate } from "react-router";
import Cartadetalle from "./CartaProyecto";
import { LuSword, LuSkull, LuFlame, LuCastle } from "react-icons/lu";

// Tipo de movimiento con su respectivo cooldown
export type Movimiento = { id: string; nombre: string; danio: number; cooldown: number };

type Props = {
    mazo: Carta[];
};

function SeleccionarCartas2({ mazo }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);
    const [listobatalla, setlistobatalla] = useState<boolean>(false);
    
    const [movimientosGlobales, setMovimientosGlobales] = useState<Record<number, Movimiento[]>>({});
    const [modalAbierto, setModalAbierto] = useState<number | null>(null);
    const [nombreMov, setNombreMov] = useState("");

    const navigate = useNavigate();

    // Filtramos el mazo original para obtener solo las de Jujutsu Kaisen
    const cartasJujutsu = mazo.filter((carta) => carta.serie === "Jujutsu Kaisen");

    // Buscamos la carta del modal dentro del mazo filtrado
    const cartaModal = modalAbierto !== null ? cartasJujutsu.find(c => c.id === modalAbierto) : null;

    // Función para calcular el daño según el orden del movimiento
    const calcularDanio = (carta: Carta, ordenMovimiento: number): number => {
        const danioBase = carta.ataque;
        const porcentajes = [0.10, 0.20, 0.30]; // 10%, 20%, 30%
        const indiceAjustado = ordenMovimiento - 1; // Convertir a índice 0-based
        
        if (indiceAjustado >= 0 && indiceAjustado < porcentajes.length) {
            const aumento = danioBase * porcentajes[indiceAjustado];
            return Math.round(danioBase + aumento);
        }
        
        return danioBase; // Fallback al daño base
    };

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
    };

    const agregarMovimiento = (idCarta: number) => {
        if (!nombreMov.trim() || !cartaModal) return;
        const actuales = movimientosGlobales[idCarta] || [];
        if (actuales.length >= 3) return; 

        // El orden del nuevo movimiento será actuales.length + 1
        const ordenMovimiento = actuales.length + 1;
        
        // Calcular el daño automáticamente basado en el orden
        const danioCalculado = calcularDanio(cartaModal, ordenMovimiento);
        
        const cooldownAsignado = ordenMovimiento;

        const nuevoMov: Movimiento = {
            id: Date.now().toString(),
            nombre: nombreMov,
            danio: danioCalculado,
            cooldown: cooldownAsignado
        };

        setMovimientosGlobales({
            ...movimientosGlobales,
            [idCarta]: [...actuales, nuevoMov]
        });
        
        setNombreMov("");
    };

    const eliminarMovimiento = (idCarta: number, idMov: string) => {
        const actuales = movimientosGlobales[idCarta] || [];
        setMovimientosGlobales({
            ...movimientosGlobales,
            [idCarta]: actuales.filter(m => m.id !== idMov)
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col items-center py-8 px-4 relative overflow-hidden">
            {/* Efectos de ambiente de mazmorra */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none" />
            
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-950/15 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-950/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-amber-950/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Botón de salida temático */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-5 py-2.5 bg-black/60 border border-amber-700/30 hover:border-red-700/50 hover:bg-red-950/30 rounded-xl backdrop-blur-sm transition-all duration-300 text-gray-400 hover:text-red-400 font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-900/10"
            >
                <LuSkull className="text-lg group-hover:animate-pulse" />
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
                    Abandonar
                </span>
            </button>

            {/* Título temático de mazmorra */}
            <div className="z-10 text-center mb-8 mt-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <LuFlame className="text-3xl text-amber-500 animate-pulse" />
                    <h1 className="text-4xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-b from-amber-300 via-orange-400 to-red-600 drop-shadow-[0_2px_10px_rgba(255,140,0,0.3)]">
                        CÁMARA DE HECHICEROS
                    </h1>
                    <LuFlame className="text-3xl text-amber-500 animate-pulse" />
                </div>
                <p className="text-amber-400/80 text-sm mt-1 tracking-wider">
                    Selecciona dos guerreros para descender a la mazmorra maldita
                </p>
                <div className="flex justify-center gap-2 mt-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
                    <LuCastle className="text-amber-600/60 text-lg" />
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
                </div>
            </div>

            {/* Grid de cartas */}
            <div className="z-10 w-full max-w-6xl flex-1 flex items-center justify-center px-2">
                {cartasJujutsu && cartasJujutsu.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
                        {cartasJujutsu.map((carta) => {
                            const estaSeleccionada =
                                cartaSeleccionada1?.id === carta.id ||
                                cartaSeleccionada2?.id === carta.id;

                            return (
                                <div
                                    key={carta.id}
                                    className={`relative transform transition-all duration-300 rounded-2xl p-1 flex flex-col
                                        ${estaSeleccionada
                                            ? 'bg-gradient-to-b from-amber-600 via-orange-700 to-red-800 scale-105 shadow-[0_0_30px_rgba(255,140,0,0.4)]'
                                            : 'bg-gradient-to-b from-gray-800/30 to-gray-900/30 hover:from-gray-700/30 hover:to-gray-800/30 hover:scale-102 border border-amber-900/20'
                                        }
                                    `}
                                >
                                    <div className="bg-[#0d0d12]/95 backdrop-blur-md rounded-[14px] p-2 h-full flex flex-col border border-amber-900/10">
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
                                            className="mt-3 w-full py-1.5 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-700/30 rounded-lg text-[11px] text-amber-200/80 font-bold tracking-wider uppercase transition-all hover:shadow-[0_0_15px_rgba(255,140,0,0.2)]"
                                        >
                                            <LuFlame className="inline mr-1 text-amber-500" size={12} />
                                            Maldiciones ({(movimientosGlobales[carta.id] || []).length}/3)
                                        </button>
                                    </div>

                                    {estaSeleccionada && (
                                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-400/30 animate-pulse shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                                            Elegido
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-500 text-lg flex flex-col items-center gap-3">
                        <LuSkull className="text-4xl text-red-900/50" />
                        <p>No hay hechiceros de Jujutsu Kaisen disponibles...</p>
                    </div>
                )}
            </div>

            {/* Botón de ir a la mazmorra */}
            <div className="z-20 mt-12 mb-4">
                <Link
                    to={`/campo-de-batalla-2/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
                    state={{ 
                        carta1: cartaSeleccionada1, 
                        carta2: cartaSeleccionada2,
                        movimientosCarta1: cartaSeleccionada1 ? movimientosGlobales[cartaSeleccionada1.id] : undefined,
                        movimientosCarta2: cartaSeleccionada2 ? movimientosGlobales[cartaSeleccionada2.id] : undefined
                    }}
                >
                    <button
                        className={`relative px-10 py-4 bg-gradient-to-b from-amber-700 via-orange-800 to-red-900 hover:from-amber-600 hover:via-orange-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-3 group overflow-hidden
                            ${!listobatalla ? 'opacity-40 cursor-not-allowed scale-100 shadow-none' : 'hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,140,0,0.3)] hover:shadow-[0_0_50px_rgba(255,140,0,0.5)]'}
                        `}
                        disabled={!listobatalla}
                    >
                        {/* Efecto de brillo en el botón */}
                        {listobatalla && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        )}
                        
                        <LuCastle size={24} className={`relative z-10 ${listobatalla ? 'group-hover:animate-bounce' : ''}`} />
                        <span className="relative z-10 text-lg uppercase tracking-widest">
                            Ir a la Mazmorra
                        </span>
                        <LuSword size={24} className={`relative z-10 ${listobatalla ? 'group-hover:animate-pulse' : ''}`} />
                    </button>
                </Link>
                
                {!listobatalla && (
                    <p className="text-amber-700/60 text-xs text-center mt-2 tracking-wider">
                        Selecciona dos hechiceros para continuar...
                    </p>
                )}
            </div>

            {/* Modal de creación de movimientos (ahora "Maldiciones") */}
            {modalAbierto !== null && cartaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="bg-[#0d0d12] border border-amber-700/50 rounded-2xl p-6 w-full max-w-md shadow-[0_0_60px_rgba(255,140,0,0.2)]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <LuFlame className="text-amber-500" />
                            <h2 className="text-xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-500 text-center">
                                Maldiciones de {cartaModal.nombre}
                            </h2>
                            <LuFlame className="text-amber-500" />
                        </div>
                        <p className="text-amber-700/60 text-xs text-center mb-4">
                            Forja hasta 3 técnicas malditas
                        </p>
                        
                        <div className="flex flex-col gap-3 mb-4">
                            <input 
                                type="text" 
                                placeholder="Nombre de la maldición (Ej: Destello oscuro)" 
                                value={nombreMov}
                                onChange={(e) => setNombreMov(e.target.value)}
                                className="w-full bg-black/50 border border-amber-900/30 rounded-lg p-2.5 text-sm text-amber-100 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                            />
                            
                            <button 
                                onClick={() => agregarMovimiento(modalAbierto)}
                                disabled={(movimientosGlobales[modalAbierto]?.length || 0) >= 3 || !nombreMov.trim()}
                                className="w-full py-2.5 bg-gradient-to-r from-amber-800 to-red-800 hover:from-amber-700 hover:to-red-700 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md disabled:opacity-30 disabled:pointer-events-none mt-2 transition-all border border-amber-600/30"
                            >
                                <LuFlame className="inline mr-2" size={14} />
                                Imbuir Maldición (CD: {(movimientosGlobales[modalAbierto]?.length || 0) + 1})
                            </button>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            {(movimientosGlobales[modalAbierto] || []).map((m) => (
                                <div key={m.id} className="flex justify-between items-center bg-black/40 hover:bg-black/60 p-3 rounded-lg border border-amber-900/20 transition-colors">
                                    <div>
                                        <p className="text-sm font-bold text-amber-300 flex items-center gap-2">
                                            <LuFlame className="text-amber-600" size={12} />
                                            {m.nombre}
                                            <span className="text-[10px] bg-red-950/50 text-red-300 px-1.5 py-0.5 rounded border border-red-800/30">
                                                CD: {m.cooldown}
                                            </span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => eliminarMovimiento(modalAbierto, m.id)} 
                                        className="text-red-400 hover:text-red-300 font-bold px-3 py-1 bg-red-950/30 rounded-md transition-colors hover:bg-red-900/50"
                                    >
                                        <LuSkull size={14} />
                                    </button>
                                </div>
                            ))}
                            {(movimientosGlobales[modalAbierto] || []).length === 0 && (
                                <p className="text-xs text-center text-amber-800/50 italic py-4">Aún no hay maldiciones forjadas. Máximo 3.</p>
                            )}
                        </div>

                        <button 
                            onClick={() => setModalAbierto(null)}
                            className="w-full py-2.5 bg-black/40 hover:bg-black/60 border border-amber-900/30 rounded-lg text-sm font-bold uppercase tracking-wider transition-all text-amber-500/80 hover:text-amber-400 hover:border-amber-700/50"
                        >
                            Sellar Maldiciones
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeleccionarCartas2;