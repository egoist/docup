export function evaluate(str) {
  try {
    const fn = new Function(`return {${str.trim()}}`);
    return fn();
  } catch (err) {
    console.error(`Error evaluate: ${str}`);
    return {}
  }
}
