import { Button, Form, Icon, Input, Row } from 'antd';
import * as  React from 'react';
import { IProps, IState } from '../component';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        sm: { span: 8 },
        xs: { span: 24 },
    },
    wrapperCol: {
        sm: { span: 16 },
        xs: { span: 24 },
    },
};

const { TextArea } = Input;

const URL_REGEXP = new RegExp(
    "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}",
    "i"
)

export class AddBrickForm extends React.Component<any, IState> {


    constructor(props: any) {
        super(props);
        this.validateLink = this.validateLink.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateETH = this.validateETH.bind(this);
    }

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
        this.props.form.validateFields((err: any, values: any) => {
            if (!err && this.props.onSubmit) {
                // console.log('Received values of form: ', values);
                this.props.onSubmit(values);
            }
        });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
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
                            placeholder="Github Link"
                            autosize={true} />
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
                            placeholder="Title" autosize={true} />
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
                        <TextArea placeholder="Brief Description" autosize={{ minRows: 4, maxRows: 8 }} rows={4} />
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
                            placeholder="ETH" autosize={true} />
                    )}
                </FormItem>

                <FormItem
                    wrapperCol={{ span: 12, offset: 5 }}
                >
                    <Button type="primary" htmlType="submit">
                        Add Your Brick
          </Button>
                </FormItem>
            </Form>
        );
    }
}


export default Form.create()(AddBrickForm);