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

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(false);

  const [almas, setAlmas] = useState(() => {
    const guardado = localStorage.getItem('almas');
    return guardado ? parseInt(guardado) : 0;
  });

  const [pasivasCompradas, setPasivasCompradas] = useState<string[]>(() => {
    const guardado = localStorage.getItem('pasivasCompradas');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [cartasCompradas, setCartasCompradas] = useState<string[]>(() => {
    const guardado = localStorage.getItem('cartasCompradas');
    return guardado ? JSON.parse(guardado) : [];
  });

  // ✅ Estados movidos FUERA de handleComprarCarta
  const [logrosCompletados, setLogrosCompletados] = useState<string[]>(() => {
    const guardado = localStorage.getItem('logrosCompletados');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [mazmorraFacilCompletada, setMazmorraFacilCompletada] = useState(() => {
    return localStorage.getItem('mazmorraFacilCompletada') === 'true';
  });
  const [mazmorraMedioCompletada, setMazmorraMedioCompletada] = useState(() => {
    return localStorage.getItem('mazmorraMedioCompletada') === 'true';
  });
  const [mazmorraDificilCompletada, setMazmorraDificilCompletada] = useState(() => {
    return localStorage.getItem('mazmorraDificilCompletada') === 'true';
  });

  // Datos para logros
  const datosLogros = {
    totalCartas: cartas.length,
    mazmorraFacilCompletada,
    mazmorraMedioCompletada,
    mazmorraDificilCompletada,
    pasivasCompradasCount: pasivasCompradas.length,
  };

  useEffect(() => { localStorage.setItem('almas', almas.toString()); }, [almas]);
  useEffect(() => { localStorage.setItem('pasivasCompradas', JSON.stringify(pasivasCompradas)); }, [pasivasCompradas]);
  useEffect(() => { localStorage.setItem('cartasCompradas', JSON.stringify(cartasCompradas)); }, [cartasCompradas]);
  useEffect(() => { localStorage.setItem('logrosCompletados', JSON.stringify(logrosCompletados)); }, [logrosCompletados]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}card`, {
        headers: { usersecretpasskey: "Gabr686940RE" }
      });
      const data = await response.json();
      const cartasMapeadas = data.data.map(toCardApiMapper);
      setCartas(cartasMapeadas);
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

  const addCarta = async (nuevaCarta: Carta) => {
    try {
      const response = await fetch(`${API_URL}card`, {
        method: "POST",
        headers: { "Content-Type": "application/json", usersecretpasskey: "Gabr686940RE" },
        body: JSON.stringify(toApiCardMapper(nuevaCarta)),
      });
      if (response.ok) fetchCards();
    } catch (e) {
      console.error("Error adding card:", e);
    }
  };

  const eliminarCarta = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}card/${id}`, {
        method: "DELETE",
        headers: { usersecretpasskey: "Gabr686940RE" }
      });
      if (response.ok) {
        setCartas(prev => prev.filter(c => c.id !== id));
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
        headers: { "Content-Type": "application/json", usersecretpasskey: "Gabr686940RE" },
        body: JSON.stringify(datosMapeados)
      });
      if (response.ok) {
        setCartas(prev => prev.map(c => c.id === cartaEditada.id ? cartaEditada : c));
      }
    } catch (error) {
      console.error("Error en la conexión final:", error);
    }
  };

  const handleAgregarAlmas = (cantidad: number, dificultad?: string) => {
    setAlmas(prev => prev + cantidad);
    if (dificultad === 'facil') {
      setMazmorraFacilCompletada(true);
      localStorage.setItem('mazmorraFacilCompletada', 'true');
    } else if (dificultad === 'medio') {
      setMazmorraMedioCompletada(true);
      localStorage.setItem('mazmorraMedioCompletada', 'true');
    } else if (dificultad === 'dificil') {
      setMazmorraDificilCompletada(true);
      localStorage.setItem('mazmorraDificilCompletada', 'true');
    }
  };

  const handleComprarPasiva = (pasiva: PasivaTienda) => {
    if (almas >= pasiva.precio && !pasivasCompradas.includes(pasiva.id)) {
      setAlmas(prev => prev - pasiva.precio);
      setPasivasCompradas(prev => [...prev, pasiva.id]);
    }
  };

  const handleComprarCarta = async (carta: CartaExclusiva) => {
    if (almas >= carta.precio && !cartasCompradas.includes(carta.id)) {
      setAlmas(prev => prev - carta.precio);
      setCartasCompradas(prev => [...prev, carta.id]);

      const nuevaCarta: Carta = {
        id: Date.now(),
        nombre: carta.nombre,
        ataque: carta.ataque,
        defensa: carta.defensa,
        hp: carta.hp,
        categoria: carta.categoria,
        ritual: carta.descripcion,
        imagen: carta.imagen,
        serie: "Curso Espacio Educa",
        clan: "",
        descripcion: carta.descripcion,
        seleccionada: false,
      };

      try {
        const response = await fetch(`${API_URL}card`, {
          method: "POST",
          headers: { "Content-Type": "application/json", usersecretpasskey: "Gabr686940RE" },
          body: JSON.stringify(toApiCardMapper(nuevaCarta)),
        });
        if (response.ok) fetchCards();
      } catch (e) {
        console.error("Error al invocar carta:", e);
      }
    }
  };

  const handleReclamarLogro = (logroId: string, recompensa: number) => {
    if (!logrosCompletados.includes(logroId)) {
      setLogrosCompletados(prev => [...prev, logroId]);
      setAlmas(prev => prev + recompensa);
    }
  };

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home cartas={cartas} onEliminar={eliminarCarta} onAñadirCarta={addCarta} onActualizar={actualizarCarta} />} />
        <Route path="/crear-carta" element={<FormularioCrearCarta onAñadirCarta={addCarta} />} />
        <Route path="/seleccionar-cartas" element={<SeleccionarCartas mazo={cartas} />} />
        <Route path="/seleccionar-cartas-2" element={<SeleccionarCartas2 mazo={cartas} pasivasCompradas={pasivasCompradas} />} />
        <Route path="/campo-de-batalla/:id1/:id2" element={<CampoDeBatalla />} />
        <Route path="/campo-de-batalla-2/:id1/:id2" element={<CampoDeBatalla2 onGanarAlmas={handleAgregarAlmas} />} />
        <Route path="/generar-carta-ia" element={<GenerarCartaIA />} />
        <Route path="/tienda-de-almas" element={
          <TiendaAlmas
            almas={almas}
            onComprarPasiva={handleComprarPasiva}
            onComprarCarta={handleComprarCarta}
            onReclamarLogro={handleReclamarLogro}
            pasivasCompradas={pasivasCompradas}
            cartasCompradas={cartasCompradas}
            logrosCompletados={logrosCompletados}
            datosLogros={datosLogros}
          />
        } />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;