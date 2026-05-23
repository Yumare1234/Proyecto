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
            <div className="flex flex-col items-center gap-6 p-4">
        {
            mazo &&
            mazo.map((carta) => {
                return (
                    <div
                        onClick={() => {
                            handleSeleccionarCarta(carta);
                    }}
                        key={carta.id} >
                    <Cartadetalle
                            carta={carta}
                            seleccionada={
                                cartaSeleccionada1?.id === carta.id ||
                                cartaSeleccionada2?.id === carta.id
                            }
                        />
                    </div>
                );
            })
        }
            <Link 
            to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
        >
            <button
                className="px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all active:scale-95 uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {}}
                disabled={!listobatalla}
            >
                <LuSword size={28} />
            </button>
</Link>
            </div>
    )

    
}


export default SeleccionarCartas;

