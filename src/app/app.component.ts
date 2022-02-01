import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy,HostListener } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  public getScreenWidth: any;
  public getScreenHeight: any;
  public screenSize: String = "";

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
  setScreenSize(width:any){
    if(width > 1536){
      this.screenSize = "2xl"
    }else if(width > 1280){
      this.screenSize = "xl"
    }else if(width > 1024){
      this.screenSize = "lg"
    }else if(width > 768){
      this.screenSize = "md"
    }else if(width > 640){
      this.screenSize = "sm"
    }else{
      this.screenSize = "xs"
    }
  }

  fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  title = 'FrontEndCofarsa';
}
