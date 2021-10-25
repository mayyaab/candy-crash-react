import { useState, useEffect } from 'react'
import ScoreBord from './components/ScoreBord'
import blueCandy from './images/Blue.png'
import greenCandy from './images/Green.png'
import orangeCandy from './images/Orange.png'
import purpleCandy from './images/Purple.png'
import redCandy from './images/Red.png'
import yellowCandy from './images/Yellow.png'
import blank from './images/Blank.png'

const width = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
]

const App = () => {

  const [currentColorArrangment, setCurrentColorArrangment] = useState([])
  const [squareBeingDraggeg, setSquareBeingDraggeg] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const chechForColumOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank
      if (columnOfThree.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        columnOfThree.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const chechForColumOfFour = () => {
    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangment[i]
      const isBlank = currentColorArrangment[i] === blank
      if (columnOfFour.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        columnOfFour.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const chechForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangment[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangment[i] === blank

      if (notValid.includes(i)) continue
      if (rowOfThree.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3)
        rowOfThree.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const chechForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangment[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangment[i] === blank

      if (notValid.includes(i)) continue
      if (rowOfFour.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4)
        rowOfFour.forEach(square => currentColorArrangment[square] = blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangment[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangment[i] = candyColors[randomNumber]
      }

      if ((currentColorArrangment[i + width]) === blank) {
        currentColorArrangment[i + width] = currentColorArrangment[i]
        currentColorArrangment[i] = blank
      }

    }
  }

  console.log(scoreDisplay)

  const dragStart = (e) => {
    setSquareBeingDraggeg(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {

    const squareBeingDraggedId = parseInt(squareBeingDraggeg.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArrangment[squareBeingReplacedId] = squareBeingDraggeg.getAttribute('src')
    currentColorArrangment[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingDraggedId)

    const isAColumnOfFour = chechForColumOfFour()
    const isARowOfFour = chechForRowOfFour()
    const isAColumnOfThree = chechForColumOfThree()
    const isARowOfThree = chechForRowOfThree()

    if (squareBeingReplacedId && validMove
      && (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)) {
      setSquareBeingDraggeg(null)
      setSquareBeingReplaced(null)
    } else {
      setCurrentColorArrangment([...currentColorArrangment])
    }
  }

  const createBoard = () => {
    const randomColorArrangment = []
    for (let i = 0; i < width * width; i++) {
      const randonColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangment.push(randonColor)
    }
    setCurrentColorArrangment(randomColorArrangment);
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      chechForColumOfFour()
      chechForColumOfThree()
      chechForRowOfFour()
      chechForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangment([...currentColorArrangment])
    }, 100)
    return () => clearInterval(timer)

  }, [chechForColumOfFour, chechForColumOfThree, chechForRowOfThree, chechForRowOfFour, moveIntoSquareBelow, currentColorArrangment])


  return (
    <div className='app'>
      <div className='game'>
        {currentColorArrangment.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd} />
        ))}

      </div>
      <ScoreBord score={scoreDisplay} />
    </div>
  );
}

export default App;
