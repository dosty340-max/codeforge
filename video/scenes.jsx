// Builds the AgentWe landing page scenes. Run in After Effects, then video/render.sh.
(function () {
  var LIME = [0.784, 1, 0], BG = [0.035, 0.035, 0.043], CARD = [0.094, 0.094, 0.106];
  var LINE = [0.2, 0.2, 0.22], WHITE = [0.98, 0.98, 0.98], MUTED = [0.63, 0.63, 0.67];
  var AMBER = [0.96, 0.62, 0.04], GREEN = [0.13, 0.77, 0.37], BLACK = [0, 0, 0];
  var BOLD = "HelveticaNeue-Bold", REGULAR = "HelveticaNeue", MONO = "Menlo-Regular";

  function ease(prop) {
    var dims = prop.propertyValueType === PropertyValueType.TwoD ? 2
      : prop.propertyValueType === PropertyValueType.ThreeD ? 3 : 1;
    var e = [], i;
    for (i = 0; i < dims; i++) e.push(new KeyframeEase(0, 75));
    for (i = 1; i <= prop.numKeys; i++) prop.setTemporalEaseAtKey(i, e, e);
  }

  function animate(prop, keys) {
    for (var i = 0; i < keys.length; i++) prop.setValueAtTime(keys[i][0], keys[i][1]);
    ease(prop);
  }

  function fadeUp(layer, t) {
    var p = layer.property("ADBE Transform Group").property("ADBE Position").value;
    animate(layer.property("ADBE Transform Group").property("ADBE Position"), [[t, [p[0], p[1] + 28]], [t + 0.5, [p[0], p[1]]]]);
    animate(layer.property("ADBE Transform Group").property("ADBE Opacity"), [[t, 0], [t + 0.4, 100]]);
    return layer;
  }

  function position(layer, x, y) {
    layer.property("ADBE Transform Group").property("ADBE Position").setValue([x, y]);
    return layer;
  }

  function text(comp, str, x, y, size, color, font, center) {
    var layer = comp.layers.addText(str);
    var source = layer.property("ADBE Text Properties").property("ADBE Text Document");
    var doc = source.value;
    doc.resetCharStyle();
    doc.fontSize = size;
    doc.font = font || REGULAR;
    doc.applyFill = true;
    doc.fillColor = color || WHITE;
    doc.applyStroke = false;
    doc.justification = center ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY;
    source.setValue(doc);
    return position(layer, x, y);
  }

  function alignRight(layer) {
    var source = layer.property("ADBE Text Properties").property("ADBE Text Document");
    var doc = source.value;
    doc.justification = ParagraphJustification.RIGHT_JUSTIFY;
    source.setValue(doc);
    return layer;
  }

  function typed(layer, t0, t1) {
    var source = layer.property("ADBE Text Properties").property("ADBE Text Document");
    source.expression = "var s = value.text; s.substr(0, Math.round(linear(time, " + t0 + ", " + t1 + ", 0, s.length)));";
  }

  function shape(comp, name) {
    var layer = comp.layers.addShape();
    layer.name = name;
    var group = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    layer.items = group.property("ADBE Vectors Group");
    return layer;
  }

  function paint(items, fill, stroke, width) {
    if (stroke) {
      var s = items.addProperty("ADBE Vector Graphic - Stroke");
      s.property("ADBE Vector Stroke Color").setValue(stroke);
      s.property("ADBE Vector Stroke Width").setValue(width || 2);
      s.property("ADBE Vector Stroke Line Cap").setValue(2);
    }
    if (fill) items.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(fill);
  }

  function rect(comp, x, y, w, h, radius, fill, stroke) {
    var layer = shape(comp, "rect");
    var r = layer.items.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue([w, h]);
    r.property("ADBE Vector Rect Roundness").setValue(radius);
    paint(layer.items, fill, stroke, 1.5);
    return position(layer, x + w / 2, y + h / 2);
  }

  function circle(comp, x, y, d, fill, stroke, width) {
    var layer = shape(comp, "circle");
    layer.items.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([d, d]);
    paint(layer.items, fill, stroke, width);
    return position(layer, x, y);
  }

  function polyline(comp, x, y, points, color, width) {
    var layer = shape(comp, "line");
    var path = new Shape();
    path.vertices = points;
    path.closed = false;
    layer.items.addProperty("ADBE Vector Shape - Group").property("ADBE Vector Shape").setValue(path);
    paint(layer.items, null, color, width);
    return position(layer, x, y);
  }

  function drawOn(layer, t0, t1) {
    var trim = layer.items.addProperty("ADBE Vector Filter - Trim");
    animate(trim.property("ADBE Vector Trim End"), [[t0, 0], [t1, 100]]);
  }

  // A feathered mask on a comp-sized solid; blurring a shape layer clips to a visible square.
  function glow(comp, x, y, d, color, opacity) {
    var layer = comp.layers.addSolid(color, "glow", comp.width, comp.height, 1);
    var r = d / 2, k = r * 0.5523, outline = new Shape();
    outline.vertices = [[x, y - r], [x + r, y], [x, y + r], [x - r, y]];
    outline.inTangents = [[-k, 0], [0, -k], [k, 0], [0, k]];
    outline.outTangents = [[k, 0], [0, k], [-k, 0], [0, -k]];
    outline.closed = true;
    var mask = layer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    mask.property("ADBE Mask Shape").setValue(outline);
    mask.property("ADBE Mask Feather").setValue([d * 0.45, d * 0.45]);
    layer.blendingMode = BlendingMode.ADD;
    layer.property("ADBE Transform Group").property("ADBE Opacity").setValue(opacity);
    return layer;
  }

  function loopFade(comp) {
    var cover = comp.layers.addSolid(BLACK, "fade", comp.width, comp.height, 1);
    animate(cover.property("ADBE Transform Group").property("ADBE Opacity"), [
      [0, 100], [0.4, 0], [comp.duration - 0.5, 0], [comp.duration, 100]
    ]);
  }

  function scene(name, w, h, duration) {
    var comp = app.project.items.addComp(name, w, h, 1, duration, 30);
    comp.bgColor = BG;
    return comp;
  }

  function buildNetwork(name, labelled) {
    var comp = scene(name, 1920, 1080, 12), cx = 960, cy = 540, i;
    var agents = ["Design", "Engineering", "Data", "Access", "Functional tests", "Security", "Performance", "Code review"];
    var loop = "2 * Math.PI * time / " + comp.duration;

    for (i = 0; i < 36; i++) {
      var dust = circle(comp, 80 + ((i * 523) % 1760), 60 + ((i * 317) % 960), 2 + (i % 3) * 1.5, LIME);
      dust.property("ADBE Transform Group").property("ADBE Opacity").setValue(10 + (i % 4) * 8);
      dust.property("ADBE Transform Group").property("ADBE Position").expression =
        "value + [" + (14 + i % 18) + " * Math.sin(" + loop + " * " + (1 + i % 2) + " + " + i + "), " +
        (14 + i % 12) + " * Math.cos(" + loop + " + " + i + ")];";
    }

    glow(comp, cx, cy, 720, LIME, 22);
    var ringA = circle(comp, cx, cy, 320, null, LINE, 1.5);
    ringA.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "time * 30";
    var ringB = circle(comp, cx, cy, 220, null, LIME, 2);
    ringB.property("ADBE Transform Group").property("ADBE Opacity").setValue(40);
    ringB.property("ADBE Transform Group").property("ADBE Scale").expression =
      "var s = 100 + 5 * Math.sin(" + loop + " * 3); [s, s];";

    for (i = 0; i < agents.length; i++) {
      var angle = (i / agents.length) * 2 * Math.PI - Math.PI / 2;
      var dx = Math.cos(angle) * 660, dy = Math.sin(angle) * 370, nx = cx + dx, ny = cy + dy;
      var start = i * 1.5;
      polyline(comp, cx, cy, [[0, 0], [dx, dy]], LINE, 1.5);

      var halo = glow(comp, nx, ny, 220, LIME, 0);
      animate(halo.property("ADBE Transform Group").property("ADBE Opacity"), [
        [start + 0.6, 0], [start + 0.9, 45], [start + 1.9, 0]
      ]);
      circle(comp, nx, ny, 58, CARD, LIME, 2);
      circle(comp, nx, ny, 12, LIME);
      if (labelled) text(comp, agents[i], nx, ny + 62, 26, MUTED, REGULAR, true);

      var pulse = circle(comp, cx, cy, 14, LIME);
      animate(pulse.property("ADBE Transform Group").property("ADBE Position"), [
        [start, [cx, cy]], [start + 0.9, [nx, ny]], [start + 1.4, [cx, cy]]
      ]);
      animate(pulse.property("ADBE Transform Group").property("ADBE Opacity"), [
        [start, 0], [start + 0.1, 100], [start + 1.3, 100], [start + 1.4, 0]
      ]);
    }

    circle(comp, cx, cy, 170, CARD, LIME, 3);
    if (labelled) {
      text(comp, "Brain", cx, cy + 4, 42, WHITE, BOLD, true);
      text(comp, "orchestrator", cx, cy + 36, 17, LIME, MONO, true);
    }
  }

  function buildPlan() {
    var comp = scene("plan", 1280, 800, 8), i;
    var tasks = [
      ["Design", "Tracks and interface"],
      ["Engineering", "Physics and netcode"],
      ["Data", "Saves and leaderboards"],
      ["Access", "Accounts and lobbies"]
    ];
    var memory = ["spec", "contracts", "decisions", "tasks"];

    rect(comp, 140, 70, 1000, 110, 20, CARD, LINE);
    text(comp, "You", 176, 112, 22, LIME, MONO);
    typed(text(comp, "Build me a multiplayer racing game", 176, 150, 36, WHITE, REGULAR), 0.4, 2);

    drawOn(polyline(comp, 640, 180, [[0, 0], [0, 90]], LIME, 3), 2.1, 2.5);
    fadeUp(rect(comp, 520, 270, 240, 76, 38, LIME), 2.4);
    fadeUp(text(comp, "Brain plans", 640, 320, 30, BLACK, BOLD, true), 2.4);

    for (i = 0; i < tasks.length; i++) {
      var x = 70 + i * 290, t = 3 + i * 0.3;
      drawOn(polyline(comp, 640, 346, [[0, 0], [0, 40], [x + 130 - 640, 40], [x + 130 - 640, 84]], LINE, 2), t - 0.3, t);
      fadeUp(rect(comp, x, 430, 270, 150, 18, CARD, LINE), t);
      fadeUp(text(comp, tasks[i][0], x + 24, 480, 30, WHITE, BOLD), t);
      fadeUp(text(comp, tasks[i][1], x + 24, 524, 20, MUTED, REGULAR), t);
    }

    fadeUp(text(comp, "Shared, versioned memory", 640, 648, 24, MUTED, REGULAR, true), 4.9);
    for (i = 0; i < memory.length; i++) {
      var mx = 270 + i * 190;
      fadeUp(rect(comp, mx, 672, 170, 52, 26, null, LIME), 5.1 + i * 0.15);
      fadeUp(text(comp, memory[i], mx + 85, 706, 22, LIME, MONO, true), 5.1 + i * 0.15);
    }
    loopFade(comp);
  }

  function buildBuild() {
    var comp = scene("build", 1280, 800, 8), i;
    var rows = [
      ["Design", "done", 100, GREEN],
      ["Engineering", "working", 78, LIME],
      ["Data", "working", 64, LIME],
      ["Access", "working", 52, LIME],
      ["Tests", "waiting", 18, AMBER]
    ];

    text(comp, "Development team", 110, 96, 44, WHITE, BOLD);
    text(comp, "Each agent works in its own folder", 110, 140, 24, MUTED, REGULAR);

    for (i = 0; i < rows.length; i++) {
      var y = 190 + i * 92, t = 0.4 + i * 0.2;
      fadeUp(rect(comp, 110, y, 1060, 76, 16, CARD, LINE), t);
      fadeUp(text(comp, rows[i][0], 140, y + 47, 28, WHITE, BOLD), t);
      fadeUp(rect(comp, 400, y + 33, 520, 10, 5, LINE), t);
      var finished = rows[i][2] === 100, fillEnd = finished ? t + 1.8 : t + 4.5;
      fadeUp(alignRight(text(comp, rows[i][1], 1140, y + 46, 22, rows[i][3], MONO)), finished ? fillEnd : t);

      var bar = rect(comp, 400, y + 33, 520, 10, 5, rows[i][3]);
      bar.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([-260, 0]);
      bar.property("ADBE Transform Group").property("ADBE Position").setValue([400, y + 38]);
      animate(bar.property("ADBE Transform Group").property("ADBE Scale"), [
        [t + 0.3, [0, 100, 100]], [fillEnd, [rows[i][2], 100, 100]]
      ]);
    }

    fadeUp(text(comp, "Project budget", 110, 696, 24, MUTED, REGULAR), 1.5);
    fadeUp(alignRight(text(comp, "0", 1170, 696, 28, LIME, MONO)), 1.5)
      .property("ADBE Text Properties").property("ADBE Text Document").expression =
      "Math.round(linear(time, 1.5, 6.5, 0, 349)) + 'k / 1000k tokens';";
    fadeUp(rect(comp, 110, 720, 1060, 10, 5, LINE), 1.5);
    var budget = rect(comp, 110, 720, 1060, 10, 5, LIME);
    budget.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([-530, 0]);
    budget.property("ADBE Transform Group").property("ADBE Position").setValue([110, 725]);
    animate(budget.property("ADBE Transform Group").property("ADBE Scale"), [[1.5, [0, 100, 100]], [6.5, [35, 100, 100]]]);
    loopFade(comp);
  }

  function buildVerify() {
    var comp = scene("verify", 1280, 800, 8), i;
    var checks = ["Build", "Lint", "Functional tests", "Security review", "Performance", "Code review"];

    text(comp, "Done means verified", 110, 96, 44, WHITE, BOLD);
    text(comp, "Every result has to pass these checks", 110, 140, 24, MUTED, REGULAR);

    for (i = 0; i < checks.length; i++) {
      var y = 180 + i * 76, t = 0.5 + i * 0.6, passAt = i === 3 ? t + 1.1 : t + 0.4;
      fadeUp(rect(comp, 110, y, 1060, 64, 14, CARD, LINE), t);
      fadeUp(text(comp, checks[i], 180, y + 41, 26, WHITE, REGULAR), t);
      fadeUp(circle(comp, 146, y + 32, 30, null, LINE, 2), t);

      var ok = circle(comp, 146, y + 32, 30, GREEN);
      animate(ok.property("ADBE Transform Group").property("ADBE Opacity"), [[passAt, 0], [passAt + 0.15, 100]]);
      drawOn(polyline(comp, 146, y + 32, [[-7, 0], [-2, 6], [8, -6]], WHITE, 3), passAt + 0.05, passAt + 0.3);

      if (i === 3) {
        var repair = alignRight(text(comp, "repair loop 1 of 3", 1140, y + 40, 22, AMBER, MONO));
        animate(repair.property("ADBE Transform Group").property("ADBE Opacity"), [
          [t + 0.2, 0], [t + 0.4, 100], [passAt, 100], [passAt + 0.2, 0]
        ]);
      }
    }

    fadeUp(rect(comp, 110, 660, 1060, 84, 16, LIME), 4.7);
    fadeUp(text(comp, "All checks passed. Ready to share.", 640, 714, 34, BLACK, BOLD, true), 4.7);
    loopFade(comp);
  }

  function browserFrame(comp, url) {
    rect(comp, 120, 70, 1040, 660, 24, CARD, LINE);
    circle(comp, 160, 110, 14, [0.94, 0.27, 0.27]);
    circle(comp, 188, 110, 14, AMBER);
    circle(comp, 216, 110, 14, GREEN);
    rect(comp, 260, 90, 780, 40, 20, BG, LINE);
    text(comp, url, 284, 118, 20, MUTED, MONO);
  }

  function buildWebsiteScene() {
    var comp = scene("creator-website", 1280, 800, 6), i;
    browserFrame(comp, "yourbarbershop.com");
    fadeUp(text(comp, "Sharp cuts,", 170, 240, 64, WHITE, BOLD), 0.4);
    fadeUp(text(comp, "booked online", 170, 310, 64, LIME, BOLD), 0.7);
    fadeUp(rect(comp, 170, 345, 230, 62, 14, LIME), 1.1);
    fadeUp(text(comp, "Book a seat", 285, 386, 26, BLACK, BOLD, true), 1.1);
    fadeUp(rect(comp, 720, 180, 390, 228, 18, LINE), 1);
    fadeUp(circle(comp, 915, 294, 90, null, LIME, 4), 1.3);
    for (i = 0; i < 3; i++) {
      var x = 170 + i * 320;
      fadeUp(rect(comp, x, 450, 300, 230, 16, BG, LINE), 1.7 + i * 0.25);
      fadeUp(rect(comp, x + 24, 480, 110, 14, 7, LIME), 1.9 + i * 0.25);
      fadeUp(rect(comp, x + 24, 512, 240, 10, 5, LINE), 2 + i * 0.25);
      fadeUp(rect(comp, x + 24, 538, 190, 10, 5, LINE), 2.1 + i * 0.25);
    }
    loopFade(comp);
  }

  function buildAppScene() {
    var comp = scene("creator-app", 1280, 800, 6), i;
    var habits = ["Morning run", "Read 20 pages", "Drink water", "Sleep by 11"];
    glow(comp, 640, 400, 760, LIME, 18);
    rect(comp, 450, 30, 380, 740, 56, CARD, LIME);
    rect(comp, 570, 52, 140, 24, 12, BG);
    fadeUp(text(comp, "Today", 490, 140, 44, WHITE, BOLD), 0.3);
    fadeUp(text(comp, "3 of 4 habits", 490, 178, 22, MUTED), 0.5);
    for (i = 0; i < habits.length; i++) {
      var y = 210 + i * 88, t = 0.8 + i * 0.4;
      fadeUp(rect(comp, 480, y, 320, 74, 18, BG, LINE), t);
      fadeUp(text(comp, habits[i], 510, y + 45, 24, WHITE), t);
      fadeUp(circle(comp, 760, y + 37, 34, null, LINE, 3), t);
      if (i < 3) {
        var done = circle(comp, 760, y + 37, 34, LIME);
        animate(done.property("ADBE Transform Group").property("ADBE Opacity"), [[t + 0.4, 0], [t + 0.55, 100]]);
        drawOn(polyline(comp, 760, y + 37, [[-8, 0], [-2, 7], [9, -7]], BLACK, 4), t + 0.45, t + 0.7);
      }
    }
    for (i = 0; i < 7; i++) {
      var bar = rect(comp, 492 + i * 44, 570, 28, 150, 8, LIME);
      bar.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 75]);
      bar.property("ADBE Transform Group").property("ADBE Position").setValue([506 + i * 44, 720]);
      animate(bar.property("ADBE Transform Group").property("ADBE Scale"), [
        [2.4 + i * 0.1, [100, 0, 100]], [3.2 + i * 0.1, [100, 30 + ((i * 37) % 70), 100]]
      ]);
    }
    loopFade(comp);
  }

  function buildGameScene() {
    var comp = scene("creator-game", 1280, 800, 6), i;
    var pads = [[60, 620, 300], [440, 520, 240], [760, 420, 240], [1040, 310, 200]];
    fadeUp(alignRight(text(comp, "0", 1220, 80, 40, LIME, MONO)), 0.2)
      .property("ADBE Text Properties").property("ADBE Text Document").expression =
      "'SCORE ' + Math.round(linear(time, 0.8, 4.4, 0, 300));";
    fadeUp(text(comp, "LEVEL 1", 60, 80, 36, WHITE, BOLD), 0.2);
    for (i = 0; i < 24; i++) {
      var star = circle(comp, 40 + ((i * 271) % 1200), 120 + ((i * 113) % 300), 3 + (i % 3), WHITE);
      star.property("ADBE Transform Group").property("ADBE Opacity").setValue(20 + (i % 4) * 15);
    }
    for (i = 0; i < pads.length; i++) {
      rect(comp, pads[i][0], pads[i][1], pads[i][2], 34, 10, CARD, LIME);
    }
    var coins = [[560, 450, 1.75], [880, 350, 3], [1140, 240, 4.3]];
    for (i = 0; i < coins.length; i++) {
      var coin = circle(comp, coins[i][0], coins[i][1], 40, LIME);
      animate(coin.property("ADBE Transform Group").property("ADBE Opacity"), [
        [coins[i][2] - 0.05, 100], [coins[i][2] + 0.1, 0]
      ]);
      animate(coin.property("ADBE Transform Group").property("ADBE Scale"), [
        [coins[i][2] - 0.05, [100, 100, 100]], [coins[i][2] + 0.1, [190, 190, 100]]
      ]);
    }
    var hero = rect(comp, 170, 550, 70, 70, 16, WHITE);
    animate(hero.property("ADBE Transform Group").property("ADBE Position"), [
      [0.5, [205, 585]], [1.1, [360, 585]], [1.5, [450, 390]], [1.9, [560, 485]],
      [2.4, [650, 485]], [2.8, [760, 300]], [3.2, [880, 385]],
      [3.7, [960, 385]], [4.1, [1040, 190]], [4.5, [1140, 275]]
    ]);
    loopFade(comp);
  }

  function buildStartupScene() {
    var comp = scene("creator-startup", 1280, 800, 6), i;
    var cards = [["Waitlist", "linear(time, 0.8, 4.8, 0, 1248)", ""], ["Signups", "linear(time, 1, 4.8, 0, 386)", ""], ["Revenue", "linear(time, 1.2, 4.8, 0, 4200)", "$"]];
    fadeUp(text(comp, "Your first customers", 90, 100, 52, WHITE, BOLD), 0.2);
    for (i = 0; i < cards.length; i++) {
      var x = 90 + i * 375;
      fadeUp(rect(comp, x, 140, 350, 150, 18, CARD, LINE), 0.5 + i * 0.2);
      fadeUp(text(comp, cards[i][0], x + 28, 188, 24, MUTED), 0.5 + i * 0.2);
      fadeUp(text(comp, "0", x + 28, 258, 54, LIME, BOLD), 0.6 + i * 0.2)
        .property("ADBE Text Properties").property("ADBE Text Document").expression =
        "'" + cards[i][2] + "' + Math.round(" + cards[i][1] + ");";
    }
    fadeUp(rect(comp, 90, 320, 1100, 410, 18, CARD, LINE), 1);
    for (i = 1; i < 4; i++) polyline(comp, 130, 330 + i * 95, [[0, 0], [1020, 0]], LINE, 1);
    var growth = polyline(comp, 130, 690, [[0, 0], [170, -30], [340, -50], [510, -120], [680, -160], [850, -270], [1020, -320]], LIME, 7);
    drawOn(growth, 1.2, 4.8);
    glow(comp, 1150, 370, 240, LIME, 25);
    fadeUp(circle(comp, 1150, 370, 26, LIME), 4.6);
    loopFade(comp);
  }

  function buildAgentScene() {
    var comp = scene("creator-agent", 1280, 800, 6), i;
    var tools = ["Read 3 new emails", "Checked help docs", "Drafted replies"];
    glow(comp, 640, 400, 900, LIME, 10);
    fadeUp(rect(comp, 560, 60, 620, 96, 24, LINE), 0.3);
    fadeUp(text(comp, "Answer my customer emails", 596, 118, 32, WHITE), 0.3);
    fadeUp(circle(comp, 120, 240, 76, null, LIME, 3), 0.9);
    fadeUp(circle(comp, 120, 240, 26, LIME), 0.9);
    for (i = 0; i < tools.length; i++) {
      var y = 190 + i * 84, t = 1.1 + i * 0.55;
      fadeUp(rect(comp, 190, y, 560, 66, 16, CARD, LINE), t);
      fadeUp(text(comp, tools[i], 262, y + 42, 26, MUTED), t);
      var tick = circle(comp, 228, y + 33, 30, GREEN);
      animate(tick.property("ADBE Transform Group").property("ADBE Opacity"), [[t + 0.3, 0], [t + 0.45, 100]]);
      drawOn(polyline(comp, 228, y + 33, [[-7, 0], [-2, 6], [8, -6]], WHITE, 3), t + 0.35, t + 0.55);
    }
    fadeUp(rect(comp, 190, 460, 900, 250, 24, CARD, LIME), 3);
    typed(fadeUp(text(comp, "All 3 emails are ready for you to send.", 232, 540, 36, WHITE), 3.2), 3.4, 4.8);
    fadeUp(rect(comp, 232, 590, 240, 68, 16, LIME), 4.6);
    fadeUp(text(comp, "Review", 352, 636, 30, BLACK, BOLD, true), 4.6);
    loopFade(comp);
  }

  function buildAutomationScene() {
    var comp = scene("creator-automation", 1280, 800, 6), i;
    var nodes = [["New order", 100, 330], ["Spreadsheet", 520, 130], ["Invoice", 520, 530], ["Summary", 940, 330]];
    var links = [[320, 390, 520, 190], [320, 390, 520, 590], [740, 190, 940, 390], [740, 590, 940, 390]];
    for (i = 0; i < links.length; i++) {
      var dx = links[i][2] - links[i][0], dy = links[i][3] - links[i][1], start = 0.8 + i * 0.5;
      drawOn(polyline(comp, links[i][0], links[i][1], [[0, 0], [dx / 2, 0], [dx / 2, dy], [dx, dy]], LIME, 4), start, start + 0.5);
      var dot = circle(comp, links[i][0], links[i][1], 20, WHITE);
      animate(dot.property("ADBE Transform Group").property("ADBE Position"), [
        [start + 2, [links[i][0], links[i][1]]],
        [start + 2.6, [links[i][2], links[i][3]]]
      ]);
      animate(dot.property("ADBE Transform Group").property("ADBE Opacity"), [
        [start + 1.9, 0], [start + 2, 100], [start + 2.6, 100], [start + 2.7, 0]
      ]);
    }
    for (i = 0; i < nodes.length; i++) {
      var t = 0.3 + i * 0.3;
      fadeUp(rect(comp, nodes[i][1], nodes[i][2], 220, 120, 20, i === 0 ? LIME : CARD, i === 0 ? null : LINE), t);
      fadeUp(text(comp, nodes[i][0], nodes[i][1] + 110, nodes[i][2] + 70, 26, i === 0 ? BLACK : WHITE, BOLD, true), t);
    }
    loopFade(comp);
  }

  function buildExtensionScene() {
    var comp = scene("creator-extension", 1280, 800, 6), i;
    browserFrame(comp, "news.example/long-article");
    fadeUp(circle(comp, 1110, 110, 44, LIME), 0.4);
    fadeUp(text(comp, "+", 1110, 122, 36, BLACK, BOLD, true), 0.4);
    for (i = 0; i < 8; i++) {
      rect(comp, 170, 190 + i * 62, i % 3 === 2 ? 340 : 480, 14, 7, LINE);
    }
    fadeUp(rect(comp, 690, 170, 430, 500, 22, BG, LIME), 1.2);
    fadeUp(text(comp, "Summary", 726, 232, 36, LIME, BOLD), 1.5);
    var points = ["Prices rise this spring", "Two new stores open", "Sales are up 12%"];
    for (i = 0; i < points.length; i++) {
      var t = 1.9 + i * 0.6;
      fadeUp(circle(comp, 738, 300 + i * 84, 14, LIME), t);
      typed(fadeUp(text(comp, points[i], 762, 310 + i * 84, 26, WHITE), t), t + 0.1, t + 0.7);
    }
    fadeUp(text(comp, "Read in 10 seconds", 726, 630, 22, MUTED, MONO), 4);
    loopFade(comp);
  }

  function buildAnythingScene() {
    var comp = scene("creator-anything", 1280, 800, 6), col, row;
    glow(comp, 640, 400, 800, LIME, 24);
    for (col = 0; col < 8; col++) {
      for (row = 0; row < 5; row++) {
        var t = 0.2 + ((col * 3 + row * 5) % 11) * 0.12, lit = (col * 7 + row * 3) % 5 === 0;
        fadeUp(rect(comp, 70 + col * 145, 60 + row * 140, 130, 124, 20, lit ? LIME : CARD, lit ? null : LINE), t);
      }
    }
    var veil = comp.layers.addSolid(BG, "veil", comp.width, comp.height, 1);
    animate(veil.property("ADBE Transform Group").property("ADBE Opacity"), [[2.4, 0], [3, 82]]);
    fadeUp(text(comp, "If you can describe it,", 640, 370, 66, WHITE, BOLD, true), 2.8);
    fadeUp(text(comp, "your team can build it.", 640, 455, 66, LIME, BOLD, true), 3.1);
    loopFade(comp);
  }

  app.beginSuppressDialogs();
  app.newProject();
  buildNetwork("network", true);
  buildNetwork("ambient", false);
  buildPlan();
  buildBuild();
  buildVerify();
  buildWebsiteScene();
  buildAppScene();
  buildGameScene();
  buildStartupScene();
  buildAgentScene();
  buildAutomationScene();
  buildExtensionScene();
  buildAnythingScene();
  app.project.save(new File(File($.fileName).parent.fsName + "/scenes.aep"));
  app.endSuppressDialogs(false);
})();
