const getUnits = require("./get-units");

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

const getPixelValue = (string, units) => {
  const numericValue = parseFloat(string);
  if (numericValue.toString().length === string.length) return numericValue;
  const name = string.replace(numericValue.toString(), "").toLowerCase();
  const unit = units.find(unit => unit.name === name);
  if (!unit) throw new Error(`Could not find such a unit: ${name}`);
  const px = Math.round(unit.multiplier * numericValue);
  console.log(`\nConverted to: ${px}px`);
  return px;
};

getUnits(input).then(units => {
  const asPx = getPixelValue(input, units);
  const [best, ...rest] = convertAndSort(asPx, units);
  console.log(`\nBest: ${best.string}, offset by: ${best.pixelOffset} pixels`);
  console.log(
    `\nRest:\n${rest
      .map(res => `${res.string} (offset: ${res.pixelOffset})`)
      .join("\n")}`
  );
});
