import { useState } from 'react';
import './App.css'
import Cartadetalle from './components/CartaProyecto';

function App() {
  const [busqueda, setBusqueda] = useState("");

  const Gojo = {
    nombre: "Satoru Gojo",
    categoria: "Grado Especial",
    ritual: "Brujeria del Infinito / Seis Ojos",
    ataque: 9490,
    defensa: 7845,
    imagen: "/imagenes/Gojo.jpg", 
    Clan: "Gojo"
  };

  const Sukuna = { 
    nombre: "Ryomen Sukuna",
    categoria: "Grado Especial",
    ritual: " Santuario Malévolo ",
    ataque: 9986,
    defensa: 8000,
    imagen: '/imagenes/Sukuna.jpg', 
    Clan: "Abe"
  };

  const Itadori = { 
    nombre: "Itadori Yuji",
    categoria: "Grado Especial",
    ritual: "Manipulación de Sangre / Santuario Malévolo / Cuerpo Sobrehumano",
    ataque: 7540,
    defensa: 7000,
    imagen: '/imagenes/Yuji.jpg', 
    Clan: "Kamo"
  };
  
  const Megumi = { 
    nombre: "Megumi Fushiguro",
    categoria: "Primer Grado",
    ritual: "Técnicas de las 10 Sombras",
    ataque: 5540,
    defensa: 3530,
    imagen: '/imagenes/Megumi.jpg', 
    Clan: "Fushiguro / Zenin"
  };

  const Yuta = { 
    nombre: "Yuta Okkotsu",
    categoria: "Grado Especial",
    ritual: "Mimetismo / Shikigami Rika Orimoto",
    ataque: 7340,
    defensa: 6730,
    imagen: '/imagenes/Yuta.jpg', 
    Clan: "Okkotsu"
  };


  return (
  <div className="flex flex-col min-h-screen bg-linear-to-br from-purple-900 via-purple-600 to-violet-900 p-5">
    
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 w-full">
      <h1 className="text-4xl font-bold text-white">Juego de Cartas Estilo Anime</h1>
      <input 
        type="text"
        placeholder="Buscar mazo o personaje..."
        className="p-2 rounded-lg bg-purple-900/50 border border-purple-400 text-white outline-none w-64"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      <Cartadetalle nombre={Gojo.nombre} categoria={Gojo.categoria} imagen={Gojo.imagen} ritual={Gojo.ritual} ataque={Gojo.ataque} defensa={Gojo.defensa} Clan={Gojo.Clan} />
      <Cartadetalle nombre={Sukuna.nombre} categoria={Sukuna.categoria} imagen={Sukuna.imagen} ritual={Sukuna.ritual} ataque={Sukuna.ataque} defensa={Sukuna.defensa} Clan={Sukuna.Clan} />
      <Cartadetalle nombre={Itadori.nombre} categoria={Itadori.categoria} imagen={Itadori.imagen} ritual={Itadori.ritual} ataque={Itadori.ataque} defensa={Itadori.defensa} Clan={Itadori.Clan} />
      <Cartadetalle nombre={Megumi.nombre} categoria={Megumi.categoria} imagen={Megumi.imagen} ritual={Megumi.ritual} ataque={Megumi.ataque} defensa={Megumi.defensa} Clan={Megumi.Clan} />
      <Cartadetalle nombre={Yuta.nombre} categoria={Yuta.categoria} imagen={Yuta.imagen} ritual={Yuta.ritual} ataque={Yuta.ataque} defensa={Yuta.defensa } Clan = {Yuta.Clan } />
    </div>

  </div>
  );
}


export default App;