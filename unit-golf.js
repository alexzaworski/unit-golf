const px = Number(process.argv[2]);
const allowedPixelOffset = Number(process.argv[3] || .5);
const resultPrecision = Number(process.argv[3] || 2);

const units = [
  { name: "px", multiplier: 1 },
  { name: "cm", multiplier: 37.78125 },
  { name: "mm", multiplier: 3.765625 },
  { name: "in", multiplier: 96 },
  { name: "pt", multiplier: 1.328125 },
  { name: "em", multiplier: 16 },
  { name: "ex", multiplier: 7.171875 },
  { name: "vw", multiplier: 4 },
  { name: "vh", multiplier: 3 },
  { name: "q",  multiplier: 0.94453125 }
];

const clampPrecision = (number, precision = 2) => {
  const pow = Math.pow(10, precision);
  return Number(Math.round(number * pow) / pow);
};

const getUnitValues = (px, unit, unitValue) => {
  const { name, multiplier } = unit;
  unitValue = unitValue || clampPrecision(px / multiplier, resultPrecision);
  const pixelOffset = clampPrecision(unitValue * multiplier - px);
  return {
    unitValue,
    string: `${unitValue}${name}`.replace(/^0./, '.'),
    pixelOffset,
  };
};

const findBestUnitValue = px => unit => {
  let result = getUnitValues(px, unit);
  const { unitValue } = result;

  if (!Number.isInteger(unitValue)) {
    let pixelOffset, newUnitValue, i = unitValue.toString().split('.')[1].length-1;
    do {
      newUnitValue = clampPrecision(unitValue, i);
      const newResult = getUnitValues(px, unit, newUnitValue);
      pixelOffset = newResult.pixelOffset;
      if (Math.abs(pixelOffset) <= allowedPixelOffset) {
        result = newResult;
      }
      i--;
    } while (i >= 0);
  }

  return result;
};

const convertAndSort = px => {
  return units
    .map(findBestUnitValue(px))
    .sort((a, b) => {
      const [lnA, lnB] = [a, b].map(item => item.string.length);
      const [offsetA, offsetB] = [a.pixelOffset, b.pixelOffset].map(Math.abs);
      const lnDiff = lnA - lnB;
      if (offsetA > allowedPixelOffset) return 1;
      if (lnDiff === 0) return offsetA - offsetB;
      return lnDiff;
    });
};

const [best, ...rest] = convertAndSort(px);

console.log(`\nBest: ${best.string}, offset by: ${best.pixelOffset} pixels`);
console.log(`\nRest:\n${rest.map(res => `${res.string} (offset: ${res.pixelOffset})`).join('\n')}`);
