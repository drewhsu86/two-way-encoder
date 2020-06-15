# two-way-encoder

## Summary

[Deployed on Surge](https://drewhsu86-two-way-encoder.surge.sh)

This program creates a way of encoding letters in such a way that it can be reversed. A simple way to do this is to swap random pairs of the alphabet (13 pairs) in some way that does not interfere with each other. One simple way of implementing this is to have the indices 0-25 on an array, randomize the array, and then iterate through the array 2 at a time.

One way to shuffle indices is with an algorithm like Fisher-Yates. But in order to make it predictably reversable, we cannot use Fisher-Yates with randomly generated numbers. So a string of 13 pseudo random (but reproduceable) numbers are needed. This is also difficult because we need the random index to go between 1 and 26.

## Proposed method: use irrational numbers' repeating decimals

One way is to operate on the irrational numbers and only pick 2 of the digits at a time, going down powers of 100 (two powers of 10 at a time) given 3 dials that are each integers 0 through 9 meet the following requirements:
  * 0-0-0 produces an array of all 00, or 0 (so the number can be zero or maybe an int)
  * Works best if the number is greater than 1, so we know irrational trailing decimals will happen at right after the decimal point
  * Let numbers irrational such as e = eulers number, pi = circle's circumference/diameter
  * Possible formula: ( pi^(x1) + e^(x2) + sqrt(2)^(x3) ) -> 0,0,0 returns 1
  * Integer powers of these irrational numbers besides 0 should not return integers

