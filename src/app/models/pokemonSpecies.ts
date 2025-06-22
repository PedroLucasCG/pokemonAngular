export interface PokeSpeciesData {
    color: {
        name: string;
        url: string;
    };
    flavor_text_entries: FlavorTextEntry[];
    evolution_chain: {
        url: string;
    };
}

export interface FlavorTextEntry {
    flavor_text: string;
    language: {
        name: string;
        url: string;
    };
    version: {
        name: string;
        url: string;
    };
}

export interface EvolutionNode {
    species: {
        name: string;
        url: string;
    };
    evolves_to: EvolutionNode[];
}
