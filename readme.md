# callbag-subject

A callbag listener sink which is also a listenable source, and maintains an internal list of listeners. Use this like you would use RxJS Subject.

`npm install callbag-subject`

## example

First call `makeSubject` to create a `subject` which is then a normal callbag, so:

- Call it with args `(1, data)` to send data into the subject
- Call it with args `(2, err)` to send an error into the subject
- Call it with args `(2)` to make the subject complete

```js
const observe = require('callbag-observe');
const makeSubject = require('callbag-subject');

const subject = makeSubject();

setInterval(() => { subject(1, 'a'); }, 1000);

// First observer is added immediately
observe(x => console.log(x + 1))(subject);

// First observer is added after 2.5 seconds
setTimeout(() => {
  observe(x => console.log(x + 2))(subject);
}, 2500);

// a1
// a1
// a1
// a2
// a1
// a2
// ...
```
