
import * as React from 'react';
import { throttle } from 'lodash';
import {ICellProps} from './grid-cell.layout';

/**
 * Parent component for Cell that calculates available
 * width for setting Cells inline.
 */

export class Grid extends React.Component<IGridProps, IGridState> {

  private throttledUpdateWidth: any;
  private root: HTMLElement;
  
  constructor() {
    super();
   
    this.props = {
      min: 640,
      gutter: 0,
      throttleResize: 200
    }

    this.updateWidth = this.updateWidth.bind(this);
    this.getMinTotal = this.getMinTotal.bind(this);
    this.state = {
      width: 768
    }
  }

  updateWidth() {
    const el = this.root;
    const { width } = el.getBoundingClientRect()
    this.setState({ width })
  }

  getMinTotal(): number {
    let total = 0
    React.Children.map(this.props.children, child => {
      let childMin = (child as React.ReactElement<ICellProps>).props.min;
      total += childMin;
    });
    return total;
  }

  componentDidMount() {
    this.updateWidth()
    if (window) {
      this.startListeningForResize();
    }
  }

  componentWillUnmount() {
    if (window) {
      this.stopListeningForResize();
    }
  }

  componentDidUpdate(prevProps) {
    if (window && prevProps.throttleResize !== this.props.throttleResize) {
      this.stopListeningForResize();
      this.startListeningForResize();
    }
  }

  startListeningForResize() {
    this.throttledUpdateWidth = throttle(this.updateWidth, this.props.throttleResize);
    window.addEventListener('resize', this.throttledUpdateWidth);
  }

  stopListeningForResize() {
    window.removeEventListener('resize', this.throttledUpdateWidth);
  }

  render() {
    const { children, gutter } = this.props
    const { width } = this.state
    const style = {
      overflow: 'hidden',
      marginLeft: -gutter,
      marginRight: -gutter,
      position: 'relative'
    };

    // min width denominator
    const dmin = this.getMinTotal();
    // min values of max cells
    let maxmins = [];
    // max values of max cells
    let maxes = [];

    React.Children.map(this.props.children, child => {
      let c = child as React.ReactElement<ICellProps>;
      if (c.props.max && c.props.min / dmin * width > c.props.max) {
        maxes.push(c.props.max)
        maxmins.push(c.props.min)
      }
    });

    // sum of max cell values
    const maxSum = maxes.length ? maxes.reduce((a, b) => { return a + b }) : 0;
    // sum of min values for max cells
    const maxminSum = maxmins.length ? maxmins.reduce((a, b) => { return a + b }) : 0;
    // percent offset from remaining min cell widths
    const offset = (maxSum / width) / ((children ? (children as any[]).length : 0) - maxes.length);
    const denominator = dmin - maxminSum;

    // set child props
    const modifiedChildren = React.Children.map(children, child => {
      let c = child as React.ReactElement<ICellProps>;
      let childWidth = c.props.min / denominator - offset;
      if (c.props.max && c.props.min / dmin * width > c.props.max) {
        childWidth = c.props.max / width;
      }

      let childProps: ICellProps = {
        width: childWidth,
        inline: dmin < width,
        padding: c.props.padding,
        min: c.props.min,
        max: c.props.max
      };

      if (!c.props.padding) {
        childProps.padding = gutter
      }

      return React.cloneElement(c, childProps);
    })

    return (
      <div ref={root => this.root = root} style={style}>
        {modifiedChildren}
      </div>
    )
  }
}

interface IGridProps {
    /** Sets a default min prop on child Cell components */
    min?: number,
    /** Sets negative left and right margins to compensate for Cell padding prop */
    gutter?: number,
    /** Milliseconds for throttling window resize listener */
    throttleResize?: number,
}

interface IGridState {
  width: number;
}

