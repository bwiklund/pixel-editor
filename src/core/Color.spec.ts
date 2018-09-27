import { Color, HSV } from './Color';


describe("color", () => {
  it("can convert to hex", () => {
    expect(new Color(0, 0, 0).toHex()).toEqual("#000000");
    expect(new Color(255, 255, 255).toHex()).toEqual("#ffffff");
    expect(new Color(255, 0, 0).toHex()).toEqual("#ff0000");
    expect(new Color(0, 0, 255).toHex()).toEqual("#0000ff");
    expect(new Color(127, 127, 127).toHex()).toEqual("#7f7f7f");
  });

  it("can convert to hsv", () => {
    expect(new Color(0, 0, 0).toHSV()).toEqual(new HSV(0, 0, 0));
    expect(new Color(255, 0, 0).toHSV()).toEqual(new HSV(0, 1, 1));

    expect(new Color(255, 255, 0).toHSV().h).toBeCloseTo(1/6);
    expect(new Color(0, 255, 0).toHSV().h).toBeCloseTo(2/6);
    expect(new Color(0, 255, 255).toHSV().h).toBeCloseTo(3/6);
    expect(new Color(0, 0, 255).toHSV().h).toBeCloseTo(4/6);
    expect(new Color(255, 0, 255).toHSV().h).toBeCloseTo(5/6);
  });
});