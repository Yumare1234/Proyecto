import { useState } from 'react';
import { Sword, Shield } from 'lucide-react';
import { type Carta } from './index.tsx';

interface Props {
  carta: Carta;
  onActualizar?: (carta: Carta) => void;
  onClose: () => void;
}

export const FormularioEditarCarta = ({ carta, onActualizar, onClose }: Props) => {
  const [formData, setFormData] = useState<Carta>(carta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActualizar?.(formData);
    onClose();
  };

  return (
    // Ya no incluimos el título ni el botón de cierre aquí
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-2">
      
      {/* Input de Nombre */}
      <input 
        className="bg-zinc-900/80 p-3 rounded-lg border-2 border-purple-500/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-300 transition-colors text-white"
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        placeholder="Nombre de la carta"
      />

      {/* Inputs de Ataque y Defensa con el fix para el 0 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Sword className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <input 
            type="number"
            className="bg-zinc-900/80 p-3 pl-10 w-full rounded-lg border-2 border-purple-500/80 focus:border-purple-300 text-white"
            // Si el valor es 0, mostramos cadena vacía para que puedas borrar
            value={formData.ataque === 0 ? "" : formData.ataque}
            onChange={(e) => setFormData({...formData, ataque: e.target.value === "" ? 0 : Number(e.target.value)})}
            placeholder="Ataque"
          />
        </div>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <input 
            type="number"
            className="bg-zinc-900/80 p-3 pl-10 w-full rounded-lg border-2 border-purple-500/80 focus:border-purple-300 text-white"
            // Lo mismo para defensa
            value={formData.defensa === 0 ? "" : formData.defensa}
            onChange={(e) => setFormData({...formData, defensa: e.target.value === "" ? 0 : Number(e.target.value)})}
            placeholder="Defensa"
          />
        </div>
      </div>

      <textarea 
        className="bg-zinc-900/80 p-3 h-32 rounded-lg border-2 border-purple-500/80 focus:border-purple-300 text-white resize-none"
        value={formData.descripcion}
        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        placeholder="Descripción de la carta..."
      />

      <button 
        type="submit" 
        className="bg-emerald-600 p-3 rounded-lg font-bold uppercase text-xl text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]"
      >
        Guardar Cambios
      </button>
    </form>
  );
};