interface CharStats {
  totalTyped: number;
  totalCorrect: number;
  timestamps: number[];
}

const sentences = [
  "Type this sentence.",
  // "Type another sentence.",
  // "Here is a third sentence.",
  // "And a fourth one.",
  // "Finally, a fifth sentence.",
  // "Type this sentence. It's a fairly common one!",
  // "Here's another sentence, meant to include other characters.",
  // "This one has a question mark? And a couple of exclamation points!!",
  // "Let's not forget about the number sign # and the dollar sign $.",
  // "What about these symbols: ^ & * ( ) _ +",
  // "And these ones too: < > ? @ # ~ `",
  // "Use the left and right square brackets: [ ]",
  // "Here's a sentence with a semi-colon; and a colon: as well.",
  // "The quote ' and the double quote \" should not be forgotten.",
  // "This one includes a dash - and an underscore _",
  // "An uppercase sentence: THIS IS ALL CAPS.",
  // "Let's mix upper and lower case: This Is Mixed Case.",
  // "Include some numbers: 1234567890.",
  // "Finally, a sentence that includes all alphabets: The quick brown fox jumps over the lazy dog.",
  // "And one more with all alphabets (in caps): THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.",
];
let currentSentenceIndex = 0;
let currentSentence = sentences[currentSentenceIndex];

const inputElement: HTMLInputElement = document.getElementById(
  "input"
) as HTMLInputElement;
const sentenceDiv: HTMLElement = document.getElementById("sentence")!;
sentenceDiv.textContent = currentSentence;
let prevTimestamp = -1;

let charStats: Record<string, CharStats> = {};
let missedKeys: Record<string, number> = {};
let missedKeyPairs: Record<string, number> = {};
let mistakeKeys: Record<string, number> = {};
let mistakeKeyPairs: Record<string, number> = {};

const lowercaseWords = [
  "fn",
  "let",
  "mod",
  "struct",
  "impl",
  "enum",
  "match",
  "use",
  "pub",
  "crate",
  "trait",
  "self",
  "super",
  "type",
  "as",
  "if",
  "while",
  "loop",
  "for",
  "in",
  "return",
  "break",
  "continue",
  "unsafe",
  "mut",
  "ref",
  "Box",
  "Option",
  "Result",
  "Vec",
  "String",
  "i32",
  "u32",
  "bool",
  "f32",
  "f64",
  "dyn",
  "static",
  "drop",
  "Default",
  "Debug",
  "Clone",
  "Copy",
  "Sized",
  "PartialEq",
  "Eq",
  "PartialOrd",
  "Ord",
  "ToString",
  "From",
  "Into",
  "AsRef",
  "AsMut",
  "Borrow",
  "BorrowMut",
  "ToOwned",
  "Deref",
  "DerefMut",
  "Iterator",
  "Fn",
  "FnMut",
  "FnOnce",
  "Future",
  "Send",
  "Sync",
  "'static",
  "lifetime",
  "async",
  "await",
  "try",
  "map",
  "filter",
  "unwrap",
  "unwrap_or",
  "expect",
  "panic",
  "print",
  "println",
  "format",
  "macro",
  "extern",
  "const",
  "true",
  "false",
  "Some",
  "None",
  "Ok",
  "Err",
  "main",
  "test",
  "cfg",
  "derive",
  "where",
  "Default",
  "std",
  "collections",
  "HashMap",
  "HashSet",
  "LinkedList",
  "BinaryHeap",
  "Rc",
  "Arc",
  "Mutex",
  "RwLock",
  "Condvar",
  "once",
  "thread",
  "spawn",
  "join",
  "catch",
  "move",
  "and_then",
  "or_else",
  "unwrap_or_else",
  "unwrap_or_default",
  "is_err",
  "is_ok",
  "from_str",
  "to_string",
  "parse",
  "push",
  "pop",
  "get",
  "set",
  "insert",
  "remove",
  "contains",
  "len",
  "capacity",
  "clear",
  "new",
  "from",
  "to",
  "as",
  "as_mut",
  "as_ref",
  "clone",
  "copy",
  "read",
  "write",
  "open",
  "close",
  "seek",
  "lock",
  "try_lock",
  "raw",
  "bind",
  "accept",
  "connect",
  "listen",
  "send",
  "recv",
  "stream",
  "tcp",
  "udp",
  "io",
  "fs",
  "net",
  "path",
  "os",
  "env",
  "time",
  "thread",
  "process",
  "sync",
  "ffi",
  "panic",
  "hash",
  "num",
  "str",
  "char",
  "slice",
  "option",
  "result",
  "fmt",
  "alloc",
  "cmp",
  "iter",
  "mem",
];
const punctuationMarks = [";", ",", ":", ".", "!", "?", "->", "=>"];

function generateRandomSentence(): string {
  let sentence: string[] = [];
  for (let i = 0; i < 20; i++) {
    let word =
      lowercaseWords[Math.floor(Math.random() * lowercaseWords.length)];
    const capitalizeFirstLetter = Math.random() < 0.5;
    const capitalizeWholeWord = Math.random() < 0.1;
    if (capitalizeWholeWord) {
      word = word.toUpperCase();
    } else if (capitalizeFirstLetter) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    sentence.push(word);

    if (i >= 10 && i % 2 === 1) {
      const punctuation =
        punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      sentence[i] += punctuation;
    }
  }
  return sentence.join(" ");
}

function updateSentence() {
  while (currentSentenceIndex >= sentences.length) {
    inputElement.value = "";
    currentSentence = generateRandomSentence();
    sentences.push(currentSentence);
    // sentenceDiv.textContent = currentSentence;
    //     currentSentenceIndex = 0;
  }

  currentSentence = sentences[currentSentenceIndex];
  sentenceDiv.textContent = currentSentence;
  inputElement.value = "";
}

inputElement.addEventListener("input", (event) => {
  const currentInput = inputElement.value;
  let newInnerHTML = "";
  let errorOccurred = false;
  let errorIndex = -1;

  for (let i = 0; i < currentInput.length; i++) {
    const typedChar = currentInput[i];
    const sentenceChar = currentSentence[i];

    if (!charStats[typedChar]) {
      charStats[typedChar] = { totalTyped: 0, totalCorrect: 0, timestamps: [] };
    }

    if (typedChar === sentenceChar) {
      newInnerHTML += `<span class="green">${sentenceChar}</span>`;
      // Count the stat only if its the most recent character not after an error
      if (i === currentInput.length - 1 && errorIndex === -1) {
        // If there hasn't been 10 seconds since the last character, add the time-to-click to the character's array
        const currentTime = new Date().getTime();
        if (prevTimestamp != -1) {
          charStats[sentenceChar].totalTyped++;
          charStats[sentenceChar].totalCorrect++;

          const timeDiff = currentTime - prevTimestamp;
          console.log("Timediff", timeDiff);
          if (timeDiff < 5 * 1000) {
            charStats[sentenceChar].timestamps.push(timeDiff);
          }
        }
        prevTimestamp = currentTime;
      }
    } else {
      if (errorIndex === -1) {
        errorIndex = i;
      }
      newInnerHTML += `<span class="red">${
        typedChar == " " ? "␣" : typedChar
      }</span>`;

      // If we just missed this character, update the statistics
      if (i === errorIndex && currentInput.length === errorIndex + 1) {
        // Ignore wrong characters past the current input
        if (i == currentInput.length - 1) {
          charStats[sentenceChar].totalTyped++;
        }

        if (!missedKeys[sentenceChar]) {
          missedKeys[sentenceChar] = 0;
        }
        missedKeys[sentenceChar]++;

        if (!mistakeKeys[typedChar]) {
          mistakeKeys[typedChar] = 0;
        }
        mistakeKeys[typedChar]++;

        if (i > 0) {
          const previousChar = currentInput[i - 1];
          const keyPair = previousChar + sentenceChar;
          if (!missedKeyPairs[keyPair]) {
            missedKeyPairs[keyPair] = 0;
          }
          missedKeyPairs[keyPair]++;

          const mistakeKeyPair = previousChar + typedChar;
          if (!mistakeKeyPairs[keyPair]) {
            mistakeKeyPairs[keyPair] = 0;
          }
          mistakeKeyPairs[keyPair]++;
        }
      }
    }
  }

  // if (errorIndex !== -1) {
  //   inputElement.value = currentInput.slice(0, errorIndex + 1);
  // }

  sentenceDiv.innerHTML =
    newInnerHTML + currentSentence.slice(currentInput.length);

  if (currentInput === currentSentence) {
    currentSentenceIndex++;
    updateSentence();
  }

  calculateStats();
  calculateMostMissedKeys();
  calculateMostMissedKeyPairs();
});

function saveStats() {
  localStorage.setItem("charStats", JSON.stringify(charStats));
  localStorage.setItem("missedKeys", JSON.stringify(missedKeys));
  localStorage.setItem("missedKeyPairs", JSON.stringify(missedKeyPairs));
  localStorage.setItem("mistakeKeys", JSON.stringify(mistakeKeys));
  localStorage.setItem("mistakeKeyPairs", JSON.stringify(mistakeKeyPairs));
}

function loadStats() {
  const loadedCharStats = localStorage.getItem("charStats");
  const loadedMissedKeys = localStorage.getItem("missedKeys");
  const loadedMissedKeyPairs = localStorage.getItem("missedKeyPairs");
  const loadedMistakeKeys = localStorage.getItem("mistakeKeys");
  const loadedMistakeKeyPairs = localStorage.getItem("mistakeKeyPairs");

  if (loadedCharStats) {
    charStats = JSON.parse(loadedCharStats);
  }
  if (loadedMissedKeys) {
    missedKeys = JSON.parse(loadedMissedKeys);
  }
  if (loadedMissedKeyPairs) {
    missedKeyPairs = JSON.parse(loadedMissedKeyPairs);
  }
  if (loadedMistakeKeys) {
    mistakeKeys = JSON.parse(loadedMistakeKeys);
  }
  if (loadedMistakeKeyPairs) {
    mistakeKeyPairs = JSON.parse(loadedMistakeKeyPairs);
  }
}

function calculateStats() {
  const currentTime = new Date().getTime();
  let statsHTML = "";

  const sortedChars = Object.keys(charStats).sort();
  for (const char of sortedChars) {
    const stats = charStats[char];
    const discountFactor = 0.9;

    const weightedTimestamps = stats.timestamps.map((timestamp, index) => {
      return timestamp * Math.pow(discountFactor, index);
    });
    const sumWeightedTimestamps = weightedTimestamps.reduce(function (a, b) {
      return a + b;
    }, 0);
    let normalization_constant = (Math.pow(discountFactor, weightedTimestamps.length - 1) - 1) / (discountFactor - 1);
    const avgWeightedTimestamps = sumWeightedTimestamps / normalization_constant;
    const avgCharsPerWord = 5; // This doesn't include the space
    const wpm = (60 * 1000) / (avgWeightedTimestamps * avgCharsPerWord);
    console.log(
      avgWeightedTimestamps,
      avgCharsPerWord,
      sumWeightedTimestamps,
      weightedTimestamps.length,
      wpm
    );

    const accuracy = (stats.totalCorrect / stats.totalTyped) * 100;
    const adjustedWpm = isNaN(wpm) ? 0 : Math.pow(accuracy / 100, 2) * wpm;
    const greenComponent = Math.min(255, Math.round(adjustedWpm * 2))
      .toString(16)
      .padStart(2, "0");
    const redComponent = (255 - Math.min(255, Math.round(adjustedWpm * 2)))
      .toString(16)
      .padStart(2, "0");
    const color = "#" + redComponent + greenComponent + "00";
    console.log(greenComponent, redComponent, color);

    statsHTML += `<div style="color: ${color}">${
      char == " " ? "␣" : char
    }: WPM = ${adjustedWpm.toFixed(
      2
    )}, &nbsp;&nbsp; Accuracy = ${accuracy.toFixed(2)}%</div>`;
  }

  const statsDiv: HTMLElement = document.getElementById("stats")!;
  statsDiv.innerHTML = statsHTML;
}

function calculateMostMissedKeys() {
  const keysAndCounts = Object.entries(missedKeys);
  const top10 = keysAndCounts.sort((a, b) => b[1] - a[1]).slice(0, 10);

  const missedKeysDiv: HTMLElement = document.getElementById("missed-keys")!;
  missedKeysDiv.innerHTML =
    "Top 10 missed keys:<br>" +
    top10
      .map(([key, count]) => `${key == " " ? "␣" : key}: ${count}`)
      .join("<br>");
}

function calculateMostMissedKeyPairs() {
  const pairsAndCounts = Object.entries(missedKeyPairs);
  const top10 = pairsAndCounts.sort((a, b) => b[1] - a[1]).slice(0, 10);

  const missedKeyPairsDiv: HTMLElement =
    document.getElementById("missed-key-pairs")!;
  missedKeyPairsDiv.innerHTML =
    "Top 10 missed key pairs:<br>" +
    top10
      .map(([pair, count]) => `${pair.replace(" ", "␣")}: ${count}`)
      .join("<br>");
}
