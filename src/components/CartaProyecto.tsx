
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
        <div className='flex flex-col items-center border-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-600 w-1/3 rounded-xl border-gray-400'>
            <h3>
                {nombre} (#{numero}) {tipo}
            </h3>
            <img className='border-6 bg-linear-to-r from-yellow-500 to-orange-500 w-90 border-gray-400' src={imagen} alt={nombre} />
            <p className="text-lg font-semibold text-black-700 border-4 mt-4">  Ataque: {ataque} </p>
            <p className="text-lg font-semibold text-black-700 border-4 mt-4"> Defensa: {defensa} </p>
            <p className="text-lg font-semibold text-black-700 border-4 mt-4"> Descripcion: {descripcion} </p>
            <p className="text-lg font-semibold text-black-700 border-4 mt-4"> Genero: {genero} </p>
        </div>
    );
}

export default Cartadetalle;