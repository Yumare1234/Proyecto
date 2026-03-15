import { useMemo, useState } from 'react';
import type { Carta } from './index';
import Cartadetalle from './CartaProyecto';

const Home = ({ cartas }: { cartas: Carta[] }) => {
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
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {cartasfiltradas.length > 0 ? (
        cartasfiltradas.map((carta) => (
        <Cartadetalle key={carta.id} {...carta} />
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