import React, { useState } from 'react'
import { createStage, checkCollision } from '../gameHelper'

//Components
import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'

//Styled components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris'

//Custom Hooks
import { useInterval } from '../hooks/useInterval'
import { usePlayer } from '../hooks/usePlayer'
import { useStage } from '../hooks/useStage'
import { useGameStatus } from '../hooks/useGameStatus'

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null)
    const [gameOver, setGameOver] = useState(false)

    const [player, updatePlayerpos, resetPlayer, playerRotate] = usePlayer()
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)

    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)
    const updatingDrop = 1000 /(level + 1) + 200

    console.log('re-render')

    const movePLayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0})) {
            updatePlayerpos({ x: dir, y: 0})
        }
    }

    const startGame = () => {
        setStage(createStage())
        setDropTime(400)
        resetPlayer()
        setGameOver(false)
        setScore(0)
        setRows(0)
        setLevel(1)
    }

    const drop = () => {
        if (rows > (level + 1) *10) {
            setLevel(prev => prev +1)
            setDropTime(updatingDrop)
        }

    
        if (!checkCollision(player, stage, { x: 0, y: 1})) {
            updatePlayerpos({ x: 0, y: 1, collided: false })
        }else {
            if (player.pos.y < 1){
                console.log("Manco Hpta!!!")
                setGameOver(true)
                setDropTime(null)
            }
            updatePlayerpos({ x: 0, y: 0, collided: true })
        }
    }

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode == 40) {
                setDropTime(updatingDrop)
            }
        }
    }

    const dropPlayer = dir => {
        setDropTime(null)
        drop()
    }

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePLayer(-1);
            }   else if (keyCode === 39) {
                movePLayer(1)
            }   else if (keyCode === 40){
                dropPlayer()
            }   else if (keyCode === 38){
                playerRotate(stage, 1)
            }
        }

    }

    useInterval (() => {
        drop()
    }, dropTime)


    return (
        <StyledTetrisWrapper 
        role="button" 
        tabIndex="0" 
        onKeyDown={e => move(e)}
        onKeyUp={keyUp}>
            <StyledTetris>
            <Stage stage={stage} />
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Aprenda jugar lok" />
                ) : (
                <div>
                    <Display text={`Puntos: ${score}`} />
                    <Display text={`Filas: ${rows}`} />
                    <Display text={`Nivel: ${level}`} />
                </div>
                )}
                <StartButton callback={startGame} />
            </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris
