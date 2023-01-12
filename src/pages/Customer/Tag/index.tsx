import {PageContainer} from '@ant-design/pro-components';
import React, {useState} from "react";
import {Button, Card, Form, Select, Space, Table, Tabs, TabsProps, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import FormItem from "antd/es/form/FormItem";
import {Divider} from "antd/es";

const SetupMenu: React.FC = () => {
    return (
        <PageContainer
            header={{
                title: '标签管理',
            }}
        >
            <OperationPane/>
            <TagTable/>
        </PageContainer>
    );
};

const OperationPane: React.FC = () => {
    return (
        <Card style={{margin: "8px 0"}}>
            <Space>
                <Button type="primary">创建标签组</Button>
            </Space>
        </Card>
    )
}

const TagTable: React.FC = () => {
    const [tagGroupData, setTagGroupData] = useState([{}] as any[])
    const [tagData, setGroupData] = useState([{}] as any[])

    const tagGroupColumns: ColumnsType<any> = [
        {
            title: '标签组',
            key: 'group',
            render: (_, record) => (
                <span>xxx</span>
            )
        },
        {
            title: '所有者类型',
            key: 'ownerType',
            render: (_, record) => (
                <span>xxx</span>
            )
        },
        {
            title: '标签',
            key: 'tags',
            width: "70%",
            render: (_, record) => (
                <Space>
                    <Tag>xx1</Tag>
                    <Tag>xx2</Tag>
                    <Tag>xx3</Tag>
                </Space>
            )
        },
        {
            title: '操作',
            key: 'operation',
            render: (_, record) => (
                <Button type="dashed">修改</Button>
            )
        }
    ]

    const TagGroupTab: React.ReactNode = (
        <>
            <Form layout="inline">
                <FormItem label="标签组">
                    <Select placeholder="标签组筛选" showSearch={true}></Select>
                </FormItem>
                <FormItem label="所有者类型">
                    <Select placeholder="所有者类型筛选"></Select>
                </FormItem>
            </Form>
            <Divider/>
            <Table columns={tagGroupColumns} dataSource={tagGroupData}>

            </Table>
        </>
    )

    const tagColumns: ColumnsType<any> = [
        {
            title: '标签名称',
            key: 'tag',
            render: (_, record) => (
                <span>xxx</span>
            )
        },
        {
            title: '所有者类型',
            key: 'ownerType',
            render: (_, record) => (
                <span>xxx</span>
            )
        },
        {
            title: '所属标签组',
            key: 'tags',
            render: (_, record) => (
                <span>xxx</span>
            )
        }
    ]

    const TagTab: React.ReactNode = (
        <>
            <Form layout="inline">
                <FormItem label="标签组">
                    <Select placeholder="标签组筛选" showSearch={true}></Select>
                </FormItem>
                <FormItem label="所有者类型">
                    <Select placeholder="所有者类型筛选"></Select>
                </FormItem>
            </Form>
            <Divider/>
            <Table columns={tagColumns} dataSource={tagData}>

            </Table>
        </>
    )

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `标签组列表`,
            children: TagGroupTab,
        },
        {
            key: '2',
            label: `标签列表`,
            children: TagTab,
        }
    ];

    return (
        <Card>
            <Tabs defaultActiveKey="1" items={items}/>
        </Card>
    )
}
export default SetupMenu;
