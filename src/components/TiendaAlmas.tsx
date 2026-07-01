import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiHome, FiShoppingCart, FiStar, FiShield, FiHeart } from 'react-icons/fi';
import { LuSkull, LuSparkles, LuSwords, LuFlame, LuDroplets, LuEye } from 'react-icons/lu';

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

type Props = {
    almas: number;
    onComprarPasiva: (pasiva: PasivaTienda) => void;
    pasivasCompradas: string[];
};

function TiendaAlmas({ almas, onComprarPasiva, pasivasCompradas }: Props) {
    const [productoSeleccionado, setProductoSeleccionado] = useState<PasivaTienda | null>(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [compraExitosa, setCompraExitosa] = useState(false);
    const [mensajeCompra, setMensajeCompra] = useState('');
    const navigate = useNavigate();

    const handleComprar = (producto: PasivaTienda) => {
        if (almas >= producto.precio && !pasivasCompradas.includes(producto.id)) {
            setProductoSeleccionado(producto);
            setMostrarConfirmacion(true);
        }
    };

    const confirmarCompra = () => {
        if (productoSeleccionado) {
            onComprarPasiva(productoSeleccionado);
            setMostrarConfirmacion(false);
            setCompraExitosa(true);
            setMensajeCompra(`¡Has adquirido ${productoSeleccionado.nombre}!`);

            setTimeout(() => {
                setCompraExitosa(false);
                setProductoSeleccionado(null);
            }, 2000);
        }
    };

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
                                Tienda de Almas
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (window.confirm('¿Estás seguro de reiniciar tus almas a 0?')) {
                                    localStorage.setItem('almas', '0');
                                    localStorage.setItem('pasivasCompradas', '[]');
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
                                <span className="text-2xl font-black text-amber-400">{almas}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-black text-gray-400 uppercase tracking-[0.3em]">▸ Pasivas Permanentes ◂</h2>
                    <p className="text-gray-600 text-xs mt-2">Las pasivas compradas se equipan automáticamente en la selección de cartas</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {PASIVAS_TIENDA.map((pasiva) => {
                        const yaComprada = pasivasCompradas.includes(pasiva.id);
                        const puedeComprar = almas >= pasiva.precio && !yaComprada;

                        return (
                            <div key={pasiva.id} className={`relative group bg-[#0d0d12] border border-purple-900/20 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-300 ${yaComprada ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
                                {/* Gradiente decorativo - con pointer-events-none para no bloquear clics */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${pasiva.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

                                {yaComprada && (
                                    <div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase z-10">
                                        ✓ Adquirida
                                    </div>
                                )}

                                {/* Contenido relativo para estar sobre el gradiente */}
                                <div className="relative z-10">
                                    <div className="flex justify-center mb-4">
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pasiva.color} flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.2)]`}>
                                            {pasiva.icono}
                                        </div>
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleComprar(pasiva);
                                            }}
                                            disabled={!puedeComprar}
                                            className={`relative z-20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${yaComprada
                                                    ? 'bg-green-800 text-green-300 cursor-not-allowed'
                                                    : puedeComprar
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white cursor-pointer'
                                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                }`}
                                        >
                                            {yaComprada ? 'Adquirida' : (
                                                <>
                                                    <FiShoppingCart className="inline mr-1.5" size={14} />
                                                    Comprar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Modal de confirmación */}
            {mostrarConfirmacion && productoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setMostrarConfirmacion(false)}>
                    <div className="bg-[#0d0d12] border border-purple-700/50 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <LuSkull className="text-4xl text-purple-500 mx-auto mb-3" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">¿Confirmar Compra?</h2>
                        </div>
                        <div className="bg-black/50 border border-purple-900/20 rounded-xl p-4 mb-6">
                            <div className="flex justify-center mb-3">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${productoSeleccionado.color} flex items-center justify-center`}>
                                    {productoSeleccionado.icono}
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-white text-center mb-1">{productoSeleccionado.nombre}</h3>
                            <p className="text-xs text-gray-500 text-center mb-3">{productoSeleccionado.efecto}</p>
                            <div className="flex justify-between items-center border-t border-purple-900/20 pt-3">
                                <span className="text-xs text-gray-400">Costo:</span>
                                <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                                    <LuFlame className="text-amber-500" size={16} />{productoSeleccionado.precio} almas
                                </span>
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
        </div>
    );
}

export default TiendaAlmas;