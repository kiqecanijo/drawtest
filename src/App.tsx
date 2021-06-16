import React, { useEffect, useState, useRef } from 'react'

const { innerWidth: WIDTH, innerHeight: HEIGHT } = window

const App = () => {
  const [charts, setCharts] = useState([])

  // 🖼 ref init
  const canvasRef = useRef(null)

  const mapBars = data => {
    const dataSet: number[][] = Object.values(data)

    const transponse = dataSet[0].map((_, colIndex) =>
      dataSet.map(row => row[colIndex])
    )
    setCharts(transponse)
  }

  useEffect(() => {
    fetch('https://landing.backend.mivest.io/challenge')
      .then(res => res.json())
      .then(({ message }) => mapBars(message))
      .then(res => {
        const context = canvasRef.current.getContext('2d')
        context.canvas.width = WIDTH
        context.canvas.height = HEIGHT
        context.fillStyle = 'rgb(11, 13, 15)'
        context.fillRect(0, 0, WIDTH, HEIGHT)
      })
      .catch(e => {
        throw new Error(e)
      })
  }, [])

  return (
    <body>
      <canvas ref={canvasRef} />
      {charts.flat().map((e, key) => (
        <p key={key}>{e}</p>
      ))}
    </body>
  )
}

export default App
