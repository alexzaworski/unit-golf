const getUnitsAndPxWidth = require("./get-units-and-px-width");

const clampPrecision = (number, precision = 2) => {
  const pow = Math.pow(10, precision);
  return Number(Math.round(number * pow) / pow);
};

const getUnitValues = (px, unit, unitValue) => {
  const { name, multiplier } = unit;
  unitValue = unitValue || clampPrecision(px / multiplier);
  const pixelOffset = clampPrecision(unitValue * multiplier - px);
  return {
    unitValue,
    string: `${unitValue}${name}`.replace(/^0./, "."),
    pixelOffset
  };
};

const findBestUnitValue = (px, tolerance) => unit => {
  let result = getUnitValues(px, unit);
  const { unitValue } = result;

  if (!Number.isInteger(unitValue, tolerance)) {
    for (let i = unitValue.toString().split(".")[1].length - 1; i >= 0; i--) {
      const newUnitValue = clampPrecision(unitValue, i);
      const newResult = getUnitValues(px, unit, newUnitValue);
      const { pixelOffset } = newResult;
      if (Math.abs(pixelOffset) <= tolerance) {
        result = newResult;
      }
    }
  }

  return result;
};

const convertAndSort = (px, units, tolerance) => {
  return units.map(findBestUnitValue(px, tolerance)).sort((a, b) => {
    const [lnA, lnB] = [a, b].map(item => item.string.length);
    const [offsetA, offsetB] = [a.pixelOffset, b.pixelOffset].map(Math.abs);
    const lnDiff = lnA - lnB;
    if (offsetA > tolerance) return 1;
    if (lnDiff === 0) return offsetA - offsetB;
    return lnDiff;
  });
};

const unitGolf = ({ input, tolerance = 0.2, width = 400, height = 300 }) => {
  return getUnitsAndPxWidth({ input, width, height }).then(
    ({ units, pxWidth }) => {
      return convertAndSort(pxWidth, units, tolerance);
    }
  );
};

module.exports = unitGolf;
