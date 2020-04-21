import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ListaEstadoComponent } from './paginas/lista-estado/lista-estado.component';
import { ErrorMsgComponent } from './compartilhado/error-msg/error-msg.component';
import { FormEstadoComponent } from './compartilhado/form-estado/form-estado.component';
import { CriarEstadoComponent } from './paginas/criar-estado/criar-estado.component';
import { EditarEstadoComponent } from './paginas/editar-estado/editar-estado.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaEstadoComponent,
    ErrorMsgComponent,
    FormEstadoComponent,
    CriarEstadoComponent,
    EditarEstadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
