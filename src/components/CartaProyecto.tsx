import { useState } from 'react';
import { Modal } from './Modal'; 

function Cartadetalle({ ataque, defensa, imagen, nombre, categoria, ritual, Clan, descripcion }: any) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const alternarModal = () => setMostrarModal(!mostrarModal);

    return (
      <div className="relative">
      <div className="flex flex-col items-center border-4 border-black bg-linear-to-b from-gray-800 to-gray-900 w-64 rounded-xl shadow-2xl p-4 transform hover:scale-105 transition-all duration-300">
        <h3 className="text-white font-bold mb-2 uppercase">{nombre}</h3>
        <div className="w-full h-48 border-2 border-blue-700 rounded-lg overflow-hidden mb-3">
        <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
        </div>
      <button
          onClick={alternarModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md w-full transition-colors">
          Mostrar Detalles
        </button>
      </div>

    <Modal 
        isOpen={mostrarModal} 
        onClose={alternarModal} 
        title={`Detalles de ${nombre}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
  <div className="flex flex-col items-center space-y-4">
      <img 
        src={imagen} 
        alt={nombre} 
        className="w-48 border-4 border-black rounded-lg shadow-lg" 
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
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🚻 Clan:</strong> {Clan}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>🏷️ Categoría:</strong> {categoria}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>✨ Ritual:</strong> {ritual}</p>
            <p className="bg-gray-100 p-2 rounded-lg"><strong>📃 Descripcion:</strong> {descripcion}</p>
        </div> 
    <button 
            onClick={alternarModal}
            className="mt-3 w-100 bg-linear-to-r from-purple-700 to-blue-500 text-white py-2 rounded-lg hover:bg-purple-800">
            Cerrar
            </button>
        </div>
        </Modal>
    </div>
    );
}

export default Cartadetalle;