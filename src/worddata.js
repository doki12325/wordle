var en =

const wordlist = en.split("\n");

const wordlistor = [];

wordlist.map((data) => {
  if (data.length == 5) {
    wordlistor.push(data);
  }
});

export const wordlistorg = wordlistor;

export const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "Y",
  "Z",
];