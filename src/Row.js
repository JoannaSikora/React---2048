import React from 'react'
import Cell from './Cell'


//display and render the cells in each row
//passes down the value to each cell

const Row = (props) => {
  return (
    <tr>
      {props.row.map((cell, i) => (<Cell key={i} cellValue={cell} />))}
    </tr>
  );
};

export default Row;
