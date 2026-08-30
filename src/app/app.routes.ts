import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/lista-estado/lista-estado.component').then((m) => m.ListaEstadoComponent),
  },
  {
    path: 'estado/criar',
    loadComponent: () =>
      import('./paginas/criar-estado/criar-estado.component').then((m) => m.CriarEstadoComponent),
  },
  {
    path: 'estado/editar/:id',
    loadComponent: () =>
      import('./paginas/editar-estado/editar-estado.component').then(
        (m) => m.EditarEstadoComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
