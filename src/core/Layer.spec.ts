import { Vec } from './Vec';
import { Color } from './Color';
import { Layer } from './Layer';
import { TestBed } from '@angular/core/testing';


describe("Foo", () => {
  let l: Layer;

  beforeEach(() => {
    l = new Layer("asdf", 16, 16);
  });


  it("can be drawn to", () => {
    l.setPixel(new Vec(0, 0), 1, 2, 3, 4);
    expect(l.getColor(new Vec(0, 0))).toEqual(new Color(1, 2, 3, 4));
  });

  it("knows its own offset", () => {
    l.offset = new Vec(-1, -1);
    l.setPixel(new Vec(0, 0), 1, 2, 3, 4);
    expect(l.getColor(new Vec(0, 0))).toEqual(new Color(1, 2, 3, 4));
    expect(l.getColorInternal(new Vec(1, 1))).toEqual(new Color(1, 2, 3, 4));
  });
});