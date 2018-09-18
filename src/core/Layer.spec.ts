import { Vec } from './Vec';
import { Color } from './Color';
import { Layer } from './Layer';


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

  it("can resize itself positively, and keep pixels in the right place", () => {
    l.setPixel(new Vec(0, 0), 1, 2, 3, 4);
    expect([l.offset, l.width, l.height]).toEqual([new Vec(0, 0), 16, 16]);
    expect(l.getColor(new Vec(0, 0))).toEqual(new Color(1, 2, 3, 4));

    var newLayer = l.expandToFitOrReturnSelf(new Vec(24, 22));
    expect([newLayer.offset, newLayer.width, newLayer.height]).toEqual([new Vec(0, 0), 24, 22]);
    expect(newLayer.getColor(new Vec(0, 0))).toEqual(new Color(1, 2, 3, 4));

    var newLayer2 = newLayer.expandToFitOrReturnSelf(new Vec(-8, -10));
    expect([newLayer2.offset, newLayer2.width, newLayer2.height]).toEqual([new Vec(-8, -10), 32, 32]);
    expect(newLayer2.getColor(new Vec(0, 0))).toEqual(new Color(1, 2, 3, 4));
  });
});