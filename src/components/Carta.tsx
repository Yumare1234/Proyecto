type Props = {
    numero: number;
    pinta: string;
    mostrarCarta: (numero: number, pinta: string) => void 
};
function Carta({numero, pinta, mostrarCarta}: Props) {
    const handleClick = () => {
       mostrarCarta(numero, pinta)
    };
    return (
    <button onClick={handleClick}>
    <h1> Hola soy una carta {numero + " " + pinta} 🃏</h1>
    </button>
    )
}
export default Carta;