function makeSubject() {
  let sinks = [];
  let done = false;
  return (type, data) => {
    if (done) return;
    if (type === 0) {
      const sink = data;
      sinks.push(sink);
      sink(0, t => {
        if (t === 2) {
          const i = sinks.indexOf(sink);
          if (i > -1) sinks.splice(i, 1);
        }
      });
    } else {
      const zinkz = sinks.slice(0);
      for (let i = 0, n = zinkz.length, sink; i < n; i++) {
        sink = zinkz[i];
        if (sinks.indexOf(sink) > -1) sink(type, data);
      }
      if (type === 2) {
        done = true;
        sinks.length = 0;
      }
    }
  }
}

module.exports = makeSubject;