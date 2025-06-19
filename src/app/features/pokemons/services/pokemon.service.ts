import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private maxPokemonId = 151;

  constructor(private http: HttpClient) {}

  getAll(limit = 151): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}`);
  }

  getByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  getRandomPokemon(): Observable<any> {
    const randomId = Math.floor(Math.random() * this.maxPokemonId) + 1;
    return this.http.get(`${this.apiUrl}/${randomId}`);
  }
}
