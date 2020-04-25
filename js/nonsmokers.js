myArt('data/2013_filtered2.json')

//dropdown change handler 
$("#year-select") 
    .on("change",function(){
        document.getElementById("nonsmoking_chart_area").innerHTML = ""
        myArt($(this).val())
    });

function myArt(datafile){

    var margin = {left: 80, right: 10, top: 10, bottom: 150};

    var width = 860 - margin.left - margin.right,
        height = 425 - margin.top - margin.bottom;

    var svg = d3.select("#nonsmoking_chart_area")
        .append("svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //x label
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height+140)
        .attr('font-size', "20px")
        .attr('text-anchor', 'middle')
        .text("State");

    //y label
    svg.append("text")
        .attr("x", -(height/2))
        .attr("y", -60)
        .attr('font-size', "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Percentage (%)");

    //tooltip
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d){
            var text = "State : <span>" + d.State + "</span><br/><br/>";
            text += "Percentage : <span>" + d.NonSmokers + " %" + "</span><br>";
            return text;
        })

    svg.call(tip);

    d3.json(datafile).then(function(data){
        console.log(data);

        data.forEach(function(d){
            d.NonSmokers = +d.NonSmokers;
        });

        //x scale
        var x = d3.scaleBand()
            .domain(data.map(function(d){
                return d.State;
            }))
            .range([0,width])
            .paddingInner(0.3)
            .paddingOuter(0.3);

        //y scale
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){
                return d.NonSmokers;
            })])
            .range([height,0]);

        //x axis
        var xAxis = d3.axisBottom(x);
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .selectAll("text")
                .attr("y", "-4")
                .attr("x", "-12")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)");
        
        //y axis
        var yAxis = d3.axisLeft(y)
            .ticks(3)
            .tickFormat(function(d){
                return d + "%";
            });
        svg.append("g")
            .call(yAxis);

        var rects = svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
                .attr("y", function(d,i){
                    return y(d.NonSmokers);
                })
                .attr('x', function(d,i){
                    return x(d.State);
                })
                .attr("width", x.bandwidth)
                .attr("height", function(d,i){
                    return height-y(d.NonSmokers);
                })
                .attr("fill", "gray")
                .on("mouseover",tip.show)
                .on("mouseout",tip.hide)
        
    }); //.then()

}// function myArt()
