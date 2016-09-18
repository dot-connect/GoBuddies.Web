import * as React from 'react';

export interface CarouselItemDef{
    label:string;
    key:string;
} 

export interface CarouselItemProps {
    isSelected:boolean;
    label:string;
    width:number;
    itemKey:string;
    index:number;
    onClick:Function;
}

export interface CarouselItemState {

}

export class CarouselItem extends React.Component<CarouselItemProps,CarouselItemState>{
    constructor(props:CarouselItemProps){
        super(props);
        this.state = {};
        this.onClick = this.onClick.bind(this); 
    }
    
    onClick(e:React.SyntheticEvent){
        let props = this.props 
        props.onClick(props.index,props.itemKey);
    }

    shouldComponentUpdate(props:CarouselItemProps){
        return props.index !== this.props.index ||
            props.isSelected !== this.props.isSelected ||
            props.label !== this.props.label ||
            props.width !== this.props.width ||
            props.itemKey !== this.props.itemKey;
    }

    render(){
        let props = this.props;
        return (
            <div className="rc-item" 
            data-selected={props.isSelected} 
            onClick={this.onClick}
            style={{width:props.width+'px'}} >{props.label}</div>
        );
    }
}