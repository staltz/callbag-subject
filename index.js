function makeSubject() {
  let sinks = [];
  return (type, data) => {
    if (type === 0) {
      const sink = data;
      sinks.push(sink);
      sink(0, t => {
        if (t===2) {
          const i = sinks.indexOf(sink);
          if (i > -1) sinks.splice(i, 1);
        }
      });
    } else {
      for (let i = 0, n = sinks.length; i < n; i++) {
        sinks[i](type, data);
      }
    }
  }
}

module.exports = makeSubject;
