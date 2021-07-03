import React, { useEffect, useState, useRef } from 'react'
const dummyData = {
  message: {
    x: [62, 111, 166, 107, 87],
    y: [181, 184, 127, 78, 134],
    w: [27, 33, 32, 22, 49]
  }
}
const [WIDTH, HEIGHT] = [300, 300]

const App = () => {
  const [charts, setCharts] = useState([]) // 📊
  const [dots, setDots] = useState([])

  // 🖼 ref init
  const barsRef = useRef(null)
  const shadowRef = useRef(null)

  const mapBars = (data: { [s: string]: number[] } | ArrayLike<number[]>) => {
    const dataSet: number[][] = Object.values(data)

    const transponse = dataSet[0]
      .map((_, colIndex) => dataSet.map(row => row[colIndex]))
      .map(([x, y, w]) => ({ x, y, w }))
      .sort(({ x: aX }, { x: bX }) => (aX > bX ? 1 : -1))

    setCharts(transponse)
  }

  useEffect(() => {
    const ctx = barsRef.current.getContext('2d')
    const { random } = Math
    charts.forEach(({ x, y, w }) => {
      ctx.fillStyle = `rgba(${random() * 255},${random() * 255},${random() *
        255},0.5)`
      ctx.fillRect(x, HEIGHT - y, w, y)
    })
  }, [charts])

  useEffect(() => {
    const changePoints = charts
      .map(({ x, y, w }, index: number) => {
        const midXBars = charts
          .filter(
            ({ x: cX, y: cY }, cI: number) =>
              cI !== index && cX >= x && cX <= x + w && cY > y
          )
          .map(({ x: cX }) => ({ x: cX, y }))

        const midYBars = charts
          .filter(
            ({ x: cX, y: cY, w: cW }, cI: number) =>
              cI !== index && cX + cW >= x + w && x + w >= cX && cY <= y
          )
          .map(({ y: cY }) => ({ x: x + w, y: cY }))

        return [
          ...midXBars,
          ...midYBars,
          { x, y },
          { x: x + w, y },
          { x, y: 0 },
          { x: x + w, y: 0 }
        ]
      })
      .flat()
      .sort(({ y: aY }, { y: bY }) => (aY >= bY ? 1 : -1))
      .sort(({ x: aX }, { x: bX }) => (aX >= bX ? 1 : -1))

    const tempDots = []

    type NextMovType = [{ x: number; y: number }, boolean]

    const printDot = ([{ x, y }, skipTop = false]: NextMovType) => {
      tempDots.push({ x, y })
      const up =
        !skipTop &&
        changePoints
          .filter(({ x: currX, y: currY }) => x === currX && currY > y)
          .find(() => true)
      const right = changePoints
        .filter(({ x: currX, y: currY }) => y === currY && currX > x)
        .find(() => true)
      const down = changePoints
        .filter(({ x: currX, y: currY }) => x === currX && currY < y)
        .reverse()
        .find(() => true)

      const nextMov: NextMovType =
        (up && [up, false]) ||
        (right && [right, false]) ||
        (down && [down, true])

      nextMov && printDot(nextMov)
    }
    changePoints.length && printDot([changePoints[0], false])
    setDots(tempDots)
  }, [charts])

  useEffect(() => {
    const ctx = shadowRef.current.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.beginPath()
    dots.forEach(({ x, y }) => {
      ctx.lineTo(x, HEIGHT - y)
      //      ctx.arc(x, HEIGHT - y, 1, 0, 2 * Math.PI, true)
    })
    ctx.stroke()
  }, [dots])

  useEffect(() => {
    fetch('https://landing.backend.mivest.io/challenge')
      .then(res => res.json())
      //  .then(() => dummyData)
      .then(({ message }) => mapBars(message))
      .then(() => {
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
