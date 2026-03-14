import './App.css';
import Cartadetalle from './components/CartaProyecto';

function App() {

  const Gojo = {
    nombre: "Satoru Gojo",
    categoria: "Grado Especial",
    ritual: "Brujeria del Infinito / Seis Ojos",
    ataque: 9490,
    defensa: 7845,
    imagen: "/imagenes/Gojo.jpg", 
    Clan: "Gojo",
    descripcion: "Satoru Gojo es el Hechicero más poderoso de su época, un profesor carismático y enérgico en la Escuela Técnica de Maldiciones de Tokio."
  };

  const Sukuna = { 
    nombre: "Ryomen Sukuna",
    categoria: "Grado Especial",
    ritual: " Santuario Malévolo ",
    ataque: 9986,
    defensa: 8000,
    imagen: '/imagenes/Sukuna.jpg', 
    Clan: "Abe",
    descripcion: "Conocido como el Rey de las Maldiciones, fue un temido hechicero humano en la Era Heian y renace como espíritu maldito siendo su recipiente Itadori Yuji."
  };

  const Itadori = { 
    nombre: "Itadori Yuji",
    categoria: "Grado Especial",
    ritual: "Manipulación de Sangre / Santuario Malévolo",
    ataque: 7540,
    defensa: 7000,
    imagen: '/imagenes/Yuji.jpg', 
    Clan: "Kamo",
    descripcion: "Un adolescente fuerte, atlético y de buen corazón que se convierte en el recipiente del Rey de las Maldiciones"
  };
  
  const Megumi = { 
    nombre: "Megumi Fushiguro",
    categoria: "Primer Grado",
    ritual: "Técnicas de las 10 Sombras",
    ataque: 5540,
    defensa: 3530,
    imagen: '/imagenes/Megumi.jpg', 
    Clan: "Fushiguro / Zenin",
    descripcion: "Conocido por su personalidad estoica y su habilidad innata con la Técnica de Sombras de Diez Tipos, que le permite invocar shikigamis como el poderoso Nue y el temible Mahoraga."
  };

  const Yuta = { 
    nombre: "Yuta Okkotsu",
    categoria: "Grado Especial",
    ritual: "Mimetismo / Shikigami Rika Orimoto",
    ataque: 7340,
    defensa: 6730,
    imagen: '/imagenes/Yuta.jpg', 
    Clan: "Okkotsu",
    descripcion: "Un prodigio que inicialmente se sentía inseguro y atormentado por su amiga de la infancia, Rika Orimoto, quien se convirtió en una poderosa maldición."
  };

  const Nanami = { 
    nombre: "Nanami Kento",
    categoria: "Primer Grado",
    ritual: "Técnica de Proporción",
    ataque: 6340,
    defensa: 4330,
    imagen: '/imagenes/Nanami.jpg', 
    Clan: "Kento",
    descripcion: "Caracterizado por su apariencia de ex oficinista y su personalidad pragmática y reservada, que valora la seriedad y la lógica, aunque es un mentor estricto pero compasivo para Itadori y otros."
  };


  return (
  <div className="flex flex-col min-h-screen bg-linear-to-br from-purple-900 via-purple-600 to-violet-900 p-5">
    
    <div className="flex items-center gap-22 border-black rounded-2xl bg-blue-950 px-3 py-3 ">
    <img 
      src="/imagenes/Logo.png" 
      alt="Logo" 
      className="h-16 w-auto" 
    />
    <h1 className="text-2xl md:text-4xl font-bold text-white ">
      Juego de Cartas Estilo Anime
    </h1>
  <input
    type="text"
    placeholder="Buscar mazo o personaje..."
    className="p-2 rounded-lg bg-purple-900/50 border border-purple-400 text-white outline-none w-64"
  />
  </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8">
      <Cartadetalle nombre={Gojo.nombre} categoria={Gojo.categoria} imagen={Gojo.imagen} ritual={Gojo.ritual} ataque={Gojo.ataque} defensa={Gojo.defensa} Clan={Gojo.Clan} descripcion={Gojo.descripcion} />
      <Cartadetalle nombre={Sukuna.nombre} categoria={Sukuna.categoria} imagen={Sukuna.imagen} ritual={Sukuna.ritual} ataque={Sukuna.ataque} defensa={Sukuna.defensa} Clan={Sukuna.Clan} descripcion={Sukuna.descripcion} />
      <Cartadetalle nombre={Itadori.nombre} categoria={Itadori.categoria} imagen={Itadori.imagen} ritual={Itadori.ritual} ataque={Itadori.ataque} defensa={Itadori.defensa} Clan={Itadori.Clan} descripcion={Itadori.descripcion} />
      <Cartadetalle nombre={Megumi.nombre} categoria={Megumi.categoria} imagen={Megumi.imagen} ritual={Megumi.ritual} ataque={Megumi.ataque} defensa={Megumi.defensa} Clan={Megumi.Clan} descripcion={Megumi.descripcion} />
      <Cartadetalle nombre={Yuta.nombre} categoria={Yuta.categoria} imagen={Yuta.imagen} ritual={Yuta.ritual} ataque={Yuta.ataque} defensa={Yuta.defensa} Clan={Yuta.Clan} descripcion={Yuta.descripcion} />
      <Cartadetalle nombre={Nanami.nombre} categoria={Nanami.categoria} imagen={Nanami.imagen} ritual={Nanami.ritual} ataque={Nanami.ataque} defensa={Nanami.defensa} Clan={Nanami.Clan} descripcion={Nanami.descripcion } />
    </div>
        
  </div>
  );
}


export default App;