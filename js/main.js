// this program creates a way of encoding letters in such a way that it can be reversed.
// a simple way to do this is to swap random pairs of the alphabet (13 pairs) in a way
// that does not interfere with each other
// one simple way of implementing this is to have the indices 0-25 on an array,
// randomize the array, and then iterate through the array 2 at a time
// we can use fisher-yates like for card shuffling

// but in order to make it predictably reversable, we cannot use fisher-yates 
// with randomly generated numbers. so a string of 13 pseudo random (but reproducable)
// numbers are needed. this is also difficult because we need the random
// index to go between 1 and 26

// proposed method: use irrational numbers' repeating decimals
//    one way is to operate on the irrational numbers and only pick 2 of the digits
//    at a time, going down powers of 100 (two powers of 10 at a time)
//    given 3 dials that are each integers 0 through 9
// meet the following requirements:
//    0-0-0 produces an array of all 00, or 0 (so the number can be zero or maybe an int)
//    works best if the number is greater than 1, so we know irrational trailing decimals
//    will happen at right after the decimal point
//    let numbers be x1, x2, x3, e = eulers number, pi = circle's circumference/diameter
//    possible formula: ( pi^(x1) + e^(x2) + sqrt(2)^(x3) ) -> 0,0,0 returns 1
//    integer powers of these irrational numbers besides 0 should not return integers

// when the form button is pressed, the code will be applied to a decoding matrix
// then the decoding matrix is used to change letters one for one (no other chars changed)
// optional: take a shortened version of the digit key and transform chars 0-9 the same way

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
  'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const pi = Math.PI
const e = Math.E
const root2 = Math.pow(2, 0.5)




// let's define our javascript bindings to DOM elements
// all of our event listeners are set with in-tag properties in html
// such as onclick, onchange, etc

const answerArea = document.getElementById("answerArea")
const msg = document.getElementById("msg")
const startButton = document.getElementById("startButton")
const dials = [document.getElementById("dial1"),
document.getElementById("dial2"),
document.getElementById("dial3")]

checkDials()

startButton.addEventListener("click", (event) => {
  event.preventDefault()
  startDecode()
})




// function check dials for proper input
function checkDials() {
  console.log('--- checking dials ---')
  for (dial of dials) {

    if (!properDial(dial.value)) {
      dial.value = 0
    }
  }

}

// subfunction to return true or false for proper input
function properDial(str) {
  console.log(str)
  // i use parseInt to make sure i have a whole number
  if (parseInt(str) >= 0 && parseInt(str) <= 9) {
    return true
  } else {
    return false
  }
}


// function to generate the long irrational number based on 3 integers from dials
function dialANum(a, b, c) {
  return Math.pow(pi, a) + Math.pow(e, b) + Math.pow(root2, c)
}

// function on click of startButton
// take the string, use the dictionary on every character
// ignore characters not in the hash or dictionary
// print the message in id = answerArea

function startDecode() {
  // generate hash first
  const alphaHash = generateHash(dials[0].value, dials[1].value, dials[2].value)
  // const alphaHash = generateHash(0, 0, 0)
  const numHash = generateNumHash(dials[0].value, dials[1].value, dials[2].value)

  // grab our message
  const message = msg.value
  let newMessage = ''

  // go through the message character by character
  for (let i = 0; i < message.length; i++) {
    // if the i-th character is in the hash table, add coded character to the newMessage
    if (alphaHash[message[i].toLowerCase()]) {
      newMessage += alphaHash[message[i].toLowerCase()]
    } else if (numHash[message[i]]) {
      // if it's a character in the numerical hash, add coded character to newMessage
      newMessage += numHash[message[i]]
    } else {
      // if not in the hash, just add the character
      newMessage += message[i]
    }

  }


  // add the complete message to our output div "answerArea"
  answerArea.innerHTML = newMessage

}


// function to return an array of 13 random 2digit numbers
// because of precision, we will make two arrays with two different seeds
// (exponents of pi^a + e^b + root2^c, and the other pi^c + e^b + root2^a)
function randPairs(n, pairs) {

  // make a variable we can edit
  irradNum = n

  // clip off the digits to the left of decimal place
  irradNum = irradNum % 1

  let output = []
  // iterate 'pairs' times: store the tenths and hundredths place as 2 digit number
  // to the output array

  for (let i = 0; i < pairs; i++) {
    let twoDigit = Math.floor(irradNum * 100) // capture the top 2 digits 
    output.push(twoDigit)
    irradNum = (irradNum * 100) % 1 // clip off the top two digits and move everything up
  }

  return output

}



// function that takes in the 3 dial values, and returns a "new alphabet"
// array of rearranged letters that only swap 2 at a time non-interfering
// we will copy the original array, use the 'random numbers' to splice letters
// when two in a row are spliced, we add it to an object/hash table
// we make the double keys (so we also can check if its reversible)
// e.g.  a: n, n: a is created when a and n are spliced from the array
// return the hash table at the end (easier to use as dictionary anyway)

function generateHash(a, b, c) {
  // put in a quick dummy hash (doesn't even encode) for 0,0,0
  if (a == 0 && b == 0 && c == 0) {
    let hash = {}
    for (let i = 0; i < alphabet.length; i++) {
      hash[alphabet[i]] = alphabet[i]
    }
    return hash
  }

  let tempAlphabet = alphabet.slice() // make a copy of alphabet

  // dial values are a,b,c
  const pairSet1 = randPairs(dialANum(a, b, c), 13)
  const pairSet2 = randPairs(dialANum(c, b, a), 13)

  // the 26 random number pairs we will use will just be this concatenation
  let pairSet = pairSet1.concat(pairSet2)


  // each 2 digit number may very well be from 0 to 99
  // but we use modulus to make it between 0 and 25
  // however, as pairSet will shrink over time, we will run modulus on its length instead

  let hash = {}

  let pairIndex = pairSet.length
  console.log(pairSet)
  while (pairSet.length > 0) {
    // during each loop, pick 2 letters, set up pair of key: values
    // splice them from tempAlphabet

    // random number is made with modulus of the length of pairSet
    // to capture a number inside the array
    pairIndex = pairSet.length
    let rand = pairSet.shift() % pairIndex
    let letter1 = tempAlphabet[rand]
    tempAlphabet.splice(rand, 1) // splice one element starting at rand


    pairIndex = pairSet.length
    rand = pairSet.shift() % pairIndex
    let letter2 = tempAlphabet[rand]
    tempAlphabet.splice(rand, 1) // splice one element starting at rand


    hash[letter1] = letter2
    hash[letter2] = letter1
  }

  console.log(hash)
  return hash

}

function generateNumHash(a, b, c) {
  // put in a quick dummy hash (doesn't even encode) for 0,0,0
  if (a == 0 && b == 0 && c == 0) {
    let hash = {}
    for (let i = 0; i < 10; i++) {
      hash[i.toString()] = i.toString()
    }
    return hash
  }

  let numList = []

  for (let i = 0; i < 10; i++) {
    numList.push(i.toString())
  }

  // dial values are a,b,c
  let pairSet = randPairs(dialANum(a, b, c), 10)


  // each 2 digit number may very well be from 0 to 99
  // but we use modulus to make it between 0 and whichever number
  // however, as pairSet will shrink over time, we will run modulus on its length instead

  let hash = {}

  let pairIndex = pairSet.length
  console.log(pairSet)
  while (pairSet.length > 0) {
    // during each loop, pick 2 letters, set up pair of key: values
    // splice them from numList

    // random number is made with modulus of the length of pairSet
    // to capture a number inside the array
    pairIndex = pairSet.length
    let rand = pairSet.shift() % pairIndex
    let letter1 = numList[rand]
    numList.splice(rand, 1) // splice one element starting at rand


    pairIndex = pairSet.length
    rand = pairSet.shift() % pairIndex
    let letter2 = numList[rand]
    numList.splice(rand, 1) // splice one element starting at rand


    hash[letter1] = letter2
    hash[letter2] = letter1
  }

  console.log(hash)
  return hash

}


