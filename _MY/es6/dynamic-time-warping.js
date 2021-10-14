class HandwriteInput {
  constructor(bounds) {
    this.stream = [];
    this.focus = null;

    this.bounds = bounds;
    this.prev = null;

    // initialize stream
    for (let i = 0; i < bounds.width; i++) {
      this.stream.push(50);
    }
  }

  handleMouseMove(x, y, buttons) {
    if (
      x < this.bounds.x ||
      this.bounds.x + this.bounds.width < x ||
      y < this.bounds.y ||
      this.bounds.y + this.bounds.height < y
    ) {
      this.focus = null;
      return;
    }

    this.focus = x - this.bounds.x;

    if (buttons) {
      const current = {
        x: x - this.bounds.x,
        y: y - this.bounds.y
      };
      this.updateStream(this.prev, current);
      this.prev = current;
    } else {
      this.prev = null;
    }
  }

  updateStream(prev, { x, y }) {
    if (prev) {
      // complement stream since cursor movement is not countinuous
      let i = prev.x;
      while (i != x) {
        this.stream[i] =
          prev.y + (y - prev.y) * ((i - prev.x) / (x - prev.x));
        i += x > prev.x ? 1 : -1;
      }
    }
    this.stream[x] = y;
  }
}

class Renderer {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  renderStream(stream, { x, y, width, height }, label) {
    this.context.strokeStyle = "gray";
    this.context.strokeRect(x, y, width, height);
    this.context.beginPath();
    for (let i = 1; i < stream.length; i++) {
      this.context.moveTo(x + (i - 1), y + stream[i - 1]);
      this.context.lineTo(x + i, y + stream[i]);
    }
    this.context.stroke();

    if (label) {
      this.context.textBaseline = "middle";
      this.context.fillText(label, x - 70, y + height / 2);
    }
  }

  renderStreamHighlight(highlightArea, { x, y, height }) {
    this.context.strokeStyle = "green";
    this.context.strokeRect(
      highlightArea[0] + x,
      y,
      highlightArea[1] - highlightArea[0],
      height
    );
  }

  renderWarpingPath(warpingPath, { x, y, height }, label) {
    const margin = 3;
    this.context.strokeStyle = "lightgray";
    this.context.beginPath();
    for (let i = 0; i < warpingPath.length; i++) {
      if (i % 10 == 0) {
        this.context.moveTo(x + warpingPath[i][0], y + margin);
        this.context.lineTo(
          x + warpingPath[i][1],
          y + height - margin
        );
      }
    }
    this.context.stroke();

    if (label) {
      this.context.textBaseline = "middle";
      this.context.fillText(label, x - 80, y + height / 2);
    }
  }

  renderWarpingPathHighlight(highlight, { x, y, height }) {
    const margin = 3;
    this.context.strokeStyle = "green";
    this.context.beginPath();

    this.context.moveTo(x + highlight[0][0] * 1, y + margin);
    this.context.lineTo(x + highlight[0][1] * 1, y + margin);
    this.context.lineTo(
      x + highlight[1][0] * 1,
      y + height - margin
    );
    this.context.lineTo(
      x + highlight[1][1] * 1,
      y + height - margin
    );
    this.context.lineTo(x + highlight[0][0] * 1, y + margin);

    this.context.stroke();
  }
}

function getHighlightArea(focus1, focus2, warpingPath) {
  const highlight = [Number.MAX_VALUE, 0];

  const calc = (focus, s, t) => {
    for (let i = 0; i < warpingPath.length; i++) {
      if (warpingPath[i][s] == focus) {
        if (warpingPath[i][t] < highlight[0]) {
          highlight[0] = warpingPath[i][t];
        }
        if (highlight[1] < warpingPath[i][t]) {
          highlight[1] = warpingPath[i][t];
        }
      }
    }
  };

  if (focus1) {
    calc(focus1, 0, 1);
    return [
      [focus1, focus1], highlight
    ];
  } else if (focus2) {
    calc(focus2, 1, 0);
    return [highlight, [focus2, focus2]];
  }
  return [
    [0, 0],
    [0, 0],
  ];
}

function matchStream(stream1, stream2) {
  const map = [];
  const cache = [];

  for (let i = 0; i < stream1.length; i++) {
    map.push([]);
    cache.push([]);
    for (let j = 0; j < stream2.length; j++) {
      map[i].push(Math.abs(stream1[i] - stream2[j]) + 1);
      cache[i].push(Math.abs(i - j) < 150 ? -1 : Number.MAX_VALUE);
    }
  }
  cache[0][0] = 1;

  let search = null;
  search = (x, y) => {
    if (cache[x][y] <= 0) {
      cache[x][y] =
        map[x][y] +
        Math.min(
          x > 0 ? search(x - 1, y) : Number.MAX_VALUE,
          y > 0 ? search(x, y - 1) : Number.MAX_VALUE,
          x > 0 && y > 0 ? search(x - 1, y - 1) : Number.MAX_VALUE
        );
    }
    return cache[x][y];
  };

  search(stream1.length - 1, stream2.length - 1);

  let x = 0;
  let y = 0;
  const match = [];
  while (x != stream1.length - 1 || y > stream2.length - 1) {
    if (
      cache[x + 1][y + 1] <= cache[x + 1][y] &&
      cache[x + 1][y + 1] <= cache[x][y + 1]
    ) {
      x += 1;
      y += 1;
    } else if (cache[x][y + 1] <= cache[x + 1][y]) {
      y += 1;
    } else {
      x += 1;
    }
    match.push([x, y]);
  }

  return match;
}

function init() {
  const canvas = document.getElementsByClassName("dtw")[0];

  const renderer = new Renderer(canvas);
  const input1 = new HandwriteInput({
    x: 100,
    y: 10,
    width: 400,
    height: 100
  });
  const input2 = new HandwriteInput({
    x: 100,
    y: 210,
    width: 400,
    height: 100
  });

  let stream1 = input1.stream;
  let stream2 = input2.stream;
  let w = matchStream(stream1, stream2);
  let highlight = [
    [0, 0],
    [0, 0],
  ];

  const update = e => {
    if (e) {
      input1.handleMouseMove(e.offsetX, e.offsetY, e.buttons);
      input2.handleMouseMove(e.offsetX, e.offsetY, e.buttons);

      if (e.buttons) {
        stream1 = input1.stream;
        stream2 = input2.stream;
        w = matchStream(stream1, stream2);
      }
      highlight = getHighlightArea(input1.focus, input2.focus, w);
    }

    renderer.clear();
    renderer.renderStream(
      stream1, {
      x: 100,
      y: 10,
      width: 400,
      height: 100
    },
      "stream (x)"
    );
    renderer.renderStream(
      stream2, {
      x: 100,
      y: 210,
      width: 400,
      height: 100
    },
      "stream (y)"
    );
    renderer.renderWarpingPath(
      w, {
      x: 100,
      y: 110,
      width: 400,
      height: 100
    },
      "warping path (w)"
    );
    renderer.renderStreamHighlight(highlight[0], {
      x: 100,
      y: 10,
      width: 400,
      height: 100,
    });
    renderer.renderStreamHighlight(highlight[1], {
      x: 100,
      y: 210,
      width: 400,
      height: 100,
    });
    renderer.renderWarpingPathHighlight(highlight, {
      x: 100,
      y: 110,
      width: 400,
      height: 100,
    });
  };

  canvas.addEventListener("mousemove", update);
  update();
}

document.addEventListener("DOMContentLoaded", init);
