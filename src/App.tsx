import { Routes, Route } from 'react-router'; 
import { useState } from 'react';
import Home from './components/home';
import { MAZO_JUJUTSU } from './components/cartas';
import { FormularioCrearCarta } from './components/formularioCrearcarta';
import { toApiCardMapper, toCardApiMapper, type Carta, type IApiCard } from './components';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_EDUCA_API_URL

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] =useState(false);
  const eliminarCarta= (id: number) => {
  const nuevasCartas = cartas.filter(carta => carta.id !== id);
  setCartas(nuevasCartas); 
}; 

  const onAñadirCarta = (nuevaCarta: any) => {
    setCartas((prevCartas) => [...prevCartas, nuevaCarta]);
    console.log("Nueva carta añadida al estado:", nuevaCarta);
  }

const fetchCard = async () => {
        setLoading(true);
        try {
            console.log("Hola Mundo, trayendo cartas de la Api", API_URL 
            );
            const response = await fetch(`${API_URL}card`, {
              headers: {
                usersecretpasskey: "Gabr686940RE"
              }
            }
          );
            const data = await response.json() as {data: IApiCard[]};
            console.log(data);
          const cartasFromApi: IApiCard[] = data.data;
            const cartasMapped: Carta[] = cartasFromApi.map(toCardApiMapper);
          console.log(cartasMapped);
          setCartas(cartasMapped);
            } catch (error) {
            console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(( ) => {
            fetchCard();
        }, []);

        const addCarta = async (carta: Carta) => {
    try {
      await fetch(`${API_URL}card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Gabr686940RE"
        },
        body: JSON.stringify(toApiCardMapper(carta)),
      });
      fetchCard();
    } catch (e) {
      console.error("Error adding task", e);
    }
  }

  const agregarCarta = (carta: Carta) => {
  }
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home cartas={cartas} onEliminar={eliminarCarta} onAñadirCarta={onAñadirCarta} />} 
      />
      <Route 
        path="/crear-carta" 
        element={<FormularioCrearCarta onAñadirCarta={addCarta} />} 
      />
    </Routes>
  );
}

export default App;