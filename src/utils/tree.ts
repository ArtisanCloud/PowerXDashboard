type TreeNode = {
  id: bigint;
  children?: TreeNode[];
};

// function FindNodeById<T extends TreeNode>(tree: T[], id: bigint): T | undefined {
// 	for (const node of tree) {
// 		if (node.id === id) {
// 			return node;
// 		}
//
// 		if (node.children) {
// 			const result = findNodeById(node.children, id);
// 			if (result) {
// 				return result;
// 			}
// 		}
// 	}
//
// 	return undefined;
// }
