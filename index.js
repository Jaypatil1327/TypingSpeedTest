const wordsList = "the, and, is, may, or, of, on, in, at, as, to, for, with, from, by, about, that, which, can, will, would, should, could, might, must, shall, have, has, had, do, does, did, this, these, those, there, here, where, when, why, how, what, who, whom, whose, some, any, many, much, few, several, all, most, none, one, two, three, first, last, early, late, soon, always, never, sometimes, often, usually, rarely, maybe, definitely, possibly, surely, certainly, probably, mostly, merely, just, exactly, nearly, almost, entirely, fully, partially, half, quarter, once, twice, again, before, after, now, then, later, soon, yesterday, today, tomorrow, morning, evening, night, noon, midday, midnight, day, week, month, year, decade, century, hour, minute, second, moment, instant, forever, temporary, permanent, change, remain, move, stop, go, come, return, start, begin, continue, end, finish, complete, done, work, play, sleep, dream, think, feel, know, learn, understand, remember, forget, believe, doubt, love, hate, like, dislike, enjoy, prefer, choose, select, pick, give, take, send, receive, offer, request, ask, tell, say, speak, talk, write, read, listen, hear, watch, see, look, find, lose, buy, sell, cost, pay, earn, spend, save, build, destroy, create, make, break, fix, change, keep, hold, touch, push, pull, throw, catch, drop, lift, carry, wear, remove, wash, clean, dry, wet, open, close, lock, unlock, enter, exit, leave, arrive, wait, hurry, slow, fast, quick, sudden, surprise, shock, fear, courage, calm, relax, excited, happy, sad, angry, joy, sorrow, pain, pleasure, safe, dangerous, easy, difficult, simple, complex, bright, dark, light, heavy, loud, quiet, silence, noise, truth, lie, real, fake, true, false, right, wrong, good, bad, best, worst, better, worse, perfect, excellent, great, nice, fine, okay, decent, poor, rich, big, small, tall, short, long, wide, narrow, high, low, deep, shallow, thick, thin, strong, weak".split(",");

const typer = document.querySelector(".typer");
const overlay = document.querySelector(".overlay");
const timerEl = document.querySelector(".timer");

let allSpans = [];
let currentIndex = 0;
let startTime = null;
let correctWords = 0;
let typedWord = '';
let timer = 30;
let intervalId = null;

// Generate random word
function getRandomWord() {
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

// Create span-based word DOM
function createWordSpan(word) {
  const div = document.createElement("div");
  div.className = "words";

  for (let letter of word) {
    const span = document.createElement("span");
    span.textContent = letter;
    div.appendChild(span);
    allSpans.push(span);
}

  const space = document.createElement("span");
  space.textContent = " ";
  div.appendChild(space);
  allSpans.push(space);

  return div;
}

function loadWords() {
  for (let i = 0; i < 100; i++) {
    const word = getRandomWord();
    typer.appendChild(createWordSpan(word));
  }
}

function startGame() {
  overlay.classList.add("hidden");
  typer.classList.add("focused");
  startTime = Date.now();

  intervalId = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(intervalId);
      typer.blur();
      document.removeEventListener("keydown", handleKeydown);
      showWPM();
    }
  }, 1000);
}

function showWPM() {
  const wpm = correctWords * 2; // because 30s = half a minute
  overlay.textContent = `Time's up! WPM: ${wpm}`;
  overlay.classList.remove("hidden");
  typer.classList.remove("focused")
}

function handleKeydown(e) {
  if (!startTime) startGame();

  if (e.key === "Backspace") {
    if (currentIndex > 0) {
      currentIndex--;
      typedWord = typedWord.slice(0, -1);
      allSpans[currentIndex].classList.remove("correct", "wrong");
    }
    return;
  }

  if (e.key === " ") {
    // Word complete
    let start = currentIndex - typedWord.length;
    let correct = true;
    for (let i = 0; i < typedWord.length; i++) {
      if (typedWord[i] !== allSpans[start + i].textContent) {
        correct = false;
        break;
      }
    }
    if (correct) correctWords++;

    typedWord = "";
    currentIndex++; 
    return;
  }

  if (e.key.length === 1) {
    const currentSpan = allSpans[currentIndex];
    if (!currentSpan) return;

    if (e.key === currentSpan.textContent) {
      currentSpan.classList.add("correct");
    } else {
      currentSpan.classList.add("wrong");
    }

    typedWord += e.key;
    currentIndex++;
  }
}

loadWords();
document.addEventListener("keydown", handleKeydown);
