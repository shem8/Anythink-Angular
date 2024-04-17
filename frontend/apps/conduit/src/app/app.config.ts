import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from "@angular/router";
import { provideRouterStore } from "@ngrx/router-store";
import { ngrxFormsEffects, ngrxFormsFeature } from "@realworld/core/forms";
import { authGuard, tokenInterceptor } from "@realworld/auth/data-access";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { errorHandlingInterceptor } from "@realworld/core/error-handler";
import { provideEffects } from "@ngrx/effects";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { API_URL } from "@realworld/core/http-client";
import { environment } from "@env/environment";
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      [
        {
          path: "",
          redirectTo: "home",
          pathMatch: "full",
        },
        {
          path: "home",
          loadComponent: () =>
            import("@realworld/home/src/lib/home.component").then(
              (m) => m.HomeComponent,
            ),
        },
        {
          path: "login",
          loadComponent: () =>
            import("@realworld/auth/feature-auth").then(
              (m) => m.LoginComponent,
            ),
        },
        {
          path: "register",
          loadComponent: () =>
            import("@realworld/auth/feature-auth").then(
              (m) => m.RegisterComponent,
            ),
        },
        {
          path: "item",
          loadChildren: () =>
            import("@realworld/items/item").then((m) => m.ITEM_ROUTES),
        },
        {
          path: "settings",
          loadComponent: () =>
            import("@realworld/settings/feature-settings").then(
              (settings) => settings.SettingsComponent,
            ),
        },
        {
          path: "editor",
          loadChildren: () =>
            import("@realworld/items/item-edit").then(
              (item) => item.ITEM_EDIT_ROUTES,
            ),
          canActivate: [authGuard],
        },
        {
          path: "profile",
          loadChildren: () =>
            import("@realworld/profile/feature-profile").then(
              (profile) => profile.PROFILE_ROUTES,
            ),
        },
      ],
      withViewTransitions(),
      withComponentInputBinding(),
    ),
    provideStore({
      ngrxForms: ngrxFormsFeature.reducer,
    }),
    provideEffects(ngrxFormsEffects),
    provideRouterStore(),
    provideHttpClient(
      withInterceptors([errorHandlingInterceptor, tokenInterceptor]),
    ),
    !environment.production ? provideStoreDevtools() : [],
    { provide: API_URL, useValue: process.env["BACKEND_URL"] },
  ],
};
