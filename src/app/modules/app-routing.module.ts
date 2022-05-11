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
import { IndexFacturasComponent } from './../pages/index-facturas/index-facturas.component';
import { IndexComponent } from './../pages/index/index.component';
import { LoginComponent } from './../pages/login/login.component';
import { NotaCreditoComponent } from './../pages/nota-credito/nota-credito.component';
import { OrdenCompraComponent } from './../pages/orden-compra/orden-compra.component';
import { PreviewFacturasComponent } from './../pages/preview-facturas/preview-facturas.component';
import { RolesComponent } from './../pages/roles/roles.component';
import { UsuariosComponent } from './../pages/usuarios/usuarios.component';

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
    ]
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
    ],
    canActivate: [AuthGuard],
    data: { permission: ['facturacion'] },
  },
  {
    path: 'devoluciones',
    component: LayoutComponent,
    children: [
      {
        path: ':idDevolucion',
        component: DevolucionesComponent,
      },
      {
        path: '',
        component: IndexDevolucionesComponent,
      },
      {
        path: 'new',
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
