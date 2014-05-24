$(function() {
  // Handler for .ready() called.

        var line;

        var vis = d3.select("#tableau_principal").append("svg")
            .attr("width","100%")
            .attr("height","100%")
            .on("mousedown", mousedown)
            .on("mouseup", mouseup);

        // D functions generation
        function mousedown() {
            var m = d3.mouse(this);
            line = vis.append("line")
                .attr("x1", m[0])
                .attr("y1", m[1])
                .attr("x2", m[0])
                .attr("y2", m[1]);
            
            vis.on("mousemove", mousemove);
        }

        function mousemove() {
            var m = d3.mouse(this);
            line.attr("x2", m[0])
                .attr("y2", m[1]);
        }

        function mouseup() {
            vis.on("mousemove", null);
        }
        // F functions generation

  console.log ("apppppppp");
}); // // FIN DOC READY //

// functions generales used partt //

