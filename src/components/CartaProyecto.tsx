import React, { useState } from 'react';

type Props = {
    categoria: string;
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
    categoria,
    tipo,
    genero = "Desconocido"
}: Props) {
    const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
    const alternarDescripcion = () => {
        setMostrarDescripcion(!mostrarDescripcion);
        };
    return (
        <div className='flex flex-col items-center border-4 bg-gradient-to-r from-gray-300 via-blue-300 to-purple-600 w-1/3 rounded-xl border-black-800 rounded-lg text-black font-bold py-6'>
            <h3>
                {nombre} ({categoria}) {tipo}
            </h3>
            <img className='border-6 bg-linear-to-r w-90 border-purple-900 rounded-lg' src={imagen} alt={nombre} />
            <p className="bg-black-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4">  ⚔ Ataque: {ataque} </p>
            <p className="bg-black-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4"> 🛡 Defensa: {defensa} </p>
            <button onClick={alternarDescripcion} 
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4">
        {mostrarDescripcion ? ' 📃 Ocultar Descripción' : ' 📄 Mostrar Descripción'}
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