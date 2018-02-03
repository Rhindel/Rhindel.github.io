var width = 970;
var height = width*0.45;

var projection = d3.geoEquirectangular()
    .scale(180);

var path = d3.geoPath()
  .projection(projection);

var zoom = d3.zoom()
                .scaleExtent([1, 10])
                .on("zoom", zoomed);

//Main objects *****************************************************************
var svg = d3.select(".map").append("svg")
              .attr("width", width)
              .attr("height", height)
              .call(zoom);//free zoom

svg.append("rect")
    .attr("class", "zoom-container")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none");

var gCountries = svg.append("g")
      .attr("class", "countries");
var gCities = svg.append("g")
    .attr("class", "cities");

var tooltip = d3.select(".map")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


//Retrieve and organize travels informations ***********************************          
var visitedCountries = [];
var visitedPlaces = [];
var trips = [];

$.getJSON("./resources/travels.json", function(data) {  
  $.each(data.trips, function(i, trip){
  trips.push(trip);
    $.each(trip.stops, function(j, stop){
      //Slow, need to change
      visitedPlaces.push({"name": trip.name,"date": trip.date, "country": stop.country, "city": stop.city, "coordinates": stop.coordinates});      
      if(!visitedCountries.includes(stop.country)) {
        visitedCountries.push(stop.country);
      };
    });
  });  
}).done(function() {
    console.log( "second success");
  })
  .fail( function(d, textStatus, error) {
        console.error("JSON failed, status: " + textStatus + ", error: "+ error)
    })
  .always(function() {
    console.log( "complete" );
  });

console.log("countries: ", trips);
console.log("New JSON: ", visitedCountries);



// Draw map ********************************************************************

d3.json("./resources/worldNoATA.json", function(error, world) {
  if (error) return console.error("error: ", error);

  var countries = topojson.feature(world, world.objects.countries).features;

//Draw and color countries
  gCountries.selectAll("path")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
      .attr("id", function(d) { return d.properties.NAME; })
      .attr("d", path)
      .attr("fill", colorCountries)
      .on("mouseover", showTooltip)
      .on("mousemove", followTooltip)
      .on("mouseout", hideTooltip);



//Draw and color cities
  gCities.selectAll("circle")
  .data(visitedPlaces)
  .enter().append("circle")
    .attr("class", function(d) { return "city " + d.city; })
    .attr("r", 3)
    .attr("transform", function(d) {
      return "translate(" + projection(d.coordinates) + ")";
    });
  
   
});

//Visual behavior functions ***************************************************

function colorCountries(d){
  if (visitedCountries.includes(d.properties.NAME)){
    return "#428bca";
  } else {
    return "#ccc";
  };
};

function showTooltip(d){
  if (visitedCountries.includes(d.properties.NAME)){
  tooltip.transition()
    .duration(200)
    .style("opacity", .9);
  } else {
    hideTooltip();
  };
}

function followTooltip(d){
  var i = 0;
  do {
    if (d.properties.NAME == visitedPlaces[i].country) {
      tooltip .html("Trip: " + visitedPlaces[i].name + 
                    "<br/>Date: " + visitedPlaces[i].date +
                    "<br/>Country: " + d.properties.NAME)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 25) + "px");

    };
    i++;
  } while (i < visitedPlaces.length || d.properties.NAME == visitedPlaces[i].country);    
      
};

function hideTooltip(){
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
};


//Zoom functions****************************************************************

function zoomed() {
  //For countries
  //scale factor
  gCountries.style("stroke-width", 1 / d3.event.transform.k + "px");
  gCountries.attr("transform", d3.event.transform);

  //For cities
  gCities.selectAll("circle").attr("r", 3/ d3.event.transform.k); 
  gCities.attr("transform", d3.event.transform);
};

function resetZoom() {
  console.log("click!");

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity );

};