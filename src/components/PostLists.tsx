import { FC, useState, useContext } from 'react';
import { Avatar, Col, Card, ConfigProvider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LoadingCard } from './LoadingCard';
import { postContext } from '../contexts/postContext'

const { Meta } = Card;

const PostCard = (props: {post:string}) => {
    const {post} = props
    if(post !== '') {
      // NOTE: loading中でない
        return (
            <Card >
                <Meta
                    avatar={<Avatar style={{ backgroundColor: '#F00' }} icon={<UserOutlined />} />}
                    title={post}
                    style={{textAlign: 'left', whiteSpace: 'normal'}}
                />
            </Card>
        )
    } else {
        return <LoadingCard />
    }
}

export const PostLists = () => {
    const {posts} = useContext(postContext);
    const postLists = posts.map((post,index) => {
        return (
            <Col offset={0} span={20} key={post + index}>
                <ConfigProvider
                    theme={{
                    token: {
                        colorBgContainer: '#87d068'
                    }
                    }}
                >
                    <PostCard post={post} />
                </ConfigProvider>
            </Col>
        )
    })
    return postLists
}