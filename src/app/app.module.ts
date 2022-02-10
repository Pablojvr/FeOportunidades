import { LayoutModule } from './layout/layout.module';
import { AuthGuard } from './guards/auth';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MaterialModule } from './modules/app-material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditarUsuarioModalComponent } from './componets/editar-usuario-modal/editar-usuario-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ConfirmacionModalComponent } from './componets/confirmacion-modal/confirmacion-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    UsuariosComponent,
    NotfoundComponent,
    EditarUsuarioModalComponent,
    ConfirmacionModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    SweetAlert2Module,
    LayoutModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
