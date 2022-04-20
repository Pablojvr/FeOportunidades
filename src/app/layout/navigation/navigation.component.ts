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
  @Input() isExpanded!: boolean;

  constructor() {}

  allItems: any[] = [
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
      text: 'Compras',
      icon: 'shopping_bag',
      url: null,
      menu: [
        {
          text: 'Solicitudes de Compra',
          icon: 'summarize',
          url: '/compras',
          show: false,
        },
        {
          text: 'Ingresos de Compra',
          icon: 'archive',
          url: '/ingreso_compras',
        },
      ],
    },
    {
      permission: "facturacion",
      text: 'Facturas',
      icon: 'receipt',
      url: null,
      menu: [
        {
          text: 'Facturas',
          icon: 'receipt',
          url: '/facturas',
          show: false,
        },
        // {
        //   text: 'Ingresos de Compra',
        //   icon: 'post_add',
        //   url: '/entrada_mercancia',
        // },
      ],
    },
    {
      permission: "devoluciones",
      text: 'Devoluciones',
      icon: 'assignment_return',
      url: null,
      menu: [
        {
          text: 'Devoluciones',
          icon: 'assignment_return',
          url: '/devoluciones',
          show: false,
        },
        // {
        //   text: 'Ingresos de Compra',
        //   icon: 'post_add',
        //   url: '/entrada_mercancia',
        // },
      ],
    },
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
