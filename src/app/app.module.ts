import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DocViewComponent } from './doc-view/doc-view.component';
import { PaletteComponent } from './palette/palette.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolPropertiesComponent } from './tool-properties/tool-properties.component';
import { HistoryComponent } from './history/history.component';
import { MenuComponent } from './menu/menu.component';
import { ElectronService } from './electron.service';

@NgModule({
  declarations: [
    AppComponent,
    DocViewComponent,
    PaletteComponent,
    ColorPickerComponent,
    TimelineComponent,
    ToolbarComponent,
    ToolPropertiesComponent,
    HistoryComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
