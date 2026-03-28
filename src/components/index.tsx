export interface Carta {
    id: number;
    nombre: string;
    categoria: string;
    ritual: string;
    ataque: number;
    defensa: number;
    imagen: string;
    clan: string;
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
        "lifePoints": number,
        "pictureUrl": string,
        "attributes": {clan?: string, ritual: string, categoria: string},
        "userSecret": string,
        "createdAt": string,
        "updatedAt": string | null,
}

export const toApiCardMapper = (carta: Carta) => {
    return{
        name: carta.nombre,
        description: carta.descripcion,
        pictureUrl: carta.imagen || "https://i.pinimg.com/originals/a6/e2/59/a6e2591c2fde4b61374422b8ea7b0ab9.jpg",
        lifePoints: Number(carta.hp),
        attack: Number(carta.ataque),
        defense: Number(carta.defensa),
        attributes: {
            clan: carta.clan,
            ritual: carta.ritual,
            categoria: carta.categoria,
            }
        }
    }

export const toCardApiMapper = (apiCard: IApiCard): Carta => ({
    id: parseInt(apiCard.idCard),
    nombre: apiCard.name,
    categoria: apiCard.attributes?.categoria,
    ritual: apiCard.attributes?.ritual,
    ataque: apiCard.attack,
    defensa: apiCard.defense,
    imagen: apiCard.pictureUrl,
    clan: apiCard.attributes?.clan || "",
    descripcion: apiCard.description,
    hp: apiCard.lifePoints, 
})

