import { version } from '../../../../package.json';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  version: string = version;
  constructor() {}

  ngOnInit(): void {}
}
