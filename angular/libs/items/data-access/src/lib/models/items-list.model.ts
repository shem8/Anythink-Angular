import { Item } from "@realworld/core/api-types";

export interface ItemsListState {
  listConfig: ItemsListConfig;
  items: Items;
}

export interface ItemsListConfig {
  type: ListType;
  currentPage: number;
  filters: Filters;
}

export interface Filters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export type ListType = "ALL" | "FEED";

export interface Items {
  entities: Item[];
  itemsCount: number;
}

export const itemsListInitialState: ItemsListState = {
  listConfig: {
    type: "ALL",
    currentPage: 1,
    filters: {
      limit: 10,
    },
  },
  items: {
    entities: [],
    itemsCount: 0,
  },
};
