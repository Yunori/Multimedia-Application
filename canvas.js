window.onload = function() {
  var canvas, context;
  var height, width;
  var dots = [];
  var originalCoordinates = [1, 8, 6, 8, 7, 7, 8, 7, 9, 6, 17, 6, 18, 7, 19, 7, 20, 8, 25, 8, 25, 10, 24, 11, 24, 12, 22, 14, 22, 17, 21, 18, 21, 19, 19, 21, 23, 25, 23, 26, 24, 27, 24, 33, 22, 35, 14, 35, 13, 34, 12, 35, 11, 35, 10, 34, 10, 32, 9, 31, 9, 28, 8, 27, 8, 23, 9, 22, 8, 21, 7, 21, 5, 19, 5, 18, 4, 17, 4, 14, 2, 12, 2, 11, 1, 10, 1, 8];
  var anim;
  var drawInterval;
  var direction = 0

  var settings = {
    multX: 0,
    multY: 0,
    scaleX: 0,
    scaleY: 0,
    minY: originalCoordinates[1],
    maxY: originalCoordinates[1],
    minX: originalCoordinates[0],
    maxX: originalCoordinates[0]
  };

  function isNumeric(value) {
    return /^-?\d+(\.?\d+)?$/.test(value);
  }

  function Dot(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.direction = (2 * Math.PI) * direction
    this.speed = 0.1; //0.01 + (Math.random() * 0.01)
    this.connectTo = undefined;
  }

  function pxHeight(percentage) {
    return (percentage / 100) * height;
  }

  function pxWidth(percentage) {
    return (percentage / 100) * width;
  }

  function initDots() {
    dots = [];
    var id = 0;
    for (id = 0; id <= originalCoordinates.length - 1; id = id + 2) {
      var dot = new Dot(originalCoordinates[id], originalCoordinates[id + 1]);
      dots.push(dot);
    }
  }

  function draw() {
    function drawDots() {
      for (var z = 0; z < dots.length; z++) {
        context.beginPath();
        context.arc(pxWidth(dots[z].x), pxHeight(dots[z].y), 7, 0, 2 * Math.PI, false);
        context.fill();
      }
    }

    function moveDots() {
      initCanvas()
      for (var z = 0; z < dots.length; z++) {
        dots[z].x = dots[z].x + Math.cos(dots[z].direction) * dots[z].speed;
        dots[z].y = dots[z].y + Math.sin(dots[z].direction) * dots[z].speed;
      }
      for (var x = 0; x < dots.length; x++) {
        if (x + 1 < dots.length) {
          connectDots(dots[x], dots[x + 1]);
        }
      }
      drawDots();
      anim = window.requestAnimationFrame(moveDots);
    }

    function connectDots(dot1, dot2) {
      context.lineWidth = 7;
      var gradient = context.createLinearGradient(pxWidth(dot1.x), pxWidth(dot1.y), pxWidth(dot2.x), pxWidth(dot2.y));
      gradient.addColorStop("0", "blue");
      gradient.addColorStop("0.5" , "red");
      gradient.addColorStop("1", "yellow");
      context.strokeStyle = gradient;
      context.beginPath();
      context.moveTo(pxWidth(dot1.x), pxHeight(dot1.y));
      context.lineTo(pxWidth(dot2.x), pxHeight(dot2.y));
      context.stroke();
      dot1.connectTo = dot2;
    }
    initCanvas()
    drawDots();
    var x = 0;
    drawInterval = setInterval(function() {
      if (x + 1 < dots.length) {
        connectDots(dots[x], dots[x + 1]);
      } else {
        moveDots()
        window.clearInterval(drawInterval);
      }
      x++;
    }, 100);
  }

  function applySettings() {
    var directions = [0.25, 0.5, 0.75, 1];
    direction = directions[Math.floor(Math.random() * directions.length)];
    settings.multX = isNumeric(document.getElementById('multx').value) ? document.getElementById('multx').value : 1;
    settings.multY = isNumeric(document.getElementById('multy').value) ? document.getElementById('multy').value : 2;
    settings.scaleX = isNumeric(document.getElementById('scalex').value) ? document.getElementById('scalex').value : 1;
    settings.scaleY = isNumeric(document.getElementById('scaley').value) ? document.getElementById('scaley').value : 1;
    originalCoordinates = originalCoordinates.map(function(value, index) {
      if (index % 2 === 1) {
        settings.minY = settings.minY > value ? value : settings.minY;
        settings.maxY = settings.maxY < value ? value : settings.maxY;
      }
      else {
        settings.minX = settings.minX > value ? value : settings.minX;
        settings.maxX = settings.maxX < value ? value : settings.maxX;
      }
      return value * (index % 2 === 0 ? settings.multX : settings.multY);
    })
  }

  function initCanvas() {
    //height = canvas.clientHeight;
    //width = canvas.clientWidth;
    //context.canvas.width = window.innerWidth;
    //context.canvas.height = window.innerHeight;
    height = 1080;
    width = 1920;
    context.canvas.width = 1920;
    context.canvas.height = 1080;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.font = "30px Arial";
    context.fillText("Responsive kitty", context.canvas.width/2.30, context.canvas.height/10);
    context.translate((context.canvas.width - (pxWidth(settings.maxX) - pxWidth(settings.minX))*settings.multX*settings.scaleX)/2 - pxWidth(settings.minX)*settings.multX*settings.scaleX, (context.canvas.height - (pxHeight(settings.maxY) - pxHeight(settings.minY))*settings.multY*settings.scaleY)/2 - pxHeight(settings.minY)*settings.multY*settings.scaleY);
    context.scale(settings.scaleX, settings.scaleY);
  }

  var appbtn = document.getElementById('apply');

  appbtn.addEventListener('click', init);

  function init() {
    window.clearInterval(drawInterval);
    cancelAnimationFrame(anim);
    applySettings();
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    initDots();
    draw();
  }
}
