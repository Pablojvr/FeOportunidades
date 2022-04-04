import { FacturasComponent } from './../pages/facturas/facturas.component';
import { IndexFacturasComponent } from './../pages/index-facturas/index-facturas.component';
import { IndexEntradaMercanciaComponent } from './../pages/index-entrada-mercancia/index-entrada-mercancia.component';
import { EntradaMercanciaComponent } from './../pages/entrada-mercancia/entrada-mercancia.component';
import { OrdenCompraComponent } from './../pages/orden-compra/orden-compra.component';
import { IndexComprasComponent } from './../pages/index-compras/index-compras.component';
import { ComprasComponent } from './../pages/compras/compras.component';
import { RolesComponent } from './../pages/roles/roles.component';
import { LayoutComponent } from './../layout/layout.component';
import { UsuariosComponent } from './../pages/usuarios/usuarios.component';
import { NotfoundComponent } from './../pages/notfound/notfound.component';
import { LoginComponent } from './../pages/login/login.component';
import { IndexComponent } from './../pages/index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth';

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
    ],
    canActivate: [AuthGuard],
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
