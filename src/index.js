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

const handlePageChange = (event) =>{
  if (totalPages>3){
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

    //change images
    let startIndex= (curPage-1) *  6
    let imgElements=document.getElementsByClassName('img'); 
    console.log(selectedPaths)
    console.log(startIndex)
    for (let i=startIndex;i<startIndex+6; i++){
      if (i<selectedPaths.length)
        imgElements[i-startIndex].src="./few_patches/"+selectedPaths[i]
      else
        imgElements[i-startIndex].src=blankSrc
    }  
  }
  
}

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

const resetImgs = () => {
  let imgElements=document.getElementsByClassName('img'); 
  for (let i=0;i<6; i++){
    if (i<selectedPaths.length)
      imgElements[i].src="./few_patches/"+selectedPaths[i]
    else
      imgElements[i].src=blankSrc
  }
  resetPagination()
}

const onLassoSelect = (selection) =>{
  selectedPoints=selection.points
  let duplicatePaths=[]
  selectedPoints.forEach((point)=>duplicatePaths.push(urls[point]))
  selectedPaths=[...new Set(duplicatePaths)]
  totalPages = Math.ceil(selectedPaths.length/6)
  resetImgs()
}



const data = await d3.csv('./few_patches/sample_proj.csv')

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


let xScale = d3.scaleLinear().domain([xMin,xMax]).range([-1,1])
let yScale = d3.scaleLinear().domain([yMin,yMax]).range([-1,1])
let coordinates2=[]

console.log(coordinates[0])
coordinates.forEach((element, index)=> {
  coordinates[index][0]=xScale(element[0])
  coordinates[index][1]=yScale(element[1])
})

console.log(coordinates);
console.log(urls)
const canvas = document.querySelector('#canvas');

const { width, height } = canvas.getBoundingClientRect();

const scatterplot = createScatterplot({
  canvas,
  width,
  height,
  pointSize: 5,
  pointColor:"#c192e8",
  opacity:0.5
});

scatterplot.subscribe('select', onLassoSelect);

/*
const points = new Array(1000000)
  .fill()
  .map(() => [-1 + Math.random() * 2, -1 + Math.random() * 2]);
*/
scatterplot.draw(coordinates);

