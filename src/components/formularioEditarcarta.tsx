import { useState } from 'react';
import { type Carta } from './index.tsx';

interface Props {
  carta: Carta;
  onActualizar: (carta: Carta) => void;
  onClose: () => void;
}

export const FormularioEditarCarta = ({ carta, onActualizar, onClose }: Props) => {
  // Inicializamos el estado con los datos actuales de la carta
  const [formData, setFormData] = useState<Carta>(carta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActualizar(formData); // Enviamos los datos editados a la API
    onClose(); // Cerramos el modal
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 text-white">
      <input 
        className="bg-slate-800 p-2 rounded border border-purple-500"
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        placeholder="Nombre"
      />
      <div className="grid grid-cols-2 gap-2">
        <input 
          type="number"
          className="bg-slate-800 p-2 rounded border border-purple-500"
          value={formData.ataque}
          onChange={(e) => setFormData({...formData, ataque: Number(e.target.value)})}
          placeholder="Ataque"
        />
        <input 
          type="number"
          className="bg-slate-800 p-2 rounded border border-purple-500"
          value={formData.defensa}
          onChange={(e) => setFormData({...formData, defensa: Number(e.target.value)})}
          placeholder="Defensa"
        />
      </div>
      <textarea 
        className="bg-slate-800 p-2 rounded border border-purple-500"
        value={formData.descripcion}
        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        placeholder="Descripción"
      />
      <button type="submit" className="bg-green-600 py-2 rounded-xl font-bold uppercase hover:bg-green-500 transition-colors">
        Guardar Cambios
      </button>
    </form>
  );
};