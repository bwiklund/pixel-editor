import { App } from './App';
import { Fill } from './tools/Fill';
import { Pencil } from './tools/Pencil';
import { toPng } from './exporters/Png';
import { saveFile, saveBlobFile } from '../util/io';

// some global commands stubbed out here so they can be bound to user keys in a clean way
var Commands = {}
var Shortcuts = {}

function CMD(name: string, defaultShortcut: string, action: Function) {
  Commands[name] = action;
  Shortcuts[name] = defaultShortcut;
}

CMD("New", "&n", (app: App) => {
  app.newDoc();
});

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

// NOTE: these unicode chars are what String.charFromKeyCode is giving for left/right brackets...?
CMD("ShrinkCurrentTool", "û", (app: App) => {
  if (app.activeTool instanceof Pencil) {
    app.activeTool.size = Math.max(1, app.activeTool.size - 1);
    app.activeTool.redrawBrushPreview();
  }
});

CMD("GrowCurrentTool", "ý", (app: App) => {
  if (app.activeTool instanceof Pencil) {
    app.activeTool.size = Math.max(1, app.activeTool.size + 1);
    app.activeTool.redrawBrushPreview();
  }
});

CMD("ToggleContiguous", "c", (app: App) => {
  if (app.activeTool instanceof Fill) {
    app.activeTool.contiguous = !app.activeTool.contiguous;
  }
});

CMD("Undo", "%z", (app: App) => {
  app.undo();
});

CMD("QuickExport", "&%#s", (app: App) => {
  // TODO: dispatch this to some exporter service
  var doc = app.activeDoc;
  toPng(doc, (blob) => {
    saveBlobFile(doc.name + '.png', blob, () => { });
  });
});

export { Commands, Shortcuts } 