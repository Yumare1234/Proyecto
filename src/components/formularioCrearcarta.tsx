// components/FormularioCrearCarta.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router'; 
import { InputField } from './inputField'; 
import type { NuevaCarta } from './index'; 

interface FormularioProps {
  onAñadirCarta: (carta: NuevaCarta) => void;
}

export const FormularioCrearCarta: React.FC<FormularioProps> = ({ onAñadirCarta }) => {
  const estadoInicial: Omit<NuevaCarta, 'id'> = {
    nombre: '',
    Clan: '',
    ritual: '',
    categoria: '',
    descripcion: '',
    ataque: 1000,
    defensa: 1000,
    imagen: '',
  };

  const [form, setForm] = useState<Omit<NuevaCarta, 'id'>>(estadoInicial);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    setForm(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.imagen.trim()) {
      alert("Por favor, rellena los campos obligatorios (Nombre e Imagen).");
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
    <div className="bg-slate-900/70 border border-purple-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 underline decoration-purple-500">
        Inscribir Nuevo Hechicero
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
          label="Nombre del Personaje" 
          id="nombre" 
          name="nombre" 
          placeholder="Ej: Satoru Gojo" 
          value={form.nombre} 
          onChange={handleChange} 
          required 
        />
        
        <InputField 
          label="URL de la Imagen" 
          id="imagen" 
          name="imagen" 
          type="url" 
          placeholder="https://ejemplo.com/imagen.jpg" 
          value={form.imagen} 
          onChange={handleChange} 
          required 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Clan" id="Clan" name="Clan" placeholder="Gojo, Zenin..." value={form.Clan} onChange={handleChange} />
          <InputField label="Categoría" id="categoria" name="categoria" placeholder="Especial, 1º Grado..." value={form.categoria} onChange={handleChange} />
        </div>

        <InputField label="Técnica / Ritual" id="ritual" name="ritual" placeholder="Ilimitado..." value={form.ritual} onChange={handleChange} />
        
        <InputField 
          label="Descripción" 
          id="descripcion" 
          name="descripcion" 
          placeholder="Escribe una breve historia..." 
          value={form.descripcion} 
          onChange={handleChange} 
          isTextArea 
        />
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <InputField label="Poder de Ataque (⚔️)" id="ataque" name="ataque" type="number" value={form.ataque} onChange={handleChange} placeholder='0'/>
          <InputField label="Poder de Defensa (🛡️)" id="defensa" name="defensa" type="number" value={form.defensa} onChange={handleChange} placeholder='0'/>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all active:scale-95 uppercase text-sm tracking-widest"
        > 
          Crear Carta
        </button>
      </form>
    </div>
  );
};