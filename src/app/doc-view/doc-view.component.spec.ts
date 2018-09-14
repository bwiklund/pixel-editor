import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewComponent } from './doc-view.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { HistoryComponent } from '../history/history.component';
import { App } from '../../core/App';
import { Doc } from '../../core/Doc';

describe('DocViewComponent', () => {
  let component: DocViewComponent;
  let fixture: ComponentFixture<DocViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocViewComponent, TimelineComponent, HistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewComponent);
    component = fixture.componentInstance;
    component.app = new App();
    component.doc = new Doc("test", 16, 16);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
