/*
 * Based on https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
 * promiseSerial resolves Promises sequentially.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * const funcs = urls.map(url => () => $.ajax(url)) : array of promises, which will be reduced...
 * 
 * const fctToDoSomethingOnEachStepResultLikeStoringItSomewhereOrWhatever = x => arr.push();
 * 
 * promiseSerial(funcs, fctToDoSomethingOnEachStepResultLikeStoringItSomewhereOrWhatever)
 *   .then(console.log)
 *   .catch(console.error)
 */
function promiseSerial(arrOfProm, callbackOnResolve) {
	return arrOfProm.reduce((prevPromise, nextFunctionWithPromise) => {
		return prevPromise.then(res => nextFunctionWithPromise().then(x => callbackOnResolve(x)));
	}, Promise.resolve("first dummy PROMISE"));
}

// build array of functions returning promises...
const tuples = [
	{ time: 1000, text: "tuple #1" }, 
	{ time: 2000, text: "tuple #2" }, 
	{ time: 500, text: "tuple #3" }, 
	{ time: 4000, text: "tuple #4" }
];
const arrProm = tuples.map((tuple, k) => () => new Promise(function(res, rej) {
	setTimeout(x => { console.log("tuple", k, tuple.text, tuple.time); res(tuple.text); }, tuple.time)
}));

const result = [];

// execute all promises one after another, waiting for previous end...
const callbackOnResolve = x => result.push(x);
const seq = promiseSerial(arrProm, callbackOnResolve)
	.then(x => console.log("finished", x, result))
	.catch(x => console.log("error caught", x, result));

console.log("final result array, empty at this moment: ", result);
