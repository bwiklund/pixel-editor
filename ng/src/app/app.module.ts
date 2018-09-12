import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DocViewComponent } from './doc-view/doc-view.component';
import { PaletteComponent } from './palette/palette.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    DocViewComponent,
    PaletteComponent,
    ColorPickerComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
