import { Designer } from './attempt';

let components = [
    105,
    75,
    295,
    163,
    148,
    218,
    159,
    159,
    178,
    243,
    176,
    383
];

let evolver = new LazyGuy(components);
let document = evolver.createDocument();

console.log('document', document);