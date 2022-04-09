import React from 'react'
import Board from './Board'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        sort: 0,
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      locationList: [{
        index: null,
        location: 'start'
      }],
      pointIndex: undefined,
      isLastStep: true,
      order: 'asc',
      victoryList: []
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    let isLastStep = this.state.isLastStep
    let locationList = this.state.locationList
    // 如果勝負已經揭曉，或者某個 Square 已經被填滿了
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    if (!isLastStep) {
      locationList = this.state.locationList.slice(0, this.state.stepNumber + 1)
      isLastStep = true
    }
    locationList.push({
      index: i,
      location: calculateLocation(i)
    })
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    
    let victoryList = []
    if (calculateWinner(squares)) {
      victoryList = calculateWinner(squares)
    }
    this.setState({
      history: history.concat([{
        squares,
        sort: this.state.stepNumber + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      locationList: locationList,
      pointIndex: i,
      victoryList,
      isLastStep
    })
  }

  handleOrder() {
    this.setState({
      order: this.state.order === 'asc' ? 'desc' : 'asc'
    })
  }

  jumpTo(step, pointIndex) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      pointIndex: pointIndex,
      isLastStep: step === this.state.locationList.length - 1
    })
  }

  render() {
    let history = this.state.history
    let locationList = this.state.locationList
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    if (this.state.order === 'desc') {
      history = [...history].reverse()
      locationList = [...locationList].reverse()
    }

    
    const moves = history.map((step, move) => {
      const handleActive = this.state.pointIndex === locationList[move].index ? 'is-active' : ''
      const desc = step.sort !== 0 ? 'Go to move #' + step.sort : 'Go to game start'
      return (
        <li key={move}>
          <div>
            <button
              className={`button ${handleActive}`}
              onClick={() => this.jumpTo(step.sort, locationList[move].index)} 
              style={{ margin: '6px' }}
            >
              {desc}
            </button>
            <span>({ locationList[move].location })</span>
          </div>
        </li>
      )
    })

    let status

    if (winner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X')
    } else if (locationList.length === 10) {
      status = '平手'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    const order = this.state.order === 'asc' ? 'is-asc' : 'is-desc'

    return (
      <div className="game">
        <div className='game-function'>
          <button className={`button function-button ${order}`} disabled={history.length < 3} onClick={() => this.handleOrder() }>{ this.state.order === 'asc' ? '由大到小' : '由小到大'}</button>
        </div>
        <div className="game-board">
          <Board
            isLastStep={this.state.isLastStep}
            victoryList={this.state.victoryList}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div class="game-info-text">{status}</div>
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
      return [a,b,c]
    }
  }
  return null
}

export default Game