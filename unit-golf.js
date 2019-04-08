const px = process.argv[2];
const precision = process.argv[3];

const conversions = [
  { unit: "px", value: 1 },
  { unit: "cm", value: 37.78125 },
  { unit: "mm", value: 3.765625 },
  { unit: "in", value: 96 },
  { unit: "pt", value: 1.328125 },
  { unit: "pc", value: 16 },
  { unit: "em", value: 16 },
  { unit: "ex", value: 7.171875 },
  { unit: "vw", value: 4 },
  { unit: "vh", value: 3 },
  { unit: "q", value: 0.94453125 }
];

const convert = px => {
  return conversions
    .map(({ unit, value }) => {
      const converted = (px / value).toPrecision(precision || 3);
      // casting back to number strips trailing 0s
      return `${Number(converted)}${unit}`;
    })
    .sort((a, b) => a.length - b.length);
};

console.log(convert(px));
