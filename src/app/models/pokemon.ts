export interface Ability {
    ability: {
        name: string,
        url: string
    },
    is_hidden: boolean,
    slot: number
}

export interface Type {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

export interface Stats {
    base_stat: number,
    effort: number,
    stat: {
        name: string,
        url: string
    }
}

export interface PokeData {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
}

export interface PokeDataWithArtwork {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
    artworkSrc: string,
}

export interface PokeDataEvolution {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
    artworkSrc: string,
}

export interface PokeApiShortResponse {
    name: string,
    url: string
}

export interface PokeApiResponse {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
    sprites: {
        other: {
            'official-artwork': { front_default: string }
        }
    },
}
