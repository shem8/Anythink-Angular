import { Routes } from "@angular/router";
import { authGuard } from "@realworld/auth/data-access";
import { ItemEditComponent } from "./item-edit.component";
import { itemEditResolver } from "./resolvers/item-edit-resolver";

export const ITEM_EDIT_ROUTES: Routes = [
  {
    path: "",
    component: ItemEditComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: ItemEditComponent,
        canActivate: [authGuard],
      },
      {
        path: ":slug",
        component: ItemEditComponent,
        resolve: { itemEditResolver },
      },
    ],
  },
];
