var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
let mapClickCount = 0;
let socket = io();
let serverPath = 'None';

//canvas.width = 1000;
//canvas.height = 1000;

let background = new Image();
background.src = 'mapImg/de_mirage.png'
background.onload = () => { ctx.drawImage(background, 0, 0) }

canvas.width = background.width;
canvas.height = background.height;
//let color = '#000000';






const mouse = {

    x: 0,
    y: 0,

    lastX: 0,
    lastY: 0,

    color: '#000000',

    buttonNames: ['b1', 'b2', 'b3']

}

function mouseEvent(e) {

    let bounds = canvas.getBoundingClientRect();

    mouse.x = e.pageX - bounds.left - scrollX;
    mouse.y = e.pageY - bounds.top - scrollY;

    mouse.x /= bounds.width;
    mouse.y /= bounds.height;

    mouse.x *= canvas.width;
    mouse.y *= canvas.height;

    if (e.type === 'mousedown' && e.target.id === 'canvas') {

        mouse[mouse.buttonNames[e.which - 1]] = true;

    } else if (e.type === 'mouseup') {
        mouse[mouse.buttonNames[e.which - 1]] = false;
    }




}

document.addEventListener('mousemove', mouseEvent);
document.addEventListener('mousedown', mouseEvent);
document.addEventListener('mouseup', mouseEvent);


function mainLoop(time) {

    if (mouse.b1) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = mouse.color;
        ctx.moveTo(mouse.lastX, mouse.lastY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke()
        socket.emit('drawing', { data: mouse, room: serverPath })

    }

    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    requestAnimationFrame(mainLoop)


}


let toolbox = document.getElementsByClassName("toolbox");
let importbox = document.getElementsByClassName("importbox");


function changeMap(map) {


    let mapName = "de_" + map;

    /*
    document.getElementById('mapimage').style.backgroundImage = "url(mapImg/" + mapName + ".png)";
    */

    background.src = 'mapImg/' + mapName + '.png';
    socket.emit('mapchange', { data: background.src, room: serverPath });
    socket.on('mapchange', (map) => {
        background.src = map;
    })

    ctx.drawImage(background, 0, 0)


    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //causes blank beginning
    canvas.width = background.width;
    canvas.height = background.height;






    //sets visibility for other options once map is selected

    for (let i = 0; i < importbox.length; i++) {
        importbox[i].style.visibility = 'visible'
    }

    for (let i = 0; i < toolbox.length; i++) {
        toolbox[i].style.visibility = 'visible'


    }
}

function download1(dataURL, fileName) {

    let a = document.createElement('a');
    a.href = dataURL;
    a.setAttribute('download', fileName);
    a.click();

}

function getDataurl() {

    return canvas.toDataURL();


}

function clearMap() {


    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(background, 0, 0)




}


function colorPicker(param) {

    mouse.color = param;

}

socket.on('drawing', (data) => {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = data.color;
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke()
})

function changeServer(path) {

    socket.emit('serverchange', { new: path, old: serverPath })
    serverPath = path;

}

requestAnimationFrame(mainLoop)