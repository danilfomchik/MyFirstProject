var pencilTool = document.querySelector('.pencilTool');
var eraserTool = document.querySelector('.eraserTool');
var paintTool = document.querySelector('.paintTool');
var pipetTool = document.querySelector('.pipetTool');
var loupeTool = document.querySelector('.loupeTool');
var paletteTool = document.querySelector('.paletteTool');
var wrapper = document.querySelector('.wrapper');
var downloadFavicon = document.querySelector('.downloadFavicon');
var colorInput = document.querySelector('.colorInput');

var canvas = document.querySelector('#myCanvas')
ctx = canvas.getContext('2d');

// добавляем класс activeTool для инструментов
initElems('.tools')

function initElems(selector){
    var tools = document.querySelectorAll(selector);

    for(var i = 0; i < tools.length; i++){
        tools[i].addEventListener('click', function(event){
            deactivateActiveTool();
            removeClassList()

            this.classList.add('activeTool')
            // canvas.classList.add('pencilCursor');

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

//карандаш
pencilTool.addEventListener('click', function(){
    canvas.classList.add('pencilCursor');
})
//резинка
eraserTool.addEventListener('click', function(){
    canvas.classList.add('eraserCursor');
})
//заливка
paintTool.addEventListener('click', function(){
    canvas.classList.add('paintCursor');
})
//пипетка
pipetTool.addEventListener('click', function(){
    canvas.classList.add('pipetCursor');
})
//лупа
loupeTool.addEventListener('click', function(){
    canvas.classList.add('loupeCursor');
})
//палитра
paletteTool.addEventListener('click', function(){
    colorInput.style.display = 'block';
})

downloadFavicon.addEventListener('click', function(){
    alert('Разрешить скачивание файла?')
})