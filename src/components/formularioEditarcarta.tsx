import { useState } from 'react';
import { Sword, Shield, Heart } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4 p-3 bg-slate-950/90 rounded-3xl border border-white/10 shadow-[0_0_24px_rgba(0,0,0,0.45)]">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-slate-900/90 p-3 border border-white/10 shadow-[inset_0_0_16px_rgba(255,255,255,0.05)]">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Editar carta</p>
            <h2 className="text-2xl font-black text-white tracking-tight">{carta.nombre}</h2>
          </div>
          <p className="text-sm text-slate-300 leading-6">
            Ajusta el nombre, atributos y descripción antes de actualizar la carta en el mazo.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Nombre</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre de la carta"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Serie</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-3 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.serie}
            onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
            placeholder="Serie al que pertenece"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Clan</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.clan}
            onChange={(e) => setFormData({ ...formData, clan: e.target.value })}
            placeholder="Clan al que pertenece"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Categoría</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-3 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            placeholder="Especial, Grado 1, etc."
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Técnica / Ritual</span>
        <input
          className="mt-2 w-full bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
          value={formData.ritual}
          onChange={(e) => setFormData({ ...formData, ritual: e.target.value })}
          placeholder="Nombre de la técnica o ritual"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block relative">
          <Sword className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Ataque</span>
          <input
            type="number"
            className="mt-2 h-12 w-full bg-slate-900/80 p-2.5 pl-12 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.ataque === 0 ? '' : formData.ataque}
            onChange={(e) => setFormData({ ...formData, ataque: e.target.value === '' ? 0 : Number(e.target.value) })}
            placeholder="0"
          />
        </label>
        <label className="block relative">
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300" />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Defensa</span>
          <input
            type="number"
            className="mt-2 h-12 w-full bg-slate-900/80 p-3 pl-12 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.defensa === 0 ? '' : formData.defensa}
            onChange={(e) => setFormData({ ...formData, defensa: e.target.value === '' ? 0 : Number(e.target.value) })}
            placeholder="0"
          />
        </label>
        <label className="block relative">
          <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Vida</span>
          <input
            type="number"
            className="mt-2 h-12 w-full bg-slate-900/80 p-3 pl-12 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.hp === 0 ? '' : formData.hp}
            onChange={(e) => setFormData({ ...formData, hp: e.target.value === '' ? 0 : Number(e.target.value) })}
            placeholder="0"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Imagen</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-2.5 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.imagen}
            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
            placeholder="URL de la imagen"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Voz</span>
          <input
            className="mt-2 w-full bg-slate-900/80 p-3 rounded-2xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.voz || ''}
            onChange={(e) => setFormData({ ...formData, voz: e.target.value })}
            placeholder="URL opcional de la voz"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Descripción</span>
        <textarea
          className="mt-2 w-full bg-slate-900/80 p-3 min-h-[140px] rounded-3xl border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder:text-slate-500 transition resize-none"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          placeholder="Descripción de la carta..."
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-200 hover:bg-white/10 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(236,72,153,0.45)] transition"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};