import { ColorPickerComponent } from './color-picker/color-picker.component';
import { Component, ChangeDetectorRef, HostListener, Input, ViewChild } from '@angular/core';

import { App, Command } from '../core';
import { newDocFromImage } from '../util/ImageImporter';
import { AppService } from './app.service';
import * as Commands from '../core/Commands';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng';
  app: App;

  constructor(private cd: ChangeDetectorRef, public appService: AppService, public electronService: ElectronService) {
    this.app = appService.app;
    this.app.docs.push(newDocFromImage("assets/lunaAvatar_neutral_0.png", () => { }));
    this.app.docs.push(newDocFromImage("assets/peepAvatar_neutral_0.png", () => { }));

    // if (electronService.isElectron()) {
    //   this.electronService.ipcRenderer.send('openFile', () => {
    //     console.log("Event sent.");
    //   })

    //   this.electronService.ipcRenderer.on('fileData', (event, data) => {
    //     var file = new Blob([data], { type: "image/png" });
    //     debugger
    //     this.app.handleMysteriousIncomingBlob(file);
    //   })
    // }
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

    // simple fire and forget shortcuts to tools
    var simpleToolShortcuts = {
      66: () => this.app.selectTool(this.app.pencilTool),
      80: () => this.app.selectTool(this.app.pencilTool),
      72: () => this.app.selectTool(this.app.pannerTool),
      73: () => this.app.selectTool(this.app.colorPickerTool),
      69: () => this.app.selectTool(this.app.eraserTool),
      71: () => this.app.selectTool(this.app.fillTool),
      86: () => this.app.selectTool(this.app.moveTool),
      90: () => this.app.selectTool(this.app.zoomTool),
    };

    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && simpleToolShortcuts[e.keyCode]) {
      simpleToolShortcuts[e.keyCode]();
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
    var Shortcuts = Command.Shortcuts;

    var flippedShortcuts = {};
    for (var k in Shortcuts) { flippedShortcuts[Shortcuts[k]] = k; }

    var commandName = flippedShortcuts[char];
    if (commandName == null) return;

    var commandFunc = <Command>Commands[commandName];
    if (commandFunc != null) {
      e.preventDefault(); // TODO: blacklist some key combos maybe? or does the browser do this anyways
      commandFunc.invoke(this.app);
    }
  }
}
