import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonService } from '../features/pokemons/services/pokemon.service';
import { PokemonSpeciesService } from '../features/pokemons/services/pokemonSpecies.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { LucideIconData } from 'lucide-angular';
import { firstValueFrom, Observable } from 'rxjs';
import { LucideAngularModule, Heart, Swords, Shield, ShieldHalf, Zap, LoaderPinwheel } from 'lucide-angular';

interface Ability {
    ability: {
        name: string,
        url: string
    },
    is_hidden: boolean,
    slot: number
}

interface Type {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

interface Stats {
    base_stat: number,
    effort: number,
    stat: {
        name: string,
        url: string
    }
}

interface PokeData {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
}

interface PokeDataEvolution {
    id: number,
    name: string,
    types: Type[],
    height: number,
    weight: number,
    abilities: Ability[]
    stats: Stats[],
    sprite: string,
}

interface PokeSpeciesData {
    color: {
        name: string;
        url: string;
    };
    flavor_text_entries: FlavorTextEntry[];
    evolution_chain: {
        url: string;
    };
}

interface FlavorTextEntry {
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

interface PokeApiResponse {
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

interface EvolutionChain {
    id: number;
    chain: EvolutionNode;
}

interface EvolutionNode {
    species: {
        name: string;
        url: string;
    };
    evolves_to: EvolutionNode[];
}

const pokemonColorMap: Record<string, string> = {
  black: '#7d7d7d',
  blue: '#a5c8ff',
  brown: '#d2b48c',
  gray: '#d3d3d3',
  green: '#b2e2b2',
  pink: '#ffc1cc',
  purple: '#d1b3ff',
  red: '#E34234',
  white: '#ededed',
  yellow: '#fff5b3',
};

@Component({
  selector: 'app-details',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
    artworkSrc = "";
    pokeData : PokeData | null = null;
    pokeEvolutionData : PokeDataEvolution[] = [];
    pokeSpecies : PokeSpeciesData | null = null;
    randomIndex : number = 0;
    iconBackPokedex : string = "../../assets/imgs/play.png";
    evolutionChain : string[] = [];

    readonly icons : Record<string, LucideIconData> = {
        hp: Heart,
        attack: Swords,
        defense: Shield,
        'special-defense': ShieldHalf,
        speed: Zap,
        'special-attack': LoaderPinwheel
    }

    @Input({ required: true }) pageId!: string;

    constructor (
        private route: ActivatedRoute,
        private pokemonService: PokemonService,
        private pokemonSpeciesService: PokemonSpeciesService ) {}

    fetchPokemonData(id : number) {
        this.pokemonService.getById(id).subscribe(data => {
            this.artworkSrc = data.sprites.other["official-artwork"].front_default;
            this.pokeData = {
                id: data.id,
                name: data.name,
                types: data.types,
                height: data.height / 100,
                weight: data.weight / 100,
                abilities: data.abilities,
                stats: data.stats,
            };
        });
        this.pokemonSpeciesService.getById(id).subscribe(async data => {
            this.pokeSpecies = {
                color: data.color,
                flavor_text_entries : data.flavor_text_entries,
                evolution_chain: data.evolution_chain,
            }
            const englishEntries = data.flavor_text_entries.filter(
                (entry : FlavorTextEntry) => entry.language.name === 'en'
            );
            this.randomIndex = Math.floor(Math.random() * englishEntries.length);
            this.pokeSpecies.flavor_text_entries  = englishEntries;

            let evolutionUrl = this.pokeSpecies?.evolution_chain?.url;
            let evolutionChainData = await this.nextEvolution(evolutionUrl);
            this.evolutionDetails(evolutionChainData);

            for (const pokemon of this.evolutionChain) {
                this.pokemonService.getByName(pokemon).subscribe( pokemonData => {
                    this.pokeEvolutionData.push({
                        id: pokemonData.id,
                        name: pokemonData.name,
                        types: pokemonData.types,
                        height: pokemonData.height / 100,
                        weight: pokemonData.weight / 100,
                        abilities: pokemonData.abilities,
                        stats: pokemonData.stats,
                        sprite: pokemonData.sprites.other["official-artwork"].front_default
                    });
                });
            }

            console.log(this.pokeEvolutionData);
        });
    }

     evolutionDetails(evolutionChainData: EvolutionNode) {
        this.evolutionChain.push(evolutionChainData.species.name);

        for (const evol of evolutionChainData.evolves_to) {
            this.evolutionDetails(evol);
        }
    }


    async nextEvolution(evolutionUrl: string): Promise<EvolutionNode> {
        const data = await firstValueFrom(this.pokemonService.getWithUrl(evolutionUrl));
        return data.chain;
    }

    sanitizeFlavorText(text: string): string {
        return text
            .replace(/\n|\f/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    getFormattedId(): string {
        if (!this.pokeData?.id) return '';
        return this.pokeData.id.toString().padStart(3, '0');
    }

    getColor(name : string | undefined) {
        return pokemonColorMap[name || 'white'];
    }

    getContrastColor(hexColor: string): string {
        const color = hexColor.replace('#', '');

        const r = parseInt(color.slice(0, 2), 16);
        const g = parseInt(color.slice(2, 4), 16);
        const b = parseInt(color.slice(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? 'black' : 'white';
    }


    ngOnInit(){
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchPokemonData(parseInt(id));
        }
    }
}
