export default function combine(objects) {
  const result = {};
  for (let object of objects) {
    for (let key in object) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        console.error(`'${key}' is duplicated.`);
      }
    }
    Object.assign(result, object);
  }

  return result;
}
