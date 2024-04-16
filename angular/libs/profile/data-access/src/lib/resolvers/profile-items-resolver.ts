import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import {
  ItemsListStore,
  itemsListInitialState,
} from "@realworld/items/data-access";
import { of } from "rxjs";

export const profileItemsResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
) => {
  const username = route.params["username"];
  const itemsListStore = inject(ItemsListStore);

  const config = {
    ...itemsListInitialState.listConfig,
    filters: {
      ...itemsListInitialState.listConfig.filters,
      author: username,
    },
  };

  itemsListStore.setListConfig(config);
  itemsListStore.loadItems(config);

  return of(true);
};
