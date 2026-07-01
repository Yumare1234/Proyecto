import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { GenerarCartaIA } from './components/CrearCartaIA';
import Home from './components/home';
import { FormularioCrearCarta } from './components/formularioCrearcarta';
import { toCardApiMapper, toApiCardMapper, type Carta } from './components/index.tsx';
import SeleccionarCartas from './components/seleccionarCartas.tsx';
import CampoDeBatalla from './components/CamposDeBatalla.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import SeleccionarCartas2 from './components/seleccionarCartas2.tsx';
import CampoDeBatalla2 from './components/CamposDeBatalla2.tsx';
import TiendaAlmas from './components/TiendaAlmas.tsx';

const API_URL = import.meta.env.VITE_EDUCA_API_URL;

// Tipo de pasiva de la tienda
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

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado global de almas y pasivas
  const [almas, setAlmas] = useState(() => {
    const guardado = localStorage.getItem('almas');
    return guardado ? parseInt(guardado) : 0;
  });

  const [pasivasCompradas, setPasivasCompradas] = useState<string[]>(() => {
    const guardado = localStorage.getItem('pasivasCompradas');
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guardar almas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('almas', almas.toString());
  }, [almas]);

  // Guardar pasivas compradas en localStorage
  useEffect(() => {
    localStorage.setItem('pasivasCompradas', JSON.stringify(pasivasCompradas));
  }, [pasivasCompradas]);

  // --- 1. LEER (GET) ---
  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}card`, {
        headers: { usersecretpasskey: "Gabr686940RE" }
      });
      const data = await response.json();
      const cartasMapeadas = data.data.map(toCardApiMapper);
      setCartas(cartasMapeadas);
      console.log(loading);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartas.length === 0 && !loading) {
      fetchCards();
    }
  }, [cartas.length, loading]);

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
      if (response.ok) fetchCards();
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

  // Función para agregar almas (llamada desde CamposDeBatalla2 al ganar)
  const handleAgregarAlmas = (cantidad: number) => {
    setAlmas(prev => prev + cantidad);
  };

  // Función para comprar una pasiva en la tienda
  const handleComprarPasiva = (pasiva: PasivaTienda) => {
    if (almas >= pasiva.precio && !pasivasCompradas.includes(pasiva.id)) {
      setAlmas(prev => prev - pasiva.precio);
      setPasivasCompradas(prev => [...prev, pasiva.id]);
    }
  };

  return (
    <ErrorBoundary>
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
        <Route
          path="/seleccionar-cartas"
          element={<SeleccionarCartas mazo={cartas} />}
        />
        <Route
          path="/seleccionar-cartas-2"
          element={<SeleccionarCartas2 mazo={cartas} pasivasCompradas={pasivasCompradas} />}
        />
        <Route
          path="/campo-de-batalla/:id1/:id2"
          element={<CampoDeBatalla />}
        />
        <Route
          path="/campo-de-batalla-2/:id1/:id2"
          element={<CampoDeBatalla2 onGanarAlmas={handleAgregarAlmas} />}
        />
        <Route
          path="/generar-carta-ia"
          element={<GenerarCartaIA />}
        />
        <Route
          path="/tienda-de-almas"
          element={<TiendaAlmas almas={almas} onComprarPasiva={handleComprarPasiva} pasivasCompradas={pasivasCompradas} />}
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;