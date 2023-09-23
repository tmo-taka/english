import { FC, useContext } from 'react';
import { Avatar, Col, Card, Form, Row, Button, Input, Collapse } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LoadingCard } from './LoadingCard'
import { chatContext } from '../contexts/chatContext'
import { enChatContext } from '../contexts/enChatContext'

const ChatCard = (props: {chat:string, index: number}) => {
    const { Meta } = Card;
    const { TextArea } = Input
    const {chat, index} = props
    const {enChats} = useContext(enChatContext);
    if(chat !== '') {
        // NOTE: loading中でない
        return (
            <Card >
                <Meta
                    avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
                    title={chat}
                    style={{borderBottom: 'solid 1px #CCC', textAlign: 'left', whiteSpace: 'normal', marginBottom: 8}}
                />
                <Form layout='vertical'>
                    <Form.Item<FieldType>
                        label="上記を英語に訳してみましょう！"
                        name="translateToEnglish"
                    >
                        <Row align='bottom'>
                            <Col flex={5}>
                                <TextArea />
                            </Col>
                            <Col flex={1}>
                                <Button type="primary" htmlType="submit">
                                確認
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
                <Collapse
                    style={{ textAlign: 'left'}}
                    items={[{ key: index, label: '回答をみる', children: <p>{enChats[index]}</p> }]}
                />
            </Card>
        )
    } else {
        return <LoadingCard />
    }
}

export const ChatLists= () => {
    const {chats} = useContext(chatContext);
    const chatLists = chats.map((chat,index) => {
        return (
            <Col offset={24} span={20} key={chat + index}>
                <ChatCard chat={chat} index={index} />
            </Col>
        );
    });
    return chatLists
};