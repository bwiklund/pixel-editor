import { Injectable } from '@angular/core';
import { App } from '../core';

@Injectable({ providedIn: 'root' })
export class AppService {
  app: App = new App();
}
