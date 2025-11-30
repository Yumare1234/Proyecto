import React, { useState } from 'react';

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
    const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
    const alternarDescripcion = () => {
        setMostrarDescripcion(!mostrarDescripcion);
        };
    return (
        <div className='flex flex-col items-center border-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-600 w-1/4 rounded-xl border-gray-400 rounded-lg'>
            <h3>
                {nombre} (#{numero}) {tipo}
            </h3>
            <img className='border-6 bg-linear-to-r from-yellow-500 to-orange-500 w-90 border-gray-400 rounded-lg' src={imagen} alt={nombre} />
            <p className="bg-black-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4 w-ful">  🗡 Ataque: {ataque} </p>
            <p className="bg-black-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4 w-ful"> 🛡 Defensa: {defensa} </p>
            <button onClick={alternarDescripcion} 
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4 w-full">
        {mostrarDescripcion ? 'Ocultar Descripción' : 'Mostrar Descripción'}
      </button>
      {mostrarDescripcion && (
        <p className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-4 text-center">
        {descripcion} </p>
      )}
        <p className="bg-black-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4 w-ful"> 🚻 Genero: {genero} </p>
        </div>
    );
}

export default Cartadetalle;