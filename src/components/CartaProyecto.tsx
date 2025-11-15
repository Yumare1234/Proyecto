type Props = {
    numero: number;
    nombre: string;
    tipo: string;
    ataque: number;
    defensa: number;
    descripcion: string;
    imagen: string;
    genero?: string;
};

function Cartadetalle({
    ataque,
    defensa,
    descripcion,
    imagen,
    nombre,
    numero,
    tipo,
    genero = "Desconocido"
}: Props) {
    return (
        <div className='flex flex-col items-center border-4 bg-yellow-600 w-2/4 rounded-xl'>
            <h3>
                {nombre} (#{numero})
            </h3>
            <img className='border-6 bg-linear-to-r from-yellow-500 to-orange-500' src={imagen} alt={nombre} />
            <p> Tipo: {tipo} </p>
            <p> Ataque: {ataque} </p>
            <p> Defensa: {defensa} </p>
            <p> {descripcion} </p>
            <p> Genero: {genero} </p>
        </div>
    );
}

export default Cartadetalle;