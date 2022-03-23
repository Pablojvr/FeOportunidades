import { LayoutModule } from './layout/layout.module';
import { AuthGuard } from './guards/auth';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MaterialModule } from './modules/app-material.module';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './pages/index/index.component';
import { IndexComprasComponent } from './pages/index-compras/index-compras.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditarUsuarioModalComponent } from './componets/editar-usuario-modal/editar-usuario-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ConfirmacionModalComponent } from './componets/confirmacion-modal/confirmacion-modal.component';
import { RolesComponent } from './pages/roles/roles.component';
import { EditarRolModalComponent } from './componets/editar-rol-modal/editar-rol-modal.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { DatePipe } from '@angular/common';
import { OrdenCompraComponent } from './pages/orden-compra/orden-compra.component';
import { EntradaMercanciaComponent } from './pages/entrada-mercancia/entrada-mercancia.component';
import { IndexEntradaMercanciaComponent } from './pages/index-entrada-mercancia/index-entrada-mercancia.component';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    IndexComprasComponent,
    LoginComponent,
    UsuariosComponent,
    NotfoundComponent,
    EditarUsuarioModalComponent,
    ConfirmacionModalComponent,
    RolesComponent,
    EditarRolModalComponent,
    ComprasComponent,
    OrdenCompraComponent,
    EntradaMercanciaComponent,
    IndexEntradaMercanciaComponent,


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
    DatePipe,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
