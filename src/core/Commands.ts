import { App } from './App';
import { Fill } from './tools/Fill';
import { Pencil } from './tools/Pencil';

import { Command } from './Command';
import { PngExportHandler } from './formats/Handlers';
import { saveBlobFile } from '../util/io';


export const NewFile = new Command("NewFile", "&n", (app: App) => {
  app.newDoc();
});

export const SaveFile = new Command("SaveFile", "%s", (app: App) => {
  app.activeDoc.save();
});

export const OpenFile = new Command("OpenFile", "%o", (app: App) => {
  app.openFile();
});

export const CloseFile = new Command("CloseFile", "#w", (app: App) => { // shift W for now until i put this in an electron container
  app.closeDoc(app.activeDoc);
});

export const CloseAllFiles = new Command("CloseAllFiles", null, (app: App) => {
  app.closeAllDocs();
});

export const NewLayer = new Command("NewLayer", "#n", (app: App) => {
  app.activeDoc.newLayer();
});

export const DeleteLayer = new Command("DeleteLayer", null, (app: App) => {
  app.activeDoc.deleteLayers([app.activeDoc.activeLayer]);
});

export const SwapActiveColors = new Command("SwapActiveColors", "x", (app: App) => {
  var tmp = app.colorFg;
  app.colorFg = app.colorBg;
  app.colorBg = tmp;
});

// NOTE: these unicode chars are what String.charFromKeyCode is giving for left/right brackets...?
export const ShrinkCurrentTool = new Command("ShrinkCurrentTool", "û", (app: App) => {
  if (app.activeTool instanceof Pencil) {
    app.activeTool.size = Math.max(1, app.activeTool.size - 1);
    app.activeTool.redrawBrushPreview();
  }
});

export const GrowCurrentTool = new Command("GrowCurrentTool", "ý", (app: App) => {
  if (app.activeTool instanceof Pencil) {
    app.activeTool.size = Math.max(1, app.activeTool.size + 1);
    app.activeTool.redrawBrushPreview();
  }
});

export const ToggleContiguous = new Command("ToggleContiguous", "c", (app: App) => {
  if (app.activeTool instanceof Fill) {
    app.activeTool.contiguous = !app.activeTool.contiguous;
  }
});

export const Undo = new Command("Undo", "%z", (app: App) => {
  app.undo();
});

export const QuickExport = new Command("QuickExport", "&%#s", (app: App) => {
  // TODO: dispatch this to some exporter service
  var handler = new PngExportHandler();
  var doc = app.activeDoc;
  handler.action(app.activeDoc, (blob: Blob) => {
    saveBlobFile(doc.name + '.png', blob, () => { });
  });
});
