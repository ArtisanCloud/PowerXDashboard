import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { CaretDownFilled, FolderFilled } from '@ant-design/icons';
import type { DataNode } from 'rc-tree/lib/interface';
import type { ReactNode } from 'react';
import styles from '@/pages/Setting/Employee/index.less';
import _ from 'lodash';
import { UseDepartments } from '@/models/department';

export type DepartmentTreeProps = {
  visible: boolean;
  allDepartments: DepartmentOption[];
};

export interface DepartmentOption extends API.Department {
  key: any;
  label: string;
  value: string;
}

export interface TreeNode {
  title: string;
  key: string;
  parentKey: string;
  children: TreeNode[];
  checkable?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  order: number;
  staff_num: number;
}

const buildDepartmentTree = (
  items: API.Department[],
): { nodes: TreeNode[]; tree: TreeNode[] } => {
  let nodes: TreeNode[] = []; // 一维节点
  let tree: TreeNode[] = []; // 树形节点
  items.forEach((department: API.Department) => {
    nodes.push({
      title: department.name,
      key: `${department.id}`,
      parentKey: `${department.parentid}`,
      children: [],
      checkable: true,
      selectable: false,
      order: department.order,
      staff_num: department.employeeCount,
    });
    if (department?.subDepartments) {
      department?.subDepartments.forEach((subDepartment: API.Department) => {
        nodes.push({
          title: subDepartment.name,
          key: `${subDepartment.id}`,
          parentKey: `${subDepartment.parentid}`,
          children: [],
          checkable: true,
          selectable: false,
          order: department.order,
          staff_num: department.employeeCount,
        });
      });
    }
  });

  // 排序原始nodes，group在前，node在后
  nodes = nodes.sort((a, b) => {
    return a?.order - b?.order;
  });

  const nodesByKey = _.keyBy(nodes, 'key'); // 去重

  nodes = _.toArray<TreeNode>(nodesByKey); // 设置一维节点

  const groupedNodes = _.groupBy(nodesByKey, 'parentKey');
  // 组装node
  _.each(_.omit(groupedNodes, `0`), (children, parentKey) => {
    if (nodesByKey[parentKey]) {
      nodesByKey[parentKey].children = children || [];
    }
  });

  tree = _.toArray<TreeNode>(nodesByKey);
  // 清除顶层的冗余node
  tree = tree.filter((item) => {
    return item.parentKey === `0`;
  });

  return {
    nodes,
    tree,
  };
};

const DepartmentList = ({
  callback,
}: {
  callback: (selectedKey: string) => void;
}) => {
  const { departments } = UseDepartments();
  const [allDepartments, setAllDepartments] = useState<API.Department[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    DepartmentOption[]
  >([]);
  const [departmentNodes, setDepartmentNodes] = useState<TreeNode[]>([]); // 一维的节点
  const [departmentTree, setDepartmentTree] = useState<TreeNode[]>([]); // 多维的树节点
  const [selectedDepartments, setSelectedDepartments] = useState<
    DepartmentOption[]
  >([]);
  const [keyword] = useState<string>('');
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [checkedNodeKeys, setCheckedNodeKeys] = useState<string[]>([]);
  const [expandedNodeKeys, setExpandedNodeKeys] = useState<string[]>(['1']);
  const allDepartmentMap = _.keyBy(allDepartments, 'ext_id');

  useEffect(() => {
    // console.log("departments:", departments)
    setAllDepartments(departments);
    setExpandedNodeKeys(['1']);
  }, [departments]);

  const onNodesCheck = (checked: {
    checked: string[];
    halfChecked: string[];
  }) => {
    const checkedExtDepartmentIDs: number[] = [];
    let selectedExtDepartmentIDs = selectedDepartments.map((item) => item.id);
    let checkedKeys = [...checked.checked];

    // 找出本次uncheck的key，根据这些key的ext_id去删除相关checkedKey
    const uncheckedKeys = _.difference(checkedNodeKeys, checkedKeys);
    _.forEach<string>(uncheckedKeys, (key: string) => {
      // @ts-ignore
      checkedKeys = checkedKeys.filter<string>((checkedKey) => {
        return !checkedKey.includes(key);
      });
    });

    // 记录当前所有checked的key
    checkedKeys.forEach((key) => {
      checkedExtDepartmentIDs.push(Number(key));
      selectedExtDepartmentIDs.push(Number(key));
    });

    // 计算需要删除的extDepartmentID
    // @ts-ignore
    const shouldDeleteExtDepartmentIDs = _.difference(
      _.map(departmentOptions, 'id'),
      checkedExtDepartmentIDs,
    );
    selectedExtDepartmentIDs = _.difference(
      _.uniq(selectedExtDepartmentIDs),
      _.uniq(shouldDeleteExtDepartmentIDs),
    );

    const items = selectedExtDepartmentIDs.map((selectedExtDepartmentID) => {
      return allDepartmentMap[selectedExtDepartmentID];
    });

    // @ts-ignore
    setSelectedDepartments(items);
  };

  const nodeRender = (node: DataNode): ReactNode => {
    return (
      <div
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          callback && callback(String(node.key));
        }}
        style={{
          padding: '4px 6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        <FolderFilled
          style={{
            color: '#47a7ff',
            fontSize: 20,
            marginRight: 6,
            verticalAlign: -6,
          }}
        />
        <span>
          {/* node.title */}
          {
            // @ts-ignore
            node.title.length > 14 ? (
              <span>{node.title.slice(0, 13)}...</span>
            ) : (
              <span>{node.title}</span>
            )
          }
          ({node.staff_num})
        </span>
      </div>
    );
  };
  // 监听选中部门变化，计算checked的树节点
  useEffect(() => {
    const allDepartmentNodeKeys = _.map(departmentNodes, 'key');
    // 计算当前选中的部门，命中的key
    const matchedKeys: string[] = [];
    allDepartmentNodeKeys.forEach((key: string) => {
      selectedDepartments.forEach((department) => {
        if (key === `${department.id}`) {
          matchedKeys.push(key);
        }
      });
    });
    setCheckedNodeKeys(matchedKeys);
  }, [selectedDepartments]);

  // 关键词变化的时候
  useEffect(() => {
    const filteredDepartments = allDepartments.filter((item) => {
      return keyword === '' || item.name.includes(keyword);
    });
    // @ts-ignore
    setDepartmentOptions(filteredDepartments);
    const { nodes, tree } = buildDepartmentTree(filteredDepartments);
    // 这里同步更新node节点和选中key值
    let checkedKeys: string[] = [];
    nodes.forEach((node) => {
      selectedDepartments.forEach((department) => {
        if (node.key === `${department.id}`) {
          checkedKeys.push(node.key);
        }
      });
    });
    checkedKeys = _.uniq<string>(checkedKeys);
    setCheckedNodeKeys(checkedKeys);
    setDepartmentNodes(nodes);
    setDepartmentTree(tree);
  }, [allDepartments, keyword]);

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.departmentTitle}>部门信息</span>
        <a
          type={'link'}
          onClick={() => {
            const currentStatus = !expandAll;
            if (currentStatus) {
              setExpandedNodeKeys(_.map(departmentNodes, 'key'));
            } else {
              setExpandedNodeKeys(['0']);
            }
            setExpandAll(currentStatus);
          }}
        >
          {!expandAll ? '展开全部' : '收起全部'}
        </a>
      </div>
      <div className={styles.treeContainer}>
        <Tree
          autoExpandParent={false}
          checkStrictly={true}
          checkedKeys={checkedNodeKeys}
          expandedKeys={expandedNodeKeys}
          // @ts-ignore
          onExpand={(expandedKeys: string[]) => {
            setExpandedNodeKeys(expandedKeys);
          }}
          height={300}
          switcherIcon={<CaretDownFilled style={{ color: '#47a7ff' }} />}
          multiple={true}
          treeData={departmentTree}
          // @ts-ignore
          onCheck={onNodesCheck}
          titleRender={nodeRender}
        />
      </div>
    </div>
  );
};
export default React.memo(DepartmentList);
