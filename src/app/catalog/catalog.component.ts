import { Component } from '@angular/core';
import { PokemonService } from '../features/pokemons/services/pokemon.service';
import { CookieService } from '../features/favorites/services/cookie.service';
import { PokeDataWithArtwork, PokeApiResponse, PokeApiShortResponse } from '../models/pokemon';
import type { LucideIconData } from 'lucide-angular';
import { LucideAngularModule, Heart, Trash, X} from 'lucide-angular';
import { pokemonTypeColorMap } from '../constants/pokemonColors';
import { forkJoin, Observable, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
    pokeData : PokeDataWithArtwork[] | null = null;
    favorites : number[] = [];
    favoritesData : PokeDataWithArtwork[] = [];
    typeColor : Record<string, string> = pokemonTypeColorMap;
    page : number = 0;
    itemPerPage : number = 30;
    totalPages : number = 0;
    currentPage : number = 1;
    showModal: boolean = false;
    favoritoIcon : LucideIconData = Heart;
    trashIcon : LucideIconData = Trash;
    closeIcon : LucideIconData = X;

    constructor (
        private pokemonService: PokemonService,
        private cookieService: CookieService ) {}

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

    async addPokemonToFavorites(id: number) {
        if (!this.pokeData) return;
        const pokemonToAdd = this.pokeData.find(item => item.id === id);
        if (!pokemonToAdd) return;

        const alreadyFavorite = this.favorites.find(item => item === id);
        if (alreadyFavorite) {
            await this.removePokemonFromFavorites(alreadyFavorite);
            return;
        }

        this.favorites.push(pokemonToAdd.id);
        this.cookieService.setCookie("favorites", JSON.stringify(this.favorites), 30);

        this.favoritesData = await this.getFavorites();
    }

    async getFavorites(): Promise<PokeDataWithArtwork[]> {
        const favoritesCookie = this.cookieService.getCookie("favorites");
        if (favoritesCookie) {
            try {
                const pokemonIds: number[] = JSON.parse(favoritesCookie);
                const requests = pokemonIds.map(id => this.pokemonService.getById(id));

                const responses = await firstValueFrom(forkJoin(requests));

                const pokemons: PokeDataWithArtwork[] = responses.map(data => ({
                    id: data.id,
                    name: data.name,
                    types: data.types,
                    height: data.height / 100,
                    weight: data.weight / 100,
                    abilities: data.abilities,
                    stats: data.stats,
                    artworkSrc: data.sprites.other["official-artwork"].front_default
                }));

                return pokemons;

            } catch (e) {
                console.error('Failed to parse favorites cookie', e);
                return [];
            }
        }
        return [];
    }


    async removePokemonFromFavorites(id : number) {
        this.favorites = this.favorites.filter(item => item !== id);
        this.cookieService.setCookie("favorites", JSON.stringify(this.favorites), 30);
        this.favoritesData = await this.getFavorites();
    }

    isFavorite(id: number): boolean {
        return this.favorites.some(item => item === id);
    }


    openModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
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

    async ngOnInit(){
        const favoritesCookie = this.cookieService.getCookie("favorites");
        if (favoritesCookie) {
            this.favorites = JSON.parse(favoritesCookie);
        }
        this.favoritesData = await this.getFavorites();
        this.fetchPokemonData();
    }
}
