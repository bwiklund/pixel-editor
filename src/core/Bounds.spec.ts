import { Bounds } from './Bounds';
import { Vec } from './Vec';


describe("bounds", () => {
  it("does what it says on the tin", () => {
    var a = new Bounds(new Vec(0, 0), new Vec(16, 16));
    expect([a.width, a.height]).toEqual([16, 16]);

    var b = a.newBoundsIncluding(new Vec(17, 18));
    expect(b.br).toEqual(new Vec(17, 18));
    expect([b.width, b.height]).toEqual([17, 18]);

    var c = b.newBoundsIncluding(new Vec(-1, -2));
    expect(c.tl).toEqual(new Vec(-1, -2));
    expect([c.width, c.height]).toEqual([18, 20]);
  });

});