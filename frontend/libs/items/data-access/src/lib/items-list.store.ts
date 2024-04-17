import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
} from "@ngrx/signals";
import {
  Items,
  ItemsListConfig,
  ItemsListState,
  itemsListInitialState,
} from "./models/items-list.model";
import { computed, inject } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe, tap } from "rxjs";
import {
  setLoaded,
  setLoading,
  withCallState,
} from "@realworld/core/data-access";
import { tapResponse } from "@ngrx/operators";
import { ActionsService } from "./services/actions.service";
import { Item } from "@realworld/core/api-types";

export const ItemsListStore = signalStore(
  { providedIn: "root" },
  withState<ItemsListState>(itemsListInitialState),
  withComputed(({ listConfig, items }) => ({
    totalPages: computed(() =>
      Array.from(
        new Array(
          Math.ceil(items().itemsCount / (listConfig()?.filters?.limit ?? 1)),
        ),
        (_, index) => index + 1,
      ),
    ),
  })),
  withMethods(
    (
      store,
      itemsService = inject(ItemsService),
      actionsService = inject(ActionsService),
    ) => ({
      loadItems: rxMethod<ItemsListConfig>(
        pipe(
          tap(() => setLoading("getItems")),
          concatMap((listConfig) =>
            itemsService.query(listConfig).pipe(
              tapResponse({
                next: ({ items, itemsCount }) => {
                  patchState(store, {
                    items: {
                      itemsCount: itemsCount,
                      entities: items,
                    },
                    ...setLoaded("getItems"),
                  });
                },
                error: () => {
                  patchState(store, {
                    ...itemsListInitialState,
                    ...setLoaded("getItems"),
                  });
                },
              }),
            ),
          ),
        ),
      ),
      favouriteItem: rxMethod<string>(
        pipe(
          concatMap((slug) =>
            actionsService.favorite(slug).pipe(
              tapResponse({
                next: ({ item }) => {
                  patchState(store, {
                    items: replaceItem(store.items(), item),
                  });
                },
                error: () => {
                  patchState(store, itemsListInitialState);
                },
              }),
            ),
          ),
        ),
      ),
      unFavouriteItem: rxMethod<string>(
        pipe(
          concatMap((slug) =>
            actionsService.unfavorite(slug).pipe(
              tapResponse({
                next: ({ item }) => {
                  patchState(store, {
                    items: replaceItem(store.items(), item),
                  });
                },
                error: () => {
                  patchState(store, itemsListInitialState);
                },
              }),
            ),
          ),
        ),
      ),
      setListConfig: (listConfig: ItemsListConfig) => {
        patchState(store, { listConfig });
      },
      setListPage: (page: number) => {
        const filters = {
          ...store.listConfig.filters(),
          offset: (store.listConfig().filters.limit ?? 10) * (page - 1),
        };
        const listConfig: ItemsListConfig = {
          ...store.listConfig(),
          currentPage: page,
          filters,
        };
        patchState(store, { listConfig });
      },
    }),
  ),
  withCallState({ collection: "getItems" }),
);

function replaceItem(items: Items, payload: Item): Items {
  const itemIndex = items.entities.findIndex((a) => a.slug === payload.slug);
  const entities = [
    ...items.entities.slice(0, itemIndex),
    Object.assign({}, items.entities[itemIndex], payload),
    ...items.entities.slice(itemIndex + 1),
  ];
  return { ...items, entities };
}
