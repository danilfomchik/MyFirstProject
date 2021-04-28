const pencilTool = document.querySelector('.pencilTool');
const eraserTool = document.querySelector('.eraserTool');
const paintTool = document.querySelector('.paintTool');
const pipetTool = document.querySelector('.pipetTool');
const loupeTool = document.querySelector('.loupeTool');
const paletteTool = document.querySelector('.paletteTool');
const wrapper = document.querySelector('.wrapper');
const downloadFavicon = document.querySelector('.downloadFavicon');
const colorInput = document.querySelector('.colorInput');
const toolsDiv = document.querySelector('.tools');
const wrapperImg = document.querySelectorAll('.wrapperImg')
const tools = document.querySelectorAll('.tools');


var canvas = document.querySelector('#myCanvas')
ctx = canvas.getContext('2d');

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
    let result = await fetchData;

    console.log('result-->', result);
    for(i = 0; i < result.length; i++){
        let toolName = result[i]["name"];
        let toolSrc = result[i]["src"];
        let cursorClass = result[i]["cursorClass"];

        wrapperImg[i].src = toolSrc;
        tools[i].classList.add(toolName);

        tools[i].addEventListener('click', (event) => {
            canvas.classList.add(cursorClass)
            if(cursorClass == 'paletteCursor'){
                colorInput.style.display = 'block';
            }
        })
    }
    downloadFavicon.addEventListener('click', () => {
        alert('Разрешить скачивание файла?')
    })
}

getTools(toolsData);


// добавляем класс activeTool для инструментов
initElems()

function initElems(){

    console.log('tools-->', tools);

    for(var i = 0; i < tools.length; i++){
        tools[i].addEventListener('click', (event) => {
            deactivateActiveTool();
            removeClassList()

            this.classList.add('activeTool')
            event.stopPropagation();
        })
    }
}

// деактивируем класс activeTool для инструментов
function deactivateActiveTool(){
    var active = getActiveTool();
    if(active){
        active.classList.remove('activeTool')
    }
}

// получаем класс activeTool
function getActiveTool (){
    return document.querySelector('.activeTool');
}

// удаляем класс у канваса
function removeClassList(){
    if(canvas.classList.length > 0){
        canvas.classList = '';
    }
}