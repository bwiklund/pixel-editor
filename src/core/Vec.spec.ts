import { Vec } from './Vec';


describe("vec", () => {
  it("can add and subtract", () => {
    expect(new Vec(1,2).add(new Vec(3,4))).toEqual(new Vec(4,6));
    expect(new Vec(1,2).sub(new Vec(3,4))).toEqual(new Vec(-2,-2));
  });
  
  it("can multiply", () => {
    expect(new Vec(1,2).scalarMult(2)).toEqual(new Vec(2,4));
  });
  
  it("can mag", () => {
    expect(new Vec(1,0).mag()).toBeCloseTo(1);
    expect(new Vec(1,1).mag()).toBeCloseTo(Math.sqrt(2));
    expect(new Vec(2,2).mag()).toBeCloseTo(Math.sqrt(2) * 2);
    expect(new Vec(-1,-1).mag()).toBeCloseTo(Math.sqrt(2));
    expect(new Vec(0,-1).mag()).toBeCloseTo(1);
  });
  
  it("can round", () => {
    expect(new Vec(1,0).round()).toEqual(new Vec(1,0));
    expect(new Vec(1.2,0.2).round()).toEqual(new Vec(1,0));
    expect(new Vec(0.8,-0.2).round()).toEqual(new Vec(1,-0)); // -0
  });
  
  it("can make a new copy", () => {
    var a = new Vec(1,2);
    var b = a.copy();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });
});