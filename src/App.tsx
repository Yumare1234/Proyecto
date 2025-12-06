import { useState } from 'react';
import './App.css'
import Cartadetalle from './components/CartaProyecto';

function App() {

  const Gojo = {
    nombre: "Satoru Gojo",
    categoria: "El Honrado",
    tipo: "🌌",
    ataque: 9490,
    defensa: 7845,
    descripcion: " Satoru Gojo El Hechicero Más Fuerte,  Con su habilidad: Infinito Ilimitado, los ataques de los enemigos no pueden hacerle daño. Posee los Seis Ojos, analizando y neutralizando cualquier técnica rival. Su dominio del Infinito lo hace prácticamente invencible ",
    imagen: "/imagenes/Gojo.jpg", 
    genero: "Masculino"
  };

  const Sukuna = { 
    nombre: "Ryomen Sukuna",
    categoria: "EL Rey de las Maldiciones",
    tipo: "💀",
    ataque: 9999,
    defensa: 8000,
    descripcion: "La encarnación del mal. Sukuna es el Rey de las Maldiciones, cuya existencia se basa en la destrucción. Utiliza técnicas de corte y desmantelamiento para aniquilar cualquier objetivo, estableciéndose como la fuerza más poderosa y temida de la era actual.",
    imagen: '/imagenes/Sukuna.jpg', 
    genero: "Masculino"
  };

  const Itadori = { 
    nombre: "Itadori Yuji",
    categoria: "El Recipiente de Sukuna (Gallo) ",
    tipo: "🔥",
    ataque: 7540,
    defensa: 7000,
    descripcion: "El Contenedor de Sukuna. Yuji es un prodigio de fuerza física sobrehumana y velocidad, luchando con un espíritu inquebrantable. Su dominio del Golpe Divergente y su resistencia única lo convierten en la última esperanza contra el Rey de las Maldiciones. Su motivación es simple: asegurar que nadie tenga una 'muerte sin sentido'.",
    imagen: '/imagenes/Yuji.jpg', 
    genero: "Masculino"
  };

  return (
    <div className="flex px-10 items-center min-h-screen bg-gray-100 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 gap-8">

    <Cartadetalle
    nombre={Gojo.nombre}
    categoria={Gojo.categoria}
    imagen={Gojo.imagen}
    tipo={Gojo.tipo}
    ataque={Gojo.ataque}
    defensa={Gojo.defensa}
    descripcion={Gojo.descripcion}
    genero={Gojo.genero}
    />

<Cartadetalle
    nombre={Sukuna.nombre}
    categoria={Sukuna.categoria}
    imagen={Sukuna.imagen}
    tipo={Sukuna.tipo}
    ataque={Sukuna.ataque}
    defensa={Sukuna.defensa}
    descripcion={Sukuna.descripcion}
    genero={Sukuna.genero}
    />

<Cartadetalle
    nombre={Itadori.nombre}
    categoria={Itadori.categoria}
    imagen={Itadori.imagen}
    tipo={Itadori.tipo}
    ataque={Itadori.ataque}
    defensa={Itadori.defensa}
    descripcion={Itadori.descripcion}
    genero={Itadori.genero}
    />


    </div>
  );
}


export default App;