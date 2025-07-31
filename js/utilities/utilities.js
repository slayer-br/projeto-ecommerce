export function validateZipCode(zip) {
  const regexZip = /^\d{5}-?\d{3}$/;
  return regexZip.test(zip);
}
