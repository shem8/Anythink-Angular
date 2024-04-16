import { Routes } from "@angular/router";
import { ItemListComponent } from "@realworld/items/feature-items-list/src";
import { authGuard } from "@realworld/auth/data-access";
import {
  profileItemsResolver,
  profileFavoritesResolver,
  profileResolver,
} from "@realworld/profile/data-access";
import { ProfileComponent } from "./profile.component";

export const PROFILE_ROUTES: Routes = [
  {
    path: ":username",
    component: ProfileComponent,
    resolve: { profileResolver },
    canActivate: [authGuard],
    children: [
      {
        path: "",
        component: ItemListComponent,
        resolve: { profileItemsResolver },
      },
      {
        path: "favorites",
        component: ItemListComponent,
        resolve: { profileFavoritesResolver },
      },
    ],
  },
];
