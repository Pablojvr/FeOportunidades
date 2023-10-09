import {
  Component, HostListener,
  Input, OnInit, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('snav') sideBar!: NavigationComponent;
  @Input() toggleNav!: boolean;
  @Input() isExpanded!: boolean;

  constructor() {}

  allItems: any[] = [
    {
      text: 'Home',
      icon: 'home',
      url: '/home',
    },
    {
      permission: "administrar",
      text: 'Administracion',
      icon: 'settings',
      url: null,
      show: false,
      menu: [
        { text: 'Usuarios', icon: 'people', url: '/usuarios' },
        {
          text: 'Roles',
          icon: 'manage_accounts',
          url: '/roles',
          show: false,
        },
      ],
    },
    {
      permission: "compras",
      text: 'Cortes de Caja',
      icon: 'shopping_bag',
      url: null,
      menu: [
        {
          text: 'Nuevo Corte de Caja',
          icon: 'summarize',
          url: '/CorteCaja',
          show: false,
        },
        {
          text: 'Ver Cortes de Caja',
          icon: 'archive',
          url: '/VerCortes',
        },
      ],
    }
  ];

  menuItems :any= [];

  public getScreenWidth: any;
  public getScreenHeight: any;
  public screenSize: String = '';

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.setScreenSize(this.getScreenWidth);

    this.filterMenuItems();
  }
  filterMenuItems(){
    var user = localStorage.getItem('loggedInUser')
      ? JSON.parse(localStorage.getItem('loggedInUser') ?? '{}')
      : null;

    this.menuItems = this.allItems.filter(
      item => { return !item.permission || user.rol[item.permission]==false }
    )
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
