// Builds the Codeforge landing page scenes. Run in After Effects, then video/render.sh.
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

  function buildNetwork() {
    var comp = scene("network", 1920, 1080, 12), cx = 960, cy = 540, i;
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
      text(comp, agents[i], nx, ny + 62, 26, MUTED, REGULAR, true);

      var pulse = circle(comp, cx, cy, 14, LIME);
      animate(pulse.property("ADBE Transform Group").property("ADBE Position"), [
        [start, [cx, cy]], [start + 0.9, [nx, ny]], [start + 1.4, [cx, cy]]
      ]);
      animate(pulse.property("ADBE Transform Group").property("ADBE Opacity"), [
        [start, 0], [start + 0.1, 100], [start + 1.3, 100], [start + 1.4, 0]
      ]);
    }

    circle(comp, cx, cy, 170, CARD, LIME, 3);
    text(comp, "Brain", cx, cy + 4, 42, WHITE, BOLD, true);
    text(comp, "orchestrator", cx, cy + 36, 17, LIME, MONO, true);
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

  app.beginSuppressDialogs();
  app.newProject();
  buildNetwork();
  buildPlan();
  buildBuild();
  buildVerify();
  app.project.save(new File(File($.fileName).parent.fsName + "/scenes.aep"));
  app.endSuppressDialogs(false);
})();
