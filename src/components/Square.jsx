function Square(props) {
  const isVictory = props.isVictory && props.isLastStep ? 'is-victory' : ''
  return (
    <button 
      className={`square ${isVictory}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

export default Square