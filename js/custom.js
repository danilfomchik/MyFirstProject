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

const canvas = document.querySelector('#myCanvas');
context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth - 160;
canvas.height = document.documentElement.clientHeight - 20;


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
    const result = await fetchData;

    console.log('result-->', result);

    for(let i = 0; i < result.length; i++){
        let {name:toolName, src:toolSrc, cursor} = result[i];

        wrapperImg[i].src = toolSrc;
        tools[i].classList.add(toolName);

        tools[i].addEventListener('click', () => canvas.classList.add(cursor), false) 
        tools[i].addEventListener('click', pencilDraw, false)

        function pencilDraw(){
            if(cursor == 'pencilCursor'){
                drawing();
                alert('r');
            }
            tools[i].removeEventListener('click', pencilDraw, false) 
        };
    }
}
getTools(toolsData);


//рисование
var flag = true;

function drawing(){

    let mouse = { x:0, y:0};
    let draw = false;

    if(flag){
        canvas.addEventListener("mousedown", function(e){   
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            draw = true;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
        });
        canvas.addEventListener("mousemove", function(e){
             
            if(draw == true){
             
                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
                context.lineTo(mouse.x, mouse.y);
                context.strokeStyle = colorInput.value;
                context.stroke();
            }
        });
        canvas.addEventListener("mouseup", function(e){
             
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
            context.closePath();
            draw = false;
        });
    }
}

function stopDrawing(){
    flag = false;
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