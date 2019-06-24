export default function combine(objects) {
  const result = {};
  for (let object of objects) {
    for (let key in object) {
      if (result.hasOwnProperty(key)) {
        console.error(`'${key}'の宣言が重複しています。`);
      }
    }
    Object.assign(result, object);
  }

  return result;
}
