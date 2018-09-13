import { Component, OnInit, Input } from '@angular/core';
import { Doc } from '../../core/Doc';
import { App } from '../../core/App';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() doc : Doc;
  @Input() app : App;

  constructor() { }

  ngOnInit() {
  }

}
