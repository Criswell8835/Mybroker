const excluded = new Set([
  "EU",
  "EZ",
  "QO",
  "UN",
  "ZZ",
  "XA",
  "XB",
  "XC",
  "XD",
  "XE",
  "XF",
  "XG",
  "XH",
  "XI",
  "XJ",
  "XL",
  "XM",
  "XN",
  "XO",
  "XP",
  "XQ",
  "XR",
  "XS",
  "XT",
  "XU",
  "XV",
  "XW",
  "XY",
  "XZ",
]);

function countryNames() {
  const display = new Intl.DisplayNames(["en"], { type: "region" });
  const names: string[] = [];
  for (let first = 65; first <= 90; first += 1) {
    for (let second = 65; second <= 90; second += 1) {
      const code = String.fromCharCode(first) + String.fromCharCode(second);
      if (excluded.has(code)) continue;
      const name = display.of(code);
      if (!name || name === code) continue;
      names.push(name);
    }
  }
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "en"));
}

export const countries = countryNames();

export function matchesCountry(name: string, query: string) {
  const needle = query.trim().toLocaleLowerCase("en");
  if (!needle) return true;
  const folded = (value: string) =>
    value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("en");
  return folded(name).includes(folded(needle));
}
