import { useState } from "react";
import type { Carta } from "./index";
import { Link, useNavigate } from "react-router";
import Cartadetalle from "./CartaProyecto";
import {
    LuSword,
    LuCastle,
    LuArrowLeft,
    LuPlus,
    LuTrash2,
    LuX,
    LuSparkles
} from "react-icons/lu";

export type Movimiento = {
    id: string;
    nombre: string;
    danio: number;
    cooldown: number
};

type Props = {
    mazo: Carta[];
};

function SeleccionarCartas({ mazo }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);

    const [movimientosGlobales, setMovimientosGlobales] = useState<Record<number, Movimiento[]>>({});
    const [modalAbierto, setModalAbierto] = useState<number | null>(null);
    const [nombreMov, setNombreMov] = useState("");
    const [danioMov, setDanioMov] = useState<number | "">("");

    const navigate = useNavigate();

    const cartaModal = modalAbierto !== null ? mazo?.find(c => c.id === modalAbierto) : null;
    const limiteMinimo = 0;
    const limiteMaximo = cartaModal?.ataque ?? 100;
    const seleccionadasCount = [cartaSeleccionada1, cartaSeleccionada2].filter(Boolean).length;
    const listobatalla = seleccionadasCount === 2;

    const handleSeleccionarCarta = (carta: Carta) => {
        const isSelected1 = cartaSeleccionada1?.id === carta.id;
        const isSelected2 = cartaSeleccionada2?.id === carta.id;

        if (isSelected1) {
            setCartaSeleccionada1(null);
            return;
        }
        if (isSelected2) {
            setCartaSeleccionada2(null);
            return;
        }

        if (!cartaSeleccionada1) {
            setCartaSeleccionada1(carta);
            return;
        }

        if (!cartaSeleccionada2) {
            setCartaSeleccionada2(carta);
            return;
        }
    };

    const abrirModal = (e: React.MouseEvent, carta: Carta) => {
        e.stopPropagation();
        setModalAbierto(carta.id);
        setDanioMov(carta.ataque);
    };

    const agregarMovimiento = (idCarta: number) => {
        if (!nombreMov.trim() || !cartaModal) return;
        const actuales = movimientosGlobales[idCarta] || [];
        if (actuales.length >= 3) return;

        let danioFinal = danioMov === "" ? 0 : danioMov;
        if (danioFinal < limiteMinimo) danioFinal = limiteMinimo;
        if (danioFinal > limiteMaximo) danioFinal = limiteMaximo;

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
        setDanioMov(cartaModal.ataque);
    };

    const eliminarMovimiento = (idCarta: number, idMov: string) => {
        const actuales = movimientosGlobales[idCarta] || [];
        setMovimientosGlobales({
            ...movimientosGlobales,
            [idCarta]: actuales.filter(m => m.id !== idMov)
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#050508] text-white flex flex-col items-center py-6 px-4 relative overflow-x-hidden">
            {/* Luces / Energía Maldita de fondo */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-950/20 rounded-full blur-[140px] pointer-events-none" />

            {/* BARRA SUPERIOR DE NAVEGACIÓN */}
            <header className="z-20 w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                {/* Botón Salir */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-2.5 bg-black/50 border border-white/10 hover:border-red-500/40 hover:bg-red-950/30 rounded-xl backdrop-blur-md transition-all duration-300 text-gray-300 hover:text-red-400 font-bold text-xs uppercase tracking-widest shadow-lg"
                >
                    <LuArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    Salir
                </button>

                {/* Botones de Acción Superiores */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link to="/seleccionar-cartas-2" className="flex-1 sm:flex-none">
                        <button className="w-full group relative px-5 py-2.5 bg-gradient-to-r from-amber-950/40 to-red-950/40 border border-amber-500/30 hover:border-amber-400/60 text-amber-200 font-bold text-xs uppercase tracking-widest rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2.5">
                            <LuCastle size={18} className="text-amber-400 group-hover:text-red-400 transition-colors" />
                            <div className="flex flex-col items-start text-left">
                                <span>Modo Historia</span>
                                <span className="text-[8px] text-amber-500/70 tracking-tighter">▸ Mazmorra</span>
                            </div>
                        </button>
                    </Link>

                    {listobatalla ? (
                        <Link
                            to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
                            state={{
                                carta1: cartaSeleccionada1,
                                carta2: cartaSeleccionada2,
                                movimientosCarta1: cartaSeleccionada1 ? movimientosGlobales[cartaSeleccionada1.id] : undefined,
                                movimientosCarta2: cartaSeleccionada2 ? movimientosGlobales[cartaSeleccionada2.id] : undefined
                            }}
                            className="flex-1 sm:flex-none"
                        >
                            <button className="w-full px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-xs uppercase tracking-widest">
                                <LuSword size={18} className="animate-bounce" />
                                Ir a la Batalla
                            </button>
                        </Link>
                    ) : (
                        <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white/5 border border-white/5 opacity-40 cursor-not-allowed text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest" disabled>
                            <LuSword size={18} />
                            Ir a la Batalla
                        </button>
                    )}
                </div>
            </header>

            {/* ENCABEZADO PRINCIPAL */}
            <div className="z-10 text-center mb-6 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-slate-100 to-blue-400 drop-shadow-lg">
                    Selecciona tus Guerreros
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Elige 2 cartas para el combate y configura sus técnicas especiales.
                </p>
            </div>

            {/* VISTA PREVIA DE RANURAS SELECCIONADAS (P1 vs P2) */}
            <div className="z-10 w-full max-w-xl mb-8">
                <div className="grid grid-cols-2 gap-4 bg-black/40 p-3 rounded-2xl border border-purple-500/20 backdrop-blur-md">
                    {/* Ranura 1 */}
                    <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${cartaSeleccionada1 ? 'bg-purple-950/40 border-purple-500/50 text-white' : 'bg-white/[0.02] border-dashed border-white/10 text-gray-500'
                        }`}>
                        <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">G1</span>
                            <span className="text-xs font-bold truncate">
                                {cartaSeleccionada1 ? cartaSeleccionada1.nombre : "Seleccionar..."}
                            </span>
                        </div>
                        {cartaSeleccionada1 && (
                            <button
                                onClick={() => setCartaSeleccionada1(null)}
                                className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <LuX size={14} />
                            </button>
                        )}
                    </div>

                    {/* Ranura 2 */}
                    <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${cartaSeleccionada2 ? 'bg-blue-950/40 border-blue-500/50 text-white' : 'bg-white/[0.02] border-dashed border-white/10 text-gray-500'
                        }`}>
                        <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">G2</span>
                            <span className="text-xs font-bold truncate">
                                {cartaSeleccionada2 ? cartaSeleccionada2.nombre : "Seleccionar..."}
                            </span>
                        </div>
                        {cartaSeleccionada2 && (
                            <button
                                onClick={() => setCartaSeleccionada2(null)}
                                className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <LuX size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* GRID DE CARTAS */}
            <main className="z-10 w-full max-w-7xl flex-1 px-2">
                {mazo && mazo.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {mazo.map((carta) => {
                            const esGuerrero1 = cartaSeleccionada1?.id === carta.id;
                            const esGuerrero2 = cartaSeleccionada2?.id === carta.id;
                            const estaSeleccionada = esGuerrero1 || esGuerrero2;
                            const cantidadMovs = (movimientosGlobales[carta.id] || []).length;

                            return (
                                <div
                                    key={carta.id}
                                    className={`relative w-full max-w-[260px] transform transition-all duration-300 rounded-2xl p-1 flex flex-col ${estaSeleccionada
                                            ? 'bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 scale-[1.03] shadow-[0_0_30px_rgba(147,51,234,0.4)]'
                                            : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02] border border-white/10'
                                        }`}
                                >
                                    <div className="bg-[#0b0c10]/95 backdrop-blur-md rounded-[14px] p-2.5 h-full flex flex-col">
                                        {/* Encabezado de la Tarjeta */}
                                        <div className="flex items-center justify-between gap-2 mb-2 px-1">
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-purple-300 font-bold truncate">
                                                {carta.categoria || "Hechicero"}
                                            </span>
                                            {estaSeleccionada && (
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${esGuerrero1 ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                                                    }`}>
                                                    {esGuerrero1 ? 'Guerrero 1' : 'Guerrero 2'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Vista de Carta Clicable */}
                                        <div
                                            onClick={() => handleSeleccionarCarta(carta)}
                                            className="cursor-pointer flex-1 rounded-xl overflow-hidden bg-black/60 border border-white/5 hover:border-purple-500/40 transition-all duration-300 relative group"
                                        >
                                            <Cartadetalle
                                                carta={carta}
                                                seleccionada={estaSeleccionada}
                                                ocultarBotones={true}
                                            />
                                        </div>

                                        {/* Botón Personalizar Ataques */}
                                        <button
                                            onClick={(e) => abrirModal(e, carta)}
                                            className="mt-3 w-full py-2 bg-gradient-to-r from-purple-950/60 to-blue-950/60 hover:from-purple-900/80 hover:to-blue-900/80 border border-purple-500/30 hover:border-purple-400 rounded-xl text-[11px] text-purple-200 font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <LuSparkles size={13} className="text-purple-400" />
                                            Ataques ({cantidadMovs}/3)
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-black/30 border border-white/10 rounded-2xl max-w-md mx-auto">
                        <span className="text-4xl mb-3">🔮</span>
                        <p className="text-gray-400 font-medium text-xs tracking-wide">
                            No hay cartas disponibles en tu mazo.
                        </p>
                    </div>
                )}
            </main>

            {/* MODAL DE TÉCNICAS / MOVIMIENTOS */}
            {modalAbierto !== null && cartaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0b0c12] border border-purple-500/40 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(147,51,234,0.3)] relative">
                        {/* Cierre X superior */}
                        <button
                            onClick={() => setModalAbierto(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <LuX size={18} />
                        </button>

                        <div className="text-center mb-5">
                            <h2 className="text-lg font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                Técnicas de {cartaModal.nombre}
                            </h2>
                            <p className="text-[11px] text-gray-400 mt-0.5">Ataque Base: {cartaModal.ataque}</p>
                        </div>

                        {/* Formulario Agregar Técnica */}
                        <div className="flex flex-col gap-3 mb-5 bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                            <input
                                type="text"
                                placeholder="Nombre de la técnica (Ej: Destello Oscuro)"
                                value={nombreMov}
                                onChange={(e) => setNombreMov(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-colors"
                            />

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] text-gray-400 uppercase px-1 font-bold">
                                    <span>Daño</span>
                                    <span>Mín: {limiteMinimo} | Máx: {limiteMaximo}</span>
                                </div>
                                <input
                                    type="number"
                                    min={limiteMinimo}
                                    max={limiteMaximo}
                                    value={danioMov}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "") {
                                            setDanioMov("");
                                        } else {
                                            const num = Number(val);
                                            setDanioMov(num > limiteMaximo ? limiteMaximo : num);
                                        }
                                    }}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500/60 transition-colors"
                                />
                            </div>

                            <button
                                onClick={() => agregarMovimiento(modalAbierto)}
                                disabled={(movimientosGlobales[modalAbierto]?.length || 0) >= 3 || !nombreMov.trim()}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 rounded-xl font-black text-xs tracking-wider uppercase shadow-md disabled:opacity-30 disabled:pointer-events-none mt-1 transition-all flex items-center justify-center gap-2"
                            >
                                <LuPlus size={16} />
                                Añadir Ataque (CD: {(movimientosGlobales[modalAbierto]?.length || 0) + 1})
                            </button>
                        </div>

                        {/* Lista de Técnicas Registradas */}
                        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                            {(movimientosGlobales[modalAbierto] || []).map((m) => (
                                <div key={m.id} className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-colors">
                                    <div>
                                        <p className="text-xs font-bold text-purple-300 flex items-center gap-2">
                                            {m.nombre}
                                            <span className="text-[9px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded border border-blue-500/30 font-semibold">
                                                CD: {m.cooldown}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Daño: {m.danio}</p>
                                    </div>
                                    <button
                                        onClick={() => eliminarMovimiento(modalAbierto, m.id)}
                                        className="text-gray-400 hover:text-red-400 p-2 bg-red-950/20 hover:bg-red-950/50 rounded-lg transition-colors"
                                    >
                                        <LuTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {(movimientosGlobales[modalAbierto] || []).length === 0 && (
                                <p className="text-xs text-center text-gray-500 italic py-4">
                                    No hay técnicas personalizadas añadidas (máximo 3).
                                </p>
                            )}
                        </div>

                        {/* Botón de Confirmación */}
                        <button
                            onClick={() => setModalAbierto(null)}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-gray-300"
                        >
                            Listo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeleccionarCartas;