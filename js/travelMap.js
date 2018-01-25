var width = 970;
var height = width*0.45;

var svg = d3.select(".map").append("svg")
              .attr("width", width)
              .attr("height", height);
              


var projection = d3.geoEquirectangular()
    .scale(180);

var path = d3.geoPath()
	.projection(projection);


d3.json("./resources/worldNoATA.json", function(error, world) {
  if (error) return console.error("error: ", error);
  console.log("world: ", world);
  console.log(topojson.feature(world, world.objects.countries).features);

  svg.call(d3.zoom().on("zoom", function () {
          svg.attr("transform", d3.event.transform)
        }))
      .append("g")
      .attr("class", "countries")
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("path")
    .attr("class", "country")
      .attr("id", function(d) { return d.properties.NAME; })
      .attr("d", path);

  svg.append("g")
      .attr("class", "cities")
    .selectAll("circle")
    .data(topojson.feature(world, world.objects.cities).features)
    .enter().append("circle")
      .attr("class", function(d) { return "city " + d.properties.NAME; })
      .attr("cx", function(d) {
                         return projection(d.geometry.coordinates)[0];
                 })
                 .attr("cy", function(d) {
                         return projection(d.geometry.coordinates)[1];
                 })
      .attr("r", 1);
   
});

// var visitedCountries = d3.json("./resources/travels.json", function(error, me){
//   if(error) return console.error("error: ", error)

//   console.log("me: ", me);
//   console.log("me countries: ", topojson.feature(world, me.objects.countries).trip);
// });


