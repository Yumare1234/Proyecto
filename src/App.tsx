import './App.css'
import Cartadetalle from './components/CartaProyecto';

function App() {

  const Pikachu = {
    nombre: "Pikachu",
    numero: 70,
    tipo: "⚡",
    ataque: 554,
    defensa: 403,
    descripcion: "Pikachu es un Pokémon ratón de tipo eléctrico, de color amarillo, pequeño y bípedo, conocido por almacenar y descargar electricidad desde las bolsas rojas de sus mejillas. Tiene orejas largas con puntas negras, rayas marrones en la espalda y una cola con forma de rayo (la de las hembras tiene forma de corazón en la punta)",
    imagen: "/imagenes/Pikachu.png", 
    genero: "Macho"
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <Cartadetalle
    
    nombre={Pikachu.nombre}
    numero={Pikachu.numero}
    imagen={Pikachu.imagen}
    tipo={Pikachu.tipo}
    ataque={Pikachu.ataque}
    defensa={Pikachu.defensa}
    descripcion={Pikachu.descripcion}
    genero={Pikachu.genero}

    />
    </div>
  );
}

export default App;