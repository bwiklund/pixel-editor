import { App } from './App';

// some global commands stubbed out here so they can be bound to user keys in a clean way
var Commands = {}
var Shortcuts = {}

function CMD(name: string, defaultShortcut: string, action: Function) {
  Commands[name] = action;
  Shortcuts[name] = defaultShortcut;
}

CMD("Save", "%s", (app: App) => {
  console.error("Saving not implemented yet");
});

CMD("Open", "%o", (app: App) => {
  console.error("Open not implemented yet");
});

CMD("Close", "#w", (app: App) => { // shift W for now until i put this in an electron container
  app.closeDoc(app.activeDoc);
});

CMD("NewLayer", "#n", (app: App) => {
  app.activeDoc.newLayer();
});

CMD("SwapActiveColors", "x", (app: App) => {
  var tmp = app.colorFg;
  app.colorFg = app.colorBg;
  app.colorBg = tmp;
});

export { Commands, Shortcuts } 