var ChooseSketch = function ($) {
  let explainTouch_Xpos;
  let explainTouch_Ypos;
  let explainTouch_W;
  let explainTouch_H = 150;
  let explainButton_State = true;

  let chooseTouch_Xpos = -50;
  let chooseTouch_XposArr = [];
  let chooseTouch_Ypos = 0;
  let chooseTouch_W = 70;
  let chooseTouch_H;
  let chooseButton_State = false;
  let chooseResult = -1;

  let visualToogle = true;

  let hitTestX = -1;
  let hitTestY = -1;

  $.setup = function () {
    $.createCanvas($.windowWidth, $.windowHeight);
    $.noStroke();
    $.background(70, 150, 0, 100);

    // explain page init
    explainTouch_Xpos = 0;
    explainTouch_Ypos = $.windowHeight / 2 + 130;
    explainTouch_W = $.windowWidth;

    // choose winner page init
    chooseTouch_H = $.windowHeight;
    for (let i = 0; i < 4; i++) {
      chooseTouch_XposArr.push((chooseTouch_Xpos += 80));
    }
    console.log(chooseTouch_XposArr);
  };

  $.draw = function () {
    $.clear();

    //* Visual Touch Area
    // explain
    if (explainButton_State && visualToogle) {
      $.fill(255, 0, 0, 75);
      $.rect(
        explainTouch_Xpos,
        explainTouch_Ypos,
        explainTouch_W,
        explainTouch_H
      );
    }

    // choosen
    if (chooseButton_State && visualToogle) {
      for (let i = 0; i < 4; i++) {
        $.fill(255, 0, 0, 75);
        $.rect(
          chooseTouch_XposArr[i],
          chooseTouch_Ypos,
          chooseTouch_W,
          chooseTouch_H
        );
      }
    }

    // Rank visual
    if(RankState){
      $.fill(0,255,0,75);
      $.rect(50,50,100,100);
    }
  };

  $.preload = function () {};

  $.touchStarted = function () {
    hitTestX = $.mouseX;
    hitTestY = $.mouseY;

    // console.log("I'm touch p5: "+ hitTestX +" , "+hitTestY);
  };

  $.touchEnded = function () {
    //* explain page
    if (
      $.collidePointRect(
        hitTestX,
        hitTestY,
        explainTouch_Xpos,
        explainTouch_Ypos,
        explainTouch_W,
        explainTouch_H
      ) &&
      explainButton_State
    ) {
      ExplainTrigger();
      // delay 0.7's set the choose state (true)
      setTimeout(function () {
        chooseButton_State = true;
      }, 700);
      console.log("Explain Pressed");
      explainButton_State = false;
    }
    //* end explain page

    //* Choose page
    for (let i = 0; i < 4; i++) {
      if (
        $.collidePointRect(
          hitTestX,
          hitTestY,
          chooseTouch_XposArr[i],
          chooseTouch_Ypos,
          chooseTouch_W,
          chooseTouch_H
        ) &&
        chooseButton_State
      ) {
        chooseResult = i+1;
        ChooseTrigger();
        // set Horse Object userChoose property
        let horseObj = HorseObjectArr[i];
        horseObj.userChoose = 1;
        // hide the p5js container
        const ChooseContainer = document.querySelector("#ChooseInP5");
        ChooseContainer.style.display = "none";
        console.log("Choosen Pressed, " + chooseResult);
        chooseButton_State = false;
      }
    }
    //* End Choose page
  };

  //* explain page
  function ExplainTrigger() {
    const onBoardContainer = document.querySelector(".background-overlay");
    const coords = { x: 0, y: 0 }; // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
      .to({ x: 0, y: -1000 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        onBoardContainer.style.setProperty(
          "transform",
          `translate(${coords.x}px, ${coords.y}px)`
        );
      })
      .start();
  }
  //* end explain page
  //* explain page
  function ChooseTrigger() {
    const ChooseContainer = document.querySelector(".choosePage");
    const coords = { x: 0, y: 0 }; // Start at (0, 0)
    const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
      .to({ x: 0, y: -1000 }, 1000) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        ChooseContainer.style.setProperty(
          "transform",
          `translate(${coords.x}px, ${coords.y}px)`
        );
      })
      .start();
  }
  //* end explain page
};

var ChooseSketch_p5 = new p5(ChooseSketch, "ChooseInP5");
