import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Carta } from "./index";
import type { Movimiento } from "./seleccionarCartas2";
import { FiHome, FiAlertTriangle, FiHeart, FiInfo, FiLock } from "react-icons/fi";
import { LuRotateCcw, LuSkull, LuSwords, LuShield, LuZap, LuCastle, LuDroplets, LuCrown, LuPlus, LuSparkles, LuZapOff } from "react-icons/lu";

// Tipo de pasiva que puede tener una carta (desde la ruleta)
type Pasiva = {
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    valor: number;
    color: string;
};

// ---------- Tipos internos ----------
interface BossState {
    nombre: string;
    hp: number;
    maxHp: number;
    ataque: number;
    defensa: number;
    imagen: string;
    categoria: string;
    ritual: string;
    orden: number;
}

interface FighterState {
    carta: Carta;
    hp: number;
    maxHp: number;
    energy: number;
    maxEnergy: number;
    moves: Movimiento[];
    cooldowns: Record<string, number>;
    isAttacking: boolean;
    isDefending: boolean;
    buffs: {
        damageBoost: number;
        damageBoostTurns: number;
        defenseBoost: number;
        defenseBoostTurns: number;
        shield: number;
        shieldTurns: number;
        reverseTechniqueUsed: boolean;
        domainExpansionUsed: boolean;
    };
    pasiva: Pasiva | null;
}

interface GameState {
    phase: "difficultySelect" | "waveIntro" | "fighting" | "gameOver" | "victory" | "buffSelection" | "domainExpansion" | "reverseTechnique";
    difficulty: "facil" | "medio" | "dificil" | null;
    currentWave: number;
    totalWaves: number;
    actionLog: string[];
    selectedAttack1: Movimiento | null;
    selectedAttack2: Movimiento | null;
    selectedDefense1: boolean;
    selectedDefense2: boolean;
    turnPhase: "playerSelect" | "playerAttack" | "bossAttack" | "buffSelect" | "domainExpansion";
    bossTarget: 1 | 2 | null;
    showDamage: { target: "player1" | "player2" | "boss"; damage: number; isCrit?: boolean } | null;
    isAnimating: boolean;
    turnCounter: number;
    buffsUsedThisWave: boolean;
    pendingDomainExpansion: { playerId: 1 | 2 } | null;
    pendingReverseTechnique: { playerId: 1 | 2 } | null;
}

const MAX_WAVES = 5;
const MAX_ENERGY = 100;
const ENERGY_REGEN = 10;
const BUFF_THRESHOLD = 50;
const REVERSE_TECHNIQUE_THRESHOLD = 75;
const DOMAIN_EXPANSION_THRESHOLD = 100;
const BUFF_DURATION = 3;
const CRITICAL_CHANCE = 0.15;
const CRITICAL_MULTIPLIER = 1.8;
const DOMAIN_MULTIPLIER = 1.5;

const BOSS_BASE_DEFENSE = {
    facil: 1000,
    medio: 3000,
    dificil: 5000,
};

const BOSS_BASE_ATTACK = {
    facil: 400,
    medio: 700,
    dificil: 1000,
};

const STACK_REQUIREMENTS = {
    facil: { ataque: 1000, defensa: 1000 },
    medio: { ataque: 3000, defensa: 3000 },
    dificil: { ataque: 5000, defensa: 5000 },
};

const BOSS_ORDER = [
    {
        nombre: "Toji Fushiguro",
        baseHp: 8000,
        imagen: "/imagenes/Jefes/toji.jpg",
        categoria: "Asesino",
        ritual: "Restricción Celestial"
    },
    {
        nombre: "Hanami",
        baseHp: 6500,
        imagen: "/imagenes/Jefes/hanami.jpg",
        categoria: "Espíritu Maldito",
        ritual: "Desastre Natural"
    },
    {
        nombre: "Jogo",
        baseHp: 5500,
        imagen: "/imagenes/Jefes/jogo.jpg",
        categoria: "Espíritu Maldito",
        ritual: "Desastre de Fuego"
    },
    {
        nombre: "Kenjaku",
        baseHp: 12000,
        imagen: "/imagenes/Jefes/kenjaku.jpg",
        categoria: "Hechicero Maldito",
        ritual: "Intercambio de Cuerpos"
    },
    {
        nombre: "Sukuna Heian",
        baseHp: 20000,
        imagen: "/imagenes/Jefes/sukuna.jpg",
        categoria: "Rey de las Maldiciones",
        ritual: "Corte Infinito"
    },
];

type BuffType = 'heal10' | 'attack10' | 'speed' | 'curse';

interface BuffOption {
    id: BuffType;
    icon: React.ReactNode;
    name: string;
    desc: string;
    color: string;
}

const componentStyles = `
  .campos-de-batalla2-font {
    font-family: 'Courier New', Courier, monospace !important;
  }
  .campos-de-batalla2-bounce {
    animation: campos-de-batalla2-bounce-anim 0.8s ease-out forwards;
  }
  @keyframes campos-de-batalla2-bounce-anim {
    0% { transform: scale(0.5); opacity: 0; }
    20% { transform: scale(1.5); opacity: 1; }
    80% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1) translateY(-20px); opacity: 0; }
  }
  .campos-de-batalla2-fade-in {
    animation: campos-de-batalla2-fade-in-anim 0.4s ease-out forwards;
  }
  @keyframes campos-de-batalla2-fade-in-anim {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .campos-de-batalla2-damage-flash {
    animation: campos-de-batalla2-damage-flash-anim 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  @keyframes campos-de-batalla2-damage-flash-anim {
    0% { filter: brightness(1); transform: translateX(0); }
    20% { filter: brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(8); transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
    100% { filter: brightness(1); transform: translateX(0); }
  }
  .campos-de-batalla2-crt::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    z-index: 100;
    pointer-events: none;
  }
`;

const reproducirSonido = (ruta: string, volumen: number = 0.5) => {
    try {
        const audio = new Audio(ruta);
        audio.volume = volumen;
        audio.play().catch(e => console.log("Sonido omitido:", e));
    } catch (err) {
        console.error("Error reproduciendo audio:", err);
    }
};

function CamposDeBatalla2({ onGanarAlmas }: { onGanarAlmas?: (cantidad: number, dificultad?: string) => void }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { carta1, carta2, movimientosCarta1, movimientosCarta2, pasivaCarta1, pasivaCarta2 } = location.state || {};

    const [gameState, setGameState] = useState<GameState>({
        phase: "difficultySelect",
        difficulty: null,
        currentWave: 0,
        totalWaves: MAX_WAVES,
        actionLog: [],
        selectedAttack1: null,
        selectedAttack2: null,
        selectedDefense1: false,
        selectedDefense2: false,
        turnPhase: "playerSelect",
        bossTarget: null,
        showDamage: null,
        isAnimating: false,
        turnCounter: 0,
        buffsUsedThisWave: false,
        pendingDomainExpansion: null,
        pendingReverseTechnique: null,
    });

    const [fighters, setFighters] = useState<[FighterState, FighterState] | null>(null);
    const [boss, setBoss] = useState<BossState | null>(null);
    const [pendingBuff, setPendingBuff] = useState<{ playerId: 1 | 2 } | null>(null);
    const [showBuffInfo, setShowBuffInfo] = useState(false);
    const [showRequirementsError, setShowRequirementsError] = useState<string | null>(null);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    const startBackgroundMusic = useCallback(() => {
        try {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
            const audio = new Audio('/sounds/efectos/mazmorra_theme.mp3');
            audio.loop = true;
            audio.volume = 0.8;
            audio.play().catch(e => console.log("Música omitida:", e));
            bgMusicRef.current = audio;
        } catch (err) {
            console.error("Error música:", err);
        }
    }, []);

    const stopBackgroundMusic = useCallback(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
            bgMusicRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (gameState.phase === "waveIntro" && boss) {
            const nombreArchivo = boss.nombre.toLowerCase().replace(/ /g, "_");
            reproducirSonido(`/sounds/bosses/${nombreArchivo}.mp3`, 0.6);
            if (gameState.currentWave === 1) {
                startBackgroundMusic();
            }
        } else if (gameState.phase === "gameOver") {
            stopBackgroundMusic();
            reproducirSonido('/sounds/efectos/derrota.mp3', 0.6);
        } else if (gameState.phase === "victory") {
            stopBackgroundMusic();
            reproducirSonido('/sounds/efectos/victoria.mp3', 0.6);
        }
        return () => {
            if (gameState.phase === "gameOver" || gameState.phase === "victory") {
                stopBackgroundMusic();
            }
        };
    }, [gameState.phase, boss, gameState.currentWave, startBackgroundMusic, stopBackgroundMusic]);

    useEffect(() => {
        return () => {
            stopBackgroundMusic();
        };
    }, [stopBackgroundMusic]);

    const almasEntregadasRef = useRef(false);

    // ✅ Dar almas al ganar la mazmorra (solo una vez)
    useEffect(() => {
        if (gameState.phase === "victory" && onGanarAlmas && !almasEntregadasRef.current) {
            almasEntregadasRef.current = true;
            const almasGanadas = gameState.difficulty === 'facil' ? 100
                : gameState.difficulty === 'medio' ? 200
                    : 350;
            console.log('Dando almas:', almasGanadas, 'Dificultad:', gameState.difficulty);
            onGanarAlmas(almasGanadas, gameState.difficulty || undefined);
        }
        // Resetear cuando se reinicia el juego
        if (gameState.phase === "difficultySelect") {
            almasEntregadasRef.current = false;
        }
    }, [gameState.phase, gameState.difficulty, onGanarAlmas]);

    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.textContent = componentStyles;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const calcularDanioJefe = useCallback((ataqueJefe: number, defensaJugador: number, isDefending: boolean): number => {
        const penetracion = 0.5;
        const danioPenetrante = Math.floor(ataqueJefe * penetracion);
        const danioNormal = Math.max(1, Math.floor((ataqueJefe * (1 - penetracion)) - (defensaJugador * 0.3)));
        let danioTotal = danioPenetrante + danioNormal;
        if (isDefending) {
            danioTotal = Math.floor(danioTotal * 0.3);
        }
        const danioMinimo = Math.floor(ataqueJefe * 0.10);
        return Math.max(danioMinimo, danioTotal);
    }, []);

    const verificarCartaIndividual = useCallback((carta: Carta | undefined, requisito: { ataque: number, defensa: number }): boolean => {
        if (!carta) return false;
        return (carta.ataque || 0) >= requisito.ataque && (carta.defensa || 0) >= requisito.defensa;
    }, []);

    const verificarRequisitos = useCallback((difficulty: "facil" | "medio" | "dificil"): boolean => {
        const requisito = STACK_REQUIREMENTS[difficulty];
        if (!carta1 || !carta2) {
            setShowRequirementsError("ERROR: Se requieren dos cartas seleccionadas.");
            setErrorModalVisible(true);
            return false;
        }
        const cumple1 = verificarCartaIndividual(carta1, requisito);
        const cumple2 = verificarCartaIndividual(carta2, requisito);
        if (!cumple1 && !cumple2) {
            setShowRequirementsError(
                `¡NIVEL BLOQUEADO!\n\n` +
                `REQUISITOS PARA ${difficulty.toUpperCase()}:\n` +
                `ATQ ≥ ${requisito.ataque} | DEF ≥ ${requisito.defensa}\n\n` +
                `${carta1.nombre}: ATQ ${carta1.ataque || 0} / DEF ${carta1.defensa || 0} ✗\n` +
                `${carta2.nombre}: ATQ ${carta2.ataque || 0} / DEF ${carta2.defensa || 0} ✗\n\n` +
                `AMBAS CARTAS SON INSUFICIENTES`
            );
            setErrorModalVisible(true);
            return false;
        }
        if (!cumple1 || !cumple2) {
            const cartaNoCumple = !cumple1 ? carta1 : carta2;
            const cartaCumple = cumple1 ? carta1 : carta2;
            setShowRequirementsError(
                `¡NIVEL BLOQUEADO!\n\n` +
                `REQUISITOS PARA ${difficulty.toUpperCase()}:\n` +
                `ATQ ≥ ${requisito.ataque} | DEF ≥ ${requisito.defensa}\n\n` +
                `${cartaCumple.nombre}: ATQ ${cartaCumple.ataque || 0} / DEF ${cartaCumple.defensa || 0} ✓\n` +
                `${cartaNoCumple.nombre}: ATQ ${cartaNoCumple.ataque || 0} / DEF ${cartaNoCumple.defensa || 0} ✗\n\n` +
                `SOLO UNA CARTA CUMPLE CON LOS REQUISITOS`
            );
            setErrorModalVisible(true);
            return false;
        }
        return true;
    }, [carta1, carta2, verificarCartaIndividual]);

    const initFighters = useCallback(() => {
        const c1: Carta = carta1 || {
            id: 991, nombre: "Satoru Gojo", ataque: 300, defensa: 200, hp: 1500,
            categoria: "Hechicero Especial", ritual: "Mugen", imagen: "/sprites/gojo.png",
            clan: "Gojo", descripcion: "", seleccionada: false, serie: "Jujutsu Kaisen",
        };
        const c2: Carta = carta2 || {
            id: 992, nombre: "Megumi Fushiguro", ataque: 250, defensa: 180, hp: 1200,
            categoria: "Hechicero", ritual: "Técnica de Diez Sombras", imagen: "/sprites/megumi.png",
            clan: "Fushiguro", descripcion: "", seleccionada: false, serie: "Jujutsu Kaisen",
        };

        let hp1 = c1.hp || 1500;
        let hp2 = c2.hp || 1200;

        if (pasivaCarta1?.id === 'pasiva_vida') {
            hp1 = Math.floor(hp1 * (1 + (pasivaCarta1?.valor || 0)));
        }
        if (pasivaCarta2?.id === 'pasiva_vida') {
            hp2 = Math.floor(hp2 * (1 + (pasivaCarta2?.valor || 0)));
        }

        setFighters([
            {
                carta: c1,
                hp: hp1,
                maxHp: hp1,
                energy: 0,
                maxEnergy: MAX_ENERGY,
                moves: movimientosCarta1 || [],
                cooldowns: {},
                isAttacking: false,
                isDefending: false,
                buffs: {
                    damageBoost: pasivaCarta1?.id === 'pasiva_ataque' ? (pasivaCarta1?.valor || 0) : 0,
                    damageBoostTurns: pasivaCarta1?.id === 'pasiva_ataque' ? 999 : 0,
                    defenseBoost: pasivaCarta1?.id === 'pasiva_defensa' ? (pasivaCarta1?.valor || 0) : 0,
                    defenseBoostTurns: pasivaCarta1?.id === 'pasiva_defensa' ? 999 : 0,
                    shield: 0,
                    shieldTurns: 0,
                    reverseTechniqueUsed: false,
                    domainExpansionUsed: false,
                },
                pasiva: pasivaCarta1 || null,
            },
            {
                carta: c2,
                hp: hp2,
                maxHp: hp2,
                energy: 0,
                maxEnergy: MAX_ENERGY,
                moves: movimientosCarta2 || [],
                cooldowns: {},
                isAttacking: false,
                isDefending: false,
                buffs: {
                    damageBoost: pasivaCarta2?.id === 'pasiva_ataque' ? (pasivaCarta2?.valor || 0) : 0,
                    damageBoostTurns: pasivaCarta2?.id === 'pasiva_ataque' ? 999 : 0,
                    defenseBoost: pasivaCarta2?.id === 'pasiva_defensa' ? (pasivaCarta2?.valor || 0) : 0,
                    defenseBoostTurns: pasivaCarta2?.id === 'pasiva_defensa' ? 999 : 0,
                    shield: 0,
                    shieldTurns: 0,
                    reverseTechniqueUsed: false,
                    domainExpansionUsed: false,
                },
                pasiva: pasivaCarta2 || null,
            },
        ]);
    }, [carta1, carta2, movimientosCarta1, movimientosCarta2, pasivaCarta1, pasivaCarta2]);

    const generateBoss = useCallback((wave: number, difficulty: string) => {
        const bossTemplate = BOSS_ORDER[wave - 1];
        const diffMultiplier = difficulty === "facil" ? 0.8 : difficulty === "medio" ? 1.0 : 1.4;
        const waveMultiplier = 1 + (wave - 1) * 0.3;
        const finalMultiplier = diffMultiplier * waveMultiplier;
        const baseAttack = BOSS_BASE_ATTACK[difficulty as keyof typeof BOSS_BASE_ATTACK];
        const baseDefense = BOSS_BASE_DEFENSE[difficulty as keyof typeof BOSS_BASE_DEFENSE];
        const defenseBonus = wave >= 3 ? 300 : 0;
        return {
            nombre: bossTemplate.nombre,
            hp: Math.floor(bossTemplate.baseHp * finalMultiplier),
            maxHp: Math.floor(bossTemplate.baseHp * finalMultiplier),
            ataque: Math.floor(baseAttack * waveMultiplier),
            defensa: baseDefense + defenseBonus,
            imagen: bossTemplate.imagen,
            categoria: bossTemplate.categoria,
            ritual: bossTemplate.ritual,
            orden: wave,
        };
    }, []);

    const startGame = useCallback((difficulty: "facil" | "medio" | "dificil") => {
        if (!verificarRequisitos(difficulty)) {
            return;
        }
        const moves1 = movimientosCarta1 || [];
        const moves2 = movimientosCarta2 || [];
        if (moves1.length === 0 && moves2.length === 0) {
            setShowRequirementsError(
                `¡ADVERTENCIA!\n\n` +
                `NINGUNA CARTA TIENE MOVIMIENTOS:\n\n` +
                `${carta1?.nombre || "Carta 1"}: 0 movimientos ✗\n` +
                `${carta2?.nombre || "Carta 2"}: 0 movimientos ✗\n\n` +
                `Debes asignar al menos un movimiento a cada carta.`
            );
            setErrorModalVisible(true);
            return;
        }
        if (moves1.length === 0) {
            setShowRequirementsError(
                `¡ADVERTENCIA!\n\n` +
                `${carta1?.nombre || "Carta 1"} NO TIENE MOVIMIENTOS.`
            );
            setErrorModalVisible(true);
            return;
        }
        if (moves2.length === 0) {
            setShowRequirementsError(
                `¡ADVERTENCIA!\n\n` +
                `${carta2?.nombre || "Carta 2"} NO TIENE MOVIMIENTOS.`
            );
            setErrorModalVisible(true);
            return;
        }
        initFighters();
        const newBoss = generateBoss(1, difficulty);
        setBoss(newBoss);
        setGameState({
            difficulty,
            currentWave: 1,
            totalWaves: MAX_WAVES,
            phase: "waveIntro",
            actionLog: [`> ACCESO AL DOMINIO CONCEDIDO`, `> MODO: ${difficulty.toUpperCase()}`, `> CARGANDO OLEADA 1...`],
            selectedAttack1: null,
            selectedAttack2: null,
            selectedDefense1: false,
            selectedDefense2: false,
            turnPhase: "playerSelect",
            bossTarget: null,
            showDamage: null,
            isAnimating: false,
            turnCounter: 0,
            buffsUsedThisWave: false,
            pendingDomainExpansion: null,
            pendingReverseTechnique: null,
        });
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                phase: "fighting",
                actionLog: [...prev.actionLog, `! PELIGRO: ${newBoss.nombre} HA APARECIDO.`],
            }));
        }, 2000);
    }, [initFighters, generateBoss, verificarRequisitos, carta1, carta2, movimientosCarta1, movimientosCarta2]);

    const checkEnergyThresholds = useCallback((fighter: FighterState, playerId: 1 | 2) => {
        const energy = fighter.energy;
        const buffs = fighter.buffs;
        if (energy >= DOMAIN_EXPANSION_THRESHOLD && !buffs.domainExpansionUsed) {
            setGameState(prev => ({
                ...prev,
                pendingDomainExpansion: { playerId },
                phase: "domainExpansion",
                turnPhase: "domainExpansion",
                isAnimating: true,
            }));
            return true;
        }
        if (energy >= REVERSE_TECHNIQUE_THRESHOLD && !buffs.reverseTechniqueUsed) {
            setGameState(prev => ({
                ...prev,
                pendingReverseTechnique: { playerId },
                phase: "reverseTechnique",
                turnPhase: "buffSelect",
                isAnimating: true,
            }));
            return true;
        }
        if (energy >= BUFF_THRESHOLD && !gameState.buffsUsedThisWave) {
            setPendingBuff({ playerId });
            setShowBuffInfo(true);
            setGameState(prev => ({
                ...prev,
                phase: "buffSelection",
                turnPhase: "buffSelect",
                isAnimating: true,
            }));
            return true;
        }
        return false;
    }, [fighters, gameState.buffsUsedThisWave]);

    const applyBuff = useCallback((buffType: BuffType) => {
        if (!pendingBuff || !fighters) return;
        const { playerId } = pendingBuff;
        const fighterIndex = playerId - 1;
        const newFighters = [...fighters] as [FighterState, FighterState];
        const fighter = newFighters[fighterIndex];
        let logMessage = '';
        switch (buffType) {
            case 'heal10': {
                const healAmount = Math.floor(fighter.maxHp * 0.10);
                fighter.hp = Math.min(fighter.maxHp, fighter.hp + healAmount);
                logMessage = `+ BUFF CURACIÓN: ${fighter.carta.nombre} recupera ${healAmount} HP.`;
                break;
            }
            case 'attack10': {
                fighter.buffs.damageBoost = (fighter.buffs.damageBoost || 0) + 0.10;
                fighter.buffs.damageBoostTurns = BUFF_DURATION;
                logMessage = `^ BUFF ATAQUE: ${fighter.carta.nombre} +10% daño por ${BUFF_DURATION} turnos.`;
                break;
            }
            case 'speed': {
                fighter.buffs.shield = (fighter.buffs.shield || 0) + 50;
                fighter.buffs.shieldTurns = 2;
                logMessage = `» BUFF VELOCIDAD: ${fighter.carta.nombre} gana escudo de 50 HP por 2 turnos.`;
                break;
            }
            case 'curse': {
                fighter.buffs.defenseBoost = (fighter.buffs.defenseBoost || 0) + 0.15;
                fighter.buffs.defenseBoostTurns = BUFF_DURATION;
                logMessage = `☠ BUFF MALDITO: ${fighter.carta.nombre} +15% defensa por ${BUFF_DURATION} turnos.`;
                break;
            }
        }
        fighter.energy = Math.max(0, fighter.energy - BUFF_THRESHOLD);
        setFighters(newFighters);
        setPendingBuff(null);
        setShowBuffInfo(false);
        setGameState(prev => ({
            ...prev,
            phase: "fighting",
            turnPhase: "playerSelect",
            isAnimating: false,
            buffsUsedThisWave: true,
            actionLog: [...prev.actionLog, logMessage],
        }));
    }, [pendingBuff, fighters]);

    const executeReverseTechnique = useCallback((playerId: 1 | 2) => {
        if (!fighters) return;
        const fighter = fighters[playerId - 1];
        const healAmount = Math.floor(fighter.maxHp * 0.30);
        const newFighters = [...fighters] as [FighterState, FighterState];
        newFighters[playerId - 1] = {
            ...newFighters[playerId - 1],
            hp: Math.min(fighter.maxHp, fighter.hp + healAmount),
            energy: 0,
            buffs: {
                ...newFighters[playerId - 1].buffs,
                reverseTechniqueUsed: true,
            }
        };
        setFighters(newFighters);
        setGameState(prev => ({
            ...prev,
            phase: "fighting",
            turnPhase: "playerSelect",
            isAnimating: false,
            pendingReverseTechnique: null,
            actionLog: [...prev.actionLog, `† TÉCNICA INVERSA: ${fighter.carta.nombre} se cura ${healAmount} HP (30%).`],
        }));
    }, [fighters]);

    const executeDomainExpansion = useCallback((playerId: 1 | 2) => {
        if (!boss || !fighters) return;
        const fighter = fighters[playerId - 1];
        const danioDominio = Math.floor(fighter.carta.ataque * DOMAIN_MULTIPLIER);
        const newBoss = { ...boss, hp: Math.max(0, boss.hp - danioDominio) };
        setBoss(newBoss);
        reproducirSonido('/sounds/golpe.mp3');
        const newFighters = [...fighters] as [FighterState, FighterState];
        newFighters[playerId - 1] = {
            ...newFighters[playerId - 1],
            energy: 0,
            buffs: {
                ...newFighters[playerId - 1].buffs,
                domainExpansionUsed: true,
            }
        };
        setFighters(newFighters);
        setGameState(prev => ({
            ...prev,
            phase: "fighting",
            turnPhase: "playerSelect",
            isAnimating: false,
            pendingDomainExpansion: null,
            actionLog: [...prev.actionLog, `🔥 EXPANSIÓN DE DOMINIO: ${fighter.carta.nombre} inflige ${danioDominio} DMG`],
        }));
        if (newBoss.hp <= 0) {
            if (gameState.currentWave < MAX_WAVES) reproducirSonido('/sounds/efectos/oleada_completada.mp3');
            setTimeout(() => {
                if (gameState.currentWave >= MAX_WAVES) {
                    setGameState(prev => ({
                        ...prev,
                        phase: "victory",
                        actionLog: [...prev.actionLog, "*** DOMINIO COMPLETADO ***"],
                        isAnimating: false,
                    }));
                    return;
                }
                const nextWave = gameState.currentWave + 1;
                const newBossGen = generateBoss(nextWave, gameState.difficulty!);
                setBoss(newBossGen);
                const healedFighters = newFighters.map(f => ({
                    ...f,
                    hp: Math.min(f.maxHp, f.hp + Math.floor(f.maxHp * 0.3)),
                    energy: Math.min(f.maxEnergy, f.energy + 30),
                    cooldowns: {},
                    isAttacking: false,
                    isDefending: false,
                    buffs: {
                        damageBoost: f.pasiva?.id === 'pasiva_ataque' ? (f.pasiva?.valor || 0) : 0,
                        damageBoostTurns: f.pasiva?.id === 'pasiva_ataque' ? 999 : 0,
                        defenseBoost: f.pasiva?.id === 'pasiva_defensa' ? (f.pasiva?.valor || 0) : 0,
                        defenseBoostTurns: f.pasiva?.id === 'pasiva_defensa' ? 999 : 0,
                        shield: 0,
                        shieldTurns: 0,
                        reverseTechniqueUsed: false,
                        domainExpansionUsed: false,
                    },
                    pasiva: f.pasiva,
                }));
                setFighters(healedFighters as [FighterState, FighterState]);
                setGameState(prev => ({
                    ...prev,
                    currentWave: nextWave,
                    phase: "waveIntro",
                    selectedAttack1: null,
                    selectedAttack2: null,
                    selectedDefense1: false,
                    selectedDefense2: false,
                    turnPhase: "playerSelect",
                    actionLog: [...prev.actionLog, `> CARGANDO OLEADA ${nextWave}...`],
                    isAnimating: false,
                    buffsUsedThisWave: false,
                    turnCounter: 0,
                }));
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        phase: "fighting",
                        actionLog: [...prev.actionLog, `! PELIGRO: ${newBossGen.nombre} HA APARECIDO.`],
                    }));
                }, 2000);
            }, 1500);
        }
    }, [boss, fighters, gameState.currentWave, gameState.difficulty, gameState.totalWaves, generateBoss]);

    // Función para reducir cooldowns al final de cada turno
    const reduceCooldowns = useCallback((currentFighters: [FighterState, FighterState]): [FighterState, FighterState] => {
        return currentFighters.map(f => {
            const newCooldowns = { ...f.cooldowns };
            Object.keys(newCooldowns).forEach(key => {
                newCooldowns[key]--;
                if (newCooldowns[key] <= 0) {
                    delete newCooldowns[key];
                }
            });
            return { ...f, cooldowns: newCooldowns };
        }) as [FighterState, FighterState];
    }, []);

    const executeBossAttack = useCallback(() => {
        if (!boss || !fighters || gameState.isAnimating) return;
        const target = Math.random() < 0.5 ? 1 : 2;
        const defenderIndex = target - 1;
        const defender = fighters[defenderIndex];

        setGameState(prev => ({
            ...prev,
            turnPhase: "bossAttack",
            bossTarget: target,
            isAnimating: true,
        }));

        setTimeout(() => {
            const isDefending = (target === 1 ? gameState.selectedDefense1 : gameState.selectedDefense2);
            const shieldValue = defender.buffs.shield || 0;
            const damage = calcularDanioJefe(boss.ataque, defender.carta.defensa, isDefending);
            let finalDamage = damage;
            let absorbedByShield = 0;

            // ✅ USAR setFighters con callback para preservar cooldowns
            setFighters(prev => {
                if (!prev) return prev;
                const newFighters = [...prev] as [FighterState, FighterState];

                if (shieldValue > 0) {
                    absorbedByShield = Math.min(shieldValue, damage);
                    finalDamage = damage - absorbedByShield;
                }

                newFighters[defenderIndex] = {
                    ...newFighters[defenderIndex],
                    hp: Math.max(0, newFighters[defenderIndex].hp - finalDamage),
                    isDefending: false,
                    buffs: {
                        ...newFighters[defenderIndex].buffs,
                        damageBoostTurns: Math.max(0, newFighters[defenderIndex].buffs.damageBoostTurns - 1),
                        defenseBoostTurns: Math.max(0, newFighters[defenderIndex].buffs.defenseBoostTurns - 1),
                        shieldTurns: Math.max(0, newFighters[defenderIndex].buffs.shieldTurns - 1),
                        shield: Math.max(0, (newFighters[defenderIndex].buffs.shield || 0) - damage),
                        reverseTechniqueUsed: newFighters[defenderIndex].buffs.reverseTechniqueUsed,
                        domainExpansionUsed: newFighters[defenderIndex].buffs.domainExpansionUsed,
                    }
                };

                if (newFighters[defenderIndex].buffs.damageBoostTurns === 0 && newFighters[defenderIndex].pasiva?.id !== 'pasiva_ataque') {
                    newFighters[defenderIndex].buffs.damageBoost = 0;
                }
                if (newFighters[defenderIndex].buffs.defenseBoostTurns === 0 && newFighters[defenderIndex].pasiva?.id !== 'pasiva_defensa') {
                    newFighters[defenderIndex].buffs.defenseBoost = 0;
                }
                if (newFighters[defenderIndex].buffs.shieldTurns === 0) {
                    newFighters[defenderIndex].buffs.shield = 0;
                }

                return newFighters;
            });

            reproducirSonido('/sounds/golpe.mp3');

            let damageMessage = `- ${boss.nombre} ataca a ${defender.carta.nombre} [${finalDamage} DMG]`;
            if (isDefending) damageMessage += ' (DEFENDIENDO)';
            if (absorbedByShield > 0) damageMessage += ` [Escudo: ${absorbedByShield}]`;

            setGameState(prev => ({
                ...prev,
                showDamage: { target: target === 1 ? "player1" : "player2", damage: finalDamage },
                actionLog: [...prev.actionLog, damageMessage],
            }));

            // Verificar game over
            setFighters(prev => {
                if (!prev) return prev;
                if (prev.some(f => f.hp <= 0)) {
                    setTimeout(() => {
                        setGameState(prev2 => ({
                            ...prev2,
                            phase: "gameOver",
                            actionLog: [...prev2.actionLog, "FATAL ERROR: COMBATIENTES DERROTADOS."],
                            isAnimating: false,
                        }));
                    }, 500);
                }
                return prev;
            });

            // Reducir cooldowns y regenerar al final del turno
            setTimeout(() => {
                setFighters(prev => {
                    if (!prev) return prev;
                    if (prev.some(f => f.hp <= 0)) return prev;
                    const withReducedCD = reduceCooldowns(prev as [FighterState, FighterState]);
                    const regenerated = withReducedCD.map(f => ({
                        ...f,
                        energy: Math.min(f.maxEnergy, f.energy + ENERGY_REGEN),
                    })) as [FighterState, FighterState];
                    return regenerated;
                });

                setGameState(prev => ({
                    ...prev,
                    bossTarget: null,
                    showDamage: null,
                    turnPhase: "playerSelect",
                    selectedAttack1: null,
                    selectedAttack2: null,
                    selectedDefense1: false,
                    selectedDefense2: false,
                    isAnimating: false,
                    turnCounter: prev.turnCounter + 1,
                }));

                setTimeout(() => {
                    setFighters(prev => {
                        if (!prev) return prev;
                        if (checkEnergyThresholds(prev[0], 1)) return prev;
                        if (checkEnergyThresholds(prev[1], 2)) return prev;
                        return prev;
                    });
                }, 100);
            }, 1000);
        }, 800);
    }, [boss, fighters, gameState.isAnimating, gameState.selectedDefense1, gameState.selectedDefense2, checkEnergyThresholds, calcularDanioJefe, reduceCooldowns]);


    const executePlayerAttacks = useCallback(() => {
        if (!boss || !fighters || gameState.isAnimating) return;
        const { selectedAttack1, selectedAttack2, selectedDefense1, selectedDefense2 } = gameState;
        const p1Acting = selectedAttack1 !== null || selectedDefense1;
        const p2Acting = selectedAttack2 !== null || selectedDefense2;
        if (!p1Acting || !p2Acting) return;

        setGameState(prev => ({
            ...prev,
            turnPhase: "playerAttack",
            isAnimating: true,
        }));

        const currentBoss = { ...boss };

        // Marcar defensores
        setFighters(prev => {
            if (!prev) return prev;
            const cf = [...prev] as [FighterState, FighterState];
            if (selectedDefense1) cf[0] = { ...cf[0], isDefending: true };
            if (selectedDefense2) cf[1] = { ...cf[1], isDefending: true };
            return cf;
        });

        let attackDelay1 = 0;
        let attackDelay2 = 0;

        // ATAQUE JUGADOR 1
        if (selectedAttack1) {
            const isCrit1 = Math.random() < CRITICAL_CHANCE;
            attackDelay1 = 500;
            setTimeout(() => {
                const currentFighter = fighters?.[0];
                if (!currentFighter) return;
                const damageMultiplier1 = 1 + (currentFighter.buffs.damageBoost || 0);
                let rawDamage = Math.floor((selectedAttack1.danio + currentFighter.carta.ataque * 0.5) - currentBoss.defensa);
                rawDamage = Math.max(1, rawDamage);
                const damage1 = Math.floor(rawDamage * damageMultiplier1 * (isCrit1 ? CRITICAL_MULTIPLIER : 1));
                currentBoss.hp = Math.max(0, currentBoss.hp - damage1);
                setBoss({ ...currentBoss });
                reproducirSonido('/sounds/golpe.mp3');

                // ✅ ASIGNAR COOLDOWN - Esta es la parte clave
                setFighters(prev => {
                    if (!prev) return prev;
                    const nf = [...prev] as [FighterState, FighterState];
                    nf[0] = { ...nf[0], isAttacking: true, isDefending: false };
                    nf[0].cooldowns = {
                        ...nf[0].cooldowns,
                        [selectedAttack1.id]: selectedAttack1.cooldown
                    };
                    if (nf[0].pasiva?.id === 'pasiva_velocidad') {
                        const cd = nf[0].cooldowns[selectedAttack1.id] || 0;
                        nf[0].cooldowns[selectedAttack1.id] = Math.max(1, cd - 1);
                    }
                    return nf;
                });

                setGameState(prev => ({
                    ...prev,
                    showDamage: { target: "boss", damage: damage1, isCrit: isCrit1 },
                    actionLog: [...prev.actionLog, `> ${currentFighter.carta.nombre} [${selectedAttack1.nombre}] -> ${damage1} DMG`],
                }));

                setTimeout(() => {
                    setFighters(prev => {
                        if (!prev) return prev;
                        const rf = [...prev] as [FighterState, FighterState];
                        rf[0] = { ...rf[0], isAttacking: false };
                        return rf;
                    });
                    setGameState(prev => ({ ...prev, showDamage: null }));
                }, 800);
            }, attackDelay1);
        } else if (selectedDefense1) {
            setGameState(prev => ({
                ...prev,
                actionLog: [...prev.actionLog, `> ${fighters?.[0]?.carta?.nombre || "P1"} se defiende.`],
            }));
        }

        // ATAQUE JUGADOR 2
        if (selectedAttack2) {
            const isCrit2 = Math.random() < CRITICAL_CHANCE;
            attackDelay2 = selectedAttack1 ? 1500 : 500;
            setTimeout(() => {
                if (currentBoss.hp <= 0) return;
                const currentFighter = fighters?.[1];
                if (!currentFighter) return;
                const damageMultiplier2 = 1 + (currentFighter.buffs.damageBoost || 0);
                let rawDamage = Math.floor((selectedAttack2.danio + currentFighter.carta.ataque * 0.5) - currentBoss.defensa);
                rawDamage = Math.max(1, rawDamage);
                const damage2 = Math.floor(rawDamage * damageMultiplier2 * (isCrit2 ? CRITICAL_MULTIPLIER : 1));
                currentBoss.hp = Math.max(0, currentBoss.hp - damage2);
                setBoss({ ...currentBoss });
                reproducirSonido('/sounds/golpe.mp3');

                // ✅ ASIGNAR COOLDOWN - Esta es la parte clave
                setFighters(prev => {
                    if (!prev) return prev;
                    const nf = [...prev] as [FighterState, FighterState];
                    nf[1] = { ...nf[1], isAttacking: true, isDefending: false };
                    nf[1].cooldowns = {
                        ...nf[1].cooldowns,
                        [selectedAttack2.id]: selectedAttack2.cooldown
                    };
                    if (nf[1].pasiva?.id === 'pasiva_velocidad') {
                        const cd = nf[1].cooldowns[selectedAttack2.id] || 0;
                        nf[1].cooldowns[selectedAttack2.id] = Math.max(1, cd - 1);
                    }
                    return nf;
                });

                setGameState(prev => ({
                    ...prev,
                    showDamage: { target: "boss", damage: damage2, isCrit: isCrit2 },
                    actionLog: [...prev.actionLog, `> ${currentFighter.carta.nombre} [${selectedAttack2.nombre}] -> ${damage2} DMG`],
                }));

                setTimeout(() => {
                    setFighters(prev => {
                        if (!prev) return prev;
                        const rf = [...prev] as [FighterState, FighterState];
                        rf[1] = { ...rf[1], isAttacking: false };
                        return rf;
                    });
                    setGameState(prev => ({ ...prev, showDamage: null }));
                }, 800);
            }, attackDelay2);
        } else if (selectedDefense2) {
            setGameState(prev => ({
                ...prev,
                actionLog: [...prev.actionLog, `> ${fighters?.[1]?.carta?.nombre || "P2"} se defiende.`],
            }));
        }

        const maxDelay = Math.max(attackDelay1, attackDelay2) + 1000;
        setTimeout(() => {
            if (currentBoss.hp <= 0) {
                if (gameState.currentWave < MAX_WAVES) reproducirSonido('/sounds/efectos/oleada_completada.mp3');
                if (gameState.currentWave >= MAX_WAVES) {
                    setGameState(prev => ({
                        ...prev,
                        phase: "victory",
                        actionLog: [...prev.actionLog, "*** DOMINIO COMPLETADO ***"],
                        isAnimating: false,
                    }));
                    return;
                }
                const nextWave = gameState.currentWave + 1;
                const newBoss = generateBoss(nextWave, gameState.difficulty!);
                setBoss(newBoss);
                setFighters(prev => {
                    if (!prev) return prev;
                    return prev.map(f => ({
                        ...f,
                        hp: Math.min(f.maxHp, f.hp + Math.floor(f.maxHp * 0.3)),
                        energy: Math.min(f.maxEnergy, f.energy + 30),
                        cooldowns: {},
                        isAttacking: false,
                        isDefending: false,
                        buffs: {
                            damageBoost: f.pasiva?.id === 'pasiva_ataque' ? (f.pasiva?.valor || 0) : 0,
                            damageBoostTurns: f.pasiva?.id === 'pasiva_ataque' ? 999 : 0,
                            defenseBoost: f.pasiva?.id === 'pasiva_defensa' ? (f.pasiva?.valor || 0) : 0,
                            defenseBoostTurns: f.pasiva?.id === 'pasiva_defensa' ? 999 : 0,
                            shield: 0,
                            shieldTurns: 0,
                            reverseTechniqueUsed: false,
                            domainExpansionUsed: false,
                        },
                        pasiva: f.pasiva,
                    })) as [FighterState, FighterState];
                });
                setGameState(prev => ({
                    ...prev,
                    currentWave: nextWave,
                    phase: "waveIntro",
                    selectedAttack1: null,
                    selectedAttack2: null,
                    selectedDefense1: false,
                    selectedDefense2: false,
                    turnPhase: "playerSelect",
                    actionLog: [...prev.actionLog, `> CARGANDO OLEADA ${nextWave}...`],
                    isAnimating: false,
                    buffsUsedThisWave: false,
                    turnCounter: 0,
                }));
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        phase: "fighting",
                        actionLog: [...prev.actionLog, `! PELIGRO: ${newBoss.nombre} HA APARECIDO.`],
                    }));
                }, 2000);
                return;
            }
            executeBossAttack();
        }, maxDelay);
    }, [boss, fighters, gameState, generateBoss, executeBossAttack]);

    const selectAttack = useCallback((playerId: 1 | 2, move: Movimiento) => {
        if (gameState.turnPhase !== "playerSelect" || gameState.isAnimating) return;
        setGameState(prev => {
            const newState = { ...prev };
            if (playerId === 1) {
                newState.selectedAttack1 = move;
                newState.selectedDefense1 = false;
            } else {
                newState.selectedAttack2 = move;
                newState.selectedDefense2 = false;
            }
            return newState;
        });
    }, [gameState.turnPhase, gameState.isAnimating]);

    const selectDefense = useCallback((playerId: 1 | 2) => {
        if (gameState.turnPhase !== "playerSelect" || gameState.isAnimating) return;
        setGameState(prev => {
            const newState = { ...prev };
            if (playerId === 1) {
                newState.selectedDefense1 = !prev.selectedDefense1;
                if (newState.selectedDefense1) {
                    newState.selectedAttack1 = null;
                }
            } else {
                newState.selectedDefense2 = !prev.selectedDefense2;
                if (newState.selectedDefense2) {
                    newState.selectedAttack2 = null;
                }
            }
            return newState;
        });
    }, [gameState.turnPhase, gameState.isAnimating]);

    useEffect(() => {
        if (
            gameState.phase === "fighting" &&
            gameState.turnPhase === "playerSelect" &&
            !gameState.isAnimating
        ) {
            const p1Ready = gameState.selectedAttack1 !== null || gameState.selectedDefense1;
            const p2Ready = gameState.selectedAttack2 !== null || gameState.selectedDefense2;
            if (p1Ready && p2Ready) {
                executePlayerAttacks();
            }
        }
    }, [
        gameState.selectedAttack1,
        gameState.selectedAttack2,
        gameState.selectedDefense1,
        gameState.selectedDefense2,
        gameState.phase,
        gameState.turnPhase,
        gameState.isAnimating,
        executePlayerAttacks
    ]);

    const getPasivaIcon = (pasiva: Pasiva | null) => {
        if (!pasiva) return null;
        switch (pasiva.icono) {
            case 'vida': return <FiHeart className="text-green-500" size={10} />;
            case 'ataque': return <LuSwords className="text-red-500" size={10} />;
            case 'defensa': return <LuShield className="text-blue-500" size={10} />;
            case 'velocidad': return <LuZap className="text-purple-500" size={10} />;
            default: return <LuSparkles className="text-amber-500" size={10} />;
        }
    };

    // MODAL DE EXPANSIÓN DE DOMINIO
    if (gameState.phase === "domainExpansion" && gameState.pendingDomainExpansion) {
        const player = fighters?.[gameState.pendingDomainExpansion.playerId - 1];
        const danioDominio = player ? Math.floor(player.carta.ataque * DOMAIN_MULTIPLIER) : 0;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 campos-de-batalla2-font campos-de-batalla2-crt campos-de-batalla2-fade-in">
                <div className="bg-black p-8 border-4 border-red-600 shadow-[10px_10px_0_#7f1d1d] max-w-md w-full mx-4">
                    <div className="text-center mb-6">
                        <div className="relative inline-block">
                            <LuZapOff className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-2">
                            ¡EXPANSIÓN DE DOMINIO!
                        </h2>
                        <div className="text-red-300 text-sm mt-2">
                            [{player?.carta.nombre.toUpperCase()}]
                        </div>
                        <div className="h-1 w-16 bg-red-600 mx-auto my-4"></div>
                    </div>
                    <div className="bg-black border-2 border-red-900 p-4 mb-6">
                        <div className="text-center mb-4">
                            <div className="text-gray-400 text-xs uppercase mb-2">Daño Base</div>
                            <div className="text-2xl font-black text-white">{player?.carta.ataque || 0}</div>
                            <div className="text-red-500 text-sm mt-2">× {DOMAIN_MULTIPLIER} (150%)</div>
                            <div className="text-4xl font-black text-red-500 mt-3">{danioDominio}</div>
                            <div className="text-gray-500 text-xs mt-1">DAÑO TOTAL</div>
                        </div>
                        <p className="text-red-400 text-xs text-center mt-4">
                            Consume toda tu energía maldita (100%) para desatar un ataque devastador
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => executeDomainExpansion(gameState.pendingDomainExpansion!.playerId)}
                            className="w-full py-3 bg-red-600 border-2 border-red-400 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_#7f1d1d] hover:shadow-[4px_4px_0_#ef4444]"
                        >
                            [ DESATAR DOMINIO ]
                        </button>
                        <button
                            onClick={() => {
                                setGameState(prev => ({
                                    ...prev,
                                    phase: "fighting",
                                    turnPhase: "playerSelect",
                                    isAnimating: false,
                                    pendingDomainExpansion: null,
                                }));
                            }}
                            className="w-full py-2 bg-gray-800 border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest"
                        >
                            [ CANCELAR ]
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // MODAL DE TÉCNICA INVERSA
    if (gameState.phase === "reverseTechnique" && gameState.pendingReverseTechnique) {
        const player = fighters?.[gameState.pendingReverseTechnique.playerId - 1];
        const healAmount = player ? Math.floor(player.maxHp * 0.15) : 0;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 campos-de-batalla2-crt campos-de-batalla2-font campos-de-batalla2-fade-in">
                <div className="bg-black p-6 border-4 border-green-600 shadow-[8px_8px_0_#166534] max-w-md w-full relative">
                    <div className="text-center mb-6 border-b-4 border-green-900 pb-4 relative">
                        <FiHeart className="absolute top-0 left-0 text-green-500 text-2xl animate-pulse" />
                        <h2 className="text-2xl font-black text-green-500 tracking-widest drop-shadow-[2px_2px_0_#fff]">
                            ¡TÉCNICA INVERSA!
                        </h2>
                        <div className="text-white text-sm mt-2 flex items-center justify-center gap-2">
                            [ {player?.carta.nombre.toUpperCase()} ]
                        </div>
                    </div>
                    <div className="bg-black border-2 border-green-900 p-4 mb-6">
                        <div className="text-center mb-4">
                            <div className="text-gray-400 text-xs uppercase mb-2">Curación</div>
                            <div className="text-2xl font-black text-white">{player?.maxHp || 0} HP Máx</div>
                            <div className="text-green-500 text-sm mt-2">× 15%</div>
                            <div className="text-4xl font-black text-green-500 mt-3">+{healAmount} HP</div>
                            <div className="text-gray-500 text-xs mt-1">RECUPERACIÓN DE SALUD</div>
                        </div>
                        <p className="text-green-400 text-xs text-center mt-4">
                            Consume TODA tu energía maldita (75%) para recuperar el 15% de tu salud máxima
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => executeReverseTechnique(gameState.pendingReverseTechnique!.playerId)}
                            className="w-full py-3 bg-green-600 border-2 border-green-400 hover:bg-green-700 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_#166534] hover:shadow-[4px_4px_0_#16a34a]"
                        >
                            [ USAR TÉCNICA INVERSA ]
                        </button>
                        <button
                            onClick={() => {
                                setGameState(prev => ({
                                    ...prev,
                                    phase: "fighting",
                                    turnPhase: "playerSelect",
                                    isAnimating: false,
                                    pendingReverseTechnique: null,
                                }));
                            }}
                            className="w-full py-2 bg-gray-800 border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest"
                        >
                            [ CANCELAR ]
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // MODAL DE BUFFS
    if (gameState.phase === "buffSelection" && pendingBuff) {
        const player = fighters?.[pendingBuff.playerId - 1];
        const buffs: BuffOption[] = [
            { id: 'heal10', icon: <FiHeart className="text-xl" />, name: 'CURACIÓN +10%', desc: 'Recupera 10% de HP máximo', color: 'text-green-500 border-green-500' },
            { id: 'attack10', icon: <LuSwords className="text-xl" />, name: 'ATAQUE +10%', desc: `+10% daño por ${BUFF_DURATION} turnos`, color: 'text-red-500 border-red-500' },
            { id: 'speed', icon: <LuZap className="text-xl" />, name: 'VELOCIDAD MALDITA', desc: 'Escudo de 50 HP por 2 turnos', color: 'text-yellow-500 border-yellow-500' },
            { id: 'curse', icon: <LuSkull className="text-xl" />, name: 'REFUERZO MALDITO', desc: `+15% defensa por ${BUFF_DURATION} turnos`, color: 'text-amber-500 border-amber-500' },
        ];
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 campos-de-batalla2-crt campos-de-batalla2-font campos-de-batalla2-fade-in">
                <div className="bg-black p-6 border-4 border-amber-600 shadow-[8px_8px_0_#92400e] max-w-md w-full relative">
                    <div className="text-center mb-6 border-b-4 border-amber-900 pb-4 relative">
                        <LuSparkles className="absolute top-0 left-0 text-amber-500 text-2xl animate-pulse" />
                        <h2 className="text-2xl font-black text-amber-500 tracking-widest drop-shadow-[2px_2px_0_#fff]">
                            ¡ENERGÍA MALDITA 50%!
                        </h2>
                        <div className="text-white text-sm mt-2 flex items-center justify-center gap-2">
                            [ {player?.carta.nombre.toUpperCase()} ]
                            <button onClick={() => setShowBuffInfo(!showBuffInfo)} className="text-gray-400 hover:text-white transition-colors" title="Información">
                                <FiInfo size={16} />
                            </button>
                        </div>
                        {showBuffInfo && (
                            <p className="text-xs text-amber-300 mt-2 bg-amber-900/30 p-2 border border-amber-500/50">
                                Selecciona un buff para potenciar a tu hechicero. Consume 50% de energía maldita.
                            </p>
                        )}
                    </div>
                    <div className="space-y-3 mb-6">
                        {buffs.map((buff) => (
                            <button
                                key={buff.id}
                                onClick={() => applyBuff(buff.id)}
                                className={`w-full p-3 bg-black border-2 ${buff.color} hover:bg-gray-900 transition-all group flex items-center gap-4 text-left`}
                            >
                                <div className={`w-10 h-10 border-2 ${buff.color} flex items-center justify-center bg-black`}>
                                    {buff.icon}
                                </div>
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${buff.color}`}>{buff.name}</div>
                                    <div className="text-gray-400 text-xs mt-1">{buff.desc}</div>
                                </div>
                                <div className={`text-xl font-bold ${buff.color}`}><LuPlus /></div>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setPendingBuff(null);
                            setShowBuffInfo(false);
                            setGameState(prev => ({
                                ...prev,
                                phase: "fighting",
                                turnPhase: "playerSelect",
                                isAnimating: false,
                            }));
                        }}
                        className="w-full py-2 bg-gray-800 border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest"
                    >
                        [ OMITIR ]
                    </button>
                </div>
            </div>
        );
    }

    // MODAL DE ERROR DE REQUISITOS
    if (errorModalVisible) {
        const isMovementWarning = showRequirementsError?.includes("MOVIMIENTOS");
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 campos-de-batalla2-font campos-de-batalla2-crt">
                <div className={`bg-black p-8 border-4 ${isMovementWarning ? 'border-yellow-600 shadow-[10px_10px_0_#854d0e]' : 'border-red-600 shadow-[10px_10px_0_#7f1d1d]'} max-w-lg w-full mx-4`}>
                    <div className="text-center mb-6">
                        <div className="relative inline-block">
                            {isMovementWarning ? (
                                <FiAlertTriangle className="text-6xl text-yellow-500 mx-auto mb-4 animate-pulse" />
                            ) : (
                                <>
                                    <FiLock className="text-6xl text-red-500 mx-auto mb-4" />
                                    <FiAlertTriangle className="text-3xl text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                                </>
                            )}
                        </div>
                        <h2 className={`text-3xl font-black uppercase tracking-widest mb-2 ${isMovementWarning ? 'text-yellow-500' : 'text-red-500'}`}>
                            {isMovementWarning ? '¡ADVERTENCIA!' : '¡NIVEL BLOQUEADO!'}
                        </h2>
                        <div className={`h-1 w-16 mx-auto mb-4 ${isMovementWarning ? 'bg-yellow-600' : 'bg-red-600'}`}></div>
                    </div>
                    <div className={`bg-black border-2 ${isMovementWarning ? 'border-yellow-900' : 'border-red-900'} p-4 mb-6`}>
                        <div className={`text-sm whitespace-pre-line leading-relaxed font-bold ${isMovementWarning ? 'text-yellow-400' : 'text-red-400'}`}>
                            {showRequirementsError}
                        </div>
                    </div>
                    {!isMovementWarning && (
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs text-gray-500 border-b border-gray-800 pb-2">
                                <span className="font-bold">REQUISITOS POR DIFICULTAD (INDIVIDUALES):</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-green-500 font-bold">FÁCIL:</span>
                                <span className="text-gray-400">ATQ ≥ {STACK_REQUIREMENTS.facil.ataque} | DEF ≥ {STACK_REQUIREMENTS.facil.defensa}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-yellow-500 font-bold">MEDIO:</span>
                                <span className="text-gray-400">ATQ ≥ {STACK_REQUIREMENTS.medio.ataque} | DEF ≥ {STACK_REQUIREMENTS.medio.defensa}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-red-500 font-bold">DIFÍCIL:</span>
                                <span className="text-gray-400">ATQ ≥ {STACK_REQUIREMENTS.dificil.ataque} | DEF ≥ {STACK_REQUIREMENTS.dificil.defensa}</span>
                            </div>
                        </div>
                    )}
                    {isMovementWarning && (
                        <div className="bg-yellow-900/20 border border-yellow-700/30 p-3 mb-6 rounded">
                            <p className="text-yellow-400 text-xs text-center">
                                💡 Consejo: Regresa a la selección de cartas y usa el botón "Maldiciones" para crear movimientos.
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setErrorModalVisible(false);
                            setShowRequirementsError(null);
                        }}
                        className={`w-full py-3 bg-black border-2 font-bold text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_#374151] ${isMovementWarning
                            ? 'border-yellow-600 hover:bg-yellow-950 text-yellow-500 hover:text-yellow-400'
                            : 'border-red-600 hover:bg-red-950 text-red-500 hover:text-red-400 shadow-[4px_4px_0_#7f1d1d]'
                            }`}
                    >
                        [ ENTENDIDO - VOLVER ]
                    </button>
                </div>
            </div>
        );
    }

    // SELECCIÓN DE DIFICULTAD
    if (gameState.phase === "difficultySelect") {
        const cumpleFacil1 = verificarCartaIndividual(carta1, STACK_REQUIREMENTS.facil);
        const cumpleFacil2 = verificarCartaIndividual(carta2, STACK_REQUIREMENTS.facil);
        const cumpleMedio1 = verificarCartaIndividual(carta1, STACK_REQUIREMENTS.medio);
        const cumpleMedio2 = verificarCartaIndividual(carta2, STACK_REQUIREMENTS.medio);
        const cumpleDificil1 = verificarCartaIndividual(carta1, STACK_REQUIREMENTS.dificil);
        const cumpleDificil2 = verificarCartaIndividual(carta2, STACK_REQUIREMENTS.dificil);
        const facilDisponible = cumpleFacil1 && cumpleFacil2;
        const medioDisponible = cumpleMedio1 && cumpleMedio2;
        const dificilDisponible = cumpleDificil1 && cumpleDificil2;
        return (
            <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden campos-de-batalla2-font campos-de-batalla2-crt">
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                    backgroundImage: `linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                }} />
                <button
                    onClick={() => {
                        stopBackgroundMusic();
                        navigate('/');
                    }}
                    className="absolute top-4 left-4 z-50 px-4 py-2 bg-black border-2 border-gray-600 hover:border-red-500 hover:text-red-500 transition-all shadow-[4px_4px_0_#374151] hover:shadow-[4px_4px_0_#ef4444] text-xs font-bold"
                >
                    <FiHome className="inline mr-1 mb-0.5" /> ESC - VOLVER
                </button>
                <div className="relative z-10 text-center mb-12 bg-black border-4 border-red-600 p-6 shadow-[8px_8px_0_#7f1d1d]">
                    <h1 className="text-4xl md:text-6xl font-black tracking-widest text-red-500 mb-2 drop-shadow-[3px_3px_0_#fff]">
                        MAZMORRA MALDITA
                    </h1>
                    <p className="text-gray-400 text-sm tracking-[0.2em] mb-4">
                        SELECCIONA EL GRADO DE LA MISIÓN
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-orange-400">
                        <span>P1: {carta1?.nombre || "SATORU GOJO"}</span>
                        <span>|</span>
                        <span>P2: {carta2?.nombre || "MEGUMI FUSHIGURO"}</span>
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2">
                        <span>P1: ATQ {carta1?.ataque || 0} / DEF {carta1?.defensa || 0}</span>
                        <span>|</span>
                        <span>P2: ATQ {carta2?.ataque || 0} / DEF {carta2?.defensa || 0}</span>
                    </div>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 max-w-4xl w-full px-4 justify-center">
                    <button
                        onClick={() => startGame("facil")}
                        disabled={!facilDisponible}
                        className={`group flex-1 p-6 border-4 transition-all duration-200 ${facilDisponible
                            ? 'bg-black border-green-600 hover:bg-green-950 hover:-translate-y-2 shadow-[8px_8px_0_#166534] cursor-pointer'
                            : 'bg-gray-950 border-gray-700 opacity-60 cursor-not-allowed shadow-[8px_8px_0_#374151]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-green-500 text-sm font-bold">[ GRADO 4 ]</div>
                            {!facilDisponible && <FiLock className="text-red-500 text-xl" />}
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 group-hover:text-green-400">FÁCIL</h3>
                        <p className="text-gray-400 text-xs leading-relaxed border-t-2 border-dashed border-green-800 pt-4">
                            ATK JEFE: {BOSS_BASE_ATTACK.facil}<br />
                            DEF JEFE: {BOSS_BASE_DEFENSE.facil}<br />
                            REQ: ATQ ≥ {STACK_REQUIREMENTS.facil.ataque} | DEF ≥ {STACK_REQUIREMENTS.facil.defensa}
                        </p>
                        {!facilDisponible && (
                            <div className="mt-2 text-red-500 text-[10px] font-bold uppercase">✗ CARTAS INSUFICIENTES</div>
                        )}
                    </button>
                    <button
                        onClick={() => startGame("medio")}
                        disabled={!medioDisponible}
                        className={`group flex-1 p-6 border-4 transition-all duration-200 ${medioDisponible
                            ? 'bg-black border-yellow-600 hover:bg-yellow-950 hover:-translate-y-2 shadow-[8px_8px_0_#854d0e] cursor-pointer'
                            : 'bg-gray-950 border-gray-700 opacity-60 cursor-not-allowed shadow-[8px_8px_0_#374151]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-yellow-500 text-sm font-bold">[ GRADO 1 ]</div>
                            {!medioDisponible && <FiLock className="text-red-500 text-xl" />}
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 group-hover:text-yellow-400">MEDIO</h3>
                        <p className="text-gray-400 text-xs leading-relaxed border-t-2 border-dashed border-yellow-800 pt-4">
                            ATK JEFE: {BOSS_BASE_ATTACK.medio}<br />
                            DEF JEFE: {BOSS_BASE_DEFENSE.medio}<br />
                            REQ: ATQ ≥ {STACK_REQUIREMENTS.medio.ataque} | DEF ≥ {STACK_REQUIREMENTS.medio.defensa}
                        </p>
                        {!medioDisponible && (
                            <div className="mt-2 text-red-500 text-[10px] font-bold uppercase">✗ CARTAS INSUFICIENTES</div>
                        )}
                    </button>
                    <button
                        onClick={() => startGame("dificil")}
                        disabled={!dificilDisponible}
                        className={`group flex-1 p-6 border-4 transition-all duration-200 ${dificilDisponible
                            ? 'bg-black border-red-600 hover:bg-red-950 hover:-translate-y-2 shadow-[8px_8px_0_#7f1d1d] cursor-pointer'
                            : 'bg-gray-950 border-gray-700 opacity-60 cursor-not-allowed shadow-[8px_8px_0_#374151]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`text-sm font-bold ${dificilDisponible ? 'text-red-500 animate-pulse' : 'text-red-700'}`}>[ GRADO ESPECIAL ]</div>
                            {!dificilDisponible && <FiLock className="text-red-500 text-xl" />}
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 group-hover:text-red-400">DIFÍCIL</h3>
                        <p className="text-gray-400 text-xs leading-relaxed border-t-2 border-dashed border-red-800 pt-4">
                            ATK JEFE: {BOSS_BASE_ATTACK.dificil}<br />
                            DEF JEFE: {BOSS_BASE_DEFENSE.dificil}<br />
                            REQ: ATQ ≥ {STACK_REQUIREMENTS.dificil.ataque} | DEF ≥ {STACK_REQUIREMENTS.dificil.defensa}
                        </p>
                        {!dificilDisponible && (
                            <div className="mt-2 text-red-500 text-[10px] font-bold uppercase">✗ CARTAS INSUFICIENTES</div>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    if (!fighters || !boss) return <div className="min-h-screen bg-black text-green-500 flex items-center justify-center campos-de-batalla2-font campos-de-batalla2-crt text-xl">CARGANDO RECURSOS DEL DOMINIO...</div>;

    const [p1, p2] = fighters;

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col campos-de-batalla2-font overflow-hidden campos-de-batalla2-crt">
            <header className="z-30 flex justify-between items-center px-6 py-3 bg-black border-b-4 border-orange-900 shadow-[0_4px_0_#7c2d12]">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-orange-500 font-bold tracking-widest"><LuCastle className="inline mr-1 mb-0.5" /> UBICACIÓN</span>
                        <span className="text-lg font-black uppercase text-white">PISO {gameState.currentWave} / {MAX_WAVES}</span>
                    </div>
                    <div className="w-1 h-8 bg-gray-800" />
                    <div className="flex flex-col">
                        <span className="text-xs text-orange-500 font-bold tracking-widest">TURNO</span>
                        <span className="text-lg font-black text-white">{gameState.turnCounter}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-black border-2 border-red-600 text-red-500 text-xs font-bold uppercase shadow-[2px_2px_0_#7f1d1d]">
                        MODO: {gameState.difficulty}
                    </div>
                    <button
                        onClick={() => {
                            stopBackgroundMusic();
                            window.location.reload();
                        }}
                        className="px-3 py-1 bg-black border-2 border-gray-600 hover:border-white text-gray-400 hover:text-white transition-all shadow-[2px_2px_0_#374151]"
                    >
                        <LuRotateCcw className="inline mr-1 mb-0.5" /> RESET
                    </button>
                    <button
                        onClick={() => {
                            stopBackgroundMusic();
                            navigate("/");
                        }}
                        className="px-3 py-1 bg-black border-2 border-gray-600 hover:border-white text-gray-400 hover:text-white transition-all shadow-[2px_2px_0_#374151]"
                    >
                        <FiHome className="inline mr-1 mb-0.5" /> SALIR
                    </button>
                </div>
            </header>

            <div className="relative flex-1 bg-[#111] overflow-hidden select-none border-x-4 border-black" style={{
                backgroundImage: `linear-gradient(rgba(20, 0, 30, 0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(20, 0, 30, 0.4) 2px, transparent 2px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center'
            }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
                {(gameState.phase === "waveIntro") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-40">
                        <div className="text-center bg-black border-4 border-red-600 p-8 shadow-[10px_10px_0_#7f1d1d]">
                            <h2 className="text-4xl font-black text-white mb-4 tracking-widest animate-pulse">
                                {gameState.currentWave === 1 ? "INICIO DE MISIÓN" : `NIVEL ${gameState.currentWave}`}
                            </h2>
                            {boss && (
                                <div className="border-t-2 border-dashed border-red-800 pt-4">
                                    <p className="text-2xl text-red-500 font-bold uppercase flex items-center justify-center gap-2">
                                        <LuSkull className="text-red-500" /> &gt; {boss.nombre} &lt;
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">[{boss.categoria}] - ATK: {boss.ataque} | DEF: {boss.defensa}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {(gameState.phase === "gameOver" || gameState.phase === "victory") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-40 campos-de-batalla2-fade-in">
                        <div className={`text-center bg-black border-4 p-8 ${gameState.phase === "victory" ? 'border-yellow-500 shadow-[10px_10px_0_#854d0e]' : 'border-red-600 shadow-[10px_10px_0_#7f1d1d]'}`}>
                            {gameState.phase === "victory" && <LuCrown className="mx-auto mb-4 text-6xl text-yellow-500 drop-shadow-[0_0_15px_#ca8a04]" />}
                            <h2 className="text-4xl font-black uppercase mb-6 tracking-widest text-white">
                                {gameState.phase === "victory" ? "MISIÓN COMPLETADA" : "GAME OVER"}
                            </h2>
                            <button
                                onClick={() => {
                                    stopBackgroundMusic();
                                    window.location.href = '/';
                                }}
                                className="w-full py-3 bg-black border-2 border-white hover:bg-white hover:text-black text-white font-bold text-sm uppercase tracking-widest transition-all"
                            >
                                CONTINUAR
                            </button>
                        </div>
                    </div>
                )}
                <div className="absolute inset-x-0 top-8 bottom-8 flex flex-col justify-between items-center px-12">
                    {gameState.phase !== "waveIntro" && (
                        <div className="w-full flex flex-col items-center mt-4 relative">
                            <div className="relative border-4 border-red-900 bg-black p-2 shadow-[0_0_20px_#7f1d1d]">
                                <div className={`w-32 h-32 bg-gray-900 flex items-center justify-center overflow-hidden grayscale contrast-150 relative ${gameState.showDamage?.target === "boss" ? "campos-de-batalla2-damage-flash" : ""}`}>
                                    {boss.imagen ? (
                                        <img src={boss.imagen} alt={boss.nombre} className="w-full h-full object-cover" />
                                    ) : <div className="text-5xl">?</div>}
                                    <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply" />
                                </div>
                                {gameState.showDamage?.target === "boss" && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                        <div className="text-5xl font-black text-red-500 campos-de-batalla2-bounce drop-shadow-[2px_2px_0_#fff]">
                                            {gameState.showDamage.isCrit ? 'CRIT ' : ''}-{gameState.showDamage.damage}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 bg-black border-2 border-red-900 p-2 min-w-[300px]">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-red-500 font-bold text-sm uppercase flex items-center gap-1"><LuSkull /> {boss.nombre}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><LuDroplets size={12} className="text-red-500" /> {boss.hp} / {boss.maxHp} HP</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                                    <span>ATK: {boss.ataque}</span>
                                    <span>DEF: {boss.defensa}</span>
                                </div>
                                <div className="h-4 bg-gray-900 border-2 border-gray-700">
                                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full max-w-5xl flex justify-between items-end mb-4 relative">
                        <div className={`flex flex-col items-center transition-transform ${p1.isAttacking ? "-translate-y-8" : ""}`}>
                            {gameState.bossTarget === 1 && (<div className="absolute -top-12 text-2xl animate-pulse">🎯</div>)}
                            <div className="relative border-4 border-orange-900 bg-black p-1 shadow-[0_0_15px_#7c2d12]">
                                <div className={`w-24 h-32 bg-gray-900 overflow-hidden relative ${gameState.showDamage?.target === "player1" ? "campos-de-batalla2-damage-flash" : ""}`}>
                                    {p1.carta.imagen ? (
                                        <img src={p1.carta.imagen} alt={p1.carta.nombre} className="w-full h-full object-cover contrast-125" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">P1</div>}
                                    <div className="absolute bottom-0 inset-x-0 flex flex-col gap-1 p-1">
                                        {p1.isAttacking && <div className="bg-orange-600 border border-white text-white text-[10px] text-center font-bold">ATACANDO</div>}
                                        {p1.isDefending && <div className="bg-blue-600 border border-white text-white text-[10px] text-center font-bold flex justify-center items-center gap-1"><LuShield size={10} /> DEFENSA</div>}
                                    </div>
                                    <div className="absolute top-1 left-1 flex flex-col gap-1">
                                        {p1.buffs.damageBoost > 0 && <span className="bg-red-600 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5"><LuSwords size={8} /> ATQ+</span>}
                                        {p1.buffs.defenseBoost > 0 && <span className="bg-blue-600 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5"><LuShield size={8} /> DEF+</span>}
                                        {p1.buffs.shield > 0 && <span className="bg-cyan-500 border border-white text-black text-[8px] px-1 font-bold">ESCUDO</span>}
                                        {p1.buffs.reverseTechniqueUsed && <span className="bg-green-500 border border-white text-white text-[8px] px-1 font-bold">TÉC. INVERSA</span>}
                                        {p1.pasiva && (
                                            <span className="bg-purple-700 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5">
                                                {getPasivaIcon(p1.pasiva)} {p1.pasiva.nombre}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {gameState.showDamage?.target === "player1" && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                        <div className="text-4xl font-black text-red-500 campos-de-batalla2-bounce drop-shadow-[2px_2px_0_#fff]">-{gameState.showDamage.damage}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`flex flex-col items-center transition-transform ${p2.isAttacking ? "-translate-y-8" : ""}`}>
                            {gameState.bossTarget === 2 && (<div className="absolute -top-12 text-2xl animate-pulse">🎯</div>)}
                            <div className="relative border-4 border-blue-900 bg-black p-1 shadow-[0_0_15px_#1e3a8a]">
                                <div className={`w-24 h-32 bg-gray-900 overflow-hidden relative ${gameState.showDamage?.target === "player2" ? "campos-de-batalla2-damage-flash" : ""}`}>
                                    {p2.carta.imagen ? (
                                        <img src={p2.carta.imagen} alt={p2.carta.nombre} className="w-full h-full object-cover contrast-125" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">P2</div>}
                                    <div className="absolute bottom-0 inset-x-0 flex flex-col gap-1 p-1">
                                        {p2.isAttacking && <div className="bg-blue-600 border border-white text-white text-[10px] text-center font-bold">ATACANDO</div>}
                                        {p2.isDefending && <div className="bg-blue-600 border border-white text-white text-[10px] text-center font-bold flex justify-center items-center gap-1"><LuShield size={10} /> DEFENSA</div>}
                                    </div>
                                    <div className="absolute top-1 left-1 flex flex-col gap-1">
                                        {p2.buffs.damageBoost > 0 && <span className="bg-red-600 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5"><LuSwords size={8} /> ATQ+</span>}
                                        {p2.buffs.defenseBoost > 0 && <span className="bg-blue-600 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5"><LuShield size={8} /> DEF+</span>}
                                        {p2.buffs.shield > 0 && <span className="bg-cyan-500 border border-white text-black text-[8px] px-1 font-bold">ESCUDO</span>}
                                        {p2.buffs.reverseTechniqueUsed && <span className="bg-green-500 border border-white text-white text-[8px] px-1 font-bold">TÉC. INVERSA</span>}
                                        {p2.pasiva && (
                                            <span className="bg-purple-700 border border-white text-white text-[8px] px-1 font-bold flex items-center gap-0.5">
                                                {getPasivaIcon(p2.pasiva)} {p2.pasiva.nombre}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {gameState.showDamage?.target === "player2" && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                        <div className="text-4xl font-black text-red-500 campos-de-batalla2-bounce drop-shadow-[2px_2px_0_#fff]">-{gameState.showDamage.damage}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-72 bg-black border-t-4 border-orange-900">
                <div className="w-1/3 border-r-4 border-orange-900 p-4 flex flex-col">
                    <div className="text-orange-500 font-bold mb-3 border-b-2 border-orange-900 pb-2 text-sm">CONSOLE_LOG</div>
                    <div className="flex-1 overflow-y-auto text-xs space-y-1.5 text-gray-400 leading-relaxed pr-2">
                        {gameState.actionLog.slice(-6).map((msg, i) => (
                            <div key={i} className="border-l-2 border-gray-800 pl-2 py-0.5">{msg}</div>
                        ))}
                    </div>
                </div>
                {gameState.phase === "fighting" && gameState.turnPhase === "playerSelect" ? (
                    (!p1.moves.length && !p2.moves.length) ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 border-4 border-red-900 p-6 m-4 shadow-[8px_8px_0_#7f1d1d]">
                            <FiAlertTriangle className="text-red-500 text-5xl mb-3 animate-pulse" />
                            <span className="text-red-500 font-bold tracking-widest text-center text-sm">ERROR CRÍTICO: TÉCNICAS NO ENCONTRADAS PARA LAS CARTAS SELECCIONADAS</span>
                        </div>
                    ) : (
                        <div className="flex-1 flex bg-black">
                            <div className="w-1/2 border-r-4 border-gray-800 p-4 flex flex-col justify-between">
                                <div className="flex-shrink-0">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-orange-400 font-bold uppercase truncate text-sm">{p1.carta.nombre}</span>
                                        <span className="text-xs flex items-center gap-1.5"><LuDroplets className="text-green-500" size={14} /> HP {Math.ceil(p1.hp)}/{p1.maxHp}</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-900 border border-gray-700 mb-2">
                                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(p1.hp / p1.maxHp) * 100}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500 font-bold">ENERGÍA MALDITA</span>
                                        <span className="flex items-center gap-1.5"><LuZap className={`${p1.energy >= DOMAIN_EXPANSION_THRESHOLD ? 'text-red-500' : p1.energy >= REVERSE_TECHNIQUE_THRESHOLD ? 'text-green-400' : p1.energy >= BUFF_THRESHOLD ? 'text-amber-400' : 'text-cyan-400'}`} size={14} /> {Math.floor(p1.energy)}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-900 border border-gray-700 mb-3">
                                        <div className={`h-full transition-all duration-300 ${p1.energy >= DOMAIN_EXPANSION_THRESHOLD ? 'bg-red-500 animate-pulse' :
                                            p1.energy >= REVERSE_TECHNIQUE_THRESHOLD ? 'bg-green-500' :
                                                p1.energy >= BUFF_THRESHOLD ? 'bg-amber-500' : 'bg-blue-600'
                                            }`} style={{ width: `${(p1.energy / MAX_ENERGY) * 100}%` }} />
                                    </div>
                                    <div className="flex gap-3 text-xs mb-2">
                                        {p1.energy >= BUFF_THRESHOLD && !gameState.buffsUsedThisWave && (
                                            <span className="text-amber-400 font-bold">[BUFF DISPONIBLE]</span>
                                        )}
                                        {p1.energy >= REVERSE_TECHNIQUE_THRESHOLD && !p1.buffs.reverseTechniqueUsed && (
                                            <span className="text-green-400 font-bold">[TÉC. INVERSA]</span>
                                        )}
                                        {p1.energy >= DOMAIN_EXPANSION_THRESHOLD && !p1.buffs.domainExpansionUsed && (
                                            <span className="text-red-500 font-bold animate-pulse">[DOMINIO]</span>
                                        )}
                                    </div>
                                    {p1.pasiva && (
                                        <div className="flex items-center gap-1 text-[10px] mb-1">
                                            <span className="text-gray-500">Pasiva:</span>
                                            {getPasivaIcon(p1.pasiva)}
                                            <span className="text-purple-400">{p1.pasiva.descripcion}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto min-h-0 mt-2">
                                    <div className="grid grid-cols-1 gap-2">
                                        {p1.moves.map((move) => {
                                            const isSelected = gameState.selectedAttack1?.id === move.id;
                                            const isOnCooldown = (p1.cooldowns[move.id] || 0) > 0;
                                            console.log(`Movimiento ${move.nombre} (${move.id}): CD=${p1.cooldowns[move.id]}, isOnCooldown=${isOnCooldown}`);
                                            return (
                                                <button
                                                    key={move.id}
                                                    onClick={() => selectAttack(1, move)}
                                                    disabled={isOnCooldown || gameState.isAnimating}
                                                    className={`text-left px-3 py-2 border-2 text-sm font-bold transition-none ${isSelected ? "bg-white text-black border-white" :
                                                        isOnCooldown ? "bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed opacity-60" :
                                                            "bg-black text-white border-orange-800 hover:bg-orange-950 hover:border-orange-500"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="truncate mr-2 flex items-center gap-2">
                                                            {isOnCooldown && <FiLock className="text-gray-500" size={12} />}
                                                            {isSelected ? '▸ ' : ''}{move.nombre}
                                                        </span>
                                                        <span className="flex-shrink-0 text-xs">
                                                            {isOnCooldown ? (
                                                                <span className="text-gray-500 flex items-center gap-1">
                                                                    <FiLock size={10} /> {p1.cooldowns[move.id]} turno(s)
                                                                </span>
                                                            ) : `${move.danio} DMG`}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => selectDefense(1)}
                                            disabled={gameState.isAnimating}
                                            className={`text-left px-3 py-2 border-2 text-sm font-bold transition-none ${gameState.selectedDefense1 ? "bg-white text-black border-white" :
                                                "bg-black text-white border-blue-800 hover:bg-blue-950 hover:border-blue-500"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {gameState.selectedDefense1 ? '▸ ' : ''} <LuShield size={16} /> DEFENDER [GUARD]
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 p-4 flex flex-col justify-between">
                                <div className="flex-shrink-0">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-blue-400 font-bold uppercase truncate text-sm">{p2.carta.nombre}</span>
                                        <span className="text-xs flex items-center gap-1.5"><LuDroplets className="text-green-500" size={14} /> HP {Math.ceil(p2.hp)}/{p2.maxHp}</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-900 border border-gray-700 mb-2">
                                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(p2.hp / p2.maxHp) * 100}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500 font-bold">ENERGÍA MALDITA</span>
                                        <span className="flex items-center gap-1.5"><LuZap className={`${p2.energy >= DOMAIN_EXPANSION_THRESHOLD ? 'text-red-500' : p2.energy >= REVERSE_TECHNIQUE_THRESHOLD ? 'text-green-400' : p2.energy >= BUFF_THRESHOLD ? 'text-amber-400' : 'text-cyan-400'}`} size={14} /> {Math.floor(p2.energy)}%</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-900 border border-gray-700 mb-3">
                                        <div className={`h-full transition-all duration-300 ${p2.energy >= DOMAIN_EXPANSION_THRESHOLD ? 'bg-red-500 animate-pulse' :
                                            p2.energy >= REVERSE_TECHNIQUE_THRESHOLD ? 'bg-green-500' :
                                                p2.energy >= BUFF_THRESHOLD ? 'bg-amber-500' : 'bg-blue-600'
                                            }`} style={{ width: `${(p2.energy / MAX_ENERGY) * 100}%` }} />
                                    </div>
                                    <div className="flex gap-3 text-xs mb-2">
                                        {p2.energy >= BUFF_THRESHOLD && !gameState.buffsUsedThisWave && (
                                            <span className="text-amber-400 font-bold">[BUFF DISPONIBLE]</span>
                                        )}
                                        {p2.energy >= REVERSE_TECHNIQUE_THRESHOLD && !p2.buffs.reverseTechniqueUsed && (
                                            <span className="text-green-400 font-bold">[TÉC. INVERSA]</span>
                                        )}
                                        {p2.energy >= DOMAIN_EXPANSION_THRESHOLD && !p2.buffs.domainExpansionUsed && (
                                            <span className="text-red-500 font-bold animate-pulse">[DOMINIO]</span>
                                        )}
                                    </div>
                                    {p2.pasiva && (
                                        <div className="flex items-center gap-1 text-[10px] mb-1">
                                            <span className="text-gray-500">Pasiva:</span>
                                            {getPasivaIcon(p2.pasiva)}
                                            <span className="text-purple-400">{p2.pasiva.descripcion}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto min-h-0 mt-2">
                                    <div className="grid grid-cols-1 gap-2">
                                        {p2.moves.map((move) => {
                                            const isSelected = gameState.selectedAttack2?.id === move.id;
                                            const isOnCooldown = (p2.cooldowns[move.id] || 0) > 0;
                                            return (
                                                <button
                                                    key={move.id}
                                                    onClick={() => selectAttack(2, move)}
                                                    disabled={isOnCooldown || gameState.isAnimating}
                                                    className={`text-left px-3 py-2 border-2 text-sm font-bold transition-none ${isSelected ? "bg-white text-black border-white" :
                                                        isOnCooldown ? "bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed opacity-60" :
                                                            "bg-black text-white border-blue-800 hover:bg-blue-950 hover:border-blue-500"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="truncate mr-2 flex items-center gap-2">
                                                            {isOnCooldown && <FiLock className="text-gray-500" size={12} />}
                                                            {isSelected ? '▸ ' : ''}{move.nombre}
                                                        </span>
                                                        <span className="flex-shrink-0 text-xs">
                                                            {isOnCooldown ? (
                                                                <span className="text-gray-500 flex items-center gap-1">
                                                                    <FiLock size={10} /> {p2.cooldowns[move.id]} turno(s)
                                                                </span>
                                                            ) : `${move.danio} DMG`}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => selectDefense(2)}
                                            disabled={gameState.isAnimating}
                                            className={`text-left px-3 py-2 border-2 text-sm font-bold transition-none ${gameState.selectedDefense2 ? "bg-white text-black border-white" :
                                                "bg-black text-white border-blue-800 hover:bg-blue-950 hover:border-blue-500"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {gameState.selectedDefense2 ? '▸ ' : ''} <LuShield size={16} /> DEFENDER [GUARD]
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-black">
                        <div className="text-2xl font-black text-gray-600 animate-pulse tracking-[0.2em]">
                            ESPERANDO RESOLUCIÓN DE TURNO...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CamposDeBatalla2;