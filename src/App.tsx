import './App.css'
import Carta from './components/Carta'
import Cartadetalle from './components/CartaProyecto'
function App() {
  const mostrarCarta = (numero: number, pinta: string) => {
    alert(`Carta de numero: ${numero} y de pinta ${pinta}`);
  };

  return (
    <div>
      <h1> Mi Primer Proyecto en React </h1>
      <p> Nombre: Gabriel Yumare </p>
      <Carta numero={2} pinta={"Diamante"} mostrarCarta={mostrarCarta} />
      <Carta numero={3} pinta={"Trebol"} mostrarCarta={mostrarCarta} />
      <Carta numero={6} pinta={"Corazon"} mostrarCarta={mostrarCarta} />
      <Carta numero={18} pinta={"Trebol"} mostrarCarta={mostrarCarta} />
      <Cartadetalle
        ataque={2655}
        nombre="Pikachu"
        defensa={3045}
        descripcion="Pikachu es un pokemon capaz de usar ataques del su elemento como impactrueno"
        imagen="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/025.png"
        numero={325}
        tipo="Electrico"
      />
    </div>
  )
}

export default App
