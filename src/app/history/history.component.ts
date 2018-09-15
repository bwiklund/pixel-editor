import { Component, Input } from '@angular/core';
import { Doc } from '../../core/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  @Input() doc: Doc;
}
