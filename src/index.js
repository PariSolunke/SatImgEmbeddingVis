import createScatterplot from 'regl-scatterplot';
import * as d3 from 'd3';
let coordinates=[]
let urls=[]
let curPage=1
let totalPages=0
let selectedPoints=[]
let selectedPaths=[]
let xMin,xMax,yMin,yMax;
let blankSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
let pageElement=document.getElementById("pagination")
let pageButton1, pageButton2, pageButton3, dots1, dots2, nextButton,prevButton;


//handler to change pages
const handlePageChange = (event) =>{

  if (totalPages<=3){

    pageButton1.className=""
    pageButton2.className=""
    pageButton3.className=""

    if (event.target.id=="pageButton1"){
      pageButton1.className="active"
      if (curPage==1)
        return
      curPage=1
    }

    else if (event.target.id=="pageButton2"){
      pageButton2.className="active"
      if (curPage==2)
        return
      curPage=2
    }

    else if (event.target.id=="pageButton3"){
      pageButton3.className="active"
      if (curPage==3)
        return
      curPage=3
    }
  }

  else if (totalPages>3){

    if (event.target.id=="pageButton1"){
      if (curPage==1)
        return
      curPage=1
    }

    else if (event.target.id=="pageButton3"){
      if (curPage==totalPages)
        return
      curPage=totalPages
    }

    else if (event.target.id =="prevButton"){
      if (curPage==1)
        return
      curPage=curPage-1
    }

    else if (event.target.id=="nextButton"){
      if (curPage==totalPages)
        return
      curPage=curPage+1
    }
    
    if (curPage==1){
      resetImgs();
      return;
    }
    
    if (curPage>2)
      dots1.style.display ="inline"
    else
      dots1.style.display ="none"


    if (curPage<totalPages){
      dots2.style.display="inline";
      pageButton1.className=""
      pageButton2.innerHTML=String(curPage)
      pageButton2.className="active"
      pageButton3.className=""
      if (curPage==totalPages-1)
        dots2.style.display="none";
    }

    else if (curPage==totalPages){
      dots2.style.display="none";
      pageButton1.className=""
      pageButton2.className=""
      pageButton2.innerHTML=String(totalPages-1)
      pageButton3.className="active"
    }
  }

  //change images
  let startIndex= (curPage-1) *  9
  let imgElements=document.getElementsByClassName('img'); 
  for (let i=startIndex;i<startIndex+9; i++){
    if (i<selectedPaths.length)
      imgElements[i-startIndex].src="./data/"+selectedPaths[i]
    else
      imgElements[i-startIndex].src=blankSrc
  }   
}

//Reset Pagination

const resetPagination = () =>{
  curPage=1
  pageElement.innerHTML=""
  if (totalPages>3){
    prevButton = document.createElement("a")
    prevButton.id="prevButton";
    prevButton.href="javascript:void(0)";
    prevButton.onclick=handlePageChange;
    prevButton.innerHTML="&laquo;"
    pageElement.append(prevButton)
    
    pageButton1=document.createElement("a")
    pageButton1.id="pageButton1"
    pageButton1.href="javascript:void(0)";
    pageButton1.onclick=handlePageChange;
    pageButton1.innerHTML="1"
    pageButton1.className="active"
    pageElement.append(pageButton1)

    dots1=document.createElement("a")
    dots1.href="javascript:void(0)";
    dots1.innerHTML="..."
    dots1.id="non-link"
    dots1.style.display="none"
    pageElement.append(dots1)

    pageButton2=document.createElement("a")
    pageButton2.id="pageButton2"
    pageButton2.href="javascript:void(0)";
    pageButton2.onclick=handlePageChange;
    pageButton2.innerHTML="2"
    pageElement.append(pageButton2)
    

    dots2=document.createElement("a")
    dots2.href="javascript:void(0)";
    dots2.innerHTML="..."
    dots2.id="non-link"
    dots2.style.display="inline"
    pageElement.append(dots2)
    
    pageButton3=document.createElement("a")
    pageButton3.id="pageButton3"
    pageButton3.href="javascript:void(0)";
    pageButton3.onclick=handlePageChange;
    pageButton3.innerHTML=String(totalPages)
    pageElement.append(pageButton3)

    nextButton = document.createElement("a")
    nextButton.id="nextButton"
    nextButton.href="javascript:void(0)";
    nextButton.onclick=handlePageChange;
    nextButton.innerHTML="&raquo;"
    pageElement.append(nextButton)
  }

  else{

    pageButton1=document.createElement("a")
    pageButton1.id="pageButton1"
    pageButton1.href="javascript:void(0)";
    pageButton1.onclick=handlePageChange;
    pageButton1.innerHTML="1"
    pageButton1.className="active"
    pageElement.append(pageButton1)
    
    if (totalPages>1){
    pageButton2=document.createElement("a")
    pageButton2.id="pageButton2"
    pageButton2.href="javascript:void(0)";
    pageButton2.onclick=handlePageChange;
    pageButton2.innerHTML="2"
    pageElement.append(pageButton2)
    }

    if (totalPages>2){
      pageButton3=document.createElement("a")
      pageButton3.id="pageButton3"
      pageButton3.href="javascript:void(0)";
      pageButton3.onclick=handlePageChange;
      pageButton3.innerHTML=String(totalPages)
      pageElement.append(pageButton3)
    }
  }
}

//Reset Images
const resetImgs = () => {
  let imgElements=document.getElementsByClassName('img'); 
  for (let i=0;i<9; i++){
    if (i<selectedPaths.length)
      imgElements[i].src="./data/"+selectedPaths[i]
    else
      imgElements[i].src=blankSrc
  }
  resetPagination()
}

//funciton to handle select Lasso event
const onLassoSelect = (selection) =>{
  selectedPoints=selection.points
  let duplicatePaths=[]
  selectedPoints.forEach((point)=>duplicatePaths.push(urls[point]))
  selectedPaths=[...new Set(duplicatePaths)]
  //selectedPaths=duplicatePaths;
  totalPages = Math.ceil(selectedPaths.length/9)
  resetImgs()
}

//function to handle deselect Lasso event
const onLassoDeselect = () => {
  selectedPoints=[]
  selectedPaths=[]
  totalPages=1
  resetImgs()
}


//load csv file
const data = await d3.csv('./data/proj.csv')

//get coordinates and urls from the loaded data
data.forEach((d, i)=>{
  coordinates.push ([parseFloat(d.x), parseFloat(d.y)]);
  if (i==0){
    xMin=xMax=coordinates[i][0]
    yMin=yMax=coordinates[i][1]
  }
  else{
    xMin=Math.min(xMin, coordinates[i][0])
    xMax=Math.max(xMax, coordinates[i][0])
    yMin=Math.min(yMin, coordinates[i][1])
    yMax=Math.max(yMax, coordinates[i][1])
  }
  urls.push(d.path)
});

//The below code is used to normalize the x and y coordinates between -1 to 1 in browser, not needed if coordinates are already normalized
/*
let xScale = d3.scaleLinear().domain([xMin,xMax]).range([-1,1])
let yScale = d3.scaleLinear().domain([yMin,yMax]).range([-1,1])

coordinates.forEach((element, index)=> {
  coordinates[index][0]=xScale(element[0])
  coordinates[index][1]=yScale(element[1])
})
*/

const canvas = document.querySelector('#canvas');

const { width, height } = canvas.getBoundingClientRect()

let pointSize = 1
if (coordinates.length < 1000)
  pointSize=7
else if(coordinates.length < 10000)
  pointSize=6
else if(coordinates.length < 50000)
  pointSize=4  
else if (coordinates.length< 170000)
  pointSize=2

const scatterplot = createScatterplot({
  canvas,
  width,
  height,
  pointSize: pointSize,
  pointColor:"#a866de",
  opacity:0.5,
  cameraDistance:1.05
});

//on selection of points
scatterplot.subscribe('select', onLassoSelect);

//on deselect
scatterplot.subscribe('deselect', onLassoDeselect);

//draw scatterplot of projection
scatterplot.draw(coordinates);

