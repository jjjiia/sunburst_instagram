
var width = 820,
    height = 820,
    radius = 400;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

var color = d3.scale.category20c();
var topDictionary = {
    "instagram":"#bbb",
    "day":"#aaa",
    "night":"#ccc"
}
var daySecond ={
  "light":"#efb257",
  "people":"#f6d4a2",
  "urban":"#966527",
  "social":"#e08f15"
}
var dayThird = {
    "city":"#966527",
  "urban":"#955f0e",
  "cityscape":"#996B29",
  "metropolis":"#9B702F",  
"metropolitan_area":"#9B702F",
  "location":"#9E753B",
  "landmark":"#A28352",
  "residential_area":"#A4885C",
  "urban_area":"#A78D69",
  "architecture":"#AA9980",
  "graffiti":"#B1ACA1",
  "social_group":"#D0942B",
  "party":"#C29836",
  "human_activity":"#B59D46",
  "human_action":"#A5A256",
  "party":"#C29836",
  "crowd":"#86AA79",
  "conversation":"#98A768",
  "community":"#77AF8A",
  "team":"#59BAAB",
  "light":"#efb257",
  "lighting":"#e4b656",
  "night":"#daba56",
  "darkness":"#cfbf56",
  "daylighting":"#c5c356",
  "light_fixture":"#c5c356",
  "people":"#F8CC9A",
  "person":"#F7C392",
  "man":"#F7BB87",
  "woman":"#F8B27F",
  "selfie":"#F9AA79",
  "girl":"#F9A372",
  "pedestrian":"#F79A6A"
}
var nightSecond = {
  "urban":"#4675A6",
  "social":"0575B7",
  "light":"1B6192",
  "people":"2C4D62"
}
var nightThird = {
  "city":"4A75A6",
  "cityscape":"#4E72A6",
  "metropolis":"#5471A1",
  "metropolitan_area":"#5471A1",
  "location":"#5B7098",
  "landmark":"#656C8C",
  "residential_area":"#696A88",
  "urban_area":"#6B6A81",
  "architecture":"#716976",
  "graffiti":"#715E62",
  "social_group":"#2C71B2",
  "party":"#5269A6",
  "human_activity":"#646499",
  "human_action":"#775D8D",
  "party":"#5269a6",
  "crowd":"#95527A",
  "conversation":"#865783",
  "community":"#9E4B6E",
  "team":"#AB3458",
  "light":"#365B8E",
  "lighting":"#4A578F",
  "night":"#59518C",
  "darkness":"#664A89",
  "daylighting":"#724086",
  "light_fixture":"#7B3683",
  "people":"#265266",
  "person":"#1E566B",
  "man":"#195C74",
  "woman":"#156179",
  "selfie":"#13667D",
  "girl":"#116A82",
  "pedestrian":"#0F6F89"
}
var projection = d3.geo.mercator().scale(40000).center([ -87.630564,42.2])

$(function() {
	queue()
		.defer(d3.json, "temp_real.json")
        .defer(d3.json, "instagrams.json")
        .defer(d3.json, "counties.geojson")
        .await(dataDidLoad);
})
function dataDidLoad(error,tree,images,counties){
    
    
    drawSunburst(tree,images)

    var w = window
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    var map = d3.select("#map").append("svg").attr("width", x).attr("height", y).attr("class","mapSvg")

    drawBuildings(counties,map)

}
function drawBuildings(geoData,svg){
    //need to generalize projection into global var later
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    
    //push data, add path
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class","street")
		.attr("d",path)
		.style("stroke","#aaa")
        .attr("fill","none")
}
function drawSunburst(root,images){
var svg = d3.select("#sunburst").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var sizeScale = d3.scale.linear().domain([10,4000]).range([10,100])
var partition = d3.layout.partition()
    .value(function(d) { //console.log(d.name);
         return sizeScale(d.size); });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var g = svg.selectAll("g")
          .data(partition.nodes(root))
        .enter().append("g");

      var path = g.append("path")
        .attr("d", arc)
        .attr("class","arc")
        .style("fill", function(d) { 
            if(d.name == "day" || d.name=="night"|| d.name =="instagram"){
                return(topDictionary[d.name])
            }else if(d.parent.name=="night"){
                return nightSecond[d.name]
            }else if(d.parent.name =="day"){
                return daySecond[d.name]
            }else if(d.parent.parent.name =="day"){
                return dayThird[d.name.replace(" ","_")]
            }else{
                return nightThird[d.name.replace(" ","_")]
            }
        
            return color((d.children ? d : d.parent).name); 
        })
        .on("click", click);
      var text = g.append("text")
        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .text(function(d) { return d.name; });

    
      function click(d) {          
        // fade out all text elements
          var imagesKeyArray = []
          var imagesArray = []
           d3.selectAll(".dots").remove()
           d3.selectAll(".red").remove()
           d3.selectAll(".blue").remove()
          
          if(d.name == "instagram"){
              console.log(d.name)
              d3.select("#current").html("all") 
              
          }
          else if(d.name == "day"){
              for(var c in d.children){
                  imagesKeyArray.push(d.children[c].name)
                  for(var e in d.children[c].children){
                      imagesKeyArray.push(d.children[c].children[e].name)
                  }
              }
              for(var k in imagesKeyArray){
                  imagesArray = imagesArray.concat(images["Day"][imagesKeyArray[k]])                  
              }
              d3.select("#current").html(imagesArray.length+" images for "+d.name) 
          }
          else if(d.name == "night"){
              for(var c in d.children){
                  imagesKeyArray.push(d.children[c].name)
                  for(var e in d.children[c].children){
                      imagesKeyArray.push(d.children[c].children[e].name)
                  }
              }
              for(var k in imagesKeyArray){
                  imagesArray = imagesArray.concat(images["Night"][imagesKeyArray[k]])                  
              }
              d3.select("#current").html(imagesArray.length+" images for "+d.name) 
              
          }
          else if(d.parent.name == "day"){
              for(var c in d.children){
                  imagesKeyArray.push(d.children[c].name)
              }
              for(var k in imagesKeyArray){
                  imagesArray = imagesArray.concat(images["Day"][imagesKeyArray[k]])                  
              }
              d3.select("#current").html(imagesArray.length+" images for "+d.parent.name+":"+d.name) 
              
          }else if(d.parent.name == "night"){
              for(var c in d.children){
                  imagesKeyArray.push(d.children[c].name)
                  
              }
              for(var k in imagesKeyArray){
                  imagesArray = imagesArray.concat(images["Night"][imagesKeyArray[k]])    
                           
              }
              d3.select("#current").html(imagesArray.length+" images for "+d.parent.name+":"+d.name) 
              
          }
          else if(d.parent.parent.name=="day"){
              imagesArrayD = images["Day"][d.name.replace(" ","_")]  
              imagesArrayN = images["Night"][d.name.replace(" ","_")]  
              
              drawDots(imagesArrayD.slice([1,imagesArrayD.length]), d.name.replace(" ","_"), "red")
              drawDots(imagesArrayN.slice([1,imagesArrayN.length]), d.name.replace(" ","_"), "blue")
              
              d3.select("#current").html(imagesArrayD.length+imagesArrayN.length+" images for "+d.name)
          }
          else if(d.parent.parent.name=="night")
          {
              imagesArrayD = images["Day"][d.name.replace(" ","_")]  
              imagesArrayN = images["Night"][d.name.replace(" ","_")]  
              
              drawDots(imagesArrayD.slice([1,imagesArrayD.length]), d.name.replace(" ","_"), "red")
              drawDots(imagesArrayN.slice([1,imagesArrayN.length]), d.name.replace(" ","_"), "blue")
              
              d3.select("#current").html(imagesArrayD.length+imagesArrayN.length+" images for "+d.name)
          }
          //console.log(imagesArray.length)
          //console.log(imagesArray.slice([1,imagesArray.length]))
          drawDots(imagesArray.slice([1,imagesArray.length]), d.name.replace(" ","_"), "red")
          d3.selectAll(".arc").attr("opacity",.4)
          d3.select(this).attr("opacity",1)
       // text.transition().attr("opacity", 0);
       // path.transition()
       //   .duration(700)
       //   .attrTween("d", arcTween(d))
       //   .each("end", function(e, i) {
       //       // check if the animated element's data e lies within the visible angle span given in d
       //       if (e.x >= d.x && e.x < (d.x + d.dx)) {
       //         // get a selection of the associated text element
       //         var arcText = d3.select(this.parentNode).select("text");
       //         // fade in the text element and recalculate positions
       //         arcText.transition().duration(100)
       //           .attr("opacity", 1)
       //           .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
       //           .attr("x", function(d) { return y(d.y); });
       //       }
       //   
       //   });
      }
}




d3.select(self.frameElement).style("height", height + "px");

function drawDots(data,category,color){
    //console.log(data)
   
    d3.select("#map svg").selectAll(".dots")
        .data(data)
        .enter()
        .append("circle")//.transition().delay(function(d,i){return i/2})
        .attr("class",color)
        .attr("r",4)
        .attr("cx",function(d){
            if(d!= undefined){
                var lat = parseFloat(d[1])
                var lng = parseFloat(d[2])
                //to get projected dot position, use this basic formula
                var projectedLng = projection([lng,lat])[0]
                return projectedLng                
            }

        })
        .attr("cy",function(d){
            if(d!=undefined){
            var lat = parseFloat(d[1])
            var lng = parseFloat(d[2])
            var projectedLat = projection([lng,lat])[1]
            return projectedLat                
            }

        })
        .attr("fill",function(d){
            return color
            return colorDictionary[category.replace(" ","_")]
        })
        .attr("opacity",1)        
}

function drawMap(category,imagesArray){
   
    var map= d3.select("#map svg")
    map.selectAll("image").remove()
    map.selectAll("image")
    .data(imagesArray)
    .enter()
    .append("svg:image")
    .transition()
    .delay(function(d,i){return i})
    .attr("xlink:href", function(d,i){
        //console.log (d[0])
        return (d[0])
        d3.uri(d[0], function(data){ 
            $("#grid").attr("src", "data:image/png;base64," + data);  // inject data:image in DOM
        } )
       // return "http://www.dataminding.org/jiazhang/files/gimgs/13_dsc0027.jpg"
        //return "images/"+i%7+".jpeg"
    })
    .attr("width",imageSize)
    .attr("height",imageSize)
    .attr("x",function(d,i){return i%perRow*(imageSize+3)})
    .attr("y",function(d,i){return Math.floor(i/perRow)*(imageSize+3)})
    
}

// Interpolate the scales!
function arcTween(d) {
var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}
