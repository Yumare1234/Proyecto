import { useState } from 'react';
import './App.css'
import Cartadetalle from './components/CartaProyecto';

function App() {


  const Gojo = {
    nombre: "Satoru Gojo",
    categoria: "Especial",
    ritual: "Brujeria del Infinito / Seis Ojos",
    ataque: 9490,
    defensa: 7845,
    imagen: "/imagenes/Gojo.jpg", 
    genero: "Masculino"
  };

  const Sukuna = { 
    nombre: "Ryomen Sukuna",
    categoria: "Especial",
    ritual: " Santuario Malévolo ",
    ataque: 9999,
    defensa: 8000,
    imagen: '/imagenes/Sukuna.jpg', 
    genero: "Masculino"
  };

  const Itadori = { 
    nombre: "Itadori Yuji",
    categoria: "Especial",
    ritual: "Manipulación de Sangre / Santuario Malévolo / Cuerpo Sobrehumano",
    ataque: 7540,
    defensa: 7000,
    imagen: '/imagenes/Yuji.jpg', 
    genero: "Masculino"
  };

  return (
    <div className="flex px-5 items-start flex-wrap min-h-screen bg-gray-100 bg-linear-to-br from-purple-900 via-purple-600 to-violet-900 gap-8">

    <Cartadetalle
    nombre={Gojo.nombre}
    categoria={Gojo.categoria}
    imagen={Gojo.imagen}
    ritual={Gojo.ritual}
    ataque={Gojo.ataque}
    defensa={Gojo.defensa}
    genero={Gojo.genero}
    />

<Cartadetalle
    nombre={Sukuna.nombre}
    categoria={Sukuna.categoria}
    imagen={Sukuna.imagen}
    ritual={Sukuna.ritual}
    ataque={Sukuna.ataque}
    defensa={Sukuna.defensa}
    genero={Sukuna.genero}
    />

<Cartadetalle
    nombre={Itadori.nombre}
    categoria={Itadori.categoria}
    imagen={Itadori.imagen}
    ritual={Itadori.ritual}
    ataque={Itadori.ataque}
    defensa={Itadori.defensa}
    genero={Itadori.genero}
    />

    </div>
  );
}


export default App;