import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { InputField } from './inputField';
import { SelectorSonidoMyInstants } from './SelectorSonidoMyInstants'; // ← Importamos el selector
import type { NuevaCarta } from './index';

interface FormularioProps {
  onAñadirCarta: (carta: NuevaCarta) => void;
}

export const FormularioCrearCarta: React.FC<FormularioProps> = ({ onAñadirCarta }) => {
  const estadoInicial: Omit<NuevaCarta, 'id'> = {
    nombre: '',
    serie: '',
    clan: '',
    ritual: '',
    categoria: '',
    descripcion: '',
    ataque: 1000,
    defensa: 1000,
    imagen: '',
    hp: 1000,
    voz: '',
  };

  const [form, setForm] = useState<Omit<NuevaCarta, 'id'>>(estadoInicial);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      if (value === '') {
        setForm(prev => ({
          ...prev,
          [name]: 0
        }));
        return;
      }

      let numValue = Number(value);

      if (name === 'ataque' || name === 'defensa' || name === 'hp') {
        numValue = Math.min(numValue, 10000);
        numValue = Math.max(numValue, 0);
      }

      setForm(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejador específico para cuando se selecciona un sonido del buscador
  const handleSeleccionarVoz = (url: string) => {
    setForm(prev => ({ ...prev, voz: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.imagen.trim()) {
      alert("Por favor, rellena los campos obligatorios (Nombre e Imagen).");
      return;
    }

    if (form.ataque > 10000 || form.defensa > 10000 || form.hp > 10000) {
      alert("El ataque, la defensa y la vida máxima no pueden superar 10,000.");
      return;
    }

    if (form.ataque <= 0 || form.defensa <= 0 || form.hp <= 0) {
      alert("El ataque, la defensa y la vida deben ser mayores a 0.");
      return;
    }

    const nuevaCartaFinal: NuevaCarta = {
      ...form,
      id: Date.now(),
    };

    onAñadirCarta(nuevaCartaFinal);
    setForm(estadoInicial);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="relative w-full max-w-2xl my-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 rounded-2xl blur-xl opacity-30"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-transparent to-purple-600 rounded-2xl blur opacity-20"></div>

        <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-blue-500/30 p-8 shadow-2xl shadow-blue-500/20">
          <div className="relative mb-8 pb-4 border-b border-blue-500/30">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 tracking-tight">
              INSCRIBIR NUEVO HECHICERO
            </h2>
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-24 h-0.5 bg-gradient-to-l from-blue-500 to-transparent"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="NOMBRE DEL PERSONAJE *" id="nombre" name="nombre" placeholder="Ej: Satoru Gojo" value={form.nombre} onChange={handleChange} required />
            <InputField label="URL DE LA IMAGEN *" id="imagen" name="imagen" type="url" placeholder="https://ejemplo.com/imagen.jpg" value={form.imagen} onChange={handleChange} required />

            {/* 🔍 NUEVA SECCIÓN: BÚSQUEDA DE VOZ CON MYINSTANTS */}
            <div className="p-4 rounded-xl bg-black/30 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 text-lg">🔊</span>
                <h3 className="text-xs font-bold text-amber-400/80 uppercase tracking-wider">Línea de Voz del Personaje</h3>
                <span className="text-[10px] text-gray-600">(Opcional)</span>
              </div>

              {/* Buscador interactivo */}
              <SelectorSonidoMyInstants
                onSelect={handleSeleccionarVoz}
              />

              {/* Campo manual como alternativa */}
              <InputField
                label="O pega una URL manualmente"
                id="voz"
                name="voz"
                type="url"
                placeholder="https://ejemplo.com/voz.mp3"
                value={form.voz || ''}
                onChange={handleChange}
              />
              <p className="text-[10px] text-gray-600 mt-2">
                Usa el buscador para encontrar sonidos de MyInstants, o pega directamente la URL de un archivo .mp3 / .wav.
              </p>
            </div>

            <InputField label="SERIE *" id="serie" name="serie" placeholder="Ej: Jujutsu Kaisen" value={form.serie} onChange={handleChange} required />

            <div className="grid grid-cols-2 gap-5">
              <InputField label="CLAN" id="clan" name="clan" placeholder="Gojo, Zenin..." value={form.clan} onChange={handleChange} />
              <InputField label="CATEGORÍA" id="categoria" name="categoria" placeholder="Especial, 1º Grado..." value={form.categoria} onChange={handleChange} />
            </div>

            <InputField label="TÉCNICA / RITUAL" id="ritual" name="ritual" placeholder="Ilimitado..." value={form.ritual} onChange={handleChange} />
            <InputField label="DESCRIPCIÓN" id="descripcion" name="descripcion" placeholder="Escribe una breve historia sobre sus habilidades..." value={form.descripcion} onChange={handleChange} isTextArea />

            <div className="mt-6 p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-[0.2em] uppercase text-center">Estadísticas de Combate (Máx: 10,000)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <InputField
                      label="ATAQUE ⚔️" id="ataque" name="ataque" type="number"
                      value={form.ataque === 0 ? '' : form.ataque}
                      onChange={handleChange}
                      placeholder="1000"
                      min="0"
                      max="10000"
                    />
                    {form.ataque >= 10000 && (
                      <span className="text-[10px] text-amber-500 absolute -bottom-4 left-0">Límite alcanzado (10,000)</span>
                    )}
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <InputField
                      label="DEFENSA 🛡️" id="defensa" name="defensa" type="number"
                      value={form.defensa === 0 ? '' : form.defensa}
                      onChange={handleChange}
                      placeholder="1000"
                      min="0"
                      max="10000"
                    />
                    {form.defensa >= 10000 && (
                      <span className="text-[10px] text-amber-500 absolute -bottom-4 left-0">Límite alcanzado (10,000)</span>
                    )}
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                    <InputField
                      label="VIDA (HP) 💚" id="hp" name="hp" type="number"
                      value={form.hp === 0 ? '' : form.hp}
                      onChange={handleChange}
                      placeholder="1000"
                      min="0"
                      max="10000"
                    />
                    {form.hp >= 10000 && (
                      <span className="text-[10px] text-amber-500 absolute -bottom-4 left-0">Límite alcanzado (10,000)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button type="button" onClick={() => navigate('/')} className="w-full sm:w-1/3 py-4 border border-white/10 hover:border-red-500/40 hover:bg-red-950/20 text-gray-400 hover:text-red-400 font-bold rounded-xl text-xs tracking-widest transition-all duration-300 uppercase">Volver</button>
              <button type="submit" className="relative w-full sm:w-2/3 py-4 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-xl"></div>
                <span className="relative flex items-center justify-center gap-2 text-white font-bold uppercase text-xs tracking-[0.2em]">⚡ CREAR CARTA ⚡</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};