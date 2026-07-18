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
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-4 shadow-[0_0_28px_rgba(0,0,0,0.3)] backdrop-blur-sm">

      <div className="grid gap-3">
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Nombre</span>
          <input
            className="mt-2 w-full bg-slate-900/90 p-3 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre de la carta"
          />
        </label>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Serie</span>
          <input
            className="mt-2 w-full bg-slate-900/90 p-3 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.serie}
            onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
            placeholder="Serie a la que pertenece"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Clan</span>
            <input
              className="mt-2 w-full bg-slate-900/90 p-3 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
              value={formData.clan}
              onChange={(e) => setFormData({ ...formData, clan: e.target.value })}
              placeholder="Clan"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Categoría</span>
            <input
              className="mt-2 w-full bg-slate-900/90 p-3 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              placeholder="Grado o tipo"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Técnica / Ritual</span>
          <input
            className="mt-2 w-full bg-slate-900/90 p-3 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
            value={formData.ritual}
            onChange={(e) => setFormData({ ...formData, ritual: e.target.value })}
            placeholder="Técnica o ritual"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block relative">
            <Sword className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Ataque</span>
            <input
              type="number"
              className="mt-2 h-11 w-full bg-slate-900/90 p-3 pl-12 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
              value={formData.ataque === 0 ? '' : formData.ataque}
              onChange={(e) => setFormData({ ...formData, ataque: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
            />
          </label>

          <label className="block relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Defensa</span>
            <input
              type="number"
              className="mt-2 h-11 w-full bg-slate-900/90 p-3 pl-12 rounded-3xl border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition"
              value={formData.defensa === 0 ? '' : formData.defensa}
              onChange={(e) => setFormData({ ...formData, defensa: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Descripción</span>
          <textarea
            className="mt-2 w-full bg-slate-900/90 p-3 min-h-[130px] rounded-[1.5rem] border border-white/10 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20 text-white placeholder:text-slate-500 transition resize-none"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción de la carta..."
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-200 hover:bg-white/10 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_22px_rgba(168,85,247,0.35)] hover:shadow-[0_0_28px_rgba(236,72,153,0.45)] transition"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};