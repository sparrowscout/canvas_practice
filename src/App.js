import React, { useRef, useEffect, useState } from 'react'
import styled from "styled-components"
import SockJsClient from 'react-stomp';
import SockJS from "sockjs-client"
import Stomp from "stompjs"


const defaultStyle = { border: '1px solid gray', display: 'inline-block', margin: '1rem' }

function Main(arg) {
  const $websocket = React.useRef(null);

  const handleMsg = msg => {
    console.log(msg);
  }

  const handleClickSendTo = () => {
    $websocket.current.sendMessage ('/sendTo');
  }

  const handleClickSendTemplate = () => {
    $websocket.current.sendMessage('/Template')
  }

  //sockJS
  // const sock = new SockJS('http://localhost:8080')
  //sock 서버 위로 stomp 사용하기
  // let client = Stomp.over(sock)

  const [mouse, setMouse] = useState(false)
  //마우스다운일 때 true 업일 때 false로
  const [ctx, setCtx] = useState();
  const [drawCanvas, setDrawCanvas] = useState();

  const [color, setColor] = useState('black');
  const [stroke, setStroke] = useState(3);

  const canvasRef = useRef(null);
  const canvasDrawRef = React.useRef(null)

  const array = []

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

  const canvasEventListener = (x, y) => {
    console.log(x,y)
 
    if (!mouse) {
      return false
    }
    if (array.length === 0) {
      array.push({ x, y })
      console.log(array)

    } else {

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
      console.log(array)

     
      // const location = {x: x, y: y}

      //데이터 전송(공식문서에 진짜 이렇게 써있음 ..)
      // sock.onopen = function(event){
      //   sock.send(JSON.stringify(location))
      // }
      
      //서버로부터 데이터 수신하기 (공식문서에 진짜 이렇게 써있음 ..)
      // sock.onmessage = function(event){
      //   console.log(event.data)
      // }
    }
  }


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
        onMouseMove={(event) => { canvasEventListener(event.clientX - event.target.offsetLeft,
                                                       event.clientY - event.target.offsetTop) }}
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

      <SockJsClient
      url="http://localhost:8080/start"
      topics={['/topics/sendTo','/topics/template','/topics/api']}
      onMessage={msg => {
        console.log(msg)
      }}
      ref={$websocket}
      />
      <button onClick={handleClickSendTo}>SendTo</button>
      <button onClick={handleClickSendTemplate}>SendTemplate</button>

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