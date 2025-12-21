import React, { useState } from 'react';
import { Modal } from './Modal'; 

function Cartadetalle({ ataque, defensa, imagen, nombre, categoria, ritual, Clan}: any) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
<div className="flex flex-col items-center space-y-4">
      <img 
        src={imagen} 
        alt={nombre} 
        className="w-48 border-4 border-purple-900 rounded-lg shadow-lg" 
      />
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="bg-red-100 p-2 rounded-lg text-center border border-red-200">
          <p className="text-xs font-bold text-red-700 uppercase">Ataque</p>
          <p className="text-lg font-black text-red-900">⚔️ {ataque}</p>
          
        </div>
        <div className="bg-blue-100 p-2 rounded-lg text-center border border-blue-200">
          <p className="text-xs font-bold text-blue-700 uppercase">Defensa</p>
          <p className="text-lg font-black text-blue-900">🛡️ {defensa}</p>
        </div>
      </div>
    </div>
            <div className="w-full space-y-2 transform-3d">
            <p className="bg-gray-100 p-2 rounded-lg"><strong>⚔️ Ataque:</strong> {ataque}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🛡️ Defensa:</strong> {defensa}</p>
                <p className="bg-gray-100 p-2 rounded-lg"><strong>🚻 Clan:</strong> {Clan}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🏷️ Categoría:</strong> {categoria}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>✨ Ritual:</strong> {ritual}</p>
        </div> 
    <button 
            onClick={alternarModal}
            className="mt-3 w-100 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-800">
            Cerrar
            </button>
        </div>
        </Modal>
    </div>
    );
}

export default Cartadetalle;