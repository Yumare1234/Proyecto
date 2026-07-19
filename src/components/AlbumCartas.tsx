import { useMemo } from 'react';
import { Link } from 'react-router';
import type { Carta } from './index';

type AlbumPersonaje = {
  id: number;
  nombre: string;
  clan: string;
  categoria: string;
  ritual: string;
  descripcion: string;
};

// Catálogo expandido a 24 espacios
const albumPersonajes: AlbumPersonaje[] = [
  { id: 1, nombre: 'Satoru Gojo', clan: 'Gojo', categoria: 'Grado Especial', ritual: 'Ojo Infinito', descripcion: 'El hechicero más poderoso del mundo. Su técnica desafía la realidad misma.' },
  { id: 2, nombre: 'Yuji Itadori', clan: 'Itadori', categoria: 'Primer Año', ritual: 'Puño Divergente / Santuario', descripcion: 'El contenedor de Sukuna, poseedor de una fuerza sobrehumana y un espíritu indomable.' },
  { id: 3, nombre: 'Megumi Fushiguro', clan: 'Zenin', categoria: 'Segundo Grado', ritual: 'Técnica de las Diez Sombras', descripcion: 'Estratega brillante que utiliza shikigamis invocados desde las sombras.' },
  { id: 4, nombre: 'Nobara Kugisaki', clan: 'Kugisaki', categoria: 'Tercer Grado', ritual: 'Técnica de la Muñeca Paja', descripcion: 'Implacable y orgullosa, ataca directamente el alma de sus enemigos.' },
  { id: 5, nombre: 'Ryomen Sukuna', clan: 'Desconocido', categoria: 'Rey de las Maldiciones', ritual: 'Santuario Malévolo', descripcion: 'La calamidad encarnada. Su sola presencia infunde terror absoluto.' },
  { id: 6, nombre: 'Kento Nanami', clan: 'Desconocido', categoria: 'Primer Grado', ritual: 'Técnica de Proporción', descripcion: 'Ex oficinista pragmático que divide a sus enemigos en una proporción de 7:3.' },
  { id: 7, nombre: 'Maki Zenin', clan: 'Zenin', categoria: 'Restricción Celestial', ritual: 'Maestría en Armas', descripcion: 'Rechazada por su clan, compensa su falta de energía maldita con una fuerza física destructiva.' },
  { id: 8, nombre: 'Toge Inumaki', clan: 'Inumaki', categoria: 'Segundo Grado', ritual: 'Discurso Maldito', descripcion: 'Sus palabras son armas literales; restringe su vocabulario para no maldecir a sus aliados.' },
  { id: 9, nombre: 'Panda', clan: 'Mutación', categoria: 'Segundo Grado', ritual: 'Núcleos Intercambiables', descripcion: 'Un cadáver maldito mutado creado por Yaga, posee tres núcleos con habilidades distintas.' },
  { id: 10, nombre: 'Aoi Todo', clan: 'Desconocido', categoria: 'Primer Grado', ritual: 'Boogie Woogie', descripcion: 'Extcéntrico y abrumadoramente fuerte. Cambia de posición con cualquier cosa que tenga energía maldita.' },
  { id: 11, nombre: 'Yuta Okkotsu', clan: 'Sugawara', categoria: 'Grado Especial', ritual: 'Copia / Rika', descripcion: 'Un prodigio atormentado que canaliza un poder infinito a través de la Reina de las Maldiciones.' },
  { id: 12, nombre: 'Suguru Geto', clan: 'Desconocido', categoria: 'Grado Especial', ritual: 'Manipulación de Maldiciones', descripcion: 'Idealista caído que absorbe y controla espíritus malditos a su voluntad.' },
  { id: 13, nombre: 'Toji Fushiguro', clan: 'Zenin', categoria: 'Restricción Celestial', ritual: 'Asesino de Hechiceros', descripcion: 'El hombre que rompió el destino. Cero energía maldita, instinto asesino absoluto.' },
  { id: 14, nombre: 'Mahito', clan: 'Maldición', categoria: 'Grado Especial', ritual: 'Mutación Inactiva', descripcion: 'Nacido del odio humano. Disfruta retorciendo las almas de sus víctimas.' },
  { id: 15, nombre: 'Choso', clan: 'Kamo', categoria: 'Pintura de la Muerte', ritual: 'Manipulación de Sangre', descripcion: 'El hermano mayor de las pinturas de la muerte. Su sangre es tóxica y letal.' },
  { id: 16, nombre: 'Jogo', clan: 'Maldición', categoria: 'Grado Especial', ritual: 'Llamas Desastrosas', descripcion: 'La encarnación del miedo a los volcanes. Posee un poder destructivo masivo.' },
  { id: 17, nombre: 'Hanami', clan: 'Maldición', categoria: 'Grado Especial', ritual: 'Magia Botánica', descripcion: 'Nacido del miedo a los bosques. Busca erradicar a la humanidad para salvar la naturaleza.' },
  { id: 18, nombre: 'Kenjaku', clan: 'Kamo (Antiguo)', categoria: 'Milenario', ritual: 'Trasplante de Cerebro', descripcion: 'Mente maestra detrás de los peores desastres, parasitando cuerpos a lo largo de los siglos.' },
  { id: 19, nombre: 'Kinji Hakari', clan: 'Desconocido', categoria: 'Estudiante', ritual: 'Descanso Privado (Jackpot)', descripcion: 'Jugador empedernido cuya expansión de dominio lo vuelve inmortal temporalmente si tiene suerte.' },
  { id: 20, nombre: 'Hiromi Higuruma', clan: 'Desconocido', categoria: 'Primer Grado', ritual: 'Juicio Mortal', descripcion: 'Abogado prodigio que impone la ley en el campo de batalla mediante un juicio maldito.' },
  { id: 21, nombre: 'Hajime Kashimo', clan: 'Antiguo', categoria: 'Hechicero Encarnado', ritual: 'Energía Eléctrica', descripcion: 'El dios del trueno de hace 400 años. Vive únicamente para encontrar un oponente digno.' },
  { id: 22, nombre: 'Uraume', clan: 'Desconocido', categoria: 'Milenario', ritual: 'Formación de Hielo', descripcion: 'Leal seguidor y chef de Sukuna, capaz de congelar el campo de batalla en un instante.' },
  { id: 23, nombre: 'Mei Mei', clan: 'Desconocido', categoria: 'Primer Grado', ritual: 'Manipulación de Cuervos', descripcion: 'Mercenaria de élite. Para ella, todo se reduce al valor del dinero.' },
  { id: 24, nombre: 'Mai Zenin', clan: 'Zenin', categoria: 'Tercer Grado', ritual: 'Construcción', descripcion: 'Hermana de Maki. Puede crear un objeto de la nada a costa de una inmensa energía.' },
];

const normalizeString = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// Nueva función de búsqueda estricta. Ya no confunde nombres cortos.
const areNamesSimilar = (a: string, b: string) => {
  const normalizedA = normalizeString(a);
  const normalizedB = normalizeString(b);

  if (normalizedA === normalizedB) return true;
  if (normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)) return true;

  const wordsA = normalizedA.split(' ');
  const wordsB = normalizedB.split(' ');

  const bIsInA = wordsB.every((w) => wordsA.includes(w));
  const aIsInB = wordsA.every((w) => wordsB.includes(w));

  return bIsInA || aIsInB;
};

const AlbumCartas = ({ cartas }: { cartas: Carta[] }) => {
  const cartasJujutsu = useMemo(
    () =>
      cartas.filter((carta) => {
        const serieStr = normalizeString(carta.serie || '');
        return serieStr.includes('jujutsu') || serieStr === 'jjk';
      }),
    [cartas],
  );

  const albumEntradas = useMemo(
    () =>
      albumPersonajes.map((personaje) => {
        const cartaDescubierta = cartasJujutsu.find((carta) => {
          const nombreCarta = carta.nombre || '';
          return areNamesSimilar(nombreCarta, personaje.nombre);
        });
        return {
          ...personaje,
          descubierto: Boolean(cartaDescubierta),
          cartaDescubierta,
        };
      }),
    [cartasJujutsu],
  );

  const descubiertasCount = albumEntradas.filter((entrada) => entrada.descubierto).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#030305] text-gray-200 overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-red-900/10 blur-[150px] pointer-events-none" />

      <header className="z-50 sticky top-0 bg-[#030305]/90 backdrop-blur-xl border-b border-purple-900/40 px-4 md:px-8 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-red-500">
              <span className="bg-red-950/50 border border-red-900/50 px-3 py-1 rounded-sm">Registro Maldito</span>
              <span className="text-purple-400">Jujutsu Kaisen</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-md">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-600">Personajes</span>
            </h1>
            <p className="max-w-2xl text-sm text-slate-400 leading-relaxed">
              Expansión de dominio completada. Aquí residen únicamente las almas de la serie Jujutsu Kaisen. Las cartas obtenidas romperán su sello.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="rounded-xl border border-purple-900/30 bg-black/60 px-5 py-3 text-center shadow-[0_0_20px_rgba(88,28,135,0.2)]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400">Desbloqueadas</p>
              <p className="mt-1 text-2xl font-black text-white">
                <span className="text-red-500">{descubiertasCount}</span>
                <span className="text-slate-600 mx-1">/</span>
                {albumEntradas.length}
              </p>
            </div>
            <Link to="/" className="inline-flex w-full sm:w-auto">
              <button className="w-full relative overflow-hidden rounded-xl bg-slate-900 border border-purple-800/50 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-purple-300 transition-all hover:bg-purple-900/20 hover:border-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95">
                ← Volver al Nexo
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <section className="grid gap-8 xl:grid-cols-[1fr_3fr]">
          
          <div className="relative overflow-hidden rounded-2xl border border-red-900/20 bg-gradient-to-b from-[#0a0a0f] to-black p-6 shadow-2xl xl:h-fit xl:sticky xl:top-32">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px]" />
            <div className="relative flex flex-col gap-6">
              <div>
                <span className="inline-flex rounded-sm border border-red-900/50 bg-red-950/30 px-2 py-1 text-[9px] uppercase tracking-[0.4em] text-red-500 font-bold">
                  Archivo Confidencial
                </span>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tighter text-white">Colección JJK</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Hechiceros Totales</p>
                  <p className="mt-1 text-2xl font-black text-white">{albumEntradas.length}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Estado del Sello</p>
                  <p className="mt-1 text-2xl font-black text-white">{descubiertasCount}</p>
                  <p className={`mt-1 text-[9px] uppercase tracking-[0.2em] font-bold ${descubiertasCount === albumEntradas.length ? 'text-purple-400' : 'text-red-500'}`}>
                    {descubiertasCount === albumEntradas.length ? 'Sellos Rotos' : 'Incompleto'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {albumEntradas.map((entrada) => {
              const carta = entrada.cartaDescubierta;
              const isHidden = !entrada.descubierto;
              const tarjetaNombre = isHidden ? 'Sello Maldito' : carta?.nombre ?? entrada.nombre;
              const tarjetaImagen = isHidden ? '/imagenes/Logo.png' : carta?.imagen || '/imagenes/Logo.png';

              return (
                <article
                  key={entrada.id}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-500 hover:-translate-y-2 ${
                    isHidden 
                      ? 'border-red-900/30 bg-[#050508] shadow-[0_10px_30px_rgba(220,38,38,0.05)]' 
                      : 'border-purple-600/30 bg-gradient-to-b from-[#100b1a] to-black shadow-[0_10px_40px_rgba(147,51,234,0.15)] hover:border-purple-400/80 hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]'
                  }`}
                >
                  {/* --- EFECTO DE DESTELLO (GLARE) --- */}
                  {!isHidden && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
                      <div className="absolute top-0 -left-[150%] h-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%]" />
                      <div className="absolute inset-0 bg-purple-500/0 transition-colors duration-500 group-hover:bg-purple-500/10 mix-blend-overlay" />
                    </div>
                  )}

                  <div className="relative overflow-hidden border-b border-white/5 bg-black h-48">
                    <img
                      src={tarjetaImagen}
                      alt={tarjetaNombre}
                      className={`h-full w-full object-cover transition-transform duration-700 ${
                        isHidden ? 'scale-105 blur-md opacity-20 grayscale' : 'group-hover:scale-110 opacity-90'
                      }`}
                    />
                    
                    {isHidden ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/60">
                        <div className="relative flex h-20 w-7 flex-col items-center justify-center bg-red-700 border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.6)] transform -rotate-6">
                          <span className="text-black font-black text-[10px] [writing-mode:vertical-lr] tracking-widest">封印</span>
                        </div>
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 drop-shadow-md">Sellado</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    )}
                  </div>

                  <div className="relative z-10 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={`text-sm font-black uppercase tracking-tight transition-colors duration-300 ${isHidden ? 'text-red-700' : 'text-white group-hover:text-purple-300'}`}>
                          {tarjetaNombre}
                        </h3>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{entrada.categoria}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className={`rounded-lg p-2 transition-colors duration-300 ${isHidden ? 'bg-black/50 border border-red-900/20' : 'bg-purple-950/20 border border-purple-900/20 group-hover:border-purple-500/40 group-hover:bg-purple-900/30'}`}>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-600">Clan</p>
                        <p className={`mt-1 text-[10px] font-bold truncate ${isHidden ? 'text-slate-700' : 'text-slate-300'}`}>
                          {isHidden ? '???' : (entrada.clan || 'Desconocido')}
                        </p>
                      </div>
                      <div className={`rounded-lg p-2 transition-colors duration-300 ${isHidden ? 'bg-black/50 border border-red-900/20' : 'bg-purple-950/20 border border-purple-900/20 group-hover:border-purple-500/40 group-hover:bg-purple-900/30'}`}>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-slate-600">Técnica</p>
                        <p className={`mt-1 text-[10px] font-bold truncate ${isHidden ? 'text-slate-700' : 'text-purple-300'}`}>
                          {isHidden ? '???' : entrada.ritual}
                        </p>
                      </div>
                    </div>

                    <div className={`rounded-lg border p-2.5 text-[11px] leading-relaxed transition-colors duration-300 ${
                      isHidden 
                        ? 'border-red-900/20 bg-black/40 text-red-900/50' 
                        : 'border-white/5 bg-white/[0.02] text-slate-400 group-hover:border-purple-500/30 group-hover:text-slate-300'
                    }`}>
                      <p className="line-clamp-3">
                        {isHidden ? 'Esta energía maldita aún no ha sido contenida. Obtenla para revelar sus secretos.' : (carta?.descripcion ?? entrada.descripcion)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AlbumCartas;