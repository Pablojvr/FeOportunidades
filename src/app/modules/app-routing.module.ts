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
    path: '**',
    children: [{ path: '', component: NotfoundComponent }],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
