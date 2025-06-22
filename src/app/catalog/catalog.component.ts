import { Component } from '@angular/core';
import { PokemonService } from '../features/pokemons/services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    artworkSrc: string,
}

interface PokeApiShortResponse {
    name: string,
    url: string
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

export const pokemonTypeColorMap: Record<string, string> = {
    normal: '#d3d3c7',
    fire: '#ffb482',
    water: '#a4d8ff',
    electric: '#ffe37b',
    grass: '#b2e8b2',
    ice: '#d4f1f9',
    fighting: '#e79a9a',
    poison: '#d4a0d4',
    ground: '#f2e1b1',
    flying: '#d0c2f0',
    psychic: '#ffb3c6',
    bug: '#d3e882',
    rock: '#e2d3a3',
    ghost: '#b9a2d0',
    dragon: '#b090f8',
    dark: '#a69889',
    steel: '#d0d0e0',
    fairy: '#f9c2d1'
};

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
    pokeData : PokeData[] | null = null;
    typeColor : Record<string, string> = pokemonTypeColorMap;
    page : number = 0;
    itemPerPage : number = 30;
    totalPages : number = 0;
    currentPage : number = 1;

    constructor (private pokemonService: PokemonService ) {}

    fetchPokemonData(offset : number = 0) {
        this.pokemonService.getAll(this.itemPerPage, offset).subscribe(data => {
            this.totalPages = Math.ceil(data.count / this.itemPerPage);
            const pokemonRequests: Observable<PokeApiResponse>[] = data.results.map((item: PokeApiShortResponse) =>
                this.pokemonService.getWithUrl(item.url)
            );

            forkJoin(pokemonRequests).subscribe( (responses: PokeApiResponse[]) => {
                this.pokeData = responses.map((data: PokeApiResponse) => ({
                    id: data.id,
                    name: data.name,
                    types: data.types,
                    height: data.height / 100,
                    weight: data.weight / 100,
                    abilities: data.abilities,
                    stats: data.stats,
                    artworkSrc: data.sprites.other["official-artwork"].front_default
                }));
            });
        });
    }

    changePage(page : number | string) {
        const pageNumber = page as number;
        const offset = (pageNumber - 1) * this.itemPerPage;
        this.currentPage = pageNumber;
        this.fetchPokemonData(offset);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get pagination(): (number | string)[] {
        const pages: (number | string)[] = [];

        const start = Math.max(2, this.currentPage - 3);
        const end = Math.min(this.totalPages - 1, this.currentPage + 3);

        pages.push(1);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < this.totalPages - 1) {
            pages.push('...');
        }

        if (this.totalPages > 1) {
            pages.push(this.totalPages);
        }

        return pages;
    }

    ngOnInit(){
        this.fetchPokemonData();
    }
}
