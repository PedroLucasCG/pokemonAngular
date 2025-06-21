import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { CatalogComponent } from './catalog/catalog.component';

export const routes: Routes = [
  { path: '', component: PokedexComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'detalhes/:id', component: DetailsComponent },
];
