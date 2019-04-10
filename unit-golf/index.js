const getUnitsAndPxWidth = require("./get-units-and-px-width");

const input = process.argv[2];
const allowedPixelOffset = Number(process.argv[3] || 0.5);
const resultPrecision = Number(process.argv[4] || 2);

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
    string: `${unitValue}${name}`.replace(/^0./, "."),
    pixelOffset
  };
};

const findBestUnitValue = px => unit => {
  let result = getUnitValues(px, unit);
  const { unitValue } = result;

  if (!Number.isInteger(unitValue)) {
    for (let i = unitValue.toString().split(".")[1].length - 1; i >= 0; i--) {
      const newUnitValue = clampPrecision(unitValue, i);
      const newResult = getUnitValues(px, unit, newUnitValue);
      const { pixelOffset } = newResult;
      if (Math.abs(pixelOffset) <= allowedPixelOffset) {
        result = newResult;
      }
    }
  }

  return result;
};

const convertAndSort = (px, units) => {
  return units.map(findBestUnitValue(px)).sort((a, b) => {
    const [lnA, lnB] = [a, b].map(item => item.string.length);
    const [offsetA, offsetB] = [a.pixelOffset, b.pixelOffset].map(Math.abs);
    const lnDiff = lnA - lnB;
    if (offsetA > allowedPixelOffset) return 1;
    if (lnDiff === 0) return offsetA - offsetB;
    return lnDiff;
  });
};

getUnitsAndPxWidth(input).then(({ units, pxWidth }) => {
  const [best, ...rest] = convertAndSort(pxWidth, units);
  console.log(`\nBest: ${best.string}, offset by: ${best.pixelOffset} pixels`);
  console.log(
    `\nRest:\n${rest
      .map(res => `${res.string} (offset: ${res.pixelOffset})`)
      .join("\n")}`
  );
});
