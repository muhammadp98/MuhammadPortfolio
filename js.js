console.clear();

class Dots {
  constructor(canvasId) {
    this.dots = [];
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.baseRadius = 6;
    this.gap = this.baseRadius * 4;
    this.balloon = this.baseRadius * 2.5;
    this.areaOfInfluence = 300;

    const init = this.init.bind(this);
    const getRadii = this.getRadii.bind(this);
    
    init();
    windowResize().listen(init);
    
    document.addEventListener("mousemove", e =>
      requestAnimationFrame(() => getRadii(e))
    );
  }

  generateDots() {
    const { canvas, gap } = this;
    const r = this.baseRadius;
    let dots = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let x = 0; x < canvas.width + r; x += gap) {
      for (let y = 0; y < canvas.height + r; y += gap) {
        dots.push({ x, y, r });
      }
    }
    
    return dots;
  }
  
  scale (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  setRadius(dot, e) {
    const { areaOfInfluence, baseRadius, balloon } = this;
    const { x, y } = dot;
    const { clientX, clientY } = e;
    const xDiff = Math.abs(x - clientX);
    const yDiff = Math.abs(y - clientY);
    const distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

    dot.r = baseRadius;

    if (distance < areaOfInfluence) {
      dot.r = this.scale(distance, 0, areaOfInfluence, balloon, baseRadius);
    }

    return dot;
  }

  redraw() {
    const { canvas, context, dots } = this;
    context.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
      const { x, y, r } = dot;
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.fill();
    });
  }

  getRadii(e) {
    const setRadius = this.setRadius.bind(this);
    this.dots = this.dots.map(dot => setRadius(dot, e));
    this.redraw();
  }

  init() {
    this.dots = this.generateDots();
    this.redraw();
  }
}

const dots = new Dots("dottest");

/**
 * Performant window resize event listener
 * @return {object}
 *
 * @usage
 *     import windowResize from './window-resize';
 *     windowResize.listen(() => {
 *         ...
 *     });
 */
function windowResize() {
  const windowResize = {
    callbacks: [],
    running: false,

    /**
     * Add the event listener
     * @return {undefinied}
     */
    init() {
      window.addEventListener("resize", windowResize.resize, {
        passive: true
      });
    },

    /**
     * Loop through callbacks and run them
     * @return {undefinied}
     */
    runCallbacks() {
      windowResize.callbacks.forEach(callback => {
        callback();
      });

      windowResize.running = false;
    },

    /**
     * Event listener method
     * @return {undefinied}
     */
    resize() {
      if (!windowResize.running) {
        windowResize.running = true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => windowResize.runCallbacks());
        } else {
          setTimeout(() => windowResize.runCallbacks(), 100);
        }
      }
    },

    /**
     * Add a callback to the callbacks array
     * @return {undefinied}
     */
    addCallback(callback) {
      if (callback) {
        windowResize.callbacks.push(callback);
      }
    },

    /**
     * Test whether or not any callbacks have been registered yet
     * @return {Boolean}
     */
    hasCallbacks() {
      return windowResize.callbacks.length > 0;
    }
  };

  return {
    // public method to add additional callback
    listen: callback => {
      if (!windowResize.hasCallbacks()) {
        windowResize.init();
      }
      windowResize.addCallback(callback);
    }
  };
}

        
        
        

var radius = 240;
var autoRotate = true;
var rotateSpeed = -60; 
var imgWidth = 350;
var imgHeight = 170;


// ===================== start =======================
setTimeout(init, 100);

var obox = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; 

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";


var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {

  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;


  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;


if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}




document.onpointerdown = function (e) {
  clearInterval(obox.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(obox);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    obox.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(obox);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(obox.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
