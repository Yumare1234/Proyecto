import { useMemo, useState } from 'react';
import type { Carta } from './index';
import Cartadetalle from './CartaProyecto';
import { Link } from 'react-router';
import { FormularioCrearCarta } from './formularioCrearcarta';

const Home = ({ cartas, onEliminar, onAñadirCarta }: { cartas: Carta[]; onEliminar: (id: number) => void; onAñadirCarta: (carta: Carta) => void }) => {
    const [busqueda, setBusqueda] = useState('');
    const cartasfiltradas = useMemo(() => {
    const term = busqueda.toLowerCase();
    return cartas.filter(carta => 
    carta.nombre.toLowerCase().includes(term) || 
    carta.categoria.toLowerCase().includes(term)
    );
}, [busqueda, cartas]);


return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-purple-900 via-purple-600 to-violet-900 p-5">
        <div className="flex items-center gap-10 border-black rounded-2xl bg-blue-950 px-6 py-4 mb-8 shadow-2xl">
        <img src="/imagenes/Logo.png" alt="Logo" className="h-16 w-auto" />
        <h1 className="text-2xl md:text-4xl font-bold text-white uppercase">
        Jujutsu Kaisen Cards
        </h1>
        <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar hechicero o grado..."
            className="p-3 rounded-xl bg-purple-900/50 border border-purple-400 text-white outline-none w-full max-w-md focus:ring-2 focus:ring-purple-300"
        />
        <Link to="/crear-carta">
        <button className="mt-10 w-full max-w-sm mx-auto bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all active:scale-95 uppercase text-sm tracking-widest">
            Crear Carta
        </button>
        </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {cartasfiltradas.length > 0 ? (
        cartasfiltradas.map((carta) => (
        <Cartadetalle key={carta.id} {...carta} onEliminar={onEliminar} />
        ))
) : (
        <p className="text-white text-center col-span-full opacity-50 italic py-10">
        No se encontraron resultados para "{busqueda}"
        </p>
    )}
</div>
        
        </div>
    );
};

export default Home;