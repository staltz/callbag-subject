import { Callbag } from 'callbag';

export default function makeSubject<T>(): Callbag<T, T>;
