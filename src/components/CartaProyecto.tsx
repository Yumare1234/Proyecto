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
        <div>
            <h3>
                {nombre} (#{numero})
            </h3>
            <img src={imagen} alt={nombre} />
            <p> Tipo: {tipo} </p>
            <p> Ataque: {ataque} </p>
            <p> Defensa: {defensa} </p>
            <p> {descripcion} </p>
            <p> Genero: {genero} </p>
        </div>
    );
}

export default Cartadetalle;