const pencilTool = document.querySelector('.pencilTool');
const eraserTool = document.querySelector('.eraserTool');
const paintTool = document.querySelector('.paintTool');
const pipetTool = document.querySelector('.pipetTool');
const loupeTool = document.querySelector('.loupeTool');
const paletteTool = document.querySelector('.paletteTool');
const wrapper = document.querySelector('.wrapper');
const downloadFavicon = document.querySelector('.downloadFavicon');
const colorInput = document.querySelector('.colorInput');
const wrapperImg = document.querySelectorAll('.wrapperImg');
const tools = document.querySelectorAll('.tools');
let restTools = [...tools];

var canvasImgArray = [];
var restoreIndex = -1;

const canvas = document.querySelector('#myCanvas');
const context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth - 130;
canvas.height = document.documentElement.clientHeight - 20;

//tools
const clear = document.querySelector('#clear');
const pencil = document.querySelector('#pencil');
const palette = document.querySelector('#palette');
const undo = document.querySelector('.fa-arrow-left');
const eraser = document.querySelector('#eraser');
const undoLast = document.querySelector('#undo');
const loupe = document.querySelector('#loupe');

//запрос данных о кнопках
var toolsData = "./toolsData.json"

async function getTools(url){
    let fetchData = fetch(url)
        .then((response) => {
            if (response.status !== 200) {
                alert('Whoops! Something went wrong!')
            }
            return Promise.resolve(response)
        })
        .then((url) => {
            return url.json();
        })
    var result = await fetchData;

    console.log('result-->', result);

    for(let i = 0; i < result.length; i++){
        let {name:toolName, src:toolImgSrc, cursor} = result[i];


        // здесь сделать рендер страницы


        wrapperImg[i].src = toolImgSrc;
        tools[i].classList.add(toolName);
    
        tools[i].addEventListener('click', () => canvas.classList.add(cursor), false) 
    }

    /*
    //событие для карандаша
    pencil.addEventListener('click', drawing)

    //очистка листа
    clear.addEventListener('click', clearCanvas);

    //палитра
    palette.addEventListener('click', showPallete);

    //ластик
    eraser.addEventListener('click', eraseImage)

    //undo
    undoLast.addEventListener('click', undo_last)
    */
}
getTools(toolsData);



//событие для карандаша
pencil.addEventListener('click', drawing)

//очистка листа
clear.addEventListener('click', clearCanvas);

//палитра
palette.addEventListener('click', showPallete);

//ластик
eraser.addEventListener('click', eraseImage)

//undo
undoLast.addEventListener('click', undo_last)

//loupe
// loupe.addEventListener('click', zoom)


//рисование
function drawing(){
    console.log('startDraw');

    let mouse = { x:0, y:0};
    let draw = false;

    canvas.addEventListener("mousedown", startDrow);
    function startDrow(e){   
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        draw = true;
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);

        bMouseDown = true;
    }

    canvas.addEventListener("mousemove", keepDrow);
    function keepDrow(e){
        context.globalCompositeOperation = 'source-over'; 
        context.lineWidth = 5;

        if(draw == true){  
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.strokeStyle = colorInput.value;
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
    }

    canvas.addEventListener("mouseup", endDrow);
    function endDrow(e){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
        context.closePath();
        draw = false;
        bMouseDown = false;
        
        canvasImgArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        restoreIndex += 1;
        console.log('canvasImgArray-->', canvasImgArray);
    }

    deleteEventListener(startDrow, keepDrow, endDrow);
}

//ластик
var isPress = false;
var old = null;

function eraseImage(){
    console.log('startErase');

    canvas.addEventListener('mousedown', startErase);
    function startErase(e){
        isPress = true;
        old = {x: e.offsetX, y: e.offsetY};
    }

    canvas.addEventListener('mousemove', keepErase);
    function keepErase(e){
        if (isPress) {
          var x = e.offsetX;
          var y = e.offsetY;
          context.globalCompositeOperation = 'destination-out';
      
          context.beginPath();
          context.arc(x, y, 10, 0, 2 * Math.PI);
          context.fill();
      
          context.lineWidth = 20;
          context.beginPath();
          context.moveTo(old.x, old.y);
          context.lineTo(x, y);
          context.stroke();
      
          old = {x: x, y: y};
      
        }
    }

    canvas.addEventListener('mouseup', endErase);
    function endErase(e){
        isPress = false;

        canvasImgArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        restoreIndex += 1;
        console.log('canvasImgArray-->', canvasImgArray);
    }

    deleteEventListener(startErase, keepErase, endErase);
}

//удаление обработчика событий
function deleteEventListener(firstFunc, secondFunc, thirdFunc) {
    for(var tool of restTools){
        tool.addEventListener('click', () => {
            canvas.removeEventListener("mousedown", firstFunc);
            canvas.removeEventListener("mousemove", secondFunc);
            canvas.removeEventListener("mouseup", thirdFunc);
        });   
    }
}

//очистка канваса
function clearCanvas(){
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    canvasImgArray = [];
    restoreIndex = -1;
}


//undo function
function undo_last(){
    if(restoreIndex <= 0){
        clearCanvas();
    } else {
        restoreIndex -= 1;
        canvasImgArray.pop();
        context.putImageData(canvasImgArray[restoreIndex], 0, 0)
    }
}

//show palette
let isPressBtn = false;

function showPallete(){
    if ( !isPressBtn ) {
        colorInput.style.display = 'block';
        isPressBtn = true;
    } else {
        colorInput.style.display = 'none';
        isPressBtn = false;
    }
}


// добавляем класс activeTool для инструментов
initElems()

function initElems(){

    console.log('tools-->', tools);

    for(let i = 0; i < tools.length; i++){
        tools[i].addEventListener('click', function(event) {
            deactivateActiveTool();
            removeClassList()

            this.classList.add('activeTool')
            event.stopPropagation();
        })
    }
}

// деактивируем класс activeTool для инструментов
var deactivateActiveTool = () => {
    const active = getActiveTool();
    if(active){
        active.classList.remove('activeTool')
    }
}

// получаем класс activeTool
var getActiveTool = () => document.querySelector('.activeTool');

// удаляем класс у канваса
var removeClassList = () => {
    if(canvas.classList.length > 0){
        canvas.classList = '';
    }
}

//скачивание рисунка
downloadFavicon.addEventListener('click', () => {
    let downloadAccept = confirm('Разрешить скачивание файла?');

    if(downloadAccept === true){
        let link = document.createElement('a');
        link.download = 'newimage.png';
        link.href = canvas.toDataURL()
        link.click();
        link.delete;
    }
});