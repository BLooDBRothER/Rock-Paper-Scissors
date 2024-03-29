import { PosEnd } from "./path_data.js";
import {
  animate,
  random,
  regularPathD,
  resetEach,
  scoreUpdate,
  showResult,
  solidPathD,
  templateScore,
  themeColorToggle,
  value,
  vlaidateName,
} from "./util.js";

const themeIc = document.querySelector(".theme-toggle");
const itemGrid = document.querySelectorAll(".items");
const items = document.querySelectorAll(".item");
const main = document.querySelector("main");
const cpItems = document.querySelectorAll(".cp");
const name = document.querySelector(".player-name");
const nameInp = document.querySelector(".player-inp");
const scoreGrid = document.querySelector(".score-grid");
const clr = document.getElementById("clr-pk");
scoreGrid.innerHTML = "";

let delay,
  playerVal,
  computerVal,
  stop = 0,
  oldTrans,
  isClicked = false,
  scores = [0, 0],
  rounds = 0,
  lastHover;

function endStart(){
  if(lastHover === "") return;
  setSolid(lastHover);
  lastHover = "";
}

function endGame() {
  if (rounds == 5) {
    rounds = 0;
    scoreGrid.innerHTML = "";
    showResult(scores[0], scores[1]);
    scores = [0, 0];
  }
}

function callResetEach() {
  scoreUpdate(scores[0], scores[1]);
  let player = document.querySelector(`.item[data-value = '${playerVal}']`);
  let computer = document.querySelector(`.cp[data-value = '${computerVal}']`);
  resetEach(player, playerVal);
  resetEach(computer, computerVal);
  isClicked = false;
  rounds++;
  setTimeout(endGame, 500);
  endStart();
}

function activateCheck() {
  if (isClicked) return;
  lastHover = this;
  isClicked = true;
  oldTrans = [];
  setSolid(this);
  playerVal = this.dataset.value;
  animateTool(this, "pl-" + playerVal);
  autoSetUtil();
}

function validateAnswer() {
  if (
    (playerVal == "scissor" && computerVal == "paper") ||
    (playerVal == "rock" && computerVal == "scissor") ||
    (playerVal == "paper" && computerVal == "rock")
  ) {
    scoreGrid.innerHTML += `<div class="each-round">${templateScore[1]} ${templateScore[2]}</div>`;
    scores[0]++;
  } else if (
    playerVal == computerVal
  ) {
    scoreGrid.innerHTML += `<div class="each-round">${templateScore[3]} ${templateScore[3]}</div>`;
  } else {
    scoreGrid.innerHTML += `<div class="each-round">${templateScore[2]} ${templateScore[1]}</div>`;
    scores[1]++;
  }
  setTimeout(callResetEach, 500);
}

function animateTool(elem, sel) {
  let trans = animate[sel];
  elem.style.transition = "transform .2s linear";
  elem.style.transform = `rotateX(${trans[0]}deg) rotateY(${trans[1]}deg) rotateZ(${trans[2]}deg)`;
}

function setREgular(elem) {
  let pathD = regularPathD[elem.dataset.value];
  elem.classList.remove("so");
  elem.querySelector("path").setAttribute("d", pathD);
}

function setSolid(elem) {
  let pathD = solidPathD[elem.dataset.value];
  elem.classList.add("so");
  elem.querySelector("path").setAttribute("d", pathD);
}

function autoSetUtil() {
  stop = 0;
  autoSet(0);
  let outDelay = 600;
  for (let i = 0; i < 2; i++) {
    setTimeout(() => {
      autoSet(i);
    }, outDelay);
    outDelay += 600;
  }
}

function autoSet(cnt) {
  delay = 0;
  if (cnt == 1) {
    computerVal = value[random()];
  }
  cpItems.forEach((item) => {
    if (stop) return;
    setTimeout(() => {
      setSolid(item);
    }, delay);
    delay += 100;
    if (cnt == 1 && item.dataset.value == computerVal) {
      stop = 1;
      setTimeout(() => {
        animateTool(item, "cp-" + item.dataset.value);
      }, delay);
      setTimeout(validateAnswer, delay + 200);
      return;
    }
    setTimeout(() => {
      setREgular(item);
    }, delay);
    delay += 100;
  });
}

items.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    if (isClicked) {
      lastHover = this;
      return;
    }
    setSolid(this);
  });
  item.addEventListener("mouseleave", function () {
    if (isClicked) {
      lastHover = "";
      console.log(lastHover)
      return;
    }
    setREgular(this);
  });
  item.addEventListener("click", activateCheck);
});

themeIc.addEventListener("click", themeColorToggle);

nameInp.addEventListener("input", vlaidateName);

clr.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--inp-clr", e.target.value);
});

window.addEventListener("click", (e) => {
  if (e.target == name) {
    e.target.classList.add("none");
    nameInp.classList.remove("none");
    nameInp.focus();
    PosEnd(nameInp);
  } else if (e.target != nameInp && !nameInp.classList.contains("none")) {
    name.innerText = nameInp.value.trim() == "" ? "Player 1" : nameInp.value;
    nameInp.classList.add("none");
    name.classList.remove("none");
  }
});


function setHeight(){
  let height = main.offsetHeight;
  itemGrid.forEach(item => {
    item.style.height = `${height-50}px`;
  });
  scoreGrid.style.height = `${height-50}px`;
}

window.onload = window.onresize= setHeight;