const test = require('tape');
const makeSubject = require('./index');

test('it shares an async finite listenable source', t => {
  t.plan(24);
  const upwardsExpected = [[0, 'function']];

  const downwardsExpectedTypeA = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpectedA = [10, 20, 30];

  const downwardsExpectedTypeB = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpectedB = [20, 30];

  function makeSource() {
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpected.shift();
      t.equals(type, e[0], 'upwards type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards data is expected: ' + e[1]);
      if (type === 0) {
        const sink = data;
        const id = setInterval(() => {
          if (sent === 0) {
            sent++;
            sink(1, 10);
            return;
          }
          if (sent === 1) {
            sent++;
            sink(1, 20);
            return;
          }
          if (sent === 2) {
            sent++;
            sink(1, 30);
            return;
          }
          if (sent === 3) {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
    return source;
  }

  function sinkA(type, data) {
    const et = downwardsExpectedTypeA.shift();
    t.equals(type, et[0], 'downwards A type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards A data type is expected: ' + et[1]);
    if (type === 1) {
      const e = downwardsExpectedA.shift();
      t.equals(data, e, 'downwards A data is expected: ' + e);
    }
  }

  function sinkB(type, data) {
    const et = downwardsExpectedTypeB.shift();
    t.equals(type, et[0], 'downwards B type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards B data type is expected: ' + et[1]);
    if (type === 1) {
      const e = downwardsExpectedB.shift();
      t.equals(data, e, 'downwards B data is expected: ' + e);
    }
  }

  const subject = makeSubject();
  subject(0, sinkA);
  setTimeout(() => {
    subject(0, sinkB);
  }, 150);

  let sent = 0;
  const id = setInterval(() => {
    if (sent === 0) {
      sent++;
      subject(1, 10);
      return;
    }
    if (sent === 1) {
      sent++;
      subject(1, 20);
      return;
    }
    if (sent === 2) {
      sent++;
      subject(1, 30);
      return;
    }
    if (sent === 3) {
      subject(2);
      clearInterval(id);
      return;
    }
  }, 100);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it does not emit data after it is completed and does not accept further sinks.', t => {
  t.plan(5);

  const expectedSink1 = [42, 'Hellow world'];
  const expectedSink2 = ['Hellow world'];

  const subject = makeSubject();
  const r = [];

  subject(0, (t, d) => {
    if (t === 1)
      r.push(d);
  });

  subject(1, 42);

  const r2 = [];
  subject(0, (t, d) => {
    if (t === 1) r2.push(d);
  });

  subject(1, 'Hellow world');
  t.deepEqual(r, expectedSink1, 'expected value for what sink 1 recorded before completion: ' + expectedSink1);
  t.deepEqual(r2, expectedSink2, 'expected value for what sink 2 recorded before completion: ' + expectedSink2);
  subject(2);

  let respondedToSink3 = false;
  subject(0, () => {
    respondedToSink3 = true;
  });

  subject(1, 'Well ...');
  t.deepEqual(r, expectedSink1, 'expected value for what sink 1 recorded after completion: ' + expectedSink1);
  t.deepEqual(r2, expectedSink2, 'expected value for what sink 2 recorded after completion: ' + expectedSink2);
  t.equal(respondedToSink3, false, 'expected to not have responded to sink 3 at all.');
});
