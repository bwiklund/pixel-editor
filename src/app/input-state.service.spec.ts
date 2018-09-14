import { TestBed } from '@angular/core/testing';

import { InputStateService } from './input-state.service';

describe('InputStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("won't let two components have focus at once", () => {
    const service: InputStateService = TestBed.get(InputStateService);
    var a = {};
    var b = {};
    expect(service.hasFocus(a)).toBeFalsy();
    expect(service.hasFocus(b)).toBeFalsy();
    service.takeFocus(a);
    expect(service.hasFocus(a)).toBeTruthy();
    expect(service.hasFocus(b)).toBeFalsy();
    service.takeIfFree(b);
    expect(service.hasFocus(a)).toBeTruthy();
    expect(service.hasFocus(b)).toBeFalsy();
  });
});
