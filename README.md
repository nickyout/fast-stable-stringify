## fast-stable-stringify
WIP. The goal is fast hashing of non-indented stringification. Currently no support for replacer or spaces. 

Warning: Tested only in node.js. 

```
Unit test


  ✓ equal to substack's

  1 passing (34ms)

Benchmark
 log:      Finished benchmarking: "nickyout/fast-stable-stringify"
 metric:   Count (236), Cycles (5), Elapsed (5.658), Hz (4442.095741053829)
 log:      Finished benchmarking: "substack/json-stable-stringify"
 metric:   Count (144), Cycles (4), Elapsed (5.57), Hz (2783.6932287080044)
 info:     Benchmark: "nickyout/fast-stable-stringify" is the fastest.
```