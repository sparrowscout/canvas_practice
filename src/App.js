import React, { useRef, useEffect, useState } from 'react'
import styled from "styled-components"

const defaultStyle = { border: '1px solid gray', display: 'inline-block', margin: '1rem' }

function Main(arg) {
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
    setCtx(context);

    const canvasDraw = canvasDrawRef.current;
    const drawContext = canvasDraw.getContext('2d');
    drawContext.lineJoin = 'round';
    drawContext.lineWidth = stroke;
    drawContext.strokeStyle = color;
    setDrawCanvas(drawContext);
  }, [color, stroke])

  const canvasEventListener = (x, y) => {
    //현재 마우스 좌표값
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

  return (
    <div className='container' >
      <canvas ref={canvasRef} style={defaultStyle}
        onMouseDown={() => { setMouse(true) }}
        onMouseMove={(event) => { canvasEventListener(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop) }}
        // onMouseLeave={(event) => { canvasEventListener(event, 'leave') }}
        onMouseUp={() => { setMouse(false) }}
      >

      </canvas>
      <button onClick={remove}>삭제하기</button>
      <ContextPick>
        <div onClick={()=>{setColor('red')}}>빨</div>
        <div onClick={()=>{setColor('yellow')}}>노</div>
        <div onClick={()=>{setColor('green')}}>초</div>
        <div onClick={()=>{setColor('blue')}}>파</div>
        <div onClick={()=>{setColor('black')}}>검</div>
      </ContextPick>
      <ContextPick>
      <div onClick={()=>{setStroke(1)}}>얇게</div>
      <div onClick={()=>{setStroke(3)}}>기본</div>
      <div onClick={()=>{setStroke(6)}}>두껍게</div>
      </ContextPick>
      <canvas ref={canvasDrawRef} style={defaultStyle}></canvas>
      
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