import { Component, OnInit, Input } from '@angular/core';
import { Doc } from '../../models/Doc';
import { App } from '../../models/App';


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
