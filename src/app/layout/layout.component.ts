import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  public getScreenWidth: any;
  public getScreenHeight: any;
  public screenSize: String = '';
  public showNavigation: boolean = false;
  public route!: any;

  constructor(private router: Router, private authService: AuthService) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.route = event;
      });
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.setScreenSize(this.getScreenWidth);
  }

  toggleNav(event: any) {
    this.showNavigation = !this.showNavigation;
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

  title = 'FrontEndCofarsa';
}
