import { Routes, Route } from 'react-router'; 
import { useState } from 'react';
import Home from './components/home';
import { MAZO_JUJUTSU } from './components/cartas';
import { FormularioCrearCarta } from './components/formularioCrearcarta';

function App() {
  const [cartas, setCartas] = useState(MAZO_JUJUTSU);
  const eliminarCarta= (id: number) => {
  const nuevasCartas = cartas.filter(carta => carta.id !== id);
  setCartas(nuevasCartas); 
}; 

  const onAñadirCarta = (nuevaCarta: any) => {
    setCartas((prevCartas) => [...prevCartas, nuevaCarta]);
    console.log("Nueva carta añadida al estado:", nuevaCarta);
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home cartas={cartas} onEliminar={eliminarCarta} onAñadirCarta={onAñadirCarta} />} 
      />
      <Route 
        path="/crear-carta" 
        element={<FormularioCrearCarta onAñadirCarta={onAñadirCarta} />} 
      />
    </Routes>
  );
}

export default App;