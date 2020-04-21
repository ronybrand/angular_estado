import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaEstadoComponent } from './paginas/lista-estado/lista-estado.component';
import { CriarEstadoComponent } from './paginas/criar-estado/criar-estado.component';
import { EditarEstadoComponent } from './paginas/editar-estado/editar-estado.component';


const routes: Routes = [
  { path: '', component: ListaEstadoComponent },
  { path: 'estado/criar', component: CriarEstadoComponent },
  { path: 'estado/editar/:id', component: EditarEstadoComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
