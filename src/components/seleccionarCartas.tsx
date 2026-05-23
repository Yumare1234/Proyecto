import { useState } from "react";
import type { Carta } from "./index";
import { Link } from "react-router";

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

        
            mazo &&
            mazo.map((carta) => {
                return (
                    <div
                        onClick={() => {
                            handleSeleccionarCarta(carta);
                    }}
                        key={carta.id} >
                    <Carta
                            carta={carta}
                            ancho={260}
                            alto={360}
                            seleccionada={
                                cartaSeleccionada1?.id === carta.id ||
                                cartaSeleccionada2?.id === carta.id
                            }
                        selectionMode={true}/>
                    </div>
                );
            })
    )

}

<Link 
    to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
>
    <CustomBtn
        extraStyle='rounded-full'
        accion={() => {}}
        disabled={!listobatalla}
    >
        <TbSword size={28} />
    </CustomBtn>
</Link>

