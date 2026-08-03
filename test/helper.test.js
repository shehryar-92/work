const test = require("node:test");
const assert = require("node:assert");
const { compoundGrowth } = require("../logic.js");

test("year 0 snapshot equals the starting principal", () => {
  const data = compoundGrowth({ principal: 1000, monthlyContribution: 0, annualRate: 5, years: 10 });
  assert.strictEqual(data[0].balance, 1000);
  assert.strictEqual(data[0].interest, 0);
});

test("returns one entry per year plus year 0", () => {
  const data = compoundGrowth({ principal: 500, monthlyContribution: 50, annualRate: 4, years: 6 });
  assert.strictEqual(data.length, 7);
});

test("matches the closed-form compound interest formula with no contributions", () => {
  const principal = 1000;
  const annualRate = 6;
  const years = 5;
  const data = compoundGrowth({ principal, monthlyContribution: 0, annualRate, years });
  const expected = principal * Math.pow(1 + annualRate / 100 / 12, 12 * years);
  assert.ok(Math.abs(data[years].balance - expected) < 0.01);
});

test("contributions accumulate correctly with 0% interest", () => {
  const data = compoundGrowth({ principal: 100, monthlyContribution: 25, annualRate: 0, years: 2 });
  assert.strictEqual(data[2].contributed, 100 + 25 * 24);
  assert.strictEqual(data[2].balance, data[2].contributed);
  assert.strictEqual(data[2].interest, 0);
});

test("balance grows faster than contributions when rate is positive", () => {
  const data = compoundGrowth({ principal: 1000, monthlyContribution: 100, annualRate: 7, years: 20 });
  const last = data[data.length - 1];
  assert.ok(last.balance > last.contributed);
  assert.ok(last.interest > 0);
});

