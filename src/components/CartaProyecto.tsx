import React, { useState } from 'react';
import { Modal } from './Modal'; 

function Cartadetalle({ ataque, defensa, imagen, nombre, categoria, ritual, genero = "Desconocido" }: any) {
    const [mostrarModal, setMostrarModal] = useState(false);

    const alternarModal = () => setMostrarModal(!mostrarModal);

    return (
    <div className='flex flex-col items-center border-4 bg-linear-to-r from-gray-300 via-blue-300 to-purple-600 w-60 rounded-xl border-black-800 p-4 font-bold shadow-lg'>
        <h3>{nombre}</h3>
        <img 
            className='border-6 bg-linear-to-r w-30 border-purple-900 rounded-lg my-2' 
            src={imagen} 
            alt={nombre} 
        />
    <button 
        onClick={alternarModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg shadow-md transition duration-300 mt-2">
        Mostrar Detalles
        </button>

    <Modal 
        isOpen={mostrarModal} 
        onClose={alternarModal} 
        title={`Detalles de ${nombre}`}>
        <div className="flex flex-col items-center space-y-4 transform-3d">
    <img src={imagen} alt={nombre} className="w-40 border-4 border-purple-900 rounded-lg shadow-lg" />
            <div className="w-full space-y-2 transform-3d">
            <p className="bg-gray-100 p-2 rounded-lg"><strong>⚔️ Ataque:</strong> {ataque}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🛡️ Defensa:</strong> {defensa}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🚻 Género:</strong> {genero}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🏷️ Categoría:</strong> {categoria}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>✨ Ritual:</strong> {ritual}</p>
        </div> 
        <button 
            onClick={alternarModal}
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-800">
            Cerrar
            </button>
        </div>
        </Modal>
    </div>
    );
}

export default Cartadetalle;