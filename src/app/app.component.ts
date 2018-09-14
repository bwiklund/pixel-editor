import { Component, ChangeDetectorRef, HostListener, Input } from '@angular/core';

import { App } from '../core/App';
import { newDocFromImage } from '../core/ImageImporter';
import { Commands, Shortcuts } from '../core/Commands';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng';
  app: App;

  constructor(private cd: ChangeDetectorRef, public appService: AppService) {
    this.app = appService.app;
    this.app.docs.push(newDocFromImage("assets/lunaAvatar_neutral_0.png", () => { }));
    this.app.docs.push(newDocFromImage("assets/peepAvatar_neutral_0.png", () => { }));
  }


  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    if (e.repeat) { return; }
    // some stuff we need to intercept first because it's more complicated that firing a command...
    // TOGGLE KEYS, the kind you have to hold to use a tool like colorpicker, then pop back to the previous tool
    if (e.keyCode == 18) { // alt
      this.app.pushTool(this.app.colorPickerTool);
      e.preventDefault();
      return;
    }
    if (e.keyCode == 32) { // space
      this.app.pushTool(this.app.pannerTool);
      e.preventDefault();
      return;
    }

    // ONE WAY shortcuts to tools
    if (e.keyCode == 66 || e.keyCode == 80) { // b or p
      this.app.selectTool(this.app.pencilTool);
      return;
    }
    if (e.keyCode == 72) { // h
      this.app.selectTool(this.app.pannerTool);
      return;
    }
    if (e.keyCode == 73) { // i
      this.app.selectTool(this.app.colorPickerTool);
      return;
    }
    if (e.keyCode == 69) { // e
      this.app.selectTool(this.app.eraserTool);
      return;
    }
    if (e.keyCode == 71) { // g
      this.app.selectTool(this.app.fillTool);
      return;
    }

    // if we're still here, fire from shortcuts database
    this.dispatchCommandShortcut(e);
  }

  @HostListener('window:keyup', ['$event'])
  keyup(e: KeyboardEvent) {
    if (e.keyCode == 18) { // alt
      this.app.popTool();
      e.preventDefault();
      return;
    }
    if (e.keyCode == 32) { // space
      this.app.popTool();
      e.preventDefault();
      return;
    }
  }

  dispatchCommandShortcut(e) {
    var char = String.fromCharCode(e.keyCode).toLowerCase();
    if (e.shiftKey) { char = "#" + char; }
    if (e.ctrlKey) { char = "%" + char; }
    if (e.altKey) { char = "&" + char; }

    console.log("Shortcut code: " + e.keyCode + ", " + char);

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
