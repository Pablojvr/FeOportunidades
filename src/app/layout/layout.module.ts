import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../modules/app-material.module';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    LayoutComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [FooterComponent, HeaderComponent, NavigationComponent],
})
export class LayoutModule {}
