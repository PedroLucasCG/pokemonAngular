import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonService } from '../features/pokemons/services/pokemon.service';
import { PokemonSpeciesService } from '../features/pokemons/services/pokemonSpecies.service';
import { ActivatedRoute } from '@angular/router';

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

export interface PokeSpeciesData {
    color: {
        name: string;
        url: string;
    };
    flavor_text_entries : FlavorTextEntry[];
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

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
    artworkSrc = "";
    pokeData : PokeData | null = null;
    pokeSpecies : PokeSpeciesData | null = null;
    randomIndex : number = 0;
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
                height: data.height,
                weight: data.weight,
                abilities: data.abilities,
                stats: data.stats,
            };
        });
        this.pokemonSpeciesService.getById(id).subscribe(data => {
            this.pokeSpecies = {
                color: data.color,
                flavor_text_entries : data.flavor_text_entries
            }
            const englishEntries = data.flavor_text_entries.filter(
                (entry : FlavorTextEntry) => entry.language.name === 'en'
            );
            this.randomIndex = Math.floor(Math.random() * englishEntries.length);
            this.pokeSpecies.flavor_text_entries  = englishEntries;
        });
    }

    public sanitizeFlavorText(text: string): string {
        return text
            .replace(/\n|\f/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    ngOnInit(){
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchPokemonData(parseInt(id));
        }
    }
}
