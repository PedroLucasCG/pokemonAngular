import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { PokedexComponent } from './pokedex/pokedex.component';

export const routes: Routes = [
  { path: '', component: PokedexComponent },
  { path: 'detalhes/:id', component: DetailsComponent },
];
