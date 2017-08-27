# fast-stable-stringify
*Notice: The License of this repository has been changed from GPL-3.0 to MIT as of 2017-08-25. All following commits will fall under the MIT license.*

[![Build Status](https://travis-ci.org/nickyout/fast-stable-stringify.svg?branch=master)](https://travis-ci.org/nickyout/fast-stable-stringify)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/nickyout_fast-stable.svg)](https://saucelabs.com/u/nickyout_fast-stable)

_The test only succeeds when mine is faster than substack's in a particular browser._

The most popular repository providing this feature is [substack's json-stable-stringify][sub]. The intent if this library is to provide a faster alternative for when performance is more important than features. It assumes you provide basic javascript values without circular references, and returns a non-indented string. It currently offers a performance boost in popular browsers of about 50%. Less so for modern desktop browsers (30%), more so for modern (mobile) safari (100%). For most legacy browsers, about 75%.

Usage:

```javascript
var stringify = require('fast-stable-stringify');
stringify({ d: 0, c: 1, a: 2, b: 3, e: 4 }); // '{"a":2,"b":3,"c":1,"d":0,"e":4}'
```

Just like substack's, it does:

*   handle all variations of all basic javascript values (number, string, boolean, array, object, null)
*   handle undefined in the same way as `JSON.stringify`
*	work without native access to `JSON.stringify`
*   **not support ie8 (and below) with complete certainty**. At least, his build failed on ie8.

Unlike substack's, it does:

*   not implement the 'replacer' or 'space' arguments of the JSON.stringify method
*   not check for circular references
*   not check for .toJSON() methods on objects

**Upgrade warning (0.1.1 to 0.2.0):**

Version 0.1.1 would sometimes return invalid JSON strings when given object properties with the value `undefined`. The response was still consistent and unique given the other properties, so I suspect in most cases this should have caused no problems. However, **if your own project is storing the results of this library (0.1.1), do note that the results will be slightly different starting with 0.2.0**.

## Test results
Tested validity (answer equal to substack's) and benchmark (faster than substack's). A test passes only if it has the same output as substack's but is faster (as concluded by [benchmark.js][ben]). 

To (hopefully) prevent [certain smart browsers][cat] from concluding the stringification is not necessary because it is never used anywhere, I summed up all the lengths of the resulting strings of each benchmark contestant and printed it along with the result data. 

### Latest (interpreted) result

Benchmark commit 14ad70c5e1|nickyout/fast-stable-stringify|substack/json-stable-stringify|last time* |fastest*
---------------------------|------------------------------|------------------------------|-----------|-----------
safari 5 on Windows 2008   | x 4,317 ops/sec              | x 1,534 ops/sec              |+162%      |+181%
safari 10 on Mac 10.12     | x 6,830 ops/sec              | x 3,430 ops/sec              |    		 |+99%
opera 12 on Windows 2003   | x 3,084 ops/sec              | x 1,938 ops/sec              |+66%       |+59%
microsoftedge 14 on Windows| x 5,717 ops/sec              | x 4,513 ops/sec              |    		 |+26%
iphone 9.2 on Mac 10.10    | x 6,643 ops/sec              | x 3,829 ops/sec              |    		 |+73%
ipad 9.2 on Mac 10.10      | x 8,563 ops/sec              | x 3,374 ops/sec              |    		 |+153%
internet explorer 9 on Wind| x 6,236 ops/sec              | x 2,954 ops/sec              |+97%	     |+111%
internet explorer 11 on Win| x 5,236 ops/sec              | x 3,729 ops/sec              |+34%       |+40%
internet explorer 10 on Win| x 7,520 ops/sec              | x 3,435 ops/sec              |+119%      |+118%
firefox 20 on Windows 10   | x 4,263 ops/sec              | x 2,038 ops/sec              |+108%      |+109%
chrome 57 on Windows 2008  | x 9,116 ops/sec              | x 7,191 ops/sec              |    		 |+26%
chrome 26 on Windows 10    | x 5,696 ops/sec              | x 3,314 ops/sec              |+47%		 |+71%
android 6.0 on Linux       | x 6,199 ops/sec              | x 4,775 ops/sec              |    		 |+29%

\* I did (nickyout / substack) - 1 in percentages

Arguably faster than last time, but more importantly, most latest versions of the most popular browsers get a bump in speed. I'll call that a win. 

See [caniuse browser usage][usg] for the 'most popular browsers'.

Click the build status badge to view the original output.

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

*	Test more unicode chars

[sub]: https://github.com/substack/json-stable-stringify
[ben]: https://github.com/bestiejs/benchmark.js
[cat]: http://mrale.ph/blog/2014/02/23/the-black-cat-of-microbenchmarks.html
[usg]: http://caniuse.com/usage-table
[zul]: https://github.com/defunctzombie/zuul
