import { Button, DatePicker, Form, Icon, Input, Row, Tag, Tooltip } from 'antd';
import * as  React from 'react';
import { IProps, IState } from '../component';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        sm: { span: 24 },
        xs: { span: 24 },
    },
    wrapperCol: {
        sm: { span: 24 },
        xs: { span: 24 },
    },
};

const { TextArea } = Input;

const URL_REGEXP = new RegExp(
    'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}',
    'i',
);

export class AddBrickForm extends React.Component<any, any> {

    public input: any;

    constructor(props: any) {
        super(props);
        this.state = this.state || { tags: [] };
        this.validateLink = this.validateLink.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateETH = this.validateETH.bind(this);
        this.showInput = this.showInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputConfirm = this.handleInputConfirm.bind(this);
        this.onExpiredChanged = this.onExpiredChanged.bind(this);

    }
    public saveInputRef = (input: any) => this.input = input;

    public validateLink(rule: any, value: any, callback: any) {
        // const form = this.props.form;
        if (value && !URL_REGEXP.test(value)) {
            callback('Link is invalid!');
        }
        callback();
    }

    public validateETH(rule: any, value: any, callback: any) {
        if (value && !(!isNaN(value) && value > 0.01)) {
            callback('ETH is invalid!');
        }
        callback();
    }

    public handleSubmit(e: any) {
        e.preventDefault();
        const self = this;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err && this.props.onSubmit) {
                values.tags = self.state.tags;
                this.props.onSubmit(values);
            }
        });
    }

    public handleClose = (removedTag: any) => {
        const tags = this.state.tags.filter((tag: any) => tag !== removedTag);
        this.setState({ tags });
    }

    public handleInputChange(e: any) {
        this.setState({ inputValue: e.target.value });
    }

    public handleInputConfirm() {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            inputValue: '',
            inputVisible: false,
            tags,
        });
    }

    public showInput() {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    public onExpiredChanged() {
        //
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        const { tags, inputVisible, inputValue } = this.state;

        return (
            <div className="main-container form-wrap-outer">
                <Form className="form-wrap" layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="GitHub Issue Link"
                    >
                        {getFieldDecorator('url', {
                            rules: [{
                                // tslint:disable-next-line:object-literal-sort-keys
                                required: true, message: 'Please input your github link!',
                            }, {
                                validator: this.validateLink,
                            }],
                        })(
                            <Input prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Github Link" />,
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Title">
                        {getFieldDecorator('title', {
                            rules: [{
                                // tslint:disable-next-line:object-literal-sort-keys
                                required: true, message: 'Please input title!',
                            }],
                        })(
                            <Input
                                prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Title" />,
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Expired">
                        {getFieldDecorator('expired', {
                            rules: [{
                                // tslint:disable-next-line:object-literal-sort-keys
                                required: true, message: 'Please set expired!',
                            }],
                        })(
                            <DatePicker
                                className="date-time"
                                showTime={true}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="Select time" onChange={this.onExpiredChanged} />,
                            // <Input
                            //     prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            //     placeholder="Title" />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Tags">
                        {getFieldDecorator('tags', {
                            rules: [],
                        })(
                            <div>
                                {tags.map((tag: any, index: number) => {
                                    const isLongTag = tag.length > 20;
                                    const tagElem = (
                                        <Tag key={tag} closable={true}
                                            // tslint:disable-next-line:jsx-no-lambda
                                            afterClose={() => this.handleClose(tag)}>
                                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                        </Tag>
                                    );
                                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                                })}
                                {inputVisible && (
                                    <Input
                                        ref={this.saveInputRef}
                                        type="text"
                                        size="small"
                                        style={{ width: 78 }}
                                        value={inputValue}
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputConfirm}
                                        onPressEnter={this.handleInputConfirm}
                                    />
                                )}
                                {!inputVisible && (
                                    <Tag
                                        onClick={this.showInput}
                                        style={{ background: '#fff', borderStyle: 'dashed' }}
                                    >
                                        <Icon type="plus" /> New Tag
                                </Tag>
                                )}
                            </div>,
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Description"
                    >
                        {getFieldDecorator('description', {
                            rules: [{
                                // tslint:disable-next-line:object-literal-sort-keys
                                required: true, message: 'Please input description!',
                            }],
                        })(
                            <TextArea placeholder="Brief Description" autosize={{ minRows: 4, maxRows: 8 }} rows={4} />,
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="ETH Value">
                        {getFieldDecorator('value', {
                            rules: [{
                                // tslint:disable-next-line:object-literal-sort-keys
                                required: true, message: 'Please input ETH!',
                            }, {
                                validator: this.validateETH,
                            }],
                        })(
                            <Input
                                prefix={<i style={{ color: 'rgba(0,0,0,.25)' }} className="fab fa-ethereum" />}
                                placeholder="ETH" />,
                        )}
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 0 }} >
                        <Button type="primary" htmlType="submit">
                            Add Your Brick
          </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(AddBrickForm);
