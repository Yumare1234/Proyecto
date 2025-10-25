import './App.css'
import Carta from './components/Carta'
function App() {
  const mostrarCarta = (numero: number, pinta: string) => {
    alert(`Carta de numero: ${numero} y de pinta ${pinta}` );
  };

  return (
    <div>
      <h1> Mi Primer Proyecto en React </h1>
      <p> Nombre: Gabriel Yumare </p>
       <Carta numero = {2} pinta = {"Diamante"} mostrarCarta={mostrarCarta}/>
       <Carta numero = {3} pinta = {"Trebol"} mostrarCarta={mostrarCarta}/>
       <Carta numero = {6} pinta = {"Corazon"} mostrarCarta={mostrarCarta}/>
       <Carta numero = {18} pinta = {"Trebol"} mostrarCarta={mostrarCarta}/>
    </div>
  )
}

export default App
