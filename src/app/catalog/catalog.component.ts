import { Component } from '@angular/core';
import { PokemonService } from '../features/pokemons/services/pokemon.service';
import { PokeDataWithArtwork, PokeApiResponse, PokeApiShortResponse } from '../models/pokemon';
import { pokemonTypeColorMap } from '../constants/pokemonColors';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
    pokeData : PokeDataWithArtwork[] | null = null;
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
