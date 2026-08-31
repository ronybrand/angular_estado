import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/lista-estado/lista-estado.component').then((m) => m.ListaEstadoComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'estado/criar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./paginas/criar-estado/criar-estado.component').then((m) => m.CriarEstadoComponent),
  },
  {
    path: 'estado/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./paginas/editar-estado/editar-estado.component').then(
        (m) => m.EditarEstadoComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
