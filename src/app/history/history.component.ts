import { Component, OnInit, Input } from '@angular/core';
import { Doc } from '../../models/Doc';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() doc: Doc;

  constructor() { }

  ngOnInit() {
  }

}
