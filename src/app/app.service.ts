import { Injectable } from '@angular/core';
import { App } from '../core/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  app: App = new App();
}
