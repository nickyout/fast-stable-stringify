# fast-stable-stringify

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nickyout_fast-stable.svg)](https://saucelabs.com/u/nickyout_fast-stable)

(Builds not numbered yet, but click the badge to see test results)

The most popular repository providing this feature is [substack's json-stable-stringify][sub]. The intent if this library is to provide a faster alternative for when performance is more important than features. It assumes you provide basic javascript values without circular references, and returns a non-indented string.  

Usage:

```javascript
var stringify = require('fast-stable-stringify');
stringify({ d: 0, c: 1, a: 2, b: 3, e: 4 }); // '{"a":2,"b":3,"c":1,"d":0,"e":4}'
```

Just like substack's, it does:

*   handle all variations of all basic javascript values (number, string, boolean, array, object, null)
*   handle undefined in the same way as JSON.stringify
*	work without native JSON.strinxgify
*   not support ie8 (and below) with complete certainty. At least, his build failed on ie8.	

Unlike substack's, it does:

*   not implement the 'replacer' or 'space' arguments of the JSON.stringify method
*   not check for circular references
*   not check for .toJSON() methods on objects

## Test results
Tested validity (answer equal to substack's) and benchmark (faster than substack's). A test passes only if it has the same output as substack's but is faster (as concluded by [benchmark.js][ben]). 

To (hopefully) prevent [certain smart browsers][cat] from concluding the stringification is not necessary because it is never used anywhere, I summed up all the lengths of the resulting strings of each benchmark contestant and printed it along with the result data. 

Benchmark commit 8fdab80    |substack/json-stable-stringify |nickyout/fast-stable-stringify |faster*
----------------------------|-------------------------------|-------------------------------|------
chrome 26 on Windows 2003   |3,300 ops/sec ±5.69% (53 runs) |4,867 ops/sec ±5.72% (64 runs) |+47%
chrome 43 on Mac 10.6       |4,317 ops/sec ±1.09% (97 runs) |6,070 ops/sec ±3.40% (90 runs) |+41%
ie9 on Windows 2008         |2,648 ops/sec ±4.01% (18 runs) |5,258 ops/sec ±3.34% (31 runs) |+98%
ie10 on Windows 2012        |2,251 ops/sec ±6.75% (69 runs) |4,112 ops/sec ±6.07% (71 runs) |+83%
ie11 on Windows 2012 R2     |3,739 ops/sec ±3.33% (81 runs) |4,891 ops/sec ±4.42% (78 runs) |+31%
safari 5 on Mac 10.6        |2,955 ops/sec ±3.02% (61 runs) |7,222 ops/sec ±3.00% (42 runs) |+144%
safari 8 on Mac 10.10       |3,828 ops/sec ±4.72% (82 runs) |10,228 ops/sec ±9.21% (87 runs)|+167%
firefox 20 on Windows 2008  |1,957 ops/sec ±8.58% (72 runs) |4,346 ops/sec ±6.16% (83 runs) |+122%
firefox 39 on Mac 10.10     |3,147 ops/sec ±3.90% (83 runs) |4,876 ops/sec ±5.45% (80 runs) |+55%
opera 11 on Windows 2003    |497 ops/sec ±4.62% (44 runs)   |634 ops/sec ±4.08% (38 runs)   |+27%
opera 12 on Windows 2003    |1,744 ops/sec ±2.14% (55 runs) |2,797 ops/sec ±3.54% (19 runs) |+60%
ipad 4.3 on Mac 10.6        |2,094 ops/sec ±1.01% (15 runs) |3,396 ops/sec ±0.75% (22 runs) |+62%
ipad 8.2 on Mac 10.10       |4,029 ops/sec ±4.36% (36 runs) |4,630 ops/sec ±8.66% (32 runs) |+15%
iphone 4.3 on Mac 10.6      |2,001 ops/sec ±7.63% (14 runs) |3,327 ops/sec ±2.99% (21 runs) |+66%
iphone 8.2 on Mac 10.10     |3,899 ops/sec ±4.80% (44 runs) |10,100 ops/sec ±6.05% (48 runs)|+159%
android 4.0 on Linux        |4,528 ops/sec ±0.78% (28 runs) |4,418 ops/sec ±2.66% (60 runs) |-2%
android 5.1 on Linux        |3,576 ops/sec ±2.46% (83 runs) |5,010 ops/sec ±7.22% (84 runs) |+40%

\* I did (nickyout / substack) - 1 in percentages

Looks like it's generally faster. I would say about 50% in practice since chrome-ff-ie take the brunt of the used browsers (or see [caniuse browser usage][usg]). 

See `./results.txt` for the original output.

## Also
It exposes the way strings are escaped for JSON:

```javascript
var stringify = require('./'),
	stringSearch = stringify.stringSearch,
	stringReplace = stringify.stringReplace,
	str = "ay\nb0ss";
str.replace(stringSearch, stringReplace); // 'ay\\nb0ss'
```

It does NOT add the quotes before and after the string needed for JSON.stringify-ing strings. Fortunately, that isn't hard:

```javascript
'"' + str.replace(stringSearch, stringReplace) + '"'; // '"ay\\nb0ss"'
```

## Running tests
For testing in node, do:

```
npm test
```

I used [zuul][zul] for testing on saucelabs. It's a very easy to use tool, but because their library is about 150MB I did not include it in the devDepencencies. I suggest installing it globally if you want to test:

```
# install zuul
npm install -g zuul
# then, to run all tests
zuul -- test/index.js
 ```
 
## TODO

*	Travis
*	Coverage

[sub]: https://github.com/substack/json-stable-stringify
[ben]: https://github.com/bestiejs/benchmark.js
[cat]: http://mrale.ph/blog/2014/02/23/the-black-cat-of-microbenchmarks.html
[usg]: http://caniuse.com/usage-table
[zul]: https://github.com/defunctzombie/zuul