"use strict";

const MAX_SCORE = 20;
const MIN_SCORE = 0;

const buttons = {
  up: document.querySelector("#button-up"),
  down: document.querySelector("#button-down"),
  a: document.querySelector("#button-a"),
  b: document.querySelector("#button-b"),
  reset: document.querySelector("#button-reset"),
};

const data = {
  score: {
    DOMElement: document.querySelector("#current-score"),
    value: MAX_SCORE,
    updateRender: function () {
      this.DOMElement.textContent = this.value;
    },
    decrease: function () {
      if (this.value <= 0) return;
      this.value--;
      this.updateRender();
    },
  },
  highscore: {
    DOMElement: document.querySelector("#high-score"),
    value: 0,
    updateRender: function () {
      this.DOMElement.textContent = this.value;
    },
    save: function () {
      this.value = data.score.value;
      this.updateRender();
    },
  },
  secretNumber: {
    DOMElement: document.querySelector("#secret-number"),
    value: 0,
    generate: function () {
      this.value = Math.trunc(Math.random() * MAX_SCORE + 1);
    },
    reveal: function () {
      this.DOMElement.textContent = this.value;
    },
    hide: function () {
      this.DOMElement.textContent = "?";
    },
  },
  userInput: {
    DOMElement: document.querySelector("#user-input"),
    value: 0,
    increase: function () {
      if (this.value != MAX_SCORE) this.value++;
      this.updateRender();
    },
    decrease: function () {
      if (this.value != MIN_SCORE) this.value--;
      this.updateRender();
    },
    updateRender: function () {
      this.DOMElement.textContent = this.value;
    },
  },
  userGuide: {
    DOMElement: document.querySelector("#user-guide"),
    value: "Use the D-Pad to increase/decrease your guess, when ready press the button A to check the result.",
    updateRender() {
      this.DOMElement.textContent = this.value;
    },
  },
  userFeedbackText: {
    DOMElement: document.querySelector("#user-feedback-text"),
    value: "waiting",
    updateRender: function () {
      this.DOMElement.textContent = this.value;
    },
    setToDefault: function () {
      this.value = "waiting";
      this.updateRender();
    },
    setToError: function () {
      this.value = "error";
      this.updateRender();
    },
    setToHigher: function () {
      this.value = "higher";
      this.updateRender();
    },
    setToLower: function () {
      this.value = "lower";
      this.updateRender();
    },
    setToCorrect: function () {
      this.value = "correct";
      this.updateRender();
    },
    setToLost: function () {
      this.value = "lost";
      this.updateRender();
    },
  },
  userFeedbackIcon: {
    DOMElements: {
      waiting: document.querySelector("#user-feedback-icon--default"),
      error: document.querySelector("#user-feedback-icon--error"),
      higher: document.querySelector("#user-feedback-icon--higher"),
      lower: document.querySelector("#user-feedback-icon--lower"),
      correct: document.querySelector("#user-feedback-icon--correct"),
      lost: document.querySelector("#user-feedback-icon--lost"),
    },
    updateRender: function () {
      this.resetRender();
      for (const property in this.DOMElements) {
        if (property != data.userFeedbackText.value) continue;
        this.DOMElements[property].classList.remove("hidden");
      }
    },
    resetRender: function () {
      Object.values(this.DOMElements).forEach((element) => {
        element.classList.add("hidden");
      });
    },
  },
};

const guess = function () {
  const userGuess = data.userInput.value;
  const secretNumber = data.secretNumber.value;

  if (data.score.value <= 0) {
    data.userFeedbackText.setToLost();
    data.userFeedbackIcon.updateRender();
    data.secretNumber.reveal();
    data.userGuide.value = "Game Over! Press the rest button to start again!";
    data.userGuide.updateRender();
    return;
  }

  if (userGuess === secretNumber) {
    data.userFeedbackText.setToCorrect();
    data.userFeedbackIcon.updateRender();
    data.secretNumber.reveal();
    data.userGuide.value = "You won! Press the rest button to increase the highscore!";
    data.userGuide.updateRender();
    if (data.score.value > data.highscore.value) data.highscore.save();
    return;
  }

  if (userGuess < secretNumber) {
    data.userFeedbackText.setToHigher();
    data.userFeedbackIcon.updateRender();
    data.score.decrease();
  }

  if (userGuess > secretNumber) {
    data.userFeedbackText.setToLower();
    data.userFeedbackIcon.updateRender();
    data.score.decrease();
  }
};

const updateAll = function () {
  data.score.updateRender();
  data.highscore.updateRender();
  data.userFeedbackText.updateRender();
  data.userFeedbackIcon.updateRender();
  data.userInput.updateRender();
  data.userGuide.updateRender();
};

const reset = function () {
  data.score.value = MAX_SCORE;
  data.userFeedbackText.setToDefault();
  data.secretNumber.hide();
  data.userInput.value = MIN_SCORE;
  data.userGuide.value = "Use the D-Pad to increase/decrease your guess, when ready press the button A to check the result.";
  init();
};

const init = function () {
  updateAll();
  data.secretNumber.generate();
  console.clear();
  console.log("Debug: " + data.secretNumber.value);
};

init();

buttons.up.addEventListener("click", () => data.userInput.increase());
buttons.down.addEventListener("click", () => data.userInput.decrease());
buttons.a.addEventListener("click", () => guess());
buttons.reset.addEventListener("click", () => reset());
