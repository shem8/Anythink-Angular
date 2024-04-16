import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { of } from "rxjs";
import {
  ItemsListStore,
  itemsListInitialState,
} from "@realworld/items/data-access";

export const profileFavoritesResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
) => {
  const username = route?.parent?.params["username"];
  const itemsListStore = inject(ItemsListStore);

  const config = {
    ...itemsListInitialState.listConfig,
    filters: {
      ...itemsListInitialState.listConfig.filters,
      favorited: username,
    },
  };

  itemsListStore.setListConfig(config);
  itemsListStore.loadItems(config);

  return of(true);
};
