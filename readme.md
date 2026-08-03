# Compound Interest Calculator

A small calculator that shows how your money grows over time with compound interest and optional monthly contributions. Just open `index.html`, no build step, no dependencies.

## What it does

Enter a starting amount, a monthly contribution, an annual interest rate, and how many years you want to project. It simulates the growth month by month (interest compounds monthly) and plots two lines on a canvas graph: your total balance and how much you actually put in yourself. The gap between the two lines is your interest earned, which is also broken out below the chart.

## Files

- `logic.js` – the actual math, `compoundGrowth()`. No DOM code, so it's easy to test on its own.
- `logic.test.js` – tests for the growth calculation, run with `node --test`.
- `app.js` – wires up the form, redraws the chart whenever an input changes, and updates the summary numbers.
- `index.html` – the page itself.
- `style.css` – styling, including the light/dark toggle (saved to `localStorage`).

## Running tests

```
node --test
```

## Notes

The graph is drawn with plain Canvas, no charting library. Colors are pulled from CSS variables so the chart redraws in the right palette when you switch themes.

