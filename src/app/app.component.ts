import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
import { Pokemon } from './models/pokemon';
import { PokemonService } from './features/pokemons/services/pokemon.service';

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

@Component({
  selector: 'app-root',
  imports: [CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    artworkSrc = "";
    pokeData : PokeData | null = null;
    title = 'pokeApp';
    pokemons : Pokemon[] = [
        //new Pokemon("Pikachu")
    ]

    constructor (private pokemonService: PokemonService) {}

    fetchRandomPokemon() {
        this.pokemonService.getRandomPokemon().subscribe(data => {
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
            console.log(this.pokeData);
        });
    }

    fetchNextPokemon(next : boolean = true){
        let id = this.pokeData?.id || 0;
        next ? ++id : --id;
        id = id < 0 ? 0 : id > 151 ? 151 : id;
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
            console.log(this.pokeData);
        });
    }

    ngOnInit() {
        this.fetchRandomPokemon();
    }
}
