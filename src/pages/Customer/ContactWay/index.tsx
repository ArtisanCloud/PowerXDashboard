import {
	ActionType,
	FooterToolbar,
	PageContainer,
	ProColumns,
	ProFormSelect,
	ProFormText,
	ProTable
} from '@ant-design/pro-components';
import styles from './index.less';
import {useEffect, useRef, useState} from "react";
import {QueryEmployeeList} from "@/services/user/UserController";
import {DEFAULT_PAGE, MAX_PAGE_SIZE} from "@/constants";
import {API_RETURN_CODE_INIT} from "@/constants/api";
import {message} from "antd/es";
import {QueryContactWayGroupList, UpdateContactWayGroup} from "@/services/contactWay/ContactWayGroupController";
import CollapsedTags from "@/components/Columns/CollapsedTags";
import moment from "moment";
import FileSaver from 'file-saver';
import {Button, Col, Divider, Dropdown, Menu, Modal, Row, Tag} from "antd";
import {history} from "umi";
import {
	CaretDownOutlined,
	CloudDownloadOutlined, DeleteOutlined,
	FolderFilled,
	MoreOutlined,
	PlusOutlined,
	PlusSquareFilled
} from "@ant-design/icons";
import {ModalForm} from "@ant-design/pro-form";
import JSZip from "jszip";
import {QueryContactWayList} from "@/services/contactWay/ContactWayController";

const ContactWayList: React.FC = () => {
	const [currentGroup, setCurrentGroup] = useState<API.ContactWayGroup>();
	const [itemDetailVisible, setItemDetailVisible] = useState(false);
	const [currentItem, setCurrentItem] = useState<API.ContactWay>();
	const [selectedItems, setSelectedItems] = useState<API.ContactWay[]>([]);
	const [filterGroupID, setFilterGroupID] = useState('0');
	const [groupItems, setGroupItems] = useState<API.ContactWayGroup[]>([]);
	const [groupItemsTimestamp, setGroupItemsTimestamp] = useState(Date.now);
	const [createGroupVisible, setCreateGroupVisible] = useState(false);
	const [batchUpdateVisible, setBatchUpdateVisible] = useState(false);
	const [editGroupVisible, setEditGroupVisible] = useState(false);
	const [allEmployees, setAllEmployees] = useState<API.Employee[]>([]);
	const actionRef = useRef<ActionType>();


	useEffect(() => {

		const HandleLoadEmployees = async () => {
			const rs: API.ResponseGetEmployeeList = await QueryEmployeeList({
				roleID: "",
				page: DEFAULT_PAGE,
				pageSize: MAX_PAGE_SIZE,
			});

			if (rs.meta.return_code === API_RETURN_CODE_INIT) {
				setAllEmployees(
					rs?.data?.data?.map((item: API.Employee) => {
						return {
							label: item.name,
							value: item.employeeID,
							...item,
						};
					}) || [],
				);
			} else {
				message.error(rs.meta.result_message);
			}
		}

		HandleLoadEmployees().catch((e) => {
			console.error('HandleLoadEmployees', e.response);
		})

	}, []);

	useEffect(() => {
		const HandleQueryGroup = async () => {
			const rs: API.ResponseQueryContactWayGroupList = await QueryContactWayGroupList()
			if (rs.meta.return_code === API_RETURN_CODE_INIT) {
				setGroupItems(rs.data)
			} else {
				message.error(rs.meta.result_message);
			}
		}

		HandleQueryGroup().catch((e) => {
			console.error('HandleLoadEmployees', e.response);
		})

	}, [groupItemsTimestamp]);


	const columns: ProColumns<API.ContactWay>[] = [
		{
			title: 'ID',
			dataIndex: 'uuid',
			valueType: 'text',
			hideInTable: true,
			hideInSearch: true,
			fixed: 'left',
		},
		{
			title: '?????????',
			dataIndex: 'codeURL',
			valueType: 'image',
			hideInSearch: true,
			width: 80,
			fixed: 'left',
			render: (dom, item) => {
				return (
					<div className={'qrcodeWrapper'}>
						<img
							src={item.codeURL}
							onClick={() => {
								setItemDetailVisible(true);
								setCurrentItem(item);
							}}
							className={'qrcode clickable'}
							alt={item.name}
						/>
					</div>
				);
			},
		},
		{
			title: '??????',
			dataIndex: 'name',
			valueType: 'text',
			fixed: 'left',
		},
		{
			title: '????????????',
			dataIndex: 'staffs',
			valueType: 'text',
			hideInSearch: true,
			width: 210,
			// render: (_, item) => {
			// 	let employees: any[] = [];
			// 	item.user?.forEach((schedule) => {
			// 		if (schedule.staffs) {
			// 			staffs = [...staffs, ...schedule.staffs];
			// 		}
			// 	});
			// 	if (item.schedule_enable === True) {
			// 		staffs = uniqWith(staffs, (a, b) => a.ext_staff_id === b.ext_staff_id);
			// 		return <CollapsedEmployees limit={2} staffs={staffs}/>;
			// 	}
			// 	return <CollapsedEmployees limit={2} staffs={item.staffs}/>;
			// },
		},
		{
			title: '????????????',
			dataIndex: 'ext_staff_ids',
			valueType: 'text',
			hideInTable: true,
			// renderFormItem: () => {
			// 	return <StaffTreeSelect options={allEmployees}/>;
			// },
		},
		{
			title: '????????????',
			dataIndex: 'backup_staffs',
			valueType: 'text',
			hideInSearch: true,
			width: 210,
			// render: (_, item) => {
			// 	return <CollapsedEmployees limit={2} staffs={item.backup_staffs}/>;
			// },
		},
		{
			title: '??????',
			dataIndex: 'customer_tags',
			valueType: 'text',
			ellipsis: true,
			hideInSearch: true,
			width: 210,
			render: (_, item) => {
				return <CollapsedTags limit={3} tags={item.wxTags}/>;
			},
		},
		{
			title: '????????????',
			dataIndex: 'add_customer_count',
			valueType: 'digit',
			hideInSearch: true,
			sorter: true,
			showSorterTooltip: false,
			width: 120,
			tooltip: '??????????????????????????????????????????????????????????????????????????????',
		},
		{
			title: '????????????',
			dataIndex: 'created_at',
			valueType: 'dateRange',
			sorter: true,
			filtered: true,
			render: (dom, item) => {
				return (
					<div
						dangerouslySetInnerHTML={{
							__html: moment(item.createdAt).format('YYYY-MM-DD HH:mm').split(' ').join('<br />'),
						}}
					/>
				);
			},
		},
		{
			title: '??????',
			width: 180,
			valueType: 'option',
			render: (_, item: API.ContactWay) => [
				<a
					key='detail'
					onClick={() => {
						setItemDetailVisible(true);
						setCurrentItem(item);
					}}
				>
					??????
				</a>,
				<a
					key='download'
					onClick={() => {
						if (item?.codeURL) {
							FileSaver.saveAs(item?.codeURL, `${item.name}.png`);
						}
					}}
				>
					??????
				</a>,
				<Dropdown
					key='more'
					overlay={
						<Menu>
							<Menu.Item
								key='edit'
								onClick={() => {
									history.push(`/staff-admin/customer-growth/contact-way/edit?id=${item.uuid}`);
								}}
							>
								??????
							</Menu.Item>
							<Menu.Item
								key='copy'
								onClick={() => {
									history.push(`/staff-admin/customer-growth/contact-way/copy?id=${item.uuid}`);
								}}
							>
								??????
							</Menu.Item>
							<Menu.Item
								key='delete'
								onClick={() => {
									Modal.confirm({
										title: `???????????????`,
										content: `?????????????????????${item.name}???????????????`,
										okText: '??????',
										okType: 'danger',
										cancelText: '??????',
										onOk() {
											// return HandleRequest({ids: [item.id]}, Delete, () => {
											// 	actionRef.current?.clearSelected?.();
											// 	actionRef.current?.reload?.();
											// });
										},
									});
								}}
							>??????</Menu.Item>

						</Menu>
					}
					trigger={['hover']}
				>
					<a style={{display: 'flex', alignItems: 'center'}}>
						??????
						<CaretDownOutlined style={{fontSize: '8px', marginLeft: '3px'}}/>
					</a>
				</Dropdown>,
			],
		},
	];

	// @ts-ignore
	// @ts-ignore
	return (
		<PageContainer
			fixedHeader
			header={{
				title: '??????????????????',
				subTitle: (
					<a
						target={'_blank'}
						className={styles.tipsLink}
						// href={'https://www.openscrm.cn/wiki/contact-way'}
					>
						????????????????????????
					</a>
				),
			}}
			extra={[
				<Button
					key='create'
					type='primary'
					icon={<PlusOutlined style={{fontSize: 16, verticalAlign: '-3px'}}/>}
					onClick={() => {
						history.push('/staff-admin/customer-growth/contact-way/create');
					}}
				>
					????????????
				</Button>,
			]}
		>
			<ProTable<API.ContactWay>
				style={{marginTop: 64}}
				actionRef={actionRef}
				className={'table'}
				scroll={{x: 'max-content'}}
				columns={columns}
				rowKey='id'
				pagination={{
					pageSizeOptions: ['5', '10', '20', '50', '100'],
					pageSize: 5,
				}}
				toolBarRender={false}
				bordered={false}
				tableAlertRender={false}
				rowSelection={{
					onChange: (_, items) => {
						setSelectedItems(items);
					},
				}}
				tableRender={(_, dom) => (
					<div className={styles.mixedTable}>
						<div className={styles.leftPart}>
							<div className={styles.header}>
								<Button
									key='1'
									className={styles.button}
									type='text'
									onClick={() => setCreateGroupVisible(true)}
									icon={<PlusSquareFilled style={{color: 'rgb(154,173,193)', fontSize: 15}}/>}
								>
									????????????
								</Button>
							</div>
							<Menu
								onSelect={(e) => {
									setFilterGroupID(e.key as string);
								}}
								defaultSelectedKeys={['0']}
								mode='inline'
								className={styles.menuList}
							>
								<Menu.Item
									icon={<FolderFilled style={{fontSize: '16px', color: '#138af8'}}/>}
									key='0'
								>
									??????
								</Menu.Item>
								{groupItems.map((item) => (
									<Menu.Item
										icon={<FolderFilled style={{fontSize: '16px', color: '#138af8'}}/>}
										key={item.uuid}
									>
										<div className={styles.menuItem}>
											{item.name}
											<span className={styles.count}
														style={{marginRight: item.contactWays ? 16 : 0}}>{item.contactWays.length}</span>
										</div>

										<Dropdown
											className={'more-actions'}
											overlay={
												<Menu
													onClick={(e) => {
														e.domEvent.preventDefault();
														e.domEvent.stopPropagation();
													}}
												>
													<Menu.Item
														onClick={() => {
															setCurrentGroup(item);
															setEditGroupVisible(true);
														}}
														key='edit'
													>
														????????????
													</Menu.Item>
													<Menu.Item
														onClick={() => {
															// showDeleteGroupConfirm(item);
														}}
														key='delete'
													>
														????????????
													</Menu.Item>
												</Menu>
											}
											trigger={['hover']}
										>
											<MoreOutlined style={{color: '#9b9b9b', fontSize: 18}}/>
										</Dropdown>

									</Menu.Item>
								))}
							</Menu>
						</div>
						<div className={styles.rightPart}>
							<div className={styles.tableWrap}>{dom}</div>
						</div>
					</div>
				)}
				params={{
					group_id: filterGroupID !== '0' ? filterGroupID : '',
				}}
				request={async (params, sort, filter) => {
					console.log(params, sort, filter)
					const queries: API.RequestQueryContactWayList = {
						groupUUID: params.group_id!,
						name: "",
						userID: "",
					}
					const rs: API.ResponseQueryContactWayList = await QueryContactWayList(queries)

					return {
						data: rs.data || [],
					}


				}}
				dateFormatter='string'
			/>

			{selectedItems?.length > 0 && (
				// ???????????????????????????
				<FooterToolbar>
          <span>
            ????????? <a style={{fontWeight: 600}}>{selectedItems.length}</a> ??? &nbsp;&nbsp;
						<span></span>
          </span>
					<Divider type='vertical'/>
					<Button
						type='link'
						onClick={() => {
							actionRef.current?.clearSelected?.();
						}}
					>
						????????????
					</Button>
					<Button onClick={() => setBatchUpdateVisible(true)}>????????????</Button>
					<Button
						icon={<CloudDownloadOutlined/>}
						type={'primary'}
						onClick={() => {
							Modal.confirm({
								title: `?????????????????????`,
								content: `???????????????????????????${selectedItems.length}??????????????????`,
								okText: '??????',
								cancelText: '??????',
								onOk: async () => {
									const zip = new JSZip();
									// eslint-disable-next-line no-restricted-syntax
									for (const item of selectedItems) {
										if (item?.codeURL) {
											// eslint-disable-next-line no-await-in-loop
											const img = (await fetch(item?.codeURL)).blob();
											zip.file(`${item.name}_${item.uuid}.png`, img);
										}
									}
									const content = await zip.generateAsync({type: 'blob'});
									FileSaver.saveAs(content, `????????????_${moment().format('YYYY_MM_DD')}.zip`);
									actionRef.current?.clearSelected?.();
									return true;
								},
							});
						}}
					>
						????????????
					</Button>
					<Button
						icon={<DeleteOutlined/>}
						onClick={async () => {
							Modal.confirm({
								title: `???????????????`,
								content: `???????????????????????????${selectedItems.length}??????????????????`,
								okText: '??????',
								okType: 'danger',
								cancelText: '??????',
								onOk() {
									// return HandleRequest(
									// 	{ids: selectedItems.map((item) => item.id)},
									// 	Delete,
									// 	() => {
									// 		actionRef.current?.clearSelected?.();
									// 		actionRef.current?.reload?.();
									// 	},
									// );
								},
							});
						}}
						danger={true}
					>
						????????????
					</Button>
				</FooterToolbar>
			)}

			<ModalForm
				width={468}
				className={'dialog from-item-label-100w'}
				layout={'horizontal'}
				visible={batchUpdateVisible}
				onVisibleChange={setBatchUpdateVisible}
				onFinish={async (values) => {
					// return await HandleRequest(
					// 	{ids: selectedItems.map((item) => item.id), ...values},
					// 	BatchUpdate,
					// 	() => {
					// 		actionRef.current?.clearSelected?.();
					// 		actionRef.current?.reload?.();
					// 		setGroupItemsTimestamp(Date.now);
					// 	},
					// );
				}}
			>
				<h2 className='dialog-title'> ????????????????????? </h2>
				<ProFormSelect
					// @ts-ignore
					options={groupItems.map((groupItem) => {
						return {key: groupItem.uuid, label: groupItem.name, value: groupItem.uuid};
					})}
					labelAlign={'left'}
					name='group_id'
					label='?????????'
					placeholder='???????????????'
					rules={[
						{
							required: true,
							message: '??????????????????',
						},
					]}
				/>
			</ModalForm>

			<ModalForm
				width={400}
				className={'dialog from-item-label-100w'}
				layout={'horizontal'}
				visible={createGroupVisible}
				onVisibleChange={setCreateGroupVisible}
				onFinish={async (params) =>
					HandleRequest({...currentGroup, ...params}, CreateGroup, () => {
						setGroupItemsTimestamp(Date.now);
					})
				}
			>
				<h2 className='dialog-title'> ???????????? </h2>
				<ProFormText
					name='name'
					label='????????????'
					tooltip='????????? 24 ?????????'
					placeholder='?????????????????????'
					rules={[
						{
							required: true,
							message: '?????????????????????',
						},
					]}
				/>
			</ModalForm>

			<ModalForm
				className={'dialog from-item-label-100w'}
				layout={'horizontal'}
				width={'500px'}
				visible={editGroupVisible}
				onVisibleChange={setEditGroupVisible}
				onFinish={async () => {
					const rs: API.ResponseUpdateContactWayGroup = await UpdateContactWayGroup({
						uuid: currentGroup!.uuid,
						groupName: currentGroup!.name
					});

					if (rs.meta.return_code === API_RETURN_CODE_INIT) {
						setGroupItemsTimestamp(Date.now);
					}

				}
				}
			>
				<h2 className='dialog-title'> ???????????? </h2>
				<ProFormText
					colon={true}
					name='name'
					label='????????????'
					tooltip='????????? 24 ?????????'
					placeholder='?????????????????????'
					initialValue={currentGroup?.name}
					rules={[
						{
							required: true,
							message: '?????????????????????',
						},
					]}
				/>
			</ModalForm>

			<Modal
				className={styles.detailDialog}
				width={'800px'}
				visible={itemDetailVisible}
				onCancel={() => setItemDetailVisible(false)}
				footer={null}
			>
				<h2 className='dialog-title' style={{textAlign: "center", fontSize: 19}}> ??????????????? </h2>
				<Row>
					<Col span={8} className={styles.leftPart}>
						<img src={currentItem?.codeURL}/>
						<h3>{currentItem?.name}</h3>
						<Button
							type={'primary'}
							onClick={() => {
								if (currentItem?.codeURL) {
									FileSaver.saveAs(currentItem?.codeURL, `${currentItem.name}.png`);
								}
							}}
						>
							???????????????
						</Button>
						<Button
							onClick={() => {
								history.push(
									`/staff-admin/customer-growth/contact-way/edit?id=${currentItem?.uuid}`,
								);
							}}
						>
							??????
						</Button>
					</Col>
					<Col span={16} className={styles.rightPart}>
						<div className={styles.section}>
							<div className={styles.titleWrapper}>
								<div className={styles.divider}/>
								<span className={styles.title}>????????????</span>
							</div>
							<div className={styles.formItem}>
								<span className={styles.title}>???????????????</span>
								<span className='date'>
                  {moment(currentItem?.createdAt).format('YYYY-MM-DD HH:mm')}
                </span>
							</div>
							<div className={styles.formItem}>
								<span className={styles.title}>???????????????</span>
								{/*{currentItem.staffs?.map((staff) => (*/}
								{/*	<Tag*/}
								{/*		key={staff.id}*/}
								{/*		className={styles.staffTag}*/}
								{/*		// style={{opacity: staff.online === False ? '0.5' : '1'}}*/}
								{/*	>*/}
								{/*		<img className={styles.icon} src={staff.avatar_url} alt={staff.name}/>*/}
								{/*		<span className={styles.text}>{staff.name}</span>*/}
								{/*	</Tag>*/}
								{/*))}*/}
							</div>
							<div className={styles.formItem}>
								<span className={styles.title}>???????????????</span>
								{/*{currentItem.backup_staffs?.map((staff) => (*/}
								{/*	<Tag*/}
								{/*		key={staff.id}*/}
								{/*		className={styles.staffTag}*/}
								{/*		// style={{opacity: staff.online === False ? '0.5' : '1'}}*/}
								{/*	>*/}
								{/*		<img className={styles.icon} src={staff.avatar_url} alt={staff.name}/>*/}
								{/*		<span className={styles.text}>{staff.name}</span>*/}
								{/*	</Tag>*/}
								{/*))}*/}
							</div>
							<p className={styles.formItem}>
								<span className={styles.title}>?????????????????????</span>
								{/*{currentItem.auto_skip_verify_enable === True && (*/}
								{/*	<span>*/}
								{/*    {currentItem.skip_verify_start_time && '~'}*/}
								{/*		{currentItem.skip_verify_end_time}????????????*/}
								{/*  </span>*/}
								{/*)}*/}
								{/*{currentItem.auto_skip_verify_enable === False && <span>?????????</span>}*/}
							</p>
							<p className={styles.formItem}>
								<span className={styles.title}>???????????????</span>
								{/*{currentItem.customer_tags?.map((tag) => (*/}
								{/*	<Tag key={tag.id} className={styles.staffTag}>*/}
								{/*		<span className={styles.text}>{tag.name}</span>*/}
								{/*	</Tag>*/}
								{/*))}*/}
							</p>
						</div>
					</Col>
				</Row>
			</Modal>
		</PageContainer>
	);
};

export default ContactWayList;
