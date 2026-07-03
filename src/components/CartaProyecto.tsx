import { useRef, useState, useEffect } from 'react';
import { Modal, CardClickEffect } from './Modal'; // Importado el nuevo efecto de impacto
import { FormularioEditarCarta } from './formularioEditarcarta';
import type { Carta } from '.';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

type Props = {
  carta: Carta,
  onEliminar?: (id: number) => void,
  onActualizar?: (cartaActualizada: Carta) => void,
  seleccionada: boolean,
  ocultarBotones?: boolean
};

function Cartadetalle({ carta, onEliminar, onActualizar, seleccionada, ocultarBotones = false }: Props) {
  const { ataque, defensa, imagen, nombre, categoria, ritual, clan, descripcion, id, hp, serie, voz } = carta;

  const [mostrarModal, setMostrarModal] = useState(false);
  const alternarModal = () => setMostrarModal(!mostrarModal);

  const [mostrarEditar, setMostrarEditar] = useState(false);
  const alternarEditar = () => setMostrarEditar(!mostrarEditar);

  const [reproduciendo, setReproduciendo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleVoz = () => {
    if (reproduciendo) {
      // Detener reproducción
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setReproduciendo(false);
    } else {
      // Iniciar reproducción
      if (voz) {
        const audio = new Audio(voz);
        audio.volume = 0.7;
        audio.onended = () => setReproduciendo(false);
        audio.onerror = () => {
          setReproduciendo(false);
          alert('No se pudo reproducir la voz del personaje. Verifica la URL.');
        };
        audio.play().catch(() => {
          setReproduciendo(false);
          alert('Error al reproducir. El navegador puede bloquear la reproducción automática.');
        });
        audioRef.current = audio;
        setReproduciendo(true);
      }
    }
  };

  // Limpiar audio al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  return (
    <div className={`relative group p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/40 to-transparent hover:from-purple-500 transition-all duration-500 ${seleccionada ? 'ring-4 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>

      {/* TARJETA EXTERIOR */}
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
          <>
            <button
              onClick={alternarModal}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
              Expandir Dominio
            </button>
            <button
              onClick={alternarEditar}
              className="w-full py-2.5 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
              Editar Carta
            </button>
          </>
        )}
      </div>

      {/* MODAL DE EDICIÓN */}
      <Modal
        isOpen={mostrarEditar}
        onClose={alternarEditar}
        title={`Editando a: ${nombre}`}
      >
        <FormularioEditarCarta
          carta={{ ataque, defensa, imagen, nombre, categoria, ritual, clan, descripcion, id, hp, serie, voz }}
          onActualizar={onActualizar}
          onClose={alternarEditar}
        />
      </Modal>

      {/* MODAL DE EXPEDIENTE */}
      <Modal
        isOpen={mostrarModal}
        onClose={alternarModal}
        title={`EXPEDIENTE: ${nombre}`}
      >
        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full h-full min-h-[450px]">

          {/* SECCIÓN IZQUIERDA */}
          <div className="relative w-full md:w-[45%] lg:w-[40%] h-64 md:h-auto rounded-xl overflow-hidden border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex-shrink-0 bg-black/50">
            <CardClickEffect>
              <div
                className="absolute inset-0 bg-cover bg-center blur-md opacity-30 transform scale-110"
                style={{ backgroundImage: `url(${imagen})` }}
              ></div>
              <img
                src={imagen}
                alt={nombre}
                className="relative z-10 w-full h-full object-cover object-center transition-transform duration-1000"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80 pointer-events-none"></div>
              <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-md">
                <span className="text-[10px] text-white/70 tracking-[0.2em] uppercase font-black">{categoria}</span>
              </div>
            </CardClickEffect>
          </div>

          {/* SECCIÓN DERECHA */}
          <div className="flex-1 flex flex-col justify-between space-y-6">

            <div className="space-y-5">
              {/* ✅ Botón de voz en el modal (si tiene voz) */}
              {voz && (
                <div className="flex justify-center">
                  <button
                    onClick={toggleVoz}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-3 ${reproduciendo
                      ? 'bg-amber-600 text-white animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-amber-950/40 border-2 border-amber-500/40 text-amber-400 hover:bg-amber-900/60 hover:border-amber-400 hover:scale-105'
                      }`}
                  >
                    {reproduciendo ? (
                      <>
                        <FiVolumeX className="text-xl animate-bounce" />
                        <span>Detener Voz</span>
                        <span className="text-[8px] text-amber-300/60">Reproduciendo...</span>
                      </>
                    ) : (
                      <>
                        <FiVolume2 className="text-xl" />
                        <span>Reproducir Voz del Personaje</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Bloques de Información Básica */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-transparent border-l-2 border-purple-500 rounded-r-lg">
                  <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Clan Afiliado</span>
                  <span className="text-white text-sm font-black tracking-wider">{clan}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-500/10 to-transparent border-l-2 border-pink-500 rounded-r-lg">
                  <span className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">Técnica Ritual</span>
                  <span className="text-white text-sm font-black tracking-wider">{ritual}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500 rounded-r-lg">
                  <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Serie</span>
                  <span className="text-white text-sm font-black tracking-wider">{serie}</span>
                </div>

                {/* ✅ Indicador de voz disponible */}
                {voz && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/10 to-transparent border-l-2 border-amber-500 rounded-r-lg">
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Línea de Voz</span>
                    <span className="text-white text-sm font-black tracking-wider flex items-center gap-2">
                      <FiVolume2 className="text-amber-400" size={14} />
                      Disponible
                    </span>
                  </div>
                )}
              </div>

              {/* Estadísticas de Combate */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative overflow-hidden rounded-lg bg-[#0f0f13] border border-red-500/20 p-3 flex flex-col items-center group/stat">
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600/50 group-hover/stat:shadow-[0_0_10px_#dc2626] transition-shadow"></div>
                  <span className="text-[10px] text-red-500 font-bold tracking-[0.2em] mb-1">ATQ</span>
                  <span className="text-lg font-black text-white">{ataque}</span>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-[#0f0f13] border border-blue-500/20 p-3 flex flex-col items-center group/stat">
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600/50 group-hover/stat:shadow-[0_0_10px_#2563eb] transition-shadow"></div>
                  <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] mb-1">DEF</span>
                  <span className="text-lg font-black text-white">{defensa}</span>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-[#0f0f13] border border-emerald-500/20 p-3 flex flex-col items-center group/stat">
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600/50 group-hover/stat:shadow-[0_0_10px_#059669] transition-shadow"></div>
                  <span className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] mb-1">VIT</span>
                  <span className="text-lg font-black text-white">{hp}</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="relative mt-2">
                <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-indigo-500 via-indigo-500/20 to-transparent"></div>
                <h4 className="text-[10px] text-indigo-400 mb-2 uppercase tracking-[0.3em] font-black">Registro del Expediente</h4>
                <p className="text-slate-300 text-sm leading-relaxed tracking-wide font-light italic opacity-90">
                  {descripcion}
                </p>
              </div>
            </div>

            {/* Zona de Controles */}
            <div className="flex justify-end items-center gap-3 pt-4 mt-auto">
              <button
                onClick={alternarModal}
                className="px-5 py-2.5 rounded-lg bg-transparent text-slate-300 text-[11px] font-black hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.15em]"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  if (onEliminar) onEliminar(id);
                }}
                className="px-5 py-2.5 rounded-lg bg-red-600/10 text-red-500 border border-red-600/30 text-[11px] font-black hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:border-red-500 transition-all uppercase tracking-[0.15em]"
              >
                Purgar Entidad
              </button>
            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Cartadetalle;