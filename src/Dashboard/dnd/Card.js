import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Select, InputNumber, Icon} from 'antd';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from './ItemTypes';
import './style.css';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
  render() {
    const {
      id, span, height, module, onChangeWidth, onChangeHeight, onClose, isDragging, connectDragSource, connectDropTarget, connectDragPreview,
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragPreview(connectDropTarget(
      <div style={{opacity, height}} className={`ant-col-sm-24 ant-col-md-${span}`}>
        {connectDragSource(
          <div className="handle"/>)}
            <div className="settings">
              <label>宽：</label>
              <Select defaultValue={`${span}`} size="small" onChange={val => onChangeWidth(id, val)}>
                <Select.Option value="8">33.3%</Select.Option>
                <Select.Option value="12">50%</Select.Option>
                <Select.Option value="16">66.7%</Select.Option>
                <Select.Option value="24">100%</Select.Option>
              </Select>
              <label>高：</label>
              <InputNumber
                min={100}
                step={10}
                defaultValue={height}
                size="small"
                onChange={val => onChangeHeight(id, val)}
              />
              <a onClick={() => onClose(id)}><Icon type="close"/></a>
            </div>
          {module}
      </div>, ));
  }
}
