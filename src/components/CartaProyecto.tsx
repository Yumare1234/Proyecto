import { useState } from 'react';
import { Modal } from './Modal';
import { FormularioEditarCarta } from './formularioEditarcarta';
import type { Carta } from '.';

type Props = {
  carta: Carta, onEliminar?: (id: number) => void, onActualizar?: (cartaActualizada: Carta) => void,
  seleccionada: boolean,
  ocultarBotones?: boolean
};

function Cartadetalle({ carta, onEliminar, onActualizar, seleccionada, ocultarBotones = false }: Props) {
  const { ataque, defensa, imagen, nombre, categoria, ritual, clan, descripcion, id, hp } = carta;
  const [mostrarModal, setMostrarModal] = useState(false);
  const alternarModal = () => setMostrarModal(!mostrarModal);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const alternarEditar = () => setMostrarEditar(!mostrarEditar);

  return (
    <div className={`relative group p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/40 to-transparent hover:from-purple-500 transition-all duration-500 ${seleccionada ? 'ring-4 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
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
        {!ocultarBotones && (
          <><button
            onClick={alternarModal}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest"
          >
            Expandir Dominio
          </button><button
            onClick={alternarEditar}
            className="w-full py-2.5 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest">
              Editar Carta
            </button></>
        )}
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
            {/* 1. Asegúrate de que el contenedor GRID tenga suficiente espacio y separación */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mx-auto">

              {/* BLOQUE DE ATAQUE */}
              <div className="flex flex-col items-center justify-center p-3 bg-black/40 border border-red-500/20 rounded-xl min-w-0 w-full">
                <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase mb-1">Ataque</span>
                {/* Icono de espadas */}
                <span className="text-xl mb-1">⚔️</span>
                {/* Ajustamos el tamaño del texto para que no desborde */}
                <span className="text-sm md:text-base font-black tracking-tight text-white w-full text-center truncate px-1">
                  {carta.ataque}
                </span>
              </div>

              {/* BLOQUE DE DEFENSA */}
              <div className="flex flex-col items-center justify-center p-3 bg-black/40 border border-blue-500/20 rounded-xl min-w-0 w-full">
                <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-1">Defensa</span>
                {/* Icono del escudo */}
                <span className="text-xl mb-1">🛡️</span>
                {/* Usamos text-sm por defecto y tracking-tighter para números densos */}
                <span className="text-sm md:text-base font-black tracking-tighter text-white w-full text-center truncate px-1">
                  {carta.defensa}
                </span>
              </div>

            </div>

            {/* 2. BARRA DE VIDA (Abajo, ocupando todo el ancho disponible) */}
            <div className="w-full max-w-xs mx-auto mt-3 p-3 bg-black/40 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                <span>💚</span>
                <span>Vida</span>
              </div>
              <span className="text-sm md:text-base font-black text-white px-1">
                {carta.hp}
              </span>
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
              onClick={() => {
                if (onEliminar) {
                  onEliminar(id);
                }
              }}
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