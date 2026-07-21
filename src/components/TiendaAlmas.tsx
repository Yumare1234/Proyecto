import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FiHome, FiShoppingCart, FiStar, FiShield, FiHeart, FiAward, FiCheckCircle, FiCircle, FiTrendingUp } from 'react-icons/fi';
import { LuSkull, LuSparkles, LuSwords, LuFlame, LuDroplets, LuEye, LuCrown, LuGhost, LuTrophy, LuGem } from 'react-icons/lu';
import type { Carta } from './index';

type PasivaTienda = {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    icono: React.ReactNode;
    color: string;
    efecto: string;
    valor: number;
    tipoIcono: string;
};

type CartaExclusiva = {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    icono: React.ReactNode;
    color: string;
    stats: string;
    categoria: string;
    imagen: string;
    ataque: number;
    defensa: number;
    hp: number;
};

type Logro = {
    id: string;
    nombre: string;
    descripcion: string;
    icono: React.ReactNode;
    recompensa: number;
    color: string;
    condicion: (datos: DatosLogros) => boolean;
};

type DatosLogros = {
    totalCartas: number;
    mazmorraFacilCompletada: boolean;
    mazmorraMedioCompletada: boolean;
    mazmorraDificilCompletada: boolean;
    pasivasCompradasCount: number;
};

const LOGROS: Logro[] = [
    {
        id: 'logro_coleccionista',
        nombre: 'COLECCIONISTA NOVATO',
        descripcion: 'Ten 5 cartas en tu mazo',
        icono: <LuGem className="text-4xl" />,
        recompensa: 200,
        color: 'from-blue-600 to-cyan-700',
        condicion: (d) => d.totalCartas >= 5
    },
    {
        id: 'logro_mazmorra_facil',
        nombre: 'SUPERVIVIENTE DE GRADO 4',
        descripcion: 'Completa la mazmorra en modo Fácil',
        icono: <FiShield className="text-4xl" />,
        recompensa: 150,
        color: 'from-green-600 to-emerald-700',
        condicion: (d) => d.mazmorraFacilCompletada
    },
    {
        id: 'logro_mazmorra_medio',
        nombre: 'GUERRERO DE GRADO 1',
        descripcion: 'Completa la mazmorra en modo Medio',
        icono: <LuSwords className="text-4xl" />,
        recompensa: 300,
        color: 'from-yellow-600 to-orange-700',
        condicion: (d) => d.mazmorraMedioCompletada
    },
    {
        id: 'logro_mazmorra_dificil',
        nombre: 'LEYENDA DE GRADO ESPECIAL',
        descripcion: 'Completa la mazmorra en modo Difícil',
        icono: <LuCrown className="text-4xl" />,
        recompensa: 600,
        color: 'from-red-600 to-purple-700',
        condicion: (d) => d.mazmorraDificilCompletada
    },
    {
        id: 'logro_comprador',
        nombre: 'INVERSOR DE ALMAS',
        descripcion: 'Compra una pasiva en la tienda',
        icono: <LuSparkles className="text-4xl" />,
        recompensa: 100,
        color: 'from-amber-500 to-yellow-600',
        condicion: (d) => d.pasivasCompradasCount >= 1
    },
    {
        id: 'logro_coleccionista_maestro',
        nombre: 'COLECCIONISTA MAESTRO',
        descripcion: 'Ten 15 cartas en tu mazo',
        icono: <LuTrophy className="text-4xl" />,
        recompensa: 500,
        color: 'from-purple-600 to-pink-700',
        condicion: (d) => d.totalCartas >= 15
    },
    {
        id: 'logro_inversor_experto',
        nombre: 'INVERSOR EXPERTO',
        descripcion: 'Compra 3 pasivas en la tienda',
        icono: <FiAward className="text-4xl" />,
        recompensa: 350,
        color: 'from-teal-600 to-cyan-700',
        condicion: (d) => d.pasivasCompradasCount >= 3
    },
    {
        id: 'logro_todas_mazmorras',
        nombre: 'DOMINADOR DE MAZMORRAS',
        descripcion: 'Completa la mazmorra en todas las dificultades',
        icono: <LuFlame className="text-4xl" />,
        recompensa: 800,
        color: 'from-red-600 via-purple-600 to-blue-700',
        condicion: (d) => d.mazmorraFacilCompletada && d.mazmorraMedioCompletada && d.mazmorraDificilCompletada
    },
    {
        id: 'logro_coleccionista_elite',
        nombre: 'COLECCIONISTA DE ÉLITE',
        descripcion: 'Ten 25 cartas en tu mazo',
        icono: <LuCrown className="text-4xl" />,
        recompensa: 1000,
        color: 'from-amber-500 via-yellow-500 to-amber-600',
        condicion: (d) => d.totalCartas >= 25
    },
    {
        id: 'logro_comprador_compulsivo',
        nombre: 'COMPRADOR COMPULSIVO',
        descripcion: 'Compra 5 pasivas en la tienda',
        icono: <LuSkull className="text-4xl" />,
        recompensa: 600,
        color: 'from-red-700 to-orange-800',
        condicion: (d) => d.pasivasCompradasCount >= 5
    },
];

const PASIVAS_TIENDA: PasivaTienda[] = [
    {
        id: 'pasiva_critico',
        nombre: 'GOLPE CRÍTICO MALDITO',
        descripcion: 'Aumenta la probabilidad de asestar golpes críticos devastadores',
        precio: 500,
        icono: <LuSwords className="text-4xl" />,
        color: 'from-yellow-600 to-red-700',
        efecto: '+15% probabilidad de crítico',
        valor: 0.15,
        tipoIcono: 'ataque'
    },
    {
        id: 'pasiva_regeneracion',
        nombre: 'REGENERACIÓN MALDITA',
        descripcion: 'Tu cuerpo se regenera al final de cada turno de batalla',
        precio: 450,
        icono: <LuDroplets className="text-4xl" />,
        color: 'from-pink-600 to-rose-700',
        efecto: 'Regenera 5% HP por turno',
        valor: 0.05,
        tipoIcono: 'vida'
    },
    {
        id: 'pasiva_robo_vida',
        nombre: 'ROBO DE VIDA',
        descripcion: 'Absorbe la energía vital del enemigo al atacar',
        precio: 550,
        icono: <FiHeart className="text-4xl" />,
        color: 'from-red-700 to-purple-800',
        efecto: 'Cura 10% del daño infligido',
        valor: 0.10,
        tipoIcono: 'vida'
    },
    {
        id: 'pasiva_reflejo',
        nombre: 'REFLEJO MALDITO',
        descripcion: 'Devuelve parte del daño recibido al enemigo',
        precio: 400,
        icono: <FiShield className="text-4xl" />,
        color: 'from-cyan-600 to-blue-700',
        efecto: 'Refleja 15% del daño recibido',
        valor: 0.15,
        tipoIcono: 'defensa'
    },
    {
        id: 'pasiva_primer_golpe',
        nombre: 'GOLPE INICIAL',
        descripcion: 'Tu primer ataque en cada oleada causa daño adicional',
        precio: 350,
        icono: <LuFlame className="text-4xl" />,
        color: 'from-orange-600 to-red-700',
        efecto: '+30% daño en el primer ataque',
        valor: 0.30,
        tipoIcono: 'ataque'
    },
    {
        id: 'pasiva_vision',
        nombre: 'VISIÓN MALDITA',
        descripcion: 'Puedes predecir los movimientos enemigos',
        precio: 300,
        icono: <LuEye className="text-4xl" />,
        color: 'from-indigo-600 to-purple-700',
        efecto: '10% de esquivar ataques',
        valor: 0.10,
        tipoIcono: 'velocidad'
    },
];

const CARTAS_EXCLUSIVAS: CartaExclusiva[] = [
    {
        id: 'carta_Ignacio',
        nombre: 'PROFESOR IGNACIO',
        descripcion: 'Uno de los profesores mas poderosos del Curso Basico, compitiendo con el Profe Edwin',
        precio: 5000,
        icono: <LuCrown className="text-5xl" />,
        color: 'from-red-900 via-red-800 to-black',
        stats: 'ATQ: 8345 | DEF: 7650 | HP: 15000',
        categoria: 'Hechicero Especial',
        imagen: '/imagenes/Exclusivas/ProfeIgnacio.png',
        ataque: 8345,
        defensa: 7650,
        hp: 15000
    },
    {
        id: 'carta_Brian',
        nombre: 'PROFESOR BRIAN',
        descripcion: 'EL Profesor mas Poderoso del Curso Avanzado, fue encerrado en la prision de su casa debido a un brujo y luego fue liberado',
        precio: 5000,
        icono: <LuEye className="text-5xl" />,
        color: 'from-blue-900 via-indigo-800 to-purple-900',
        stats: 'ATQ: 7500 | DEF: 8400 | HP: 14000',
        categoria: 'Hechicero Especial',
        imagen: '/imagenes/Exclusivas/ProfeBrian.png',
        ataque: 7500,
        defensa: 8400,
        hp: 14000
    },
    {
        id: 'carta_Edwin',
        nombre: 'PROFESOR EDWIN',
        descripcion: 'Uno de los profesores mas poderosos del Curso Basico, compitiendo con el Profe Ignacio y el mas irresponsable',
        precio: 5000,
        icono: <LuGhost className="text-5xl" />,
        color: 'from-green-900 via-emerald-800 to-teal-900',
        stats: 'ATQ: 8350 | DEF: 9105 | HP: 13500',
        categoria: 'Hechicero Especial',
        imagen: '/imagenes/Exclusivas/ProfeEdwin.jpeg',
        ataque: 8350,
        defensa: 9105,
        hp: 13500
    },
];

type Props = {
    almas: number;
    cartas: Carta[];
    onComprarPasiva: (pasiva: PasivaTienda) => void;
    onComprarCarta: (carta: CartaExclusiva) => void;
    onReclamarLogro: (logroId: string, recompensa: number) => void;
    pasivasCompradas: string[];
    cartasCompradas: string[];
    logrosCompletados: string[];
    datosLogros: DatosLogros;
};

function TiendaAlmas({ almas, cartas, onComprarPasiva, onComprarCarta, onReclamarLogro, pasivasCompradas, cartasCompradas, logrosCompletados, datosLogros }: Props) {
    const [productoSeleccionado, setProductoSeleccionado] = useState<PasivaTienda | CartaExclusiva | null>(null);
    const [tipoProducto, setTipoProducto] = useState<'pasiva' | 'carta'>('pasiva');
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [compraExitosa, setCompraExitosa] = useState(false);
    const [mensajeCompra, setMensajeCompra] = useState('');
    const [seccionActiva, setSeccionActiva] = useState<'tienda' | 'logros' | 'rankings'>('tienda');
    const [mostrarRecompensa, setMostrarRecompensa] = useState(false);
    const [recompensaMensaje, setRecompensaMensaje] = useState('');
    const navigate = useNavigate();

    // Cálculo del ranking
    const rankingCartas = useMemo(() => {
        return [...cartas]
            .map(carta => ({
                ...carta,
                poderTotal: (carta.ataque || 0) + (carta.defensa || 0) + (carta.hp || 0)
            }))
            .sort((a, b) => b.poderTotal - a.poderTotal);
    }, [cartas]);

    const handleComprarPasiva = (producto: PasivaTienda) => {
        if (almas >= producto.precio && !pasivasCompradas.includes(producto.id)) {
            setProductoSeleccionado(producto);
            setTipoProducto('pasiva');
            setMostrarConfirmacion(true);
        }
    };

    const handleComprarCarta = (producto: CartaExclusiva) => {
        if (almas >= producto.precio && !cartasCompradas.includes(producto.id)) {
            setProductoSeleccionado(producto);
            setTipoProducto('carta');
            setMostrarConfirmacion(true);
        }
    };

    const confirmarCompra = () => {
        if (productoSeleccionado) {
            if (tipoProducto === 'pasiva') {
                onComprarPasiva(productoSeleccionado as PasivaTienda);
                setMensajeCompra(`¡Has adquirido ${(productoSeleccionado as PasivaTienda).nombre}!`);
            } else {
                onComprarCarta(productoSeleccionado as CartaExclusiva);
                setMensajeCompra(`¡Has invocado a ${(productoSeleccionado as CartaExclusiva).nombre}!`);
            }
            setMostrarConfirmacion(false);
            setCompraExitosa(true);

            setTimeout(() => {
                setCompraExitosa(false);
                setProductoSeleccionado(null);
            }, 2000);
        }
    };

    const handleReclamarLogro = (logro: Logro) => {
        if (!logrosCompletados.includes(logro.id) && logro.condicion(datosLogros)) {
            onReclamarLogro(logro.id, logro.recompensa);
            setRecompensaMensaje(`¡Logro desbloqueado! +${logro.recompensa} almas`);
            setMostrarRecompensa(true);
            setTimeout(() => setMostrarRecompensa(false), 2500);
        }
    };

    const getPrecioColor = (precio: number) => {
        if (almas >= precio) return 'text-amber-400';
        return 'text-red-400';
    };

    const logrosDisponibles = LOGROS.filter(l => !logrosCompletados.includes(l.id) && l.condicion(datosLogros)).length;

    return (
        <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
            {/* Fondos decorativos */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-950/15 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-950/10 rounded-full blur-[130px] pointer-events-none" />

            {/* Header */}
            <header className="z-30 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-purple-900/30 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="group flex items-center gap-2 px-4 py-2 bg-black/60 border border-purple-900/30 hover:border-red-700/50 hover:bg-red-950/30 rounded-xl backdrop-blur-sm transition-all duration-300 text-gray-400 hover:text-red-400 font-bold text-xs uppercase tracking-widest">
                            <FiHome className="text-lg" />
                            <span>Volver</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <LuSkull className="text-2xl text-purple-500" />
                            <h1 className="text-2xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-purple-400">
                                {seccionActiva === 'logros' ? 'Salón de la Fama' : seccionActiva === 'rankings' ? 'Clasificación de Guerreros' : 'Tienda de Almas'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Botón de Rankings */}
                        <button
                            onClick={() => setSeccionActiva(seccionActiva === 'rankings' ? 'tienda' : 'rankings')}
                            className={`relative px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                                seccionActiva === 'rankings'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                    : 'bg-black/60 border border-blue-700/30 text-blue-400 hover:border-blue-500/50 hover:bg-blue-950/30'
                            }`}
                        >
                            <FiTrendingUp className="text-lg" />
                            <span>Rankings</span>
                        </button>

                        {/* Botón de Logros */}
                        <button
                            onClick={() => setSeccionActiva(seccionActiva === 'logros' ? 'tienda' : 'logros')}
                            className={`relative px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                                seccionActiva === 'logros'
                                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black shadow-[0_0_20px_rgba(255,180,0,0.3)]'
                                    : 'bg-black/60 border border-amber-700/30 text-amber-400 hover:border-amber-500/50 hover:bg-amber-950/30'
                            }`}
                        >
                            <LuTrophy className="text-lg" />
                            <span>Logros</span>
                            {logrosDisponibles > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                    {logrosDisponibles}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm('¿Estás seguro de reiniciar tus almas a 0?')) {
                                    localStorage.setItem('almas', '0');
                                    localStorage.setItem('pasivasCompradas', '[]');
                                    localStorage.setItem('cartasCompradas', '[]');
                                    localStorage.setItem('logrosCompletados', '[]');
                                    localStorage.setItem('mazmorraFacilCompletada', 'false');
                                    localStorage.setItem('mazmorraMedioCompletada', 'false');
                                    localStorage.setItem('mazmorraDificilCompletada', 'false');
                                    window.location.reload();
                                }
                            }}
                            className="px-3 py-1.5 bg-red-950/30 border border-red-700/30 hover:bg-red-900/40 text-red-400 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all"
                            title="Reiniciar almas"
                        >
                            🔄 Reiniciar
                        </button>

                        <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 border border-amber-700/30 rounded-xl backdrop-blur-sm">
                            <LuFlame className="text-2xl text-amber-500 animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-xs text-amber-400/60 uppercase tracking-widest font-bold">Almas</span>
                                <span className="text-2xl font-black text-amber-400">{almas.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal - Tienda, Logros o Rankings */}
            {seccionActiva === 'tienda' ? (
                <main className="z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {/* SECCIÓN: CARTAS EXCLUSIVAS */}
                    <div className="text-center mb-6">
                        <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest mb-3">
                            ⭐ Exclusivas ⭐
                        </div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase tracking-[0.2em]">
                            Cartas Legendarias
                        </h2>
                        <p className="text-gray-500 text-xs mt-2">Las cartas más poderosas del universo Jujutsu Kaisen</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                        {CARTAS_EXCLUSIVAS.map((carta) => {
                            const yaComprada = cartasCompradas.includes(carta.id);
                            const puedeComprar = almas >= carta.precio && !yaComprada;

                            return (
                                <div key={carta.id} className={`relative group bg-[#0d0d12] border-2 rounded-2xl p-5 transition-all duration-500 ${yaComprada
                                        ? 'border-green-900/50 opacity-60'
                                        : puedeComprar
                                            ? 'border-amber-700/50 hover:border-amber-500/80 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,180,0,0.3)]'
                                            : 'border-gray-700/50 opacity-70'
                                    }`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${carta.color} opacity-5 rounded-2xl group-hover:opacity-15 transition-opacity duration-500 pointer-events-none`} />

                                    {!yaComprada && puedeComprar && (
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-500 pointer-events-none" />
                                    )}

                                    {yaComprada && (
                                        <div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase z-10 shadow-lg">
                                            ✓ Invocada
                                        </div>
                                    )}

                                    {!yaComprada && puedeComprar && (
                                        <div className="absolute top-3 left-3 bg-amber-600 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase z-10 animate-pulse shadow-lg">
                                            🔥 Limitada
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex justify-center mb-4">
                                            <div className={`relative w-40 h-56 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,180,0,0.3)] group-hover:shadow-[0_0_50px_rgba(255,180,0,0.5)] transition-all duration-500 border-2 border-white/10 group-hover:border-amber-400/50`}>
                                                <img
                                                    src={carta.imagen}
                                                    alt={carta.nombre}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            parent.classList.add('flex', 'items-center', 'justify-center');
                                                        }
                                                    }}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t ${carta.color} opacity-30 group-hover:opacity-20 transition-opacity duration-500`} />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-2 px-3">
                                                    <p className="text-xs font-black text-white text-center tracking-wider">{carta.nombre}</p>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>
                                        </div>

                                        <div className="text-center mb-2">
                                            <span className="text-[9px] text-amber-500/60 uppercase tracking-[0.2em] font-bold">{carta.categoria}</span>
                                        </div>

                                        <h3 className="text-lg font-black text-white text-center mb-2 tracking-wider">{carta.nombre}</h3>
                                        <p className="text-xs text-gray-400 text-center mb-4 leading-relaxed">{carta.descripcion}</p>

                                        <div className="bg-black/40 border border-amber-900/30 rounded-xl p-3 mb-4">
                                            <div className="text-center text-sm font-bold text-amber-400 mb-2 tracking-wider">{carta.stats}</div>
                                            <div className="flex justify-center gap-4 text-[10px]">
                                                <span className="text-red-400">⚔️ {carta.ataque.toLocaleString()}</span>
                                                <span className="text-blue-400">🛡️ {carta.defensa.toLocaleString()}</span>
                                                <span className="text-green-400">❤️ {carta.hp.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <LuFlame className={`${getPrecioColor(carta.precio)}`} size={20} />
                                                <span className={`text-xl font-black ${getPrecioColor(carta.precio)}`}>{carta.precio.toLocaleString()}</span>
                                                <span className="text-xs text-gray-600">almas</span>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleComprarCarta(carta); }}
                                                disabled={!puedeComprar}
                                                className={`relative z-20 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${yaComprada
                                                        ? 'bg-green-800 text-green-300 cursor-not-allowed'
                                                        : puedeComprar
                                                            ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(255,180,0,0.3)] hover:shadow-[0_0_30px_rgba(255,180,0,0.5)]'
                                                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                {yaComprada ? 'Invocada' : (<><FiShoppingCart className="inline mr-1.5" size={14} /> Invocar</>)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Separador */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-800/50 to-transparent" />
                        <LuSkull className="text-purple-500 text-xl" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-800/50 to-transparent" />
                    </div>

                    {/* SECCIÓN: PASIVAS */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-black text-gray-400 uppercase tracking-[0.3em]">▸ Pasivas Permanentes ◂</h2>
                        <p className="text-gray-600 text-xs mt-2">Las pasivas compradas se añaden a la ruleta de selección</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {PASIVAS_TIENDA.map((pasiva) => {
                            const yaComprada = pasivasCompradas.includes(pasiva.id);
                            const puedeComprar = almas >= pasiva.precio && !yaComprada;

                            return (
                                <div key={pasiva.id} className={`relative group bg-[#0d0d12] border border-purple-900/20 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-300 ${yaComprada ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${pasiva.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

                                    {yaComprada && (
                                        <div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase z-10">✓ Adquirida</div>
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex justify-center mb-4">
                                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pasiva.color} flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.2)]`}>{pasiva.icono}</div>
                                        </div>
                                        <h3 className="text-sm font-bold text-white text-center mb-2">{pasiva.nombre}</h3>
                                        <p className="text-xs text-gray-500 text-center mb-3">{pasiva.descripcion}</p>
                                        <div className="bg-black/30 border border-purple-900/20 rounded-lg p-2.5 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FiStar className="text-amber-500 text-sm" />
                                                <span className="text-xs text-amber-400 font-bold">{pasiva.efecto}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <LuFlame className="text-amber-500" size={16} />
                                                <span className="text-lg font-black text-amber-400">{pasiva.precio}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleComprarPasiva(pasiva); }}
                                                disabled={!puedeComprar}
                                                className={`relative z-20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${yaComprada
                                                        ? 'bg-green-800 text-green-300 cursor-not-allowed'
                                                        : puedeComprar
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white cursor-pointer'
                                                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                    }`}
                                            >
                                                {yaComprada ? 'Adquirida' : (<><FiShoppingCart className="inline mr-1.5" size={14} /> Comprar</>)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            ) : seccionActiva === 'logros' ? (
                /* SECCIÓN DE LOGROS */
                <main className="z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest mb-3">
                            🏆 Sistema de Logros
                        </div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase tracking-[0.2em]">
                            Salón de la Fama
                        </h2>
                        <p className="text-gray-500 text-xs mt-2">Completa desafíos para ganar almas adicionales</p>
                    </div>

                    <div className="space-y-4">
                        {LOGROS.map((logro) => {
                            const completado = logrosCompletados.includes(logro.id);
                            const disponible = !completado && logro.condicion(datosLogros);
                            const bloqueado = !completado && !logro.condicion(datosLogros);

                            return (
                                <div key={logro.id} className={`relative bg-[#0d0d12] border rounded-2xl p-5 transition-all duration-300 ${completado ? 'border-green-700/50 opacity-80' :
                                        disponible ? 'border-amber-700/50 hover:border-amber-500/80 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(255,180,0,0.2)]' :
                                            'border-gray-800/50 opacity-60'
                                    }`}>
                                    <div className="flex items-center gap-5">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${logro.color} flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.2)] flex-shrink-0 ${bloqueado ? 'grayscale opacity-50' : ''}`}>
                                            {logro.icono}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {completado ? <FiCheckCircle className="text-green-500 text-lg" /> :
                                                    disponible ? <FiCircle className="text-amber-500 text-lg animate-pulse" /> :
                                                        <FiCircle className="text-gray-600 text-lg" />}
                                                <h3 className={`text-sm font-black uppercase tracking-wider ${completado ? 'text-green-400' : disponible ? 'text-amber-400' : 'text-gray-500'}`}>
                                                    {logro.nombre}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{logro.descripcion}</p>
                                            <div className="flex items-center gap-2">
                                                <LuFlame className="text-amber-500" size={14} />
                                                <span className="text-sm font-bold text-amber-400">+{logro.recompensa} almas</span>
                                            </div>
                                        </div>

                                        {disponible && (
                                            <button onClick={() => handleReclamarLogro(logro)} className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,180,0,0.3)] hover:shadow-[0_0_25px_rgba(255,180,0,0.5)] hover:scale-105 flex-shrink-0">
                                                <FiAward className="inline mr-1.5" size={14} /> Reclamar
                                            </button>
                                        )}

                                        {completado && (
                                            <span className="text-xs font-bold text-green-400 bg-green-950/30 border border-green-700/30 px-3 py-1.5 rounded-lg flex-shrink-0">✓ Completado</span>
                                        )}

                                        {bloqueado && (
                                            <span className="text-xs text-gray-600 bg-gray-900/30 border border-gray-800/30 px-3 py-1.5 rounded-lg flex-shrink-0">🔒 Bloqueado</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Estadísticas */}
                    <div className="mt-8 bg-[#0d0d12] border border-purple-900/20 rounded-2xl p-5">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-4">Tu Progreso</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-400">{datosLogros.totalCartas}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cartas en Mazo</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-400">{datosLogros.pasivasCompradasCount}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pasivas Compradas</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-400">{logrosCompletados.length}/{LOGROS.length}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Logros Completados</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-400">
                                    {[datosLogros.mazmorraFacilCompletada, datosLogros.mazmorraMedioCompletada, datosLogros.mazmorraDificilCompletada].filter(Boolean).length}/3
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mazmorras Completadas</p>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                /* 🆕 SECCIÓN DE RANKINGS */
                <main className="z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest mb-3">
                            📊 Rankings
                        </div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-500 uppercase tracking-[0.2em]">
                            Cartas Más Poderosas
                        </h2>
                        <p className="text-gray-500 text-xs mt-2">Clasificación basada en el poder total (ATQ + DEF + HP)</p>
                    </div>

                    {rankingCartas.length === 0 ? (
                        <div className="text-center py-20 bg-[#0d0d12] border border-purple-900/20 rounded-2xl">
                            <LuSkull className="text-5xl text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">No hay cartas en tu mazo para mostrar el ranking</p>
                        </div>
                    ) : (
                        <>
                            {/* Podio Top 3 */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {rankingCartas.slice(0, 3).map((carta, index) => {
                                    const medallas = ['🥇', '🥈', '🥉'];
                                    const coloresBorde = [
                                        'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]',
                                        'border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.3)]',
                                        'border-amber-700 shadow-[0_0_20px_rgba(180,83,9,0.3)]'
                                    ];
                                    const coloresFondo = [
                                        'from-yellow-600 to-amber-700',
                                        'from-gray-500 to-slate-600',
                                        'from-amber-700 to-orange-800'
                                    ];

                                    return (
                                        <div key={carta.id} className={`relative bg-[#0d0d12] border-2 ${coloresBorde[index]} rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105`}>
                                            <div className="text-4xl mb-2">{medallas[index]}</div>
                                            <div className="w-20 h-28 mx-auto mb-3 rounded-xl overflow-hidden border-2 border-white/10">
                                                {carta.imagen ? (
                                                    <img src={carta.imagen} alt={carta.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${coloresFondo[index]} flex items-center justify-center`}>
                                                        <LuSwords className="text-2xl text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-black text-white mb-1 truncate">{carta.nombre}</h3>
                                            <p className="text-xs text-gray-400 mb-2">{carta.categoria || 'Sin categoría'}</p>
                                            <div className={`inline-block bg-gradient-to-r ${coloresFondo[index]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                                ⚡ {carta.poderTotal.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Lista del resto */}
                            <div className="bg-[#0d0d12] border border-purple-900/20 rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-black/40 border-b border-purple-900/20 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="col-span-2 text-center">#</div>
                                    <div className="col-span-4">Carta</div>
                                    <div className="col-span-2 text-center">ATQ</div>
                                    <div className="col-span-2 text-center">DEF</div>
                                    <div className="col-span-2 text-center">Poder</div>
                                </div>
                                {rankingCartas.slice(3).map((carta, index) => (
                                    <div key={carta.id} className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-purple-900/10 hover:bg-white/5 transition-colors items-center">
                                        <div className="col-span-2 text-center text-sm font-bold text-gray-400">#{index + 4}</div>
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                {carta.imagen ? (
                                                    <img src={carta.imagen} alt={carta.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <LuSwords className="text-gray-500" size={14} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white truncate">{carta.nombre}</p>
                                                <p className="text-[9px] text-gray-500">{carta.categoria || 'Sin categoría'}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center text-xs text-red-400 font-bold">{carta.ataque?.toLocaleString() || 0}</div>
                                        <div className="col-span-2 text-center text-xs text-blue-400 font-bold">{carta.defensa?.toLocaleString() || 0}</div>
                                        <div className="col-span-2 text-center text-xs text-amber-400 font-bold">{carta.poderTotal.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            )}

            {/* Modal de confirmación */}
            {mostrarConfirmacion && productoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setMostrarConfirmacion(false)}>
                    <div className={`rounded-2xl p-6 w-full max-w-md border-2 ${tipoProducto === 'carta' ? 'bg-[#0d0d12] border-amber-700/50 shadow-[0_0_40px_rgba(255,180,0,0.2)]' : 'bg-[#0d0d12] border-purple-700/50'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            {tipoProducto === 'carta' ? <LuCrown className="text-5xl text-amber-500 mx-auto mb-3" /> : <LuSkull className="text-4xl text-purple-500 mx-auto mb-3" />}
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">{tipoProducto === 'carta' ? '¿Invocar Carta?' : '¿Confirmar Compra?'}</h2>
                        </div>
                        <div className="bg-black/50 border border-purple-900/20 rounded-xl p-4 mb-6">
                            <div className="flex justify-center mb-3">
                                {'color' in productoSeleccionado && (
                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${(productoSeleccionado as PasivaTienda | CartaExclusiva).color} flex items-center justify-center`}>
                                        {productoSeleccionado.icono}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-white text-center mb-1">{productoSeleccionado.nombre}</h3>
                            <p className="text-xs text-gray-500 text-center mb-3">{'efecto' in productoSeleccionado ? productoSeleccionado.efecto : (productoSeleccionado as CartaExclusiva).stats}</p>
                            <div className="flex justify-between items-center border-t border-purple-900/20 pt-3">
                                <span className="text-xs text-gray-400">Costo:</span>
                                <span className="text-lg font-black text-amber-400 flex items-center gap-1"><LuFlame className="text-amber-500" size={16} />{productoSeleccionado.precio.toLocaleString()} almas</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setMostrarConfirmacion(false)} className="flex-1 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm font-bold text-gray-400 uppercase">Cancelar</button>
                            <button onClick={confirmarCompra} className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 rounded-lg text-sm font-bold text-white uppercase">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificación de compra exitosa */}
            {compraExitosa && (
                <div className="fixed top-24 right-6 z-50 animate-bounce">
                    <div className="bg-black border border-green-700/50 rounded-xl px-5 py-3 shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center gap-3">
                        <LuSparkles className="text-green-500 text-xl" />
                        <p className="text-sm font-bold text-green-400">{mensajeCompra}</p>
                    </div>
                </div>
            )}

            {/* Notificación de logro reclamado */}
            {mostrarRecompensa && (
                <div className="fixed top-24 right-6 z-50 animate-bounce">
                    <div className="bg-black border border-amber-700/50 rounded-xl px-5 py-3 shadow-[0_0_30px_rgba(255,180,0,0.2)] flex items-center gap-3">
                        <LuTrophy className="text-amber-500 text-xl" />
                        <p className="text-sm font-bold text-amber-400">{recompensaMensaje}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TiendaAlmas;