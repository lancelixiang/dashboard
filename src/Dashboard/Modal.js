import React from 'react';
import {Checkbox, Row, Col, Modal} from 'antd';

const CheckboxGroup = Checkbox.Group;

class modal extends React.Component {
    state = {};

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            const checkList = nextProps.items.map((item) => {
                return {label: item.name, value: item.id};
            });
            const checkedList = nextProps.cards.map(card => card.id);

            this.setState({
                checkList,
                checkedList,
                indeterminate: !!checkedList.length && (checkedList.length < checkList.length),
                checkedAll: checkedList.length === checkList.length,
            });
        }
    }

    onCheckAllChange = (e) => {
        const checkedList = this.state.checkList.map(item => item.value);
        this.setState({
            checkedList: e.target.checked ? checkedList : [],
            indeterminate: false,
            checkedAll: e.target.checked,
        });
    };

    onChange = (checkedList) => {
        const checkList = this.state.checkList;
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < checkList.length),
            checkedAll: checkedList.length === checkList.length,
        });
    };

    render() {
        const {visible, onCancel, onOk} = this.props;
        const {
            indeterminate = false, checkedAll = false, checkList = [], checkedList = [],
        } = this.state;
        const modalOpts = {
            title: '模块筛选',
            visible,
            onOk: () => onOk(this.state.checkedList),
            onCancel,
        };
        return (
            <Modal {...modalOpts}>
                <div>
                    <div style={{borderBottom: '1px solid #E9E9E9'}}>
                        <Checkbox
                            indeterminate={indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={checkedAll}
                        >全选
                        </Checkbox>
                    </div>
                    <br/>
                    <CheckboxGroup value={checkedList} onChange={this.onChange}>
                        <Row>
                            {checkList.map(item => <Col span={24} key={item.value}><Checkbox
                                value={item.value}>{item.label}</Checkbox></Col>)}
                        </Row>
                    </CheckboxGroup>
                </div>
            </Modal>
        );
    }
}

export default modal;
