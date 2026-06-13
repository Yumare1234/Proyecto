import React, { useState } from 'react';
import { useNavigate } from 'react-router'; 
import { InputField } from './inputField'; 
import type { NuevaCarta } from './index'; 

interface FormularioProps {
  onAñadirCarta: (carta: NuevaCarta) => void;
}

export const FormularioCrearCarta: React.FC<FormularioProps> = ({ onAñadirCarta }) => {
  // 1. Definimos el estado inicial estable
  const estadoInicial: Omit<NuevaCarta, 'id'> = {
    nombre: '',
    clan: '',
    ritual: '',
    categoria: '',
    descripcion: '',
    ataque: 1000,
    defensa: 1000,
    imagen: '',
    hp: 1000,
  };

  // 2. Estado local
  const [form, setForm] = useState<Omit<NuevaCarta, 'id'>>(estadoInicial);
  const navigate = useNavigate();

  // 3. Función manejadora universal corregida
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Si es numérico y está vacío, permitimos el 0 temporalmente para que no se tranque al borrar
    const finalValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    
    setForm(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // 4. Procesar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación estricta de campos obligatorios
    if (!form.nombre.trim() || !form.imagen.trim()) {
      alert("Por favor, rellena los campos obligatorios (Nombre e Imagen).");
      return;
    }

    // Inyectamos un ID único basado en el timestamp actual
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
        {/* Efectos de luces de fondo (Neon Glow) */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-transparent to-blue-500 rounded-2xl blur-xl opacity-30"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 rounded-2xl blur opacity-20"></div>
        
        {/* Contenedor del Formulario */}
        <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-blue-500/30 p-8 shadow-2xl shadow-blue-500/20">
          
          {/* Encabezado */}
          <div className="relative mb-8 pb-4 border-b border-blue-500/30">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 tracking-tight">
              INSCRIBIR NUEVO HECHICERO
            </h2>
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-24 h-0.5 bg-gradient-to-l from-blue-500 to-transparent"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <InputField 
              label="NOMBRE DEL PERSONAJE *" 
              id="nombre" 
              name="nombre" 
              placeholder="Ej: Satoru Gojo" 
              value={form.nombre} 
              onChange={handleChange} 
              required 
            />
            
            {/* Imagen */}
            <InputField 
              label="URL DE LA IMAGEN *" 
              id="imagen" 
              name="imagen" 
              type="url" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={form.imagen} 
              onChange={handleChange} 
              required 
            />
            
            {/* Clan y Categoría (Grid) */}
            <div className="grid grid-cols-2 gap-5">
              {/* SOLUCIONADO: El name ahora coincide exactamente con 'clan' en minúscula */}
              <InputField 
                label="CLAN" 
                id="clan" 
                name="clan" 
                placeholder="Gojo, Zenin..." 
                value={form.clan} 
                onChange={handleChange} 
              />
              <InputField 
                label="CATEGORÍA" 
                id="categoria" 
                name="categoria" 
                placeholder="Especial, 1º Grado..." 
                value={form.categoria} 
                onChange={handleChange} 
              />
            </div>

            {/* Ritual */}
            <InputField 
              label="TÉCNICA / RITUAL" 
              id="ritual" 
              name="ritual" 
              placeholder="Ilimitado..." 
              value={form.ritual} 
              onChange={handleChange} 
            />
            
            {/* Descripción */}
            <InputField 
              label="DESCRIPCIÓN" 
              id="descripcion" 
              name="descripcion" 
              placeholder="Escribe una breve historia sobre sus habilidades..." 
              value={form.descripcion} 
              onChange={handleChange} 
              isTextArea 
            />
            
            {/* Atributos numéricos con límites lógicos */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="group relative">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <InputField 
                  label="ATAQUE ⚔️" 
                  id="ataque" 
                  name="ataque" 
                  type="number" 
                  value={form.ataque} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>
              <div className="group relative">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <InputField 
                  label="DEFENSA 🛡️" 
                  id="defensa" 
                  name="defensa" 
                  type="number" 
                  value={form.defensa} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>
              <div className="group relative">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <InputField 
                  label="VIDA (HP) 💚" 
                  id="hp" 
                  name="hp" 
                  type="number" 
                  value={form.hp} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-1/3 py-4 border border-white/10 hover:border-red-500/40 hover:bg-red-950/20 text-gray-400 hover:text-red-400 font-bold rounded-xl text-xs tracking-widest transition-all duration-300 uppercase"
              >
                Volver
              </button>

              <button
                type="submit"
                className="relative w-full sm:w-2/3 py-4 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                <span className="relative flex items-center justify-center gap-2 text-white font-bold uppercase text-xs tracking-[0.2em]">
                  ⚡ CREAR CARTA ⚡
                </span>
              </button>
            </div>

            {/* Detalles de carga inferior */}
            <div className="pt-2 flex justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-150"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse delay-300"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};