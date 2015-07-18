## fast-stable-stringify
The goal is fast non-indented stringification. Currently no support for replacer or spaces.

The most popular repository providing this feature is [substack's json-stable-stringify][0]. 

Usage:

```javascript
var stringify = require('fast-stable-stringify');
var result = stringify(obj);
```

Validity (answer equal to substack's) and benchmark (faster than substack's) test:

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nickyout_fast-stable.svg)](https://saucelabs.com/u/nickyout_fast-stable)

(Builds not numbered yet, click badge to see test results)

See results.txt for the original output:

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

\* I did (nickyout / substack) - 1

Looks like it's generally faster. 


[0]: https://github.com/substack/json-stable-stringify