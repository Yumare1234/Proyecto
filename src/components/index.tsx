export interface Carta {
    id: number;
    nombre: string;
    categoria: string;
    ritual: string;
    ataque: number;
    defensa: number;
    imagen: string;
    Clan: string;
    descripcion: string;
}

export interface Cartasprops {
    carta: Carta;
}

export type NuevaCarta = Carta;

export interface Eliminar {
    carta: Carta;
    onEliminar: (id: number) => void;
}