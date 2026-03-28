import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import Home from './components/home';
import { FormularioCrearCarta } from './components/formularioCrearcarta';
import { toCardApiMapper, toApiCardMapper, type Carta, type IApiCard } from './components/index.tsx';

const API_URL = import.meta.env.VITE_EDUCA_API_URL;

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 1. LEER (GET) ---
  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}card`, {
        headers: { usersecretpasskey: "Gabr686940RE" }
      });
      const data = await response.json();
      // Mapeamos de formato API a formato local
      const cartasMapeadas = data.data.map(toCardApiMapper);
      setCartas(cartasMapeadas);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // --- 2. CREAR (POST) ---
  const addCarta = async (nuevaCarta: Carta) => {
    try {
      const response = await fetch(`${API_URL}card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Gabr686940RE"
        },
        body: JSON.stringify(toApiCardMapper(nuevaCarta)),
      });
      if (response.ok) fetchCards(); // Recargamos la lista desde la API
    } catch (e) {
      console.error("Error adding card:", e);
    }
  };

  // --- 3. ELIMINAR (DELETE) ---
  const eliminarCarta = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}card/${id}`, {
        method: "DELETE",
        headers: { usersecretpasskey: "Gabr686940RE" }
      });
      if (response.ok) {
        setCartas(prev => prev.filter(c => c.id !== id));
        console.log("Eliminada con éxito");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const actualizarCarta = async (cartaEditada: Carta) => {
  try {
    const datosMapeados = toApiCardMapper(cartaEditada);
    const response = await fetch(`${API_URL}card/`, { 
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "usersecretpasskey": "Gabr686940RE"
      },
      body: JSON.stringify(datosMapeados)
    });
    if (response.ok) {
      setCartas(prev => prev.map(c => c.id === cartaEditada.id ? cartaEditada : c));
      console.log("¡LOGRADO! Carta actualizada en la base de datos.");
      alert("¡Dominio expandido y actualizado!");
    } else {
      // Si vuelve a dar error, intentamos la ruta con ID pero asegurando que no haya barras extra
      const urlConId = `${API_URL.replace(/\/$/, '')}/card/${cartaEditada.id}`;
      console.log("Reintentando en:", urlConId);
      
      const retryResponse = await fetch(urlConId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "usersecretpasskey": "Gabr686940RE"
        },
        body: JSON.stringify(datosMapeados)
      });

      if (retryResponse.ok) {
        setCartas(prev => prev.map(c => c.id === cartaEditada.id ? cartaEditada : c));
        alert("¡Actualizado en el segundo intento!");
      }
    }
  } catch (error) {
    console.error("Error en la conexión final:", error);
  }
};

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Home 
            cartas={cartas} 
            onEliminar={eliminarCarta} 
            onAñadirCarta={addCarta}
            onActualizar={actualizarCarta}
          />
        } 
      />
      <Route 
        path="/crear-carta" 
        element={<FormularioCrearCarta onAñadirCarta={addCarta} />} 
      />
    </Routes>
  );
}

export default App;