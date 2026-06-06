import { useState } from "react";
import type { Carta } from "./index";
import { Link } from "react-router";
import Cartadetalle from "./CartaProyecto";
import { LuSword } from "react-icons/lu";


type Props = {
    mazo: Carta[];
};

function SeleccionarCartas({ mazo }: Props) {

    const [cartaSeleccionada1, setCartaSeleccionada1] =
        useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] =
        useState<Carta | null>(null);
    const [listobatalla, setlistobatalla] = useState<boolean>(false);

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

return (
    <div className="min-h-screen w-full bg-[#0b0c10] text-white flex flex-col items-center py-8 px-4 relative overflow-hidden">
      {/* Luces de fondo ambientales de energía */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-950/20 rounded-full blur-[130px] pointer-events-none" />

{/* Encabezado de la Vista */}
    <div className="z-10 text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-md">
            Selecciona tus Guerreros
        </h1>
        <p className="text-gray-400 text-sm mt-1">
            Elige los personajes que se enfrentarán en el campo de batalla
        </p>
    </div>

{/* Contenedor principal estructurado en Grid responsivo */}
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
        className={`relative transform transition-all duration-300 rounded-2xl p-1
            ${estaSeleccionada 
            ? 'bg-gradient-to-b from-purple-500 to-blue-500 scale-105 shadow-[0_0_25px_rgba(147,51,234,0.5)]' 
            : 'bg-white/5 hover:bg-white/10 hover:scale-102 border border-white/10'
        }
    `}
>
{/* Contenedor interno con Backdrop Blur */}
<div className="bg-[#12131a]/95 backdrop-blur-md rounded-[14px] p-2 h-full">

{/* Al hacer clic en la zona de la carta, se ejecuta tu función nativa de selección */}
    <div 
        onClick={() => handleSeleccionarCarta(carta)} 
        className="cursor-pointer">

    <Cartadetalle
            carta={carta}
            seleccionada={estaSeleccionada}
            ocultarBotones={true}
        />
    </div>
</div>

{/* Indicador flotante superior si la carta está en el mazo activo */}
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
     {/* Sección del Botón utilizando el estado de la ruta para transferir los objetos de las cartas */}
<div className="z-20 mt-12 mb-4">
    <Link 
    to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
    state={{ carta1: cartaSeleccionada1, carta2: cartaSeleccionada2 }} >
    <button
        className={`px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 flex items-center gap-2
        ${!listobatalla ? 'opacity-40 cursor-not-allowed scale-100 shadow-none' : 'hover:scale-105 active:scale-95'}
    `}
    disabled={!listobatalla}>
        <LuSword size={28} className={listobatalla ? 'animate-bounce' : ''} />
    </button>
</Link>
</div>
    </div>
    );
}


export default SeleccionarCartas;

