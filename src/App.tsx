import React, { useEffect, useState, useRef } from 'react'
const dummyData = {
  message: {
    x: [90, 68, 63, 104, 146, 145, 131, 181],
    y: [95, 166, 149, 176, 166, 85, 151, 176],
    w: [21, 44, 27, 52, 25, 40, 24, 54]
  }
}
const [WIDTH, HEIGHT] = [300, 300]

const App = () => {
  const [charts, setCharts] = useState([]) // 📊
  // const [shadow, setShadow] = useState([])

  // 🖼 ref init
  const barsRef = useRef(null)
  const shadowRef = useRef(null)

  const mapBars = data => {
    const dataSet: number[][] = Object.values(data)

    const transponse = dataSet[0]
      .map((_, colIndex) => dataSet.map(row => row[colIndex]))
      .map(data => [data[0], HEIGHT - data[1], data[2], data[1]])

    const createShadow = transponse.map()

    setCharts(transponse)
  }

  useEffect(() => {
    const ctx = barsRef.current.getContext('2d')
    const { random } = Math
    charts.forEach(chart => {
      ctx.fillStyle = `rgba(${random() * 255},${random() * 255},${random() *
        255},0.5)`
      ctx.fillRect(...chart)
    })
  }, [charts])

  useEffect(() => {
    fetch('https://landing.backend.mivest.io/challenge')
      .then(res => res.json())
      .then(() => dummyData)
      .then(({ message }) => mapBars(message))
      .then(res => {
        const ctx = barsRef.current.getContext('2d')
        ctx.canvas.width = WIDTH
        ctx.canvas.height = HEIGHT
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
      })
      .catch(e => {
        throw new Error(e)
      })
  }, [])

  return (
    <>
      <canvas ref={barsRef} />
      <canvas ref={shadowRef} />
    </>
  )
}

export default App
