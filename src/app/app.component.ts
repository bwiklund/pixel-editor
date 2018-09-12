import { Component, ChangeDetectorRef, HostListener } from '@angular/core';

import { App } from '../models/App';
import { newDocFromImage } from '../models/ImageImporter';
import { Commands, Shortcuts } from '../models/Commands';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng';
  app: App;

  constructor(private cd: ChangeDetectorRef) {
    this.app = new App();
    this.app.docs.push(newDocFromImage("assets/lunaAvatar_neutral_0.png", () => { }));
    this.app.docs.push(newDocFromImage("assets/peepAvatar_neutral_0.png", () => { }));
  }


  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    var char = String.fromCharCode(e.keyCode).toLowerCase();
    if (e.shiftKey) { char = "#" + char; }
    if (e.ctrlKey) { char = "%" + char; }
    if (e.altKey) { char = "&" + char; }

    console.log("Shortcut code: " + char);

    // the commands are an object where command names are keys, so we need to invert it here.
    // TODO: cache this? probably doesn't actually matter for the N we care about
    var flippedShortcuts = {};
    for (var k in Shortcuts) { flippedShortcuts[Shortcuts[k]] = k; }

    var commandName = flippedShortcuts[char];
    if (commandName == null) return;

    var commandFunc = Commands[commandName];
    if (commandFunc != null) {
      e.preventDefault(); // TODO: blacklist some key combos maybe? or does the browser do this anyways
      commandFunc(this.app);
    }
  }
}
