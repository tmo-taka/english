import { FC } from 'react';
import { Card } from 'antd';

export const LoadingCard:FC = () => {
    return (
        <Card loading={true} />
    )
}