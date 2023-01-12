import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from "react";
import {Button, Card, Table} from "antd";
import {ListConsumer} from "@/services/consumer/ConsumerController";
import {ColumnsType} from "antd/es/table";
import {ConsumerGender} from "@/pages/Customer/type";

const SetupMenu: React.FC = () => {
    return (
        <PageContainer
            header={{
                title: '客户管理',
            }}
        >
            <ConsumerTable/>
        </PageContainer>
    );
};


const columns: ColumnsType<API.WXConsumer> = [
    {
        title: '客户',
        key: 'name',
        render: (_, record) => (
            <Button type="link">客户名称@微信</Button>
        )
    },
    {
        title: '性别',
        key: 'gender',
        render: (_, record) => (
            <span>{ConsumerGender[record.gender]}</span>
        )
    },
    {
        title: '所属客服',
        key: 'supporter',
        render: (_, record) => (
            <span>xxx</span>
        )
    },
    {
        title: '关注者',
        key: 'followers',
        render: (_, record) => (
            <span>xxx</span>
        )
    },
    {
        title: '客户标签',
        key: 'tags',
        render: (_, record) => (
            <span>xxx</span>
        )
    },
    {
        title: '添加时间',
        key: 'addDate'
    },
    {
        title: '操作',
        key: 'operation',
        render: (_, record) => (
            <Button>查看聊天记录</Button>
        )
    }
]

const ConsumerTable: React.FC = () => {
    const [consumerList, setConsumerList] = useState([] as API.WXConsumer[])

    useEffect(() => {
        ListConsumer({page: 1, pageSize: 20}).then((res) => {
            setConsumerList(res.data.data)
        })
    }, [])

    return (
        <Card title="客户列表">
            <Table columns={columns} dataSource={consumerList}>
            </Table>
        </Card>
    )
}
export default SetupMenu;
