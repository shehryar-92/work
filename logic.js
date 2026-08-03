// Simulates monthly compounding with an optional recurring monthly contribution.
// Returns one snapshot per year, from year 0 (starting point) to `years`.
function compoundGrowth({ principal, monthlyContribution, annualRate, years }) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let contributed = principal;

  const round2 = (n) => Math.round(n * 100) / 100;
  const data = [{ year: 0, balance: round2(balance), contributed: round2(contributed), interest: 0 }];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributed += monthlyContribution;
    }
    data.push({
      year: y,
      balance: round2(balance),
      contributed: round2(contributed),
      interest: round2(balance - contributed),
    });
  }

  return data;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { compoundGrowth };
} else {
  window.compoundGrowth = compoundGrowth;
}

