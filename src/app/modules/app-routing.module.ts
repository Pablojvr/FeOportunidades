import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth';
import { LayoutComponent } from './../layout/layout.component';
import { ComprasComponent } from './../pages/compras/compras.component';
import { DevolucionesComponent } from './../pages/devoluciones/devoluciones.component';
import { EntradaMercanciaComponent } from './../pages/entrada-mercancia/entrada-mercancia.component';
import { FacturasComponent } from './../pages/facturas/facturas.component';
import { IndexComprasComponent } from './../pages/index-compras/index-compras.component';
import { IndexDevolucionesComponent } from './../pages/index-devoluciones/index-devoluciones.component';
import { IndexEntradaMercanciaComponent } from './../pages/index-entrada-mercancia/index-entrada-mercancia.component';
import { CorteCajaComponent } from './../pages/corte-caja/corte-caja.component';
import { CorteCajaReporteComponent } from './../pages/corte-caja-reporte/corte-caja.component';
import { CorteCajaReporteGeneralComponent } from './../pages/corte-caja-reporte-general/corte-caja.component';
import { IndexFacturasComponent } from './../pages/index-facturas/index-facturas.component';
import { IndexNotasCreditoComponent } from './../pages/index-notas-credito/index-notas-credito.component';
import { IndexComponent } from './../pages/index/index.component';
import { LoginComponent } from './../pages/login/login.component';
import { NotaCreditoCrudComponent } from './../pages/nota-credito-crud/nota-credito-crud.component';
import { NotaCreditoComponent } from './../pages/nota-credito/nota-credito.component';
import { OrdenCompraComponent } from './../pages/orden-compra/orden-compra.component';
import { PreviewFacturasComponent } from './../pages/preview-facturas/preview-facturas.component';
import { RolesComponent } from './../pages/roles/roles.component';
import { UsuariosComponent } from './../pages/usuarios/usuarios.component';
import { IndexCorteCajaComponent } from '../pages/index-corte-caja/index-corte-caja.component';
import { CorteCajaResumenComponent } from '../pages/corte-caja-reporte-resumen/corte-caja.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: LayoutComponent,
    children: [{ path: '', component: IndexComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'usuarios',
    component: LayoutComponent,
    children: [{ path: '', component: UsuariosComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'roles',
    component: LayoutComponent,
    children: [{ path: '', component: RolesComponent }],
    canActivate: [AuthGuard],
  },
  {
    path: 'compras',
    component: LayoutComponent,
    children: [
      { path: '', component: IndexComprasComponent },
      { path: 'new', component: ComprasComponent },
      { path: 'edit/:id', component: ComprasComponent },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'CorteCaja',
    component: LayoutComponent,
    children: [
      { path: '', component: CorteCajaComponent },
      { path: 'index', component: IndexCorteCajaComponent },
      { path: ':id', component: CorteCajaComponent },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'Reportes',
    component: LayoutComponent,
    children: [
      { path: 'reporteImpresion', component: CorteCajaReporteComponent },
      { path: 'reporteGeneral', component: CorteCajaReporteGeneralComponent },
      { path: 'reporteResumen', component: CorteCajaResumenComponent },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'orden_compras',
    component: LayoutComponent,
    children: [
      {
        path: 'new/:idSolicitudCompra',
        component: OrdenCompraComponent,
      },
      {
        path: ':idOrdenCompra',
        component: OrdenCompraComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'ingreso_compras',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: IndexEntradaMercanciaComponent,
      },
      {
        path: 'new/:id',
        component: EntradaMercanciaComponent,
      },
      {
        path: 'view/:idEntradaMercancia',
        component: EntradaMercanciaComponent,
      },
      {
        path: 'new',
        component: EntradaMercanciaComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'CorteNuevo',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CorteCajaComponent,
      },
      {
        path: 'new/:id',
        component: EntradaMercanciaComponent,
      },
      {
        path: 'view/:idEntradaMercancia',
        component: EntradaMercanciaComponent,
      },
      {
        path: 'new',
        component: EntradaMercanciaComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['compras'] },
  },
  {
    path: 'notas_credito',
    component: LayoutComponent,
    children: [
      {
        path: 'new/:idFactura',
        component: NotaCreditoComponent,
      },
      {
        path: ':idNotaCredito',
        component: NotaCreditoComponent,
      },
    ],
  },

  {
    path: 'notasCredito',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: IndexNotasCreditoComponent,
      },
      {
        path: 'new/:idFactura',
        component: NotaCreditoCrudComponent,
      },
      {
        path: 'new',
        component: NotaCreditoCrudComponent,
      },
      {
        path: 'view/:idNotaCredito',
        component: NotaCreditoCrudComponent,
      },
    ],
  },
  {
    path: 'facturas',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: IndexFacturasComponent,
      },
      {
        path: 'new',
        component: FacturasComponent,
      },
      {
        path: ':idFactura',
        component: PreviewFacturasComponent,
      },
      {
        path: 'view/:idFacturas',
        component: PreviewFacturasComponent,
      },
      {
        path: 'edit/:idFacturas',
        component: FacturasComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { permission: ['facturacion'] },
  },
  {
    path: 'devoluciones',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: IndexDevolucionesComponent,
      },
      {
        path: 'new',
        component: DevolucionesComponent,
      },
      {
        path: ':idDevolucion',
        component: DevolucionesComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // {
  //   path: '**',
  //   children: [{ path: '', component: NotfoundComponent }],
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
