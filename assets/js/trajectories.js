function Trajectories() {
  var container;
  var paths;

  var x = d3.scaleLinear()
    .domain([0, 91])
    .range([5, 915]);

  var y = d3.scaleLinear()
    .domain([0, 60])
    .range([605, 5]);

  var path = d3.line()
    .x(function(d) {
      return x(d.x)
    })
    .y(function(d) {
      return y(d.y)
    });

  // var brush = d3.svg.brush()
  //   .x(x)
  //   .y(y)
  //   .extent([
  //     [0, 0],
  //     [0, 0]
  //   ])
  //   .on("brush", brushed)
  //   .on("brushend", brushended);

  // var quadtree = d3.geom.quadtree()
  //   .extent([
  //     [-1, -1],
  //     [91 + 1, 60 + 1]
  //   ]);

  var timeExtent = [0, 837];

  function me(selection) {
    // draw all trajectories
    container = selection;
    paths = container.selectAll("path")
      .data(container.datum(), function(d) {
        return d.person
      });

    paths = paths
      .enter()
      .append("path")
      .merge(paths)
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("opacity", 0.4);

    paths.attr("d", function(d) {
      return path(d.values.slice(timeExtent[0], timeExtent[1])) + "m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 ";
    });

    // container.append("g")
    //   .attr("class", "brush")
    //   .call(brush)
    //   .call(brush.event);
  }

  me.timeExtent = function(_) {
    if (!arguments.length) return timeExtent;
    timeExtent = _;

    // var paths = container.selectAll("path")
    // 	.data(container.datum(), function(d){return d.person});
    paths.attr("d", function(d) {
      return path(d.values.slice(timeExtent[0], timeExtent[1])) + "m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 ";
    });
  }

  function brushed() {
    // console.log(brush.extent());


  }

  function brushended() {
    if (brush.empty())
      console.log("empty selection");

    var extent = brush.extent();

    var list = [];
    container.datum().forEach(function(p) { // for each person
      var lastPoint = p.values[timeExtent[1] - 1];

      if (isWithin(lastPoint, extent))
        list.push({
          id: p.person
        });
    })
    buildingApp.personList.selectMultiplePersons(list);
  }

  function isWithin(p, e) {
    return (p.x >= e[0][0]) && (p.x <= e[1][0]) &&
      (p.y >= e[0][1]) && (p.y <= e[1][1]);
  }



  return me;
}
