const px = process.argv[2];
const precision = process.argv[3] || 3;

const allowedOffset = 1;

const conversions = [
  { unit: "px", value: 1 },
  { unit: "cm", value: 37.78125 },
  { unit: "mm", value: 3.765625 },
  { unit: "in", value: 96 },
  { unit: "pt", value: 1.328125 },
  { unit: "em", value: 16 },
  { unit: "ex", value: 7.171875 },
  { unit: "vw", value: 4 },
  { unit: "vh", value: 3 },
  { unit: "q",  value: 0.94453125 }
];

const findShortestValue = px => {
  return conversions
    .map({ unit, value }) => {
      const inUnits = (px / value).toPrecision(precision);
      const string = `${Number(inUnits)}${unit}`;
      const offset = Math.abs(inUnits * value - px);
      return { string, offset };
    })
    .sort((a, b) => {
      const lnDiff = a.string.length - b.string.length;
      if (a.offset >= allowedOffset || lnDiff > 0) return 1;
      if (lnDiff < 0) return -1;
      return a.offset - b.offset;
    })
    .map(res => res.string)
};

const [best, ...rest] = findShortestValue(px);

console.log(`Best match: ${best}, rest: ${rest}`);
