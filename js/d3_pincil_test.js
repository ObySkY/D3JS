$(function() {
  // Handler for .ready() called.

var data = [],

      width = 300,
      height = 300,

      // An array to hold the coordinates
      // of the line drawn on each svg.
      coords = [],

      line = d3.svg.line(),

      // Set the behavior for each part
      // of the drag.
      drag = d3.behavior.drag()
                  .on("dragstart", function() {
                    // Empty the coords array.
                    coords = [];
                    svg = d3.select(this);

                    // If a selection line already exists,
                    // remove it.
                    //svg.select(".selection").remove();

                    // Add a new selection line.
                    svg.append("path").attr({"class": "selection"});
                  })
                  .on("drag", function() {
                    // Store the mouse's current position
                    coords.push(d3.mouse(this));

                    svg = d3.select(this);

                    // Change the path of the selection line
                    // to represent the area where the mouse
                    // has been dragged.
                    svg.select(".selection").attr({
                      d: line(coords)
                    });

                    // Figure out which dots are inside the
                    // drawn path and highlight them.
                    selected = [];
                    svg.selectAll("circle.dot").each(function(d, i) {
                      point = [d3.select(this).attr("cx"), d3.select(this).attr("cy")];
                      if (pointInPolygon(point, coords)) {
                        selected.push(d.id);
                      }
                    });
                    highlight(selected);
                  })
                  .on("dragend", function() {
                    svg = d3.select(this);
                    // If the user clicks without having
                    // drawn a path, remove any paths
                    // that were drawn previously.
                    if (coords.length === 0) {
                     // d3.selectAll("svg path").remove();
                      unhighlight();
                      return;
                    }

                    // Draw a path between the first point
                    // and the last point, to close the path.
                    svg.append("path").attr({
                      "class": "terminator",
                      d: line([coords[0], coords[coords.length-1]])
                    });
                  });


  for (i=0; i<50; i++) {
    data.push({
      id: i,
      a: {
        x: randomPoint(),
        y: randomPoint()
      },
      b: {
        x: randomPoint(), 
        y: randomPoint()
      },
      c: {
        x: randomPoint(),
        y: randomPoint()
      }
    });
  }

  function randomPoint() {
    return Math.floor(Math.random()*(width-30)) + 20;
  }

  // from https://github.com/substack/point-in-polygon
  function pointInPolygon (point, vs) {
    var xi, xj, i, intersect,
        x = point[0],
        y = point[1],
        inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      xi = vs[i][0],
      yi = vs[i][1],
      xj = vs[j][0],
      yj = vs[j][1],
      intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function unhighlight() {
    d3.selectAll("circle.dot").classed("highlighted", false);
  }

  function highlight(ids) {
    // First unhighlight all the circles.
    unhighlight();

    // Find the circles that have an id
    // in the array of ids given, and 
    // highlight those.
    d3.selectAll("circle.dot").filter(function(d, i) {
      return ids.indexOf(d.id) > -1;
    })
    .classed("highlighted", true);
  }

  function Scatter(data, selector, group) {
    var svg = d3.select(selector).append("svg")
                .attr({
                  width: width,
                  height: height
                }).call(drag),

        g = svg.append("g").attr({"class": "g-dot"}),

        // Create a circle element for each
        // item in the data passed.
        dot = g.selectAll("circle.dot")
                  .data(data)
                .enter().append("circle")
                  .attr({
                    "class": "dot",
                    r: 8,
                    cx: function(d, i) {
                      return d[group].x;
                    },
                    cy: function(d, i) {
                      return d[group].y;
                    },
                  })
                  .on("mouseover", function(d, i) {
                    // Highlight circles on mouseover, but
                    // only if a path hasn't been drawn.
                    if (d3.selectAll("svg path").empty()) {
                      highlight([d.id]);
                    }
                  })
                  .on("mouseout", function(d, i) {
                    // If a path hasn't been drawn,
                    // unhighlight the highlighted circles.
                    if (d3.selectAll("svg path").empty()) {
                      unhighlight();
                    }
                  });

        text = g.selectAll("text")
                  .data(data)
                .enter().append("text")
                  .attr({
                    x: function(d, i) {
                      return d[group].x;
                    },
                    y: function(d, i) {
                      return d[group].y + 4;
                    }
                  })
                  .text(function(d, i) {
                    return d.id;
                  });
  }

  // Add the dots to each canvas div.
  Scatter(data, "#tableau_principal", "a");
  Scatter(data, "#canvas2", "b");
  Scatter(data, "#canvas3", "c");
}); // // FIN DOC READY //

// functions generales used partt //

