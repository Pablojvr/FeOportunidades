import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AppComponent } from './app.component';
import { AgregarArticuloDevolucionModalComponent } from './componets/agregar-articulo-devolucion-modal/agregar-articulo-devolucion-modal.component';
import { AgregarArticuloFacturaModalComponent } from './componets/agregar-articulo-factura-modal/agregar-articulo-factura-modal.component';
import { ConfirmacionModalComponent } from './componets/confirmacion-modal/confirmacion-modal.component';
import { EditarRolModalComponent } from './componets/editar-rol-modal/editar-rol-modal.component';
import { EditarUsuarioModalComponent } from './componets/editar-usuario-modal/editar-usuario-modal.component';
import { AuthGuard } from './guards/auth';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LayoutModule } from './layout/layout.module';
import { MaterialModule } from './modules/app-material.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { ComprasComponent } from './pages/compras/compras.component';
import { DevolucionesComponent } from './pages/devoluciones/devoluciones.component';
import { EntradaMercanciaComponent } from './pages/entrada-mercancia/entrada-mercancia.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { IndexComprasComponent } from './pages/index-compras/index-compras.component';
import { IndexDevolucionesComponent } from './pages/index-devoluciones/index-devoluciones.component';
import { IndexEntradaMercanciaComponent } from './pages/index-entrada-mercancia/index-entrada-mercancia.component';
import { IndexFacturasComponent } from './pages/index-facturas/index-facturas.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { NotaCreditoComponent } from './pages/nota-credito/nota-credito.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { OrdenCompraComponent } from './pages/orden-compra/orden-compra.component';
import { PreviewFacturasComponent } from './pages/preview-facturas/preview-facturas.component';
import { RolesComponent } from './pages/roles/roles.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NotaCreditoCrudComponent } from './pages/nota-credito-crud/nota-credito-crud.component';
import { AgregarArticuloNotaCreditoComponent } from './componets/agregar-articulo-nota-credito/agregar-articulo-nota-credito.component';
import { IndexNotasCreditoComponent } from './pages/index-notas-credito/index-notas-credito.component';
import { CorteCajaComponent } from './pages/corte-caja/corte-caja.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsModalComponent } from './componets/tabs-modal/tabs-modal.component';
registerLocaleData(localeEs, 'es');
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
    IndexFacturasComponent,
    FacturasComponent,
    AgregarArticuloFacturaModalComponent,
    PreviewFacturasComponent,
    IndexDevolucionesComponent,
    DevolucionesComponent,
    AgregarArticuloDevolucionModalComponent,
    NotaCreditoComponent,
    NotaCreditoCrudComponent,
    AgregarArticuloNotaCreditoComponent,
    IndexNotasCreditoComponent,
    CorteCajaComponent,TabsModalComponent
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
