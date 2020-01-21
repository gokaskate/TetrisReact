import React from 'react'
import Cell from './Cell'
import { StyledStage } from './styles/StyledStage'

const cell = (cell, x) => <Cell key={x} type={cell[0]} />
const column = row => row.map(cell)

const Stage = ({stage}) => {
    return (
        <StyledStage width={stage[0].length} height={stage.length}>
           { stage.map(column) }
        </StyledStage>
    )
}

export default Stage
