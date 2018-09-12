import { App } from './App';

// some global commands stubbed out here so they can be bound to user keys in a clean way
var Commands = {}
var Shortcuts = {}

function CMD(name: string, defaultShortcut: string, action: Function) {
  Commands[name] = action;
  Shortcuts[name] = defaultShortcut;
}

CMD("Save", "%s", (app: App) => {
  app.activeDoc.save();
});

CMD("Open", "%o", (app: App) => {
  app.openFile();
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

// do this with actual types instead... check if it implements something in ts
// NOTE: these unicode chars are what String.charFromKeyCode is giving for left/right brackets...?
CMD("ShrinkCurrentTool", "û", (app: App) => {
  if (typeof app.activeTool.size !== "undefined") {
    app.activeTool.size = Math.max(1, app.activeTool.size - 1);
  }
});

// see above
CMD("GrowCurrentTool", "ý", (app: App) => {
  if (typeof app.activeTool.size !== "undefined") {
    app.activeTool.size = Math.max(1, app.activeTool.size + 1);
  }
});

export { Commands, Shortcuts } 