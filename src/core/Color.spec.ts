import { Color, HSV } from './Color';


describe("color", () => {
  let hexPairs = [
    { color: new Color(0, 0, 0), hex: "#000000" },
    { color: new Color(0, 0, 0), hex: "#000000" },
    { color: new Color(255, 255, 255), hex: "#ffffff" },
    { color: new Color(255, 0, 0), hex: "#ff0000" },
    { color: new Color(0, 0, 255), hex: "#0000ff" },
    { color: new Color(127, 127, 127), hex: "#7f7f7f" }
  ];

  let hsvPairs = [
    { color: new Color(0, 0, 0), hsv: new HSV(0, 0, 0) },
    { color: new Color(255, 0, 0), hsv: new HSV(0, 1, 1) },
    { color: new Color(255, 255, 0), hsv: new HSV(1 / 6, 1, 1) },
    { color: new Color(0, 255, 0), hsv: new HSV(2 / 6, 1, 1) },
    { color: new Color(0, 255, 255), hsv: new HSV(3 / 6, 1, 1) },
    { color: new Color(0, 0, 255), hsv: new HSV(4 / 6, 1, 1) },
    { color: new Color(255, 0, 255), hsv: new HSV(5 / 6, 1, 1) },
  ];

  it("can convert to hex", () => {
    hexPairs.forEach(pair => expect(pair.color.toHex()).toEqual(pair.hex));
  });

  it("can convert from hex", () => {
    hexPairs.forEach(pair => expect(Color.fromHex(pair.hex)).toEqual(pair.color));
  });

  it("can convert to hsv", () => {
    hsvPairs.forEach(pair => expect(pair.color.toHSV()).toEqual(pair.hsv));
  });

  it("can convert from hsv", () => {
    hsvPairs.forEach(pair => expect(pair.hsv.toRGB()).toEqual(pair.color));
  });

  it("rounds incoming values to int", () => {
    expect(new Color(0.1,0.1,0.1)).toEqual(new Color(0,0,0));
  });
});