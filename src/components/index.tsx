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
    hp: number;
}

export interface Cartasprops {
    carta: Carta;
}

export type NuevaCarta = Carta;

export interface Eliminar {
    carta: Carta;
    onEliminar: (id: number) => void;
}

export interface IApiCard {
        "idCard": string,
        "name": string,
        "description": string,
        "attack": number,
        "defense": number,
        "lifePoints": 1500,
        "pictureUrl": "https://example.com/image.jpg",
        "attributes": {},
        "userSecret": null,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": null
}