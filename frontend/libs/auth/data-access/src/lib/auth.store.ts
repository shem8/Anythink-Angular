import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { AuthState, authInitialState, initialUserValue } from "./auth.model";
import { inject } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { exhaustMap, pipe, switchMap, tap } from "rxjs";
import { concatLatestFrom, tapResponse } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { formsActions, ngrxFormsQuery } from "@realworld/core/forms";
import { LocalStorageJwtService } from "./services/local-storage-jwt.service";
import { Router } from "@angular/router";

export const AuthStore = signalStore(
  { providedIn: "root" },
  withState<AuthState>(authInitialState),
  withMethods(
    (
      store,
      reduxStore = inject(Store),
      authService = inject(AuthService),
      localStorageService = inject(LocalStorageJwtService),
      router = inject(Router),
    ) => ({
      getUser: rxMethod<void>(
        pipe(
          switchMap(() => authService.user()),
          tap(({ user }) => patchState(store, { user, loggedIn: true })),
        ),
      ),
      login: rxMethod<void>(
        pipe(
          concatLatestFrom(() => reduxStore.select(ngrxFormsQuery.selectData)),
          exhaustMap(([, data]) =>
            authService.login(data).pipe(
              tapResponse({
                next: ({ user }) => {
                  patchState(store, { user, loggedIn: true });
                  localStorageService.setItem(user.token);
                  router.navigateByUrl("/");
                },
                error: ({ error }) =>
                  reduxStore.dispatch(
                    formsActions.setErrors({ errors: error.errors }),
                  ),
              }),
            ),
          ),
        ),
      ),
      register: rxMethod<void>(
        pipe(
          concatLatestFrom(() => reduxStore.select(ngrxFormsQuery.selectData)),
          exhaustMap(([, data]) =>
            authService.register(data).pipe(
              tapResponse({
                next: ({ user }) => {
                  patchState(store, { user, loggedIn: true });
                  localStorageService.setItem(user.token);
                  router.navigateByUrl("/");
                },
                error: ({ error }) =>
                  reduxStore.dispatch(
                    formsActions.setErrors({ errors: error.errors }),
                  ),
              }),
            ),
          ),
        ),
      ),
      logout: () => {
        patchState(store, { user: initialUserValue, loggedIn: false });
        localStorageService.removeItem();
        router.navigateByUrl("login");
      },
    }),
  ),
);
