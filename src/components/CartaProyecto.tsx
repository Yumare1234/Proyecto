import { useState } from 'react';
import { Modal } from './Modal'; 
import { FormularioEditarCarta } from './formularioEditarcarta';


function Cartadetalle({ ataque, defensa, imagen, nombre, categoria, ritual, clan, descripcion, id, onEliminar, hp, onActualizar}: any) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const alternarModal = () => setMostrarModal(!mostrarModal);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const alternarEditar = () => setMostrarEditar(!mostrarEditar);

    return (
      <div className="relative  group p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/40 to-transparent hover:from-purple-500 transition-all duration-500">
      <div className="flex flex-col items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl transition-transform duration-300 group-hover:-translate-y-2">
        
        <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tighter group-hover:text-purple-400 transition-colors">
          {nombre}
        </h3>

        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-purple-900/50 mb-4">
          <img 
            src={imagen} 
            alt={nombre} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>

        <button
          onClick={alternarModal}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest"
        >
          Expandir Dominio
        </button>
        <button 
    onClick={alternarEditar} 
    className="w-full py-2.5 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest">
      Editar Carta
  </button>
      </div>
      <Modal 
  isOpen={mostrarEditar} 
  onClose={alternarEditar} 
  title={`Editando a: ${nombre}`}
>
  <FormularioEditarCarta 
    carta={{ ataque, defensa, imagen, nombre, categoria, ritual, clan, descripcion, id, hp }}
    onActualizar={onActualizar} 
    onClose={alternarEditar}
  />
</Modal>
      

      
      <Modal
        isOpen={mostrarModal}
        onClose={alternarModal}
        title={`Expediente: ${nombre}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-2">
          
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative p-1 bg-gradient-to-tr rounded-2xl shadow-2xl">
              <img
                src={imagen}
                alt={nombre}
                className="w-64 h-80 object-cover rounded-xl border-4 border-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full ">
              
              <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-2xl text-center shadow-inner">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Ataque</p>
                <p className="text-2xl font-black text-white">⚔️ {ataque}</p>
              </div>
              
              <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-2xl text-center shadow-inner">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Defensa</p>
                <p className="text-2xl font-black text-white">🛡️ {defensa}</p>
              </div>
                <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-2xl shadow-inner w-42">
  <div className="flex justify-between items-center mb-1.5">
    <div className="flex items-center gap-1">
      <span className="text-xs">💚</span>
      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Vida</p>
    </div>
    <p className="text-lg font-black text-white leading-none">
      {hp}
    </p>
  </div>

  {/* La barra de salud ahora con ancho completo asegurado */}
  <div className="h-3 w-full bg-gray-900/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
    <div 
      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
      style={{ width: '100%' }} 
    />
  </div>
</div>
            </div>
          </div>
          <div className="w-full space-y-3 text-slate-200">
            <div className="space-y-2">
              <p className="bg-white/5 p-3 rounded-xl border-l-4 border-purple-500">
                <strong className="text-purple-400">💎 Clan:</strong> {clan}
              </p>
              <p className="bg-white/5 p-3 rounded-xl border-l-4 border-blue-500">
                <strong className="text-blue-400">🎴 Categoría:</strong> {categoria}
              </p>
              <p className="bg-white/5 p-3 rounded-xl border-l-4 border-pink-500">
                <strong className="text-pink-400">🔥 Ritual:</strong> {ritual}
              </p>
              <div className="bg-white/5 p-4 rounded-xl border-l-4 border-slate-400 mt-4">
                <strong className="text-slate-100 mb-1 underline decoration-purple-500">Descripción:</strong>
                <p className="text-sm leading-relaxed text-slate-400 italic">
                  "{descripcion}"
                </p>
              </div>
            </div>
            
            <button
              onClick={alternarModal}
              className="mt-6 w-full bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 py-4 p-2 rounded-xl font-bold border border-white/10 hover:border-purple-500 transition-colors uppercase text-sm tracking-widest"
            >
              Cerrar Descripcion
            </button> 
          <button
            onClick={() => onEliminar(id)}
            className="flex mx-auto mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors">
              ELIMINAR CARTA
              </button>
          </div>
        </div>
      </Modal>
    </div>
    );
}

export default Cartadetalle;