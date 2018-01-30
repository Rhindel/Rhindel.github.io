var width = 970;
var height = width*0.45;

var svg = d3.select(".map").append("svg")
              .attr("width", width)
              .attr("height", height)
              .call(d3.zoom().on("zoom", function () {
                  svg.attr("transform", d3.event.transform)
                }));


//Retrieve and organize travels informations             
var visitedCountries = [];
var visitedPlaces = [];
$.getJSON("./resources/travels.json", function(data) {  
  $.each(data.trips, function(i, trip){
    $.each(trip.stops, function(j, val){
      visitedPlaces.push(val);
      if(!visitedCountries.includes(val.country)) {
        visitedCountries.push(val.country);
      };
    });
  });  
}).done(function() {
    console.log( "second success");
  })
  .fail( function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    })
  .always(function() {
    console.log( "complete" );
  });

console.log("countries: ", visitedCountries);


var projection = d3.geoEquirectangular()
    .scale(180);

var path = d3.geoPath()
	.projection(projection);


d3.json("./resources/worldNoATA.json", function(error, world) {
  if (error) return console.error("error: ", error);
  console.log("world: ", world);
  //console.log(topojson.feature(world, world.objects.countries).features);
  var countries = topojson.feature(world, world.objects.countries).features;
  console.log("topo country", countries)

//Draw andd color countries
  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
      .attr("id", function(d) { return d.properties.NAME; })
      .attr("d", path)
      .attr("fill", function(d) {
        if (visitedCountries.includes(d.properties.NAME)){
          return "green";
        } else {
          return "#ccc";
        };

      });

//Draw and color cities
console.log(topojson.feature(world, world.objects.cities).features)
  svg.append("g")
      .attr("class", "cities")
    .selectAll("circle")
    .data(visitedPlaces)
    .enter().append("circle")
      .attr("class", function(d) { return "city " + d.city; })
      .attr("cx", function(d) {
                         return projection(d.coordinates)[0];
                 })
                 .attr("cy", function(d) {
                         return projection(d.coordinates)[1];
                 })
      .attr("r", 1);
   
});


// var visitedCountries = d3.json("./resources/travels.json", function(error, me){
//   if(error) return console.error("error: ", error)

//   console.log("me: ", me);
//   console.log("me countries: ", topojson.feature(world, me.objects.countries).trip);
// });


