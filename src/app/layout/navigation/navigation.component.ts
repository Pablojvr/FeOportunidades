import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('snav') sideBar!: NavigationComponent;
  @Input() toggleNav!: boolean;
  constructor() {}

  menuItems: any[] = [
    {
      text: 'Home',
      icon: 'home',
      url: '/home',
    },
    {
      text: 'Administracion',
      icon: 'settings',
      url: null,
      show: false,
      menu: [{ text: 'Usuarios', icon: 'people', url: '/usuarios' }],
    },
  ];

  public getScreenWidth: any;
  public getScreenHeight: any;
  public screenSize: String = '';

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.setScreenSize(this.getScreenWidth);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.setScreenSize(this.getScreenWidth);
  }
  setScreenSize(width: any) {
    if (width > 1536) {
      this.screenSize = '2xl';
    } else if (width > 1280) {
      this.screenSize = 'xl';
    } else if (width > 1024) {
      this.screenSize = 'lg';
    } else if (width > 768) {
      this.screenSize = 'md';
    } else if (width > 640) {
      this.screenSize = 'sm';
    } else {
      this.screenSize = 'xs';
    }
  }
}
