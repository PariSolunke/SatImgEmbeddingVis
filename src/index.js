import createScatterplot from 'regl-scatterplot';
import * as d3 from 'd3';
let coordinates=[]
let urls=[]
d3.csv('./few_patches/sample_proj.csv').then(function(data) {
  data.forEach((d)=>{
    coordinates.push ([parseFloat(d.x), parseFloat(d.y)]);
    urls.push(d.path)
  });

}).catch(function(error) {
  console.error('Error reading CSV file:', error);
});

console.log(coordinates);
console.log(urls)
const canvas = document.querySelector('#canvas');

const { width, height } = canvas.getBoundingClientRect();

const scatterplot = createScatterplot({
  canvas,
  width,
  height,
  pointSize: 1,
  pointColor:"#c192e8",
  opacity:0.5
});

const points = new Array(1000000)
  .fill()
  .map(() => [-1 + Math.random() * 2, -1 + Math.random() * 2]);

scatterplot.draw(points);