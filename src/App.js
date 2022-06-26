import React, { useRef, useEffect, useState } from 'react'

const defaultStyle = { border: '1px solid gray', display: 'inline-block', margin: '1rem' }

function Main(arg) {
  const [mouse, setMouse] = useState(false)
  //마우스다운일 때 true 업일 때 false로
  const [ctx, setCtx] = useState();

  const [color, setColor] = useState();
  

  const canvasRef = useRef(null);

  const array = []
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineJoin = 'round';
    context.lineWidth = 3;
    context.strokeStyle = 'blue'
    setCtx(context);
  }, [])

  const canvasEventListener = (event) => {
    //현재 마우스 좌표값
    let x = event.clientX - event.target.offsetLeft;
    let y = event.clientY - event.target.offsetTop;
    
      if (!mouse){
        return false
      }
      if (array.length === 0) {
        array.push({ x, y })
      } else {
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(array[array.length - 1].x, array[array.length - 1].y);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        array.push({ x, y })
        console.log(array)
      }

    
  }

  const remove = () =>{
    ctx.save()
      ctx.clearRect(0, 0, 2580, 2580)
      ctx.restore()
  }

  return (
    <div className='container' >
      <canvas ref={canvasRef} style={defaultStyle}
        onMouseDown ={() => { setMouse(true)}}
        onMouseMove={(event) => { canvasEventListener(event) }}
        // onMouseLeave={(event) => { canvasEventListener(event, 'leave') }}
        onMouseUp={() => { setMouse(false) }}
      >

      </canvas>
<button onClick={remove}>삭제하기</button>
    </div>
  );
}

export default Main;