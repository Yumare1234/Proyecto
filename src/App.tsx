import './App.css'
import Cartadetalle from './components/CartaProyecto';

function App() {

  const Pikachu = {
    nombre: "Pikachu",
    numero: 70,
    tipo: "⚡",
    ataque: 554,
    defensa: 403,
    descripcion: "Pikachu es un Pokémon ratón de tipo eléctrico, de color amarillo, conocido por las bolsas rojas en sus mejillas donde almacena electricidad. Mide \(40\) centímetros de alto y pesa \(6\) kilogramos. Su diseño incluye orejas largas con puntas negras y una cola en forma de rayo, aunque en las hembras la punta es con forma de corazón. ",
    imagen: "/imagenes/pikachu.jpg", 
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