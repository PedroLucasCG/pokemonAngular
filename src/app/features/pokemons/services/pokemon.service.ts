import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private maxPokemonId = 151;

  constructor(private http: HttpClient) {}

  getAll(limit = 151, offset = 0): Observable<any> {
    console.log(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
    return this.http.get(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getByName(pokemon : string): Observable<PokeApiResponse> {
    return this.http.get(`${this.apiUrl}/${pokemon}`) as Observable<PokeApiResponse>;
  }

  getRandomPokemon(): Observable<any> {
    const randomId = Math.floor(Math.random() * this.maxPokemonId) + 1;
    return this.http.get(`${this.apiUrl}/${randomId}`);
  }

  getWithUrl(url : string): Observable<any> {
    return this.http.get(url);
  }
}
