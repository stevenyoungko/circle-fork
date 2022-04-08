import React from 'react'
import Square from './Square'

function Board(props) {
  function renderSquare(i) {
    return( 
      <Square
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)} 
      />
    )
  }

  return (
    <div>
      {
        Array.from({ length: 3}).map((_, y) => (
          <div className='board-row' key={y}>
            {
              Array.from({ length: 3 }).map((_, x) => (
                renderSquare(y*3 + x)
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default Board