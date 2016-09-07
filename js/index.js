'use strict';

var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var margin = { top: 150, right: 90, bottom: 60, left: 40 };
var w = window.innerWidth;
var h = window.innerHeight;
var height = h * 0.9 - margin.top - margin.bottom,
    width = w * 0.8 - margin.left - margin.right;

d3.json(url, function (chartData) {
     var fastestTime = chartData[0].Seconds;

     var timeBehind = chartData.map(function (item) {
          return item.Seconds - fastestTime;
     });

     console.log(d3.min(timeBehind));
     var xScale = d3.scale.linear().domain([d3.max(timeBehind) + 10, d3.min(timeBehind)]).range([0, width]);

     var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

     var yScale = d3.scale.linear().domain([1, 37]).range([0, height]);

     var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);

     var tooltip = d3.select('body').append('div').style('position', 'absolute').style('text-align', 'center').style('padding', '5px 10px').style('width', '180px').style('background', '#666666').style('color', '#FFF').style('border-radius', '5px').style('opacity', 0);

     var chart = d3.select('#chart').append('svg').attr("width", width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).style('background', '#FACCAD').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

     chart.selectAll('circle').data(chartData).enter().append('circle').attr('r', 5).attr('cx', function (d) {
          return xScale(d.Seconds - fastestTime);
     }).attr('cy', function (d) {
          return yScale(d.Place);
     }).style('fill', function (d) {
          return d.Doping == '' ? 'black' : 'red';
     }).on('mouseover', function (d, i) {
          tooltip.transition().style('opacity', .9);
          tooltip.html(d.Name + ',' + d.Nationality + '</br>' + 'Year: ' + d.Year + ' Time: ' + d.Time + '</br>' + d.Doping).style('left', d3.event.pageX - 100 + 'px').style('top', d3.event.pageY - 120 + 'px');
     }).on('mouseout', function (d) {
          tooltip.transition().delay(500).style('opacity', 0);
     });

     chart.selectAll('text').data(chartData).enter().append('text').attr('x', function (d) {
          return xScale(d.Seconds - fastestTime);
     }).attr('y', function (d) {
          return yScale(d.Place);
     }).text(function (d) {
          return d.Name;
     }).attr('transform', 'translate(15, 5)').style('font-size', '.7em');

     var hGuide = chart.append('g').attr('transform', 'translate(0,' + (height - 10) + ')').call(xAxis);

     hGuide.selectAll('line').style({ stroke: '#000' });
     hGuide.selectAll('path').style({ fill: 'none', stroke: '#000' });
     hGuide.append('text').attr('y', 40).attr('x', width / 2.5).text('Seconds behind Fastest Time');

     var vGuide = chart.append('g').attr('transform', 'translate(10,0)').call(yAxis);

     vGuide.selectAll('line').style({ stroke: '#000' });
     vGuide.selectAll('path').style({ fill: 'none', stroke: '#000' });
     vGuide.append('text').attr('transform', 'rotate(-90)').attr('y', 20).attr('x', -height / 2.5).style('text-anchor', 'end').text('Ranking');

     var title = chart.append('text').attr('x', width / 2).attr('y', -100).attr("text-anchor", "middle").style('font-size', '1.4em').style('fill', 'blue').text('Doping in Professional Bicycle Racing');

     var subTitle = chart.append("text").attr("x", width / 2).attr("y", -80).attr("text-anchor", "middle").style('font-size', '1.2em').text("35 Fastest times up Alpe d'Huez");
     var description = chart.append("text").attr("x", width / 2).attr("y", -60).attr("text-anchor", "middle").style('font-size', '1.1em').text("Normalized to 13.8km distance");
     chart.append('circle').attr('cx', 50).attr('cy', 20).attr('r', 7);
     chart.append('text').attr('x', 65).attr('y', 25).text('- No doping allegations');

     chart.append('circle').attr('cx', 50).attr('cy', 40).attr('r', 7).style('fill', 'red');
     chart.append('text').attr('x', 65).attr('y', 45).text('- Doping allegations');
});