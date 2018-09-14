import { Injectable } from '@angular/core';
import { App } from '../core/app';

@Injectable({ providedIn: 'root' })
export class AppService {
  app: App = new App();
}
