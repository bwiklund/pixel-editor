import { Component, ChangeDetectorRef } from '@angular/core';

import { App } from '../models/App';
import { newDocFromImage } from '../models/ImageImporter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng';
  app : App;

  constructor(private cd: ChangeDetectorRef) {
    this.app = new App();
    this.app.docs.push(newDocFromImage("assets/lunaAvatar_neutral_0.png", () => {}));
    this.app.docs.push(newDocFromImage("assets/peepAvatar_neutral_0.png", () => {}));
  }
}
