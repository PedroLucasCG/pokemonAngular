import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonSpeciesService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon-species';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
}
