import React from 'react'
import Board from './Board'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      locationList: [{
        index: null,
        location: 'start'
      }],
      pointIndex: undefined
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    this.state.locationList.push({
      index: i,
      location: calculateLocation(i)
    })
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      locationList: this.state.locationList
    })
  }

  jumpTo(step, pointIndex) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      pointIndex: pointIndex
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    
    const moves = history.map((step, move) => {
      const handleActive = this.state.pointIndex === this.state.locationList[move].index
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          <div>
            <button 
              className={handleActive ? 'is-active' : '' }
              onClick={() => this.jumpTo(move, this.state.locationList[move].index)} 
              style={{ margin: '6px' }}
            >
              {desc}
            </button>
            <span>({ this.state.locationList[move].location })</span>
          </div>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

function calculateLocation(index) {
  const list = [
    '0,0',
    '0,1',
    '0,2',
    '1,0',
    '1,1',
    '1,2',
    '2,0',
    '2,1',
    '2,2'
  ]
  return list[index]
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    // 判斷ooxx
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Game