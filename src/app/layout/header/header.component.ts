import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleNav = new EventEmitter<null>();
  userName: string = '';
  constructor() {
    this.userName = JSON.parse(
      localStorage.getItem('loggedInUser') ?? '{}'
    )?.username;
  }

  ngOnInit(): void {}
  toogleNavigation() {
    console.log('ABRIENDO EL MENU');
    this.toggleNav.emit();
  }
}
