import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Carta } from "./index.tsx"; // Asegúrate de que este tipo esté bien exportado en el index
import Cartadetalle from "./CartaProyecto"; 

function CampoDeBatalla() {
  // 1. Obtenemos los IDs de la ruta
    const { id1, id2 } = useParams<{ id1: string; id2: string }>();

  // 2. Estados para las cartas, errores y carga
    const [carta1, setCarta1] = useState<Carta | null>(null);
    const [carta2, setCarta2] = useState<Carta | null>(null);
    const [error, setError] = useState<string | null>(null);

  // 3. Función para buscar una carta por ID
const getCarta = async (id: string): Promise<Carta> => {
    const urlAPI = `https://educa-api.onrender.com/card/${id}`;
    const respuesta = await fetch(urlAPI, {
        method: "GET",
        headers: {
        usersecretpasskey: "Gabr686940RE",
        },
    });

    if (!respuesta.ok) {
        throw new Error(`Error al obtener la carta con id ${id}: ${respuesta.statusText}`);
    }

    const objeto = await respuesta.json();
    const carta = objeto.data?.[0];

    if (!carta) {
        throw new Error(`No se encontró la carta con id ${id}`);
    }

    return carta;
};

  // 4. useEffect para disparar las peticiones de forma simultánea al cargar
useEffect(() => {
const cargarCartas = async () => {
    if (!id1 || !id2) {
        setError("Faltan los parámetros de los jugadores en la URL.");
        return;
    }

    try {
        setError(null);

        // Hacemos ambas peticiones en paralelo para que sea más rápido
        const [datosCarta1, datosCarta2] = await Promise.all([
            getCarta(id1),
            getCarta(id2)
        ]);

        setCarta1(datosCarta1);
        setCarta2(datosCarta2);
        } catch (err: unknown) { 
  if (err instanceof Error) {
    setError(err.message);
} else {
    setError("Ocurrió un error al cargar las cartas.");
    }
    };
}
    cargarCartas();
  }, [id1, id2]); // Se vuelve a ejecutar si cambian los IDs en la URL

  // 5. Renderizado condicional de la interfaz
return (
    <div className='flex items-center justify-center flex-1 min-h-screen'>
    {error && <p className="text-red-500">{error}</p>}

    {!error && carta1 && carta2 && (
        <div className='flex items-center justify-center gap-12'>
          {/* Carta 1 */}
        <div className='relative z-10'>
            <Cartadetalle
                carta={carta1}
                seleccionada={true}
            />
        </div>

        <p className='number-font text-7xl font-bold text-black'>VS</p>
          {/* Carta 2 */}
            <div className='relative z-10'>
            <Cartadetalle
                carta={carta2}
                seleccionada={true}
            />
        </div>
        </div>
    )}
    </div>
);
}

export default CampoDeBatalla;