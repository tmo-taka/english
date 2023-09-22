import { FC, useContext, useEffect } from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import { messageContext } from '../contexts/messageContext'

type InputMessage = {
    loading: boolean,
    onPost: (msg:string) => void
}

export const InputMessage: FC<InputMessage> = (props) => {
    const { message, setMessage } = useContext(messageContext);
    const { onPost, loading } = props

    const changedText = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setMessage(e.target.value);
    }

    const stateDisabled = ():boolean => {
        return (message === '') ? true: false;
    }

    useEffect(() => {
        // messageの初期化
        if(loading) { setMessage(''); }
    },[loading])

    return (
        <Form size="large" style={{ width: 800, margin: '0 auto 24px' }}>
            <Row justify="space-between">
                <Col span={21}>
                    <Input type="text" onChange={changedText} value={message} />
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={() => onPost(message)} disabled={stateDisabled()} loading={loading}>送信</Button>
                </Col>
            </Row>
        </Form>
    )
}