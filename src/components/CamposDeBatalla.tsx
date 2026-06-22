import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import type { Carta } from "./index.tsx";
import Cartadetalle from "./CartaProyecto";

type FaseBatalla = "PRESENTACION" | "COMBATE" | "FINALIZADO";
type Movimiento = { id: string; nombre: string; danio: number; cooldown: number };
type TipoEfecto = "NORMAL" | "CRITICO" | "DOMINIO" | null;

function CampoDeBatalla() {
    const { id1, id2 } = useParams<{ id1: string; id2: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const cartasDesdeState = location.state as {
        carta1?: Carta;
        carta2?: Carta;
        movimientosCarta1?: Movimiento[];
        movimientosCarta2?: Movimiento[];
    } | null;

    const movimientosUsuario = cartasDesdeState?.movimientosCarta1 || [];

    const [carta1, setCarta1] = useState<Carta | null>(null);
    const [carta2, setCarta2] = useState<Carta | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [fase, setFase] = useState<FaseBatalla>("PRESENTACION");
    const [vidaActual1, setVidaActual1] = useState<number>(1000);
    const [vidaActual2, setVidaActual2] = useState<number>(1000);
    const [turnoJugador, setTurnoJugador] = useState<boolean>(true);
    const [historialBatalla, setHistorialBatalla] = useState<string[]>([]);
    const [ganador, setGanador] = useState<string | null>(null);
    const [esEmpate, setEsEmpate] = useState<boolean>(false);

    const [cooldownDominio1, setCooldownDominio1] = useState<number>(0);
    const [cooldownsMovimientos, setCooldownsMovimientos] = useState<Record<string, number>>({});
    const [isAutomatic, setIsAutomatic] = useState<boolean>(false);

    // --- ESTADOS: EVENTO ESPECIAL GOJO VS SUKUNA ---
    const [choqueDominiosActivo, setChoqueDominiosActivo] = useState<boolean>(false);
    const [turnosRestantesClash, setTurnosRestantesClash] = useState<number>(0);
    const [cooldownChoque, setCooldownChoque] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Controla la animación de dominio que se muestra (uno solo o ambos)
    const [dominioVisual, setDominioVisual] = useState<"CARTA1" | "CARTA2" | "AMBOS" | null>(null);
    const domainTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const esDueloLegendario = useMemo(() => {
        if (!carta1 || !carta2) return false;
        const nombre1 = carta1.nombre || "";
        const nombre2 = carta2.nombre || "";
        return (
            (nombre1.includes("Satoru Gojo") && nombre2.includes("Ryomen Sukuna")) ||
            (nombre1.includes("Ryomen Sukuna") && nombre2.includes("Satoru Gojo"))
        );
    }, [carta1, carta2]);

    const [animacionActiva, setAnimacionActiva] = useState<{
        atacante: "CARTA1" | "CARTA2" | null;
        objetivo: "CARTA1" | "CARTA2" | null;
        tipo: TipoEfecto;
    }>({ atacante: null, objetivo: null, tipo: null });

    const getCartaDeServidor = async (id: string, signal: AbortSignal): Promise<Carta> => {
        const urlAPI = `https://educa-api.onrender.com/card/${id}`;
        const respuesta = await fetch(urlAPI, {
            method: "GET",
            headers: { usersecretpasskey: "Gabr686940RE" },
            signal,
        });
        if (!respuesta.ok) throw new Error(`La API respondió con código ${respuesta.status}`);
        const objeto = await respuesta.json();
        const carta = Array.isArray(objeto.data) ? objeto.data[0] : objeto.data;
        if (!carta) throw new Error(`No se encontraron datos para el ID ${id}`);
        return carta;
    };

    useEffect(() => {
        const controller = new AbortController();
        const iniciarComponente = async () => {
            if (!id1 || !id2) {
                setError("Faltan parámetros de guerreros en la URL.");
                setCargando(false);
                return;
            }
            try {
                setError(null);
                setCargando(true);

                let encontrada1: Carta | null = null;
                let encontrada2: Carta | null = null;

                if (cartasDesdeState?.carta1 && cartasDesdeState?.carta2) {
                    encontrada1 = cartasDesdeState.carta1;
                    encontrada2 = cartasDesdeState.carta2;
                } else {
                    const timeoutId = setTimeout(() => controller.abort(), 15000);
                    encontrada1 = await getCartaDeServidor(id1.trim(), controller.signal);
                    encontrada2 = await getCartaDeServidor(id2.trim(), controller.signal);
                    clearTimeout(timeoutId);
                }

                setCarta1(encontrada1);
                setCarta2(encontrada2);

                setVidaActual1(encontrada1.hp || 1000);
                setVidaActual2(encontrada2.hp || 1000);

                if (
                    (encontrada1.hp || 1000) === (encontrada2.hp || 1000) &&
                    (encontrada1.ataque || 0) === (encontrada2.ataque || 0) &&
                    (encontrada1.defensa || 0) === (encontrada2.defensa || 0)
                ) {
                    setFase("FINALIZADO");
                    setEsEmpate(true);
                    setHistorialBatalla([
                        `⚖️ Duelo cancelado: ${encontrada1.nombre} y ${encontrada2.nombre} poseen el mismo nivel de energía maldita. ¡Empate automático!`,
                        `¡Comienza el duelo de hechicería! ${encontrada1.nombre} VS ${encontrada2.nombre}.`
                    ]);
                } else {
                    setHistorialBatalla([`¡Comienza el duelo de hechicería! ${encontrada1.nombre} VS ${encontrada2.nombre}.`]);
                }

            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Fallo al invocar guerreros en el servidor");
            } finally {
                setCargando(false);
            }
        };
        iniciarComponente();
        return () => controller.abort();
    }, [id1, id2, cartasDesdeState]);

    const calcularDañoReal = (ataqueBase: number, defensaRival: number): number => {
        const def = defensaRival || 0;
        const factorMitigacion = 1 - (def / (def + 500));
        const danioCalculado = Math.floor(ataqueBase * factorMitigacion);
        const danioMinimo = Math.max(1, Math.floor(ataqueBase * 0.1));
        return Math.max(danioCalculado, danioMinimo);
    };

    const reducirTodosLosCooldowns = () => {
        setCooldownDominio1(prev => Math.max(0, prev - 1));
        setCooldownChoque(prev => Math.max(0, prev - 1));
        setCooldownsMovimientos(prev => {
            const nuevos = { ...prev };
            Object.keys(nuevos).forEach(id => {
                if (nuevos[id] > 0) nuevos[id] -= 1;
            });
            return nuevos;
        });
    };

    const avanzarTurnoClash = () => {
        if (choqueDominiosActivo) {
            setTurnosRestantesClash(prev => {
                const siguiente = prev - 1;
                if (siguiente <= 0) {
                    setChoqueDominiosActivo(false);
                    setCooldownChoque(3);
                    setDominioVisual(null);
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    }
                    setHistorialBatalla(h => ["✨ Los dominios se han disipado por agotamiento de energía maldita. La pelea continúa.", ...h]);
                    return 0;
                }
                return siguiente;
            });
        }
    };

    const dispararVFX = (atacante: "CARTA1" | "CARTA2", objetivo: "CARTA1" | "CARTA2", tipo: TipoEfecto) => {
        setAnimacionActiva({ atacante, objetivo, tipo });
        setTimeout(() => {
            setAnimacionActiva({ atacante: null, objetivo: null, tipo: null });
        }, 800);
    };

    const activarChoqueLegendario = () => {
        if (!carta1 || !carta2) return;
        setChoqueDominiosActivo(true);
        setTurnosRestantesClash(7);
        setDominioVisual("AMBOS");
        setHistorialBatalla(prev => [
            `🤞 ¡EXPANSIÓN DE DOMINIO SIMULTÁNEA! ${carta1.nombre} y ${carta2.nombre} colapsan el espacio.`,
            ...prev
        ]);

        audioRef.current = new Audio("/sounds/voces-gojo-sukuna.mp3");
        audioRef.current.volume = 0.8;
        audioRef.current.play();

        reducirTodosLosCooldowns();
        setTurnoJugador(false);
    };

    const ejecutarAtaqueManual = () => {
        if (fase !== "COMBATE" || !carta1 || !carta2) return;

        if (turnoJugador) {
            let baseDmg = Math.floor(carta1.ataque * (Math.random() * 0.15 + 0.35));
            const esCritico = Math.random() < 0.15;
            let mensajeAtaque = "";

            if (esCritico) {
                baseDmg = Math.floor(baseDmg * 2.5);
                const dmgReal = calcularDañoReal(baseDmg, carta2.defensa);
                mensajeAtaque = `🖤✨ ¡DESTELLO NEGRO! ${carta1.nombre} infligió un impacto devastador de ${dmgReal} a ${carta2.nombre}!`;
            } else {
                const dmgReal = calcularDañoReal(baseDmg, carta2.defensa);
                mensajeAtaque = `💥 ${carta1.nombre} usó "Ataque Básico" e infligió ${dmgReal} de daño.`;
            }

            const dmgRealFinal = calcularDañoReal(baseDmg, carta2.defensa);
            const nuevaVida2 = Math.max(0, vidaActual2 - dmgRealFinal);

            dispararVFX("CARTA1", "CARTA2", esCritico ? "CRITICO" : "NORMAL");
            setVidaActual2(nuevaVida2);
            setHistorialBatalla(prev => [mensajeAtaque, ...prev]);

            if (nuevaVida2 <= 0) {
                setTimeout(() => finalizarDuelo(carta1.nombre), 800);
                return;
            }

            reducirTodosLosCooldowns();
            avanzarTurnoClash();
            setTurnoJugador(false);
        }
    };

    const ejecutarMovimientoPersonalizado = (mov: Movimiento) => {
        if (fase !== "COMBATE" || !carta1 || !carta2 || choqueDominiosActivo) return;
        if ((cooldownsMovimientos[mov.id] || 0) > 0) return;

        if (turnoJugador) {
            const esCritico = Math.random() < 0.15;
            let mensaje = "";
            let dmgFinalReal = 0;

            if (esCritico) {
                const danioCritico = Math.floor(mov.danio * 2.5);
                dmgFinalReal = calcularDañoReal(danioCritico, carta2.defensa);
                mensaje = `🖤✨ ¡DESTELLO NEGRO! ${carta1.nombre} canalizó energía en "${mov.nombre}" causando ${dmgFinalReal} de daño crítico!`;
            } else {
                dmgFinalReal = calcularDañoReal(mov.danio, carta2.defensa);
                mensaje = `✨ ${carta1.nombre} ejecutó su ataque "${mov.nombre}" e infligió ${dmgFinalReal} de daño.`;
            }

            const nuevaVida2 = Math.max(0, vidaActual2 - dmgFinalReal);

            dispararVFX("CARTA1", "CARTA2", esCritico ? "CRITICO" : "NORMAL");
            setVidaActual2(nuevaVida2);
            setHistorialBatalla(prev => [mensaje, ...prev]);

            if (nuevaVida2 <= 0) {
                setTimeout(() => finalizarDuelo(carta1.nombre), 800);
                return;
            }

            reducirTodosLosCooldowns();
            setCooldownsMovimientos(prev => ({ ...prev, [mov.id]: mov.cooldown }));
            setTurnoJugador(false);
        }
    };

    useEffect(() => {
        if (fase !== "COMBATE" || !carta1 || !carta2) return;

        if (!turnoJugador && !isAutomatic && vidaActual1 > 0) {
            const timerIA = setTimeout(() => {
                let dmgIA = Math.floor(carta2.ataque * (Math.random() * 0.15 + 0.35));
                const iaCritico = Math.random() < 0.15;
                let mensajeIA = "";

                if (iaCritico) {
                    dmgIA = Math.floor(dmgIA * 2.5);
                    const dmgReal = calcularDañoReal(dmgIA, carta1.defensa);
                    mensajeIA = `🖤✨ ¡DESTELLO NEGRO! ${carta2.nombre} conecta un destello negro haciendo ${dmgReal} de daño.`;
                } else {
                    const dmgReal = calcularDañoReal(dmgIA, carta1.defensa);
                    mensajeIA = `🔮 ${carta2.nombre} responde con energía maldita causando ${dmgReal} de daño.`;
                }

                const dmgRealFinal = calcularDañoReal(dmgIA, carta1.defensa);
                const nuevaVida1 = Math.max(0, vidaActual1 - dmgRealFinal);

                dispararVFX("CARTA2", "CARTA1", iaCritico ? "CRITICO" : "NORMAL");
                setVidaActual1(nuevaVida1);
                setHistorialBatalla(prev => [mensajeIA, ...prev]);

                if (nuevaVida1 <= 0) {
                    setTimeout(() => finalizarDuelo(carta2.nombre), 800);
                    return;
                }

                avanzarTurnoClash();
                setTurnoJugador(true);
            }, 1400);

            return () => clearTimeout(timerIA);
        }

        if (isAutomatic) {
            const timerAuto = setTimeout(() => {
                if (turnoJugador) {
                    const puedeUsarDominio = cooldownDominio1 === 0 && !choqueDominiosActivo;
                    const usarExpansion = puedeUsarDominio && Math.random() < 0.35;

                    let dmgReal = 0;
                    let mensajeAuto = "";
                    let nuevaVida2 = 0;
                    let tipoEfectoAuto: TipoEfecto = "NORMAL";

                    if (usarExpansion && !esDueloLegendario) {
                        const dmgBase = Math.floor(carta1.ataque * 1.1);
                        dmgReal = calcularDañoReal(dmgBase, carta2.defensa);
                        mensajeAuto = `🤖 [AUTO] ${carta1.nombre} ejecuta 👁️ "Expansión de Dominio" haciendo ${dmgReal} de daño.`;
                        tipoEfectoAuto = "DOMINIO";
                        reducirTodosLosCooldowns();
                        setCooldownDominio1(6);

                        if (domainTimeoutRef.current) clearTimeout(domainTimeoutRef.current);
                        setDominioVisual("CARTA1");
                        domainTimeoutRef.current = setTimeout(() => {
                            setDominioVisual(prev => prev === "CARTA1" ? null : prev);
                        }, 2500);
                    } else if (esDueloLegendario && cooldownChoque === 0 && !choqueDominiosActivo) {
                        activarChoqueLegendario();
                        return;
                    } else {
                        let dmgBase = Math.floor(carta1.ataque * (Math.random() * 0.15 + 0.35));
                        if (Math.random() < 0.15) {
                            dmgBase = Math.floor(dmgBase * 2.5);
                            dmgReal = calcularDañoReal(dmgBase, carta2.defensa);
                            mensajeAuto = `🤖 [AUTO] 🖤✨ ¡DESTELLO NEGRO! ${carta1.nombre} conecta un golpe crítico devastador de ${dmgReal}.`;
                            tipoEfectoAuto = "CRITICO";
                        } else {
                            dmgReal = calcularDañoReal(dmgBase, carta2.defensa);
                            mensajeAuto = `🤖 [AUTO] ${carta1.nombre} realiza un 🥊 "Ataque Básico" de ${dmgReal} de daño.`;
                        }
                        reducirTodosLosCooldowns();
                    }

                    nuevaVida2 = Math.max(0, vidaActual2 - dmgReal);
                    dispararVFX("CARTA1", "CARTA2", tipoEfectoAuto);

                    if (nuevaVida2 <= 0 && vidaActual1 <= 0) {
                        setVidaActual2(0);
                        setTimeout(() => finalizarDuelo("EMPATE"), 800);
                        return;
                    }

                    setVidaActual2(nuevaVida2);
                    setHistorialBatalla(prev => [mensajeAuto, ...prev]);

                    if (nuevaVida2 <= 0) {
                        setTimeout(() => finalizarDuelo(carta1.nombre), 800);
                        return;
                    }

                    avanzarTurnoClash();
                    setTurnoJugador(false);

                } else {
                    const ataquesIADisponibles = choqueDominiosActivo ? ["RAFAGA", "DESMANTELAR"] : ["RAFAGA", "DESMANTELAR", "DOMINIO"];
                    const ataqueIAElegido = ataquesIADisponibles[Math.floor(Math.random() * ataquesIADisponibles.length)];
                    let dmgBase = 0;
                    let mensajeIAAuto = "";
                    let tipoEfectoIA: TipoEfecto = "NORMAL";

                    if (ataqueIAElegido === "RAFAGA") {
                        dmgBase = Math.floor(carta2.ataque * (Math.random() * 0.15 + 0.35));
                        if (Math.random() < 0.15) {
                            dmgBase = Math.floor(dmgBase * 2.5);
                            const dmgReal = calcularDañoReal(dmgBase, carta1.defensa);
                            mensajeIAAuto = `🔮 [AUTO] 🖤 ¡DESTELLO NEGRO! ${carta2.nombre} castiga con un golpe crítico de ${dmgReal}.`;
                            tipoEfectoIA = "CRITICO";
                        } else {
                            const dmgReal = calcularDañoReal(dmgBase, carta1.defensa);
                            mensajeIAAuto = `🔮 [AUTO] ${carta2.nombre} arremete con "Ráfaga Maldita" causando ${dmgReal} de daño.`;
                        }
                    } else if (ataqueIAElegido === "DESMANTELAR") {
                        dmgBase = Math.floor(carta2.ataque * 0.7);
                        const dmgReal = calcularDañoReal(dmgBase, carta1.defensa);
                        mensajeIAAuto = `⚔️ [AUTO] ${carta2.nombre} usa "Desmantelar" causando ${dmgReal} de daño.`;
                    } else {
                        const baseIA = Math.floor(carta2.ataque * 1.1);
                        const dmgReal = calcularDañoReal(baseIA, carta1.defensa);
                        mensajeIAAuto = `⚡ [AUTO] ${carta2.nombre} libera su 👁️ "Expansión de Dominio Rival" causando ${dmgReal} de daño.`;
                        tipoEfectoIA = "DOMINIO";

                        if (domainTimeoutRef.current) clearTimeout(domainTimeoutRef.current);
                        setDominioVisual("CARTA2");
                        domainTimeoutRef.current = setTimeout(() => {
                            setDominioVisual(prev => prev === "CARTA2" ? null : prev);
                        }, 2500);
                    }

                    const dmgRealFinal = calcularDañoReal(dmgBase, carta1.defensa);
                    const nuevaVida1 = Math.max(0, vidaActual1 - dmgRealFinal);

                    dispararVFX("CARTA2", "CARTA1", tipoEfectoIA);

                    if (nuevaVida1 <= 0 && vidaActual2 <= 0) {
                        setVidaActual1(0);
                        setTimeout(() => finalizarDuelo("EMPATE"), 800);
                        return;
                    }

                    setVidaActual1(nuevaVida1);
                    setHistorialBatalla(prev => [mensajeIAAuto, ...prev]);

                    if (nuevaVida1 <= 0) {
                        setTimeout(() => finalizarDuelo(carta2.nombre), 800);
                        return;
                    }

                    avanzarTurnoClash();
                    setTurnoJugador(true);
                }
            }, 1600);

            return () => clearTimeout(timerAuto);
        }
    }, [turnoJugador, fase, vidaActual1, vidaActual2, carta1, carta2, isAutomatic, cooldownDominio1, choqueDominiosActivo, cooldownChoque, esDueloLegendario]);

    const finalizarDuelo = (nombreGanador: string) => {
        setIsAutomatic(false);
        setFase("FINALIZADO");
        setDominioVisual(null);
        if (nombreGanador === "EMPATE") {
            setEsEmpate(true);
            setHistorialBatalla(prev => [`⚖️ ¡Colapso Absoluto! Los dos hechiceros se han eliminado mutuamente.`, ...prev]);
        } else {
            setGanador(nombreGanador);
            setHistorialBatalla(prev => [`🏆 ¡El combate ha terminado! Ganador: ${nombreGanador}.`, ...prev]);
        }
    };

    const obtenerEstiloLog = (log: string, index: number) => {
        if (index !== 0) return "text-gray-500/80 text-xs md:text-sm pl-2 border-l border-white/5 font-medium";

        if (log.includes("DESTELLO NEGRO")) {
            return "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-purple-500 font-black text-sm md:text-base animate-pulse bg-black/50 px-3 py-1.5 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
        }
        if (log.includes("Expansión de Dominio") || log.includes("EXPANSIÓN DE DOMINIO SIMULTÁNEA")) {
            return "text-purple-300 font-extrabold text-sm md:text-base bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-500/40";
        }
        if (log.includes("🏆")) {
            return "text-yellow-400 font-black text-base md:text-lg tracking-wide bg-yellow-950/30 px-3 py-2 rounded-xl border border-yellow-500/50 text-center uppercase shadow-md";
        }
        if (log.includes("⚖️")) {
            return "text-cyan-400 font-extrabold text-sm md:text-base bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30";
        }
        if (log.includes("Ataque Básico") || log.includes("responde con energía") || log.includes("ejecutó su ataque") || log.includes("Desmantelar")) {
            return "text-gray-100 font-bold text-sm md:text-base border-l-4 border-purple-500 pl-3 py-0.5 bg-white/5 rounded-r-lg";
        }
        return "text-gray-200 font-semibold text-sm md:text-base pl-3";
    };

    const getClasesAtacante = (id: "CARTA1" | "CARTA2") => {
        if (animacionActiva.atacante === id) {
            return id === "CARTA1"
                ? "scale-110 translate-x-8 md:translate-x-16 -rotate-3 z-50 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                : "scale-110 -translate-x-8 md:-translate-x-16 rotate-3 z-50 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]";
        }
        return "";
    };

    const getClasesObjetivo = (id: "CARTA1" | "CARTA2") => {
        if (animacionActiva.objetivo === id) {
            const baseShake = "animate-pulse scale-95 brightness-150 saturate-200 z-40";
            if (animacionActiva.tipo === "CRITICO") return `${baseShake} ring-4 ring-red-600 blur-[1px]`;
            if (animacionActiva.tipo === "DOMINIO") return `${baseShake} ring-4 ring-purple-600 hue-rotate-90`;
            return `${baseShake} ring-2 ring-white blur-[0.5px]`;
        }
        return "";
    };

    if (cargando) {
        return (
            <div className="min-h-screen w-full bg-[#0b0c10] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Invocando Guerreros...</p>
            </div>
        );
    }

    if (error || !carta1 || !carta2) {
        return (
            <div className="min-h-screen w-full bg-[#0b0c10] flex flex-col items-center justify-center p-4">
                <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-center backdrop-blur-md shadow-lg">
                    <p className="text-red-400 font-bold mb-2">Error de Inicialización</p>
                    <p className="text-gray-300 text-xs mb-4">{error || "No se cargaron los duelistas."}</p>
                    <button onClick={() => navigate("/seleccionar-cartas")} className="px-4 py-2 bg-red-900/60 text-white text-xs rounded-lg">Regresar</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full text-white flex flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden select-none transition-colors duration-1000 ${choqueDominiosActivo ? 'bg-black' : 'bg-[#0b0c10]'}`}>

            {/* ========== ESTILOS CSS PARA LOS DOMINIOS ========== */}
            <style>
                {`
                    /* Choque rgb (botón) */
                    @keyframes rgb-clash {
                        0% { border-color: #ef4444; box-shadow: 0 0 18px rgba(239, 68, 68, 0.6); }
                        33% { border-color: #22c55e; box-shadow: 0 0 18px rgba(34, 197, 94, 0.6); }
                        66% { border-color: #3b82f6; box-shadow: 0 0 18px rgba(59, 130, 246, 0.6); }
                        100% { border-color: #ef4444; box-shadow: 0 0 18px rgba(239, 68, 68, 0.6); }
                    }
                    .animate-rgb { animation: rgb-clash 1.2s linear infinite; }

                    /* ===== ANIMACIÓN DE APARICIÓN PARA LOS DOMINIOS ===== */
                    @keyframes domainAppear {
                        0% { opacity: 0; transform: scale(0.5); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    .animate-domain-in {
                        animation: domainAppear 0.6s ease-out forwards;
                    }

                    /* ===== EFECTO DE CHOQUE: LÍNEA DIVISORIA VIBRANTE ===== */
                    @keyframes clash-border-pulse {
                        0% { border-color: rgba(255,255,255,0.8); box-shadow: 0 0 20px rgba(255,255,255,0.4); }
                        50% { border-color: rgba(168,85,247,0.9); box-shadow: 0 0 40px rgba(168,85,247,0.6); }
                        100% { border-color: rgba(255,255,255,0.8); box-shadow: 0 0 20px rgba(255,255,255,0.4); }
                    }
                    .clash-divider {
                        border-right: 4px solid white;
                        animation: clash-border-pulse 1.2s ease-in-out infinite;
                    }

                    /* ===== MEJORA DEL FONDO DURANTE CHOQUE ===== */
                    .bg-clash-dark {
                        background-color: #000;
                        background-image: radial-gradient(circle at 30% 50%, rgba(168,85,247,0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 50%, rgba(220,38,38,0.15) 0%, transparent 50%);
                    }
                `}
            </style>

            {/* ========== OVERLAYS DE DOMINIOS (GIFs) ========== */}
            {/* DOMINIO ÚNICO (CARTA1 o CARTA2) – ahora con z-0 para no tapar la interfaz */}
            {dominioVisual && dominioVisual !== "AMBOS" && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none animate-domain-in"
                    style={{
                        backgroundImage: dominioVisual === "CARTA1"
                            ? (carta1?.nombre.includes("Satoru Gojo")
                                ? `url('https://media.tenor.com/LsBSgRXRgZ4AAAAC/jjk-jujutsu.gif')`
                                : `url('https://media.tenor.com/TKkwQ9A3ADEAAAAd/malevolent-shrine-jujutsu-kaisen.gif')`)
                            : (carta2?.nombre.includes("Satoru Gojo")
                                ? `url('https://media.tenor.com/LsBSgRXRgZ4AAAAC/jjk-jujutsu.gif')`
                                : `url('https://media.tenor.com/TKkwQ9A3ADEAAAAd/malevolent-shrine-jujutsu-kaisen.gif')`),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            )}

            {/* CHOQUE DE DOMINIOS: PANTALLA DIVIDIDA – también con z-0 */}
            {dominioVisual === "AMBOS" && (
                <div className="absolute inset-0 z-0 flex pointer-events-none bg-clash-dark">
                    {/* Lado izquierdo */}
                    <div
                        className="w-1/2 h-full animate-domain-in"
                        style={{
                            backgroundImage: carta1?.nombre.includes("Satoru Gojo")
                                ? `url('https://media.tenor.com/LsBSgRXRgZ4AAAAC/jjk-jujutsu.gif')`
                                : `url('https://media.tenor.com/TKkwQ9A3ADEAAAAd/malevolent-shrine-jujutsu-kaisen.gif')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRight: '4px solid rgba(255,255,255,0.7)',
                            boxShadow: 'inset 0 0 60px rgba(168,85,247,0.3)',
                        }}
                    />
                    {/* Lado derecho */}
                    <div
                        className="w-1/2 h-full animate-domain-in"
                        style={{
                            backgroundImage: carta2?.nombre.includes("Satoru Gojo")
                                ? `url('https://media.tenor.com/LsBSgRXRgZ4AAAAC/jjk-jujutsu.gif')`
                                : `url('https://media.tenor.com/TKkwQ9A3ADEAAAAd/malevolent-shrine-jujutsu-kaisen.gif')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            boxShadow: 'inset 0 0 60px rgba(220,38,38,0.3)',
                        }}
                    />
                </div>
            )}

            {/* Efectos de ataque (crítico, normal, dominio) */}
            {animacionActiva.tipo === "CRITICO" && <div className="absolute inset-0 bg-red-900/20 z-0 animate-pulse pointer-events-none" />}
            {animacionActiva.tipo === "DOMINIO" && <div className="absolute inset-0 bg-purple-900/30 z-0 animate-pulse pointer-events-none backdrop-invert-[.1]" />}

            {/* Fondo decorativo */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Botón salir */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-white/5 hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 rounded-xl text-[11px] font-bold tracking-wider uppercase text-gray-400 hover:text-red-400 transition-all flex items-center gap-1 shadow-md backdrop-blur-sm"
            >
                🚪 Salir
            </button>

            {/* Cabecera */}
            <div className="z-10 text-center mt-2 w-full max-w-xl">
                <h1 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Arena de Hechicería</h1>
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-2" />
                {fase === "COMBATE" && (
                    <>
                        <p className={`text-sm font-semibold transition-all duration-300 ${turnoJugador ? 'text-purple-400' : 'text-blue-400'}`}>
                            {isAutomatic
                                ? "⚡ Simulación Asíncrona Activa 🤖"
                                : (turnoJugador ? `Tu turno: Selecciona una acción para ${carta1.nombre}` : `Turno de la IA: ${carta2.nombre} concentrando energía...`)}
                        </p>
                        {choqueDominiosActivo && (
                            <div className="mt-1 bg-red-950/80 border border-red-500/50 py-1 px-4 rounded-full inline-block animate-bounce shadow-lg">
                                <span className="text-red-400 font-black text-xs uppercase tracking-widest">
                                    ⚔️ CHOQUE TERRITORIAL: {turnosRestantesClash} TURNOS RESTANTES
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Cartas y controles centrales */}
            <div className="z-10 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl my-auto">

                {/* Carta 1 */}
                <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${getClasesAtacante("CARTA1")} ${getClasesObjetivo("CARTA1")}`}>
                    {fase === "COMBATE" && (
                        <div className="w-full max-w-[240px] bg-black/40 border border-purple-500/30 rounded-xl p-2 backdrop-blur-sm">
                            <div className="flex justify-between text-xs font-bold mb-1 px-1">
                                <span className="text-purple-400">HP</span>
                                <span className={animacionActiva.objetivo === "CARTA1" ? "text-red-400 animate-bounce" : ""}>
                                    {vidaActual1} / {carta1.hp || 1000}
                                </span>
                            </div>
                            <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-white/5 relative">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-300"
                                    style={{ width: `${(vidaActual1 / (carta1.hp || 1000)) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div className={`relative bg-white/5 border rounded-2xl p-2 backdrop-blur-md shadow-lg transition-transform duration-300 ${fase === "COMBATE" && turnoJugador && animacionActiva.atacante !== "CARTA1" ? 'border-purple-500 ring-2 ring-purple-500/20 scale-105' : 'border-white/10 opacity-90'}`}>
                        {animacionActiva.objetivo === "CARTA1" && animacionActiva.tipo === "CRITICO" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/60 via-transparent to-transparent rounded-2xl animate-ping">
                                <span className="text-8xl drop-shadow-[0_0_20px_rgba(239,68,68,1)]">🖤</span>
                            </div>
                        )}
                        {animacionActiva.objetivo === "CARTA1" && animacionActiva.tipo === "NORMAL" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl">
                                <span className="text-7xl animate-pulse drop-shadow-xl">💥</span>
                            </div>
                        )}
                        {animacionActiva.objetivo === "CARTA1" && animacionActiva.tipo === "DOMINIO" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-purple-600/30 rounded-2xl">
                                <span className="text-8xl animate-pulse">🌌</span>
                            </div>
                        )}
                        <Cartadetalle carta={carta1} seleccionada={true} ocultarBotones={true} />
                    </div>
                </div>

                {/* Panel de acciones central */}
                <div className="flex flex-col items-center justify-center min-w-[200px] gap-6 z-20">
                    {fase === "PRESENTACION" && (
                        <div className="flex flex-col items-center gap-4 animate-fade-in">
                            <p className="number-font text-7xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-white to-blue-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                VS
                            </p>
                            <button
                                onClick={() => setFase("COMBATE")}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 font-bold rounded-xl text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-transform active:scale-95"
                            >
                                Iniciar Duelo
                            </button>
                        </div>
                    )}

                    {fase === "COMBATE" && (
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 w-full backdrop-blur-md flex flex-col gap-3 max-w-[240px] animate-fade-in max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                            {!choqueDominiosActivo && movimientosUsuario.length > 0 && (
                                <div className="w-full flex flex-col gap-2 border-b border-white/10 pb-3 mb-1">
                                    <p className="text-center text-[10px] tracking-widest text-purple-400 uppercase font-bold">Mis Movimientos</p>
                                    {movimientosUsuario.map((mov) => {
                                        const cdActual = cooldownsMovimientos[mov.id] || 0;
                                        const enCooldown = cdActual > 0;

                                        return (
                                            <button
                                                key={mov.id}
                                                disabled={!turnoJugador || isAutomatic || enCooldown || animacionActiva.atacante !== null}
                                                onClick={() => ejecutarMovimientoPersonalizado(mov)}
                                                className="w-full py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-800/60 hover:to-blue-800/60 border border-purple-500/40 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm flex flex-col items-center justify-center gap-0.5"
                                            >
                                                <span>✨ {mov.nombre}</span>
                                                {enCooldown && (
                                                    <span className="text-[10px] text-red-400 font-medium">
                                                        (Espera: {cdActual} T)
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <p className="text-center text-xs tracking-widest text-gray-400 uppercase font-bold border-b border-white/10 pb-1.5 mt-1">Acciones Base</p>

                            <button
                                disabled={!turnoJugador || isAutomatic || animacionActiva.atacante !== null}
                                onClick={ejecutarAtaqueManual}
                                className="w-full py-2 bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none"
                            >
                                🥊 Ataque Básico
                            </button>

                            <button
                                disabled={!turnoJugador || isAutomatic || (cooldownDominio1 > 0 && !esDueloLegendario) || (esDueloLegendario && cooldownChoque > 0) || animacionActiva.atacante !== null || choqueDominiosActivo}
                                onClick={() => {
                                    if (fase !== "COMBATE" || !carta1 || !carta2) return;

                                    if (esDueloLegendario && !choqueDominiosActivo) {
                                        activarChoqueLegendario();
                                        return;
                                    }

                                    const baseDmg = Math.floor(carta1.ataque * 1.1);
                                    const dmgReal = calcularDañoReal(baseDmg, carta2.defensa);
                                    const nuevaVida2 = Math.max(0, vidaActual2 - dmgReal);

                                    dispararVFX("CARTA1", "CARTA2", "DOMINIO");
                                    setVidaActual2(nuevaVida2);
                                    setHistorialBatalla(prev => [`👁️ ${carta1.nombre} usó "Expansión de Dominio" infligiendo ${dmgReal} de daño.`, ...prev]);

                                    if (nuevaVida2 <= 0) {
                                        setTimeout(() => finalizarDuelo(carta1.nombre), 800);
                                        return;
                                    }

                                    // Mostrar animación de dominio de CARTA1 (si no es choque)
                                    if (domainTimeoutRef.current) clearTimeout(domainTimeoutRef.current);
                                    setDominioVisual("CARTA1");
                                    domainTimeoutRef.current = setTimeout(() => {
                                        setDominioVisual(prev => prev === "CARTA1" ? null : prev);
                                    }, 2500);

                                    reducirTodosLosCooldowns();
                                    setCooldownDominio1(6);
                                    setTurnoJugador(false);
                                }}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all disabled:opacity-30 disabled:pointer-events-none flex flex-col items-center justify-center ${
                                    esDueloLegendario && !choqueDominiosActivo && cooldownChoque === 0
                                        ? "animate-rgb border-2 text-white scale-105 bg-black/80"
                                        : "bg-gradient-to-r from-purple-900/60 to-indigo-950/60 hover:from-purple-800/70 hover:to-indigo-900/70 border border-purple-500/30"
                                }`}
                            >
                                <span>{esDueloLegendario && !choqueDominiosActivo ? "🤞 EXPANSIÓN TERRITORIAL" : "👁️ Expandir Dominio"}</span>
                                {cooldownDominio1 > 0 && !esDueloLegendario && (
                                    <span className="text-[10px] text-red-400 font-medium">(Espera: {cooldownDominio1} T)</span>
                                )}
                                {esDueloLegendario && cooldownChoque > 0 && !choqueDominiosActivo && (
                                    <span className="text-[10px] text-red-400 font-medium">(Espera: {cooldownChoque} T)</span>
                                )}
                            </button>

                            <div className="h-[1px] w-full bg-white/10 my-1" />

                            <button
                                onClick={() => setIsAutomatic(!isAutomatic)}
                                disabled={animacionActiva.atacante !== null}
                                className={`w-full py-2 rounded-xl text-xs font-black tracking-wider transition-all uppercase shadow-md active:scale-95 disabled:opacity-50 ${isAutomatic
                                    ? "bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-600/20"
                                    : "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black"
                                }`}
                            >
                                {isAutomatic ? "🤖 Detener Auto" : "🤖 Combate Auto"}
                            </button>
                        </div>
                    )}

                    {fase === "FINALIZADO" && (
                        <div className="bg-black/50 border border-yellow-500/30 rounded-2xl p-5 text-center backdrop-blur-md max-w-[260px] shadow-[0_0_30px_rgba(234,179,8,0.15)] animate-scale-up">
                            <p className="text-yellow-400 text-xs font-black tracking-widest uppercase mb-1">Fin del Combate</p>

                            {esEmpate ? (
                                <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 drop-shadow-md uppercase tracking-wider">
                                    ¡Empate Total!
                                </p>
                            ) : (
                                <p className="text-xl font-extrabold text-white mb-4 drop-shadow-md">¡Ganador {ganador}!</p>
                            )}

                            <button
                                onClick={() => navigate("/seleccionar-cartas")}
                                className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black text-xs font-bold rounded-xl transition-transform active:scale-95"
                            >
                                Volver a Jugar
                            </button>
                        </div>
                    )}
                </div>

                {/* Carta 2 */}
                <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${getClasesAtacante("CARTA2")} ${getClasesObjetivo("CARTA2")}`}>
                    {fase === "COMBATE" && (
                        <div className="w-full max-w-[240px] bg-black/40 border border-blue-500/30 rounded-xl p-2 backdrop-blur-sm">
                            <div className="flex justify-between text-xs font-bold mb-1 px-1">
                                <span className="text-blue-400">HP</span>
                                <span className={animacionActiva.objetivo === "CARTA2" ? "text-red-400 animate-bounce" : ""}>
                                    {vidaActual2} / {carta2.hp || 1000}
                                </span>
                            </div>
                            <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-white/5 relative">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-300"
                                    style={{ width: `${(vidaActual2 / (carta2.hp || 1000)) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div className={`relative bg-white/5 border rounded-2xl p-2 backdrop-blur-md shadow-lg transition-transform duration-300 ${fase === "COMBATE" && !turnoJugador && animacionActiva.atacante !== "CARTA2" ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' : 'border-white/10 opacity-90'}`}>
                        {animacionActiva.objetivo === "CARTA2" && animacionActiva.tipo === "CRITICO" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/60 via-transparent to-transparent rounded-2xl animate-ping">
                                <span className="text-8xl drop-shadow-[0_0_20px_rgba(239,68,68,1)]">🖤</span>
                            </div>
                        )}
                        {animacionActiva.objetivo === "CARTA2" && animacionActiva.tipo === "NORMAL" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl">
                                <span className="text-7xl animate-pulse drop-shadow-xl">💥</span>
                            </div>
                        )}
                        {animacionActiva.objetivo === "CARTA2" && animacionActiva.tipo === "DOMINIO" && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-purple-600/30 rounded-2xl">
                                <span className="text-8xl animate-pulse">🌌</span>
                            </div>
                        )}
                        <Cartadetalle carta={carta2} seleccionada={true} ocultarBotones={true} />
                    </div>
                </div>

            </div>

            {/* Historial de batalla */}
            <div className="z-10 w-full max-w-4xl mt-6 bg-black/50 border border-white/10 rounded-2xl p-4 h-[160px] overflow-y-auto backdrop-blur-md shadow-2xl flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {historialBatalla.map((log, index) => (
                    <div key={index} className="transition-all duration-300 transform translate-x-0">
                        <p className={obtenerEstiloLog(log, index)}>
                            {log}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CampoDeBatalla;