
import * as React from 'react';

/**
 * Child component of Grid that displays inline when
 * there is enough space in the container
 */

export class Cell extends React.Component<ICellProps, {}> {

  constructor() {    
    super();

    this.props = {
      min: 640,
      max: null,
      width: 100,
      padding: 0,
      inline: false
    };
  }

  render() {
    // const { inline, width, padding, children } = this.props
    const style = {
      boxSizing: 'border-box',
      display: this.props.inline ? 'inline-block' : 'block',
      width: this.props.inline ? `${this.props.width * 100}%` : '100%',
      verticalAlign: 'top',
      paddingLeft: this.props.padding,
      paddingRight: this.props.padding,
      position: 'relative',
      minWidth: this.props.min
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
  }
}

export interface ICellProps {
    /** Min-width to display inline */
    min?: number,
    /** Max-width for Cell */
    max?: number,
    /** Width of cell when inline is true - value should be 0–1 */
    width?: number,
    /** Left and right padding for creating gutters */
    padding?: number,
    /** Sets display inline-block and activates width prop */
    inline?: boolean
}

