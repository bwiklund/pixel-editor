import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewComponent } from './doc-view.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { HistoryComponent } from '../history/history.component';
import { App } from '../../core/App';
import { Doc } from '../../core/Doc';
import { Color } from '../../core/Color';
import { Vec } from '../../core/Vec';

describe('DocViewComponent', () => {
  let component: DocViewComponent;
  let fixture: ComponentFixture<DocViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocViewComponent, TimelineComponent, HistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewComponent);
    component = fixture.componentInstance;
    component.app = new App();
    component.doc = new Doc("test", 16, 16);
    component.doc.newLayer();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('will draw a dot on the canvas if asked nicely', () => {
    var c = new Color(100,101,102,255);
    component.doc.activeLayer.setPixel(new Vec(0,0), c.r, c.g, c.b, c.a);
    component.updateCanvas();
    var idata = component.canvas.nativeElement.getContext('2d').getImageData(0, 0, 16, 16);
    expect(idata.data[0]).toBe(c.r);
    expect(idata.data[1]).toBe(c.g);
    expect(idata.data[2]).toBe(c.b);
    expect(idata.data[3]).toBe(c.a);
  });
});
