import { UsuariosComponent } from './../pages/usuarios/usuarios.component';
import { NotfoundComponent } from './../pages/notfound/notfound.component';
import { LoginComponent } from './../pages/login/login.component';
import { IndexComponent } from './../pages/index/index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"index",component:IndexComponent},
  {path:"usuarios",component:UsuariosComponent},
  {path:"**",component:NotfoundComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
