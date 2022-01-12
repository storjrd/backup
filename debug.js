module.exports = moduleName => {
  return (...log) => {
    console.log(`${moduleName}: `);
    console.log(log);
  }
}
