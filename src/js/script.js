'use strict';

// ----- ELEMENTS -----
const main = document.querySelector('.main');
const score = document.querySelector('.game__score .score');
const choicesBtns = document.querySelectorAll('.btn-pick');
let pickedBtn;
let computerChoice;
let scoreNumb;

// getting the highscore from local storage
let hscoreNumb = getfromLS();
if (hscoreNumb) {
  scoreNumb = hscoreNumb;
  score.innerHTML = `${hscoreNumb}`;
} else {
  score.innerHTML = 0;
  scoreNumb = 0;
}

// ----- NEW ELEMENTS -----
const computerPickedDiv = document.createElement('div');
computerPickedDiv.classList.add('cpu');
const computerPickedImg = document.createElement('img');
computerPickedDiv.append(computerPickedImg);
const result = document.createElement('div');
result.classList.add('result');
const resultText = document.createElement('p');
resultText.classList.add('result__winner');
const retryBtn = document.createElement('button');
retryBtn.classList.add('btn-retry');
retryBtn.innerHTML = 'Try again?';
result.append(resultText, retryBtn);

// the logic of how the game works
const choices = [
  {
    pick: 'rock',
    beats: 'scissors',
  },
  {
    pick: 'paper',
    beats: 'rock',
  },
  {
    pick: 'scissors',
    beats: 'paper',
  },
];

// ----- FUNCTIONS -----
function collectChoices(e) {
  // 1) getting both players choices:
  pickedBtn = e.target.closest('.btn-pick');
  const userChoice = pickedBtn.dataset.pick;

  computerChoice = randomComputerChoice();
  computerPickedImg.setAttribute(
    'src',
    `assets/images/${computerChoice.pick}.png`
  );

  animateChoices(pickedBtn, userChoice, computerChoice, computerPickedImg);
}

// showing the animations of hiding, zooming and 'skeleton' loading
function animateChoices(
  pickedBtn,
  userChoice,
  computerChoice,
  computerPickedImg
) {
  // hiding all the buttons except the one that user has chosen
  Array.from(choicesBtns)
    .filter(cbtn => cbtn !== pickedBtn)
    .forEach(cbtn => {
      cbtn.classList.add('hide');
    });

  // scaling the users choice and start showing the loading 'spinner' for the computers side
  let animationCount = 0;
  main.append(computerPickedDiv);
  setTimeout(() => {
    pickedBtn.classList.add('show');
    computerPickedDiv.classList.add('show');
    computerPickedDiv.addEventListener('animationend', () => {
      console.log('animation ended?');
      animationCount++;
      if (animationCount === 1) {
        computerPickedImg.style.opacity = '1';
        computerPickedDiv.style.backgroundColor = 'transparent';

        showResults(userChoice, computerChoice);
      }
    });
  }, 800);
}

// calculating and showing the result of who is the winner
function showResults(userChoice, computerChoice) {
  if (userChoice === computerChoice.beats) {
    resultText.innerHTML = 'Computer won';
  } else if (userChoice === computerChoice.pick) {
    resultText.innerHTML = 'DRAW!';
  } else {
    resultText.innerHTML = 'You won!';
    scoreNumb++;
    score.innerHTML = scoreNumb;
    setToLS(scoreNumb);
  }
  main.append(result);
  main.style.width = '85%';
  setTimeout(() => {
    result.classList.add('show');
  }, 1000);
}

// randomizing computer's choice
function randomComputerChoice() {
  const computerChoice = choices[Math.floor(choices.length * Math.random())];
  return computerChoice;
}

function setToLS(score) {
  localStorage.setItem('highScore', JSON.stringify(score));
}
function getfromLS() {
  const highScore = localStorage.getItem('highScore');
  return JSON.parse(highScore);
}

// ----- EVENT LISTENERS -----
choicesBtns.forEach(choiceBtn => {
  choiceBtn.addEventListener('click', collectChoices);
});

retryBtn.addEventListener('click', () => {
  const allEls = document.body.querySelectorAll('*');
  allEls.forEach(el => el.setAttribute('style', ''));

  computerPickedDiv.classList.remove('show');
  result.classList.remove('show');
  computerPickedDiv.remove();
  result.remove();

  score.innerHTML = scoreNumb;

  setTimeout(() => {
    pickedBtn.classList.remove('show');
    setTimeout(() => {
      choicesBtns.forEach(cbtn => {
        cbtn.classList.remove('hide');
      });
    }, 980);
  }, 1200);
});

// exiting the tap => new game for next time
window.addEventListener('beforeunload', () => {
  window.localStorage.removeItem('highScore');
});

// document.querySelector('.btn-modal').addEventListener('click', () => {
//   const allEls = document.body.querySelectorAll('*');
//   allEls.forEach(el => (el.style.userSelect = 'none'));
//   document.querySelector('.modal').classList.add('show');
// });

// document.querySelector('.btn-close').addEventListener('click', () => {
//   const allEls = document.body.querySelectorAll('*');
//   allEls.forEach(el => (el.style.userSelect = 'all'));
//   document.querySelector('.modal').classList.remove('show');
// });
