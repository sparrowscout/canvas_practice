import React, { useRef, useEffect, useState } from 'react'
import styled from "styled-components"
import SockJsClient from 'react-stomp';
import SockJS from "sockjs-client"
import Stomp from "stompjs"


const defaultStyle = { border: '1px solid gray', display: 'inline-block', margin: '1rem' }
function Main(arg) {
  const socket = new WebSocket("ws://localhost:5000");
// socket.binaryType = "arraybuffer"

const [location, setLocation] = useState([]);

  socket.addEventListener("open", () => {
    console.log("Connected to Server ✅")
    socket.send("무덤까지 ... 비밀입니다")
    socket.send(JSON.stringify(current))

  })

  socket.addEventListener("message", (message) =>{
    console.log(message)
  })


  const [mouse, setMouse] = useState(false)
  //마우스다운일 때 true 업일 때 false로
  const [ctx, setCtx] = useState();
  const [drawCanvas, setDrawCanvas] = useState();

  const [color, setColor] = useState('black');
  const [stroke, setStroke] = useState(3);

  const canvasRef = useRef(null);
  const canvasDrawRef = React.useRef(null)

  const current = {
    x: 0,
    y: 0,
    color: color
  }
  const array = [];
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineWidth = stroke
    context.strokeStyle = color;
    context.fillStyle = "white"
    setCtx(context);

    const canvasDraw = canvasDrawRef.current;
    const drawContext = canvasDraw.getContext('2d');
    drawContext.lineJoin = 'round';
    drawContext.lineWidth = stroke;
    drawContext.strokeStyle = color;
    setDrawCanvas(drawContext);

  }, [color, stroke])


  const canvasEventListener = (x,y) => {


    
    // const x = event.clientX - event.target.offsetLeft;
    // const y = event.clientY - event.target.offsetTop
    
    // current.x = event.clientX - event.target.offsetLeft
    // current.y = event.clientY - event.target.offsetTop

    // const startX = current.x
    // const startY = current.y
    // const endX = current.x
    // const endY = current.y
    
 
    // console.log(startX, startY, endX, endY)
    if (!mouse) {
      return false
    }
    if (array.length === 0) {
      array.push({ x, y })
    } 
    else {
      socket.addEventListener("open", () => {
        console.log("Connected to Server ✅")
        socket.send("무덤까지 ... 비밀입니다")
        socket.send(JSON.stringify(array))
      })

      ctx.save()
      drawCanvas.save()

      ctx.beginPath();
      drawCanvas.beginPath();

      ctx.moveTo(array[array.length - 1].x, array[array.length - 1].y);
      drawCanvas.moveTo(array[array.length - 1].x, array[array.length - 1].y);

      ctx.lineTo(x, y);
      drawCanvas.lineTo(x, y);

      ctx.closePath();
      drawCanvas.closePath();

      ctx.stroke();
      drawCanvas.stroke();

      ctx.restore();
      drawCanvas.restore()

      array.push({ x, y })

      // current.x = event.clientX - event.target.offsetLeft
      // current.y = event.clientY - event.target.offsetTop


    }
  }
  let drawing = false;

  //   const onMouseDown = (e: MouseEvent) => {
  //     drawing = true;
  //     current.x = e.pageX - (ctx?.offsetLeft ?? 0)
  //     current.y = e.pageY - (ctx?.offsetTop ?? 0)
  // };


  const remove = () => {
    ctx.save()
    ctx.clearRect(0, 0, 2580, 2580)
    ctx.restore()
    drawCanvas.save()
    drawCanvas.clearRect(0, 0, 2580, 2580)
    drawCanvas.restore()
  }

  function handleSaveBtn() {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "MyDrawings";
    link.click();
  }

  return (
    <div className='container' >
      <canvas ref={canvasRef} style={defaultStyle}
        onMouseDown={() => { setMouse(true) }}
        onMouseMove={(event) => {canvasEventListener(event.clientX - event.target.offsetLeft, 
                                                     event.clientY - event.target.offsetTop)}}

        // onMouseMove={(event) => {canvasEventListener(event)}}
        // onMouseLeave={(event) => { canvasEventListener(event, 'leave') }}
        onMouseUp={() => { setMouse(false) }}
      >
      </canvas>


      <button onClick={remove}>삭제하기</button>
      <button onClick={handleSaveBtn}>저장하기</button>
      <ContextPick>
        <div onClick={() => { setColor('red') }}>빨</div>
        <div onClick={() => { setColor('yellow') }}>노</div>
        <div onClick={() => { setColor('green') }}>초</div>
        <div onClick={() => { setColor('blue') }}>파</div>
        <div onClick={() => { setColor('black') }}>검</div>
        <div onClick={() => { setColor('white'); setStroke(10) }}>지우개</div>
      </ContextPick>
      <ContextPick>
        <div onClick={() => { setStroke(1) }}>얇게</div>
        <div onClick={() => { setStroke(3) }}>기본</div>
        <div onClick={() => { setStroke(6) }}>두껍게</div>
      </ContextPick>



      <canvas ref={canvasDrawRef} style={defaultStyle}></canvas>

          <button onClick={() => {
            socket.send(JSON.stringify(array))
          }}>서버에보내기</button>

      {/* <button onClick={handleClickSendTo}>SendTo</button>
      <button onClick={handleClickSendTemplate}>SendTemplate</button> */}

    </div>
  );
}

const ContextPick = styled.div`
display: flex;

div{
  margin-right: 20px;
}
`;

export default Main;