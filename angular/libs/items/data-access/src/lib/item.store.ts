import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { ItemState, itemInitialState } from "./models/item.model";
import { inject } from "@angular/core";
import { ItemsService } from "./services/items.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import {
  setLoaded,
  setLoading,
  withCallState,
} from "@realworld/core/data-access";
import { tapResponse } from "@ngrx/operators";
import { ActionsService } from "./services/actions.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { concatLatestFrom } from "@ngrx/operators";
import { formsActions, ngrxFormsQuery } from "@realworld/core/forms";

export const ItemStore = signalStore(
  { providedIn: "root" },
  withState<ItemState>(itemInitialState),
  withMethods(
    (
      store,
      itemsService = inject(ItemsService),
      actionsService = inject(ActionsService),
      router = inject(Router),
      reduxStore = inject(Store),
    ) => ({
      getItem: rxMethod<string>(
        pipe(
          tap(() => setLoading("getItem")),
          switchMap((slug) =>
            itemsService.getItem(slug).pipe(
              tapResponse({
                next: ({ item }) => {
                  patchState(store, {
                    data: item,
                    ...setLoaded("getItem"),
                  });
                },
                error: () => {
                  patchState(store, {
                    data: itemInitialState.data,
                    ...setLoaded("getItem"),
                  });
                },
              }),
            ),
          ),
        ),
      ),
      getComments: rxMethod<string>(
        pipe(
          tap(() => setLoading("getComments")),
          switchMap((slug) =>
            itemsService.getComments(slug).pipe(
              tapResponse({
                next: ({ comments }) => {
                  patchState(store, { comments: comments });
                  setLoaded("getComments");
                },
                error: () => {
                  patchState(store, { comments: itemInitialState.comments });
                  setLoaded("getComments");
                },
              }),
            ),
          ),
        ),
      ),
      followUser: rxMethod<string>(
        pipe(
          switchMap((username) => actionsService.followUser(username)),
          tap(({ profile }) =>
            patchState(store, { data: { ...store.data(), author: profile } }),
          ),
        ),
      ),
      unfollowUser: rxMethod<string>(
        pipe(
          switchMap((username) => actionsService.unfollowUser(username)),
          tap(({ profile }) =>
            patchState(store, { data: { ...store.data(), author: profile } }),
          ),
        ),
      ),
      deleteComment: rxMethod<{ commentId: number; slug: string }>(
        pipe(
          switchMap(({ commentId, slug }) =>
            itemsService.deleteComment(commentId, slug).pipe(
              tap(() =>
                patchState(store, {
                  comments: store
                    .comments()
                    .filter((item) => item.id !== commentId),
                }),
              ),
            ),
          ),
        ),
      ),
      deleteItem: rxMethod<string>(
        pipe(
          switchMap((slug) =>
            itemsService.deleteItem(slug).pipe(
              tapResponse({
                next: () => router.navigate(["/"]),
                error: () => patchState(store, itemInitialState),
              }),
            ),
          ),
        ),
      ),
      addComment: rxMethod<string>(
        pipe(
          concatLatestFrom(() => reduxStore.select(ngrxFormsQuery.selectData)),
          switchMap(([slug, data]) =>
            itemsService.addComment(slug, data.comment).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    comments: [data.comment, ...store.comments()],
                  }),
                error: ({ error }) =>
                  reduxStore.dispatch(
                    formsActions.setErrors({ errors: error.errors }),
                  ),
              }),
            ),
          ),
        ),
      ),
      publishItem: rxMethod<void>(
        pipe(
          concatLatestFrom(() => reduxStore.select(ngrxFormsQuery.selectData)),
          switchMap(([_, data]) =>
            itemsService.publishItem(data).pipe(
              tapResponse({
                next: ({ item }) =>
                  router.navigate(["item", item.slug]),
                error: ({ error }) =>
                  reduxStore.dispatch(
                    formsActions.setErrors({ errors: error.errors }),
                  ),
              }),
            ),
          ),
        ),
      ),
      initializeItem: () => {
        patchState(store, itemInitialState);
      },
    }),
  ),
  withCallState({ collection: "getItem" }),
  withCallState({ collection: "getComments" }),
);
