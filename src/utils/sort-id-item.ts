export interface SortIdItem {
  id: number;
  sortIndex: number;
}

export const sortBySortIndexAndGetSortedIds = (
  array: SortIdItem[]
): number[] => {
  const sortedArray = array.slice().sort((a, b) => a.sortIndex - b.sortIndex);
  const sortedIds = sortedArray.map((item) => item.id);
  return sortedIds;
};
