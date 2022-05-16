export const discussionConstants = {
  ITEM_COUNT: 20,
  MAX_ITEM_SHOW: 20,
  SORT_BY: "",
  ORDER_BY: "name",
  ASC: "asc",
  DESC: "desc",
  STATUS: "all",
  OFFSET: "0",
  TYPE: "all"
};
export const CONDITION_SORT_LIST_MENU = [
  {
    id: 1,
    value: "newest",
    label: "Sort by newest",
    isSelect: true,
  },
  {
    id: 2,
    value: "az",
    label: "Sort by A to Z",
    isSelect: false,
  },
]
export const CONDITION_FILTER_LIST_MENU = [
  {
    id: 1,
    value: "all",
    label: "All",
    isSelect: false,
  },
  {
    id: 2,
    value: "owner",
    label: "Owner",
    isSelect: false,
  },
  {
    id: 3,
    value: "unreads",
    label: "Unreads",
    isSelect: false,
  },
  {
    id: 3,
    value: "flag",
    label: "Flag",
    isSelect: false,
  },
  {
    id: 4,
    value: "nda",
    label: "NDA",
    isSelect: false,
  },
];