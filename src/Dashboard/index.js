import React, {Component} from 'react';
import update from 'immutability-helper';
import {Row, Button} from 'antd';
import {cloneDeep} from 'lodash';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';
import Card from './dnd/Card';
import Normal from './dnd/Normal';
import Modal from './Modal';
import Error from './ErrorPortal';
import 'antd/dist/antd.css';
import './index.css';

@DragDropContext(HTML5Backend)
export default class Index extends Component {
    state = {
        isEditable: false,
        modalVisible: false,
        saving: false,
    };
    isMount = true;

    // 仅在首次加载时更新面板
    shouldComponentUpdate(nextProps) {
        return nextProps === this.props;
    }

    componentWillUnmount() {
        this.isMount = false;
    }

    componentDidMount() {
        this.query();
    }

    query = () => {
        // todo data mock
        let res = {
            'data': [
                {'id': '1', 'span': 24, 'height': 300, 'name': '云环境概览', 'model': 'EvnSummary'},
                {'id': '2', 'span': 24, 'height': 300, 'name': '私有云资源统计', 'model': 'PrivateCloudResourceStatistics'},
                {'id': '3', 'span': 24, 'height': 300, 'name': '私有云投产情况', 'model': 'PrivateCloudProduction'},
            ],
            'success': true,
        };

        if (res.success) {
            const cards = res.data.map((item) => {
                let module = <Error {...item}/>;
                try {
                    // eslint-disable-next-line
                    const Portal = require(`./${item.model}`).default;
                    module = <Portal/>;
                } catch (e) {
                    throw e;
                }
                return {...item, module};
            });
            this.isMount && this.setState({cards});
            this._cards = cloneDeep(cards);
        }

        res = {
            'data': [
                {'id': '1', 'span': 24, 'height': 300, 'name': '云环境概览', 'model': 'EvnSummary'},
                {'id': '2', 'span': 24, 'height': 300, 'name': '私有云资源统计', 'model': 'privateCloudResourceStatistics'},
                {'id': '3', 'span': 24, 'height': 300, 'name': '私有云投产情况', 'model': 'privateCloudProduction'},
            ],
            'success': true,
        };
        if (res.success) {
            this.isMount && this.setState({items: res.data});
        }
    };

    // 修改
    edit = () => this.setState({isEditable: true});
    // 取消
    cancel = () => {
        this.setState({isEditable: false, cards: this._cards});
    };
    // 筛选
    filter = () => {
        this.setState({modalVisible: true});
    };
    // 保存
    save = () => {
        const cards = this.state.cards.map((item) => {
            return {
                id: item.id, span: item.span, height: item.height, name: item.name, model: item.model,
            };
        });
        this._cards = cloneDeep(this.state.cards);
        console.log('cards', JSON.stringify(cards));
    };
    // 修改面板宽度
    onChangeWidth = (id, val) => {
        const newCards = [];
        this.state.cards.forEach((card) => {
            if (card.id === id) {
                card.span = parseInt(val, 10);
            }
            newCards.push(card);
        });
        this.setState({cards: newCards});
    };
    // 修改面板高度
    onChangeHeight = (id, val) => {
        const newCards = [];
        this.state.cards.forEach((card) => {
            if (card.id === id) {
                card.height = parseInt(val, 10);
            }
            newCards.push(card);
        });
        this.setState({cards: newCards});
    };
    // 关闭面板
    onClose = (id) => {
        const newCards = [];
        this.state.cards.forEach((card) => {
            if (card.id !== id) {
                newCards.push(card);
            }
        });
        this.setState({cards: newCards});
    };
    // 拖动面板
    moveCard = (dragIndex, hoverIndex) => {
        const {cards} = this.state;
        const dragCard = cards[dragIndex];

        this.setState(update(this.state, {cards: {$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]}}));
    };

    render() {
        const {items = [], cards = [], saving} = this.state;
        const isEditable = this.state.isEditable;
        const modalProps = {
            visible: this.state.modalVisible,
            onOk: (checkedList) => {
                const [newCards, cards = [], lists] = [[], cloneDeep(this.state.cards), this.state.items];
                // 移除面板
                cards.forEach(card => checkedList.includes(card.id) && newCards.push(card));
                // 追加面板，放在页面底部，使用默认尺寸
                checkedList.forEach((id) => {
                    if (!cards.some(card => card.id === id)) {
                        const card = lists.filter(item => item.id === id)[0];
                        try {
                            // eslint-disable-next-line
                            const Portal = require(`./${card.model}`);
                            card.module = <Portal/>;
                        } catch (e) {
                            card.module = <Error/>;
                        }
                        newCards.push(card);
                    }
                });
                this.setState({modalVisible: false, cards: newCards});
            },
            onCancel: () => {
                this.setState({modalVisible: false});
            },
            items,
            cards,
        };

        return (
            <div className="content-inner dashboard">
                <div className="buttons">
                    {this.state.isEditable ? (
                        <div>
                            <Button type="primary" icon="rollback" onClick={this.cancel} size="small">取消</Button>
                            <Button type="primary" icon="filter" onClick={this.filter} size="small">筛选</Button>
                            <Button type="primary" icon="save" onClick={this.save} size="small"
                                    loading={saving}>保存</Button>
                        </div>) : (
                        <div>
                            <Button type="primary" onClick={this.edit} size="small">
                                <i className="iconfont icon-buju" style={{fontSize: 14, marginRight: 8}}/>布局调整
                            </Button>
                        </div>)}
                </div>
                <Row gutter={10} className={classNames('edit', {editable: isEditable})}>
                    {cards.map((card, i) => {
                        return isEditable ? (
                            <Card
                                key={card.id}
                                index={i}
                                id={card.id}
                                span={card.span}
                                height={card.height}
                                module={card.module}
                                moveCard={this.moveCard}
                                onChangeWidth={this.onChangeWidth}
                                onChangeHeight={this.onChangeHeight}
                                onClose={this.onClose}
                            />) : (
                            <Normal
                                key={card.id}
                                span={card.span}
                                height={card.height}
                                module={card.module}
                            />);
                    })}
                </Row>
                <Modal {...modalProps}/>
            </div>);
    }
}
