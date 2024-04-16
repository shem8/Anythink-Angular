import { Routes } from "@angular/router";
import { ItemComponent } from "./item.component";

export const ITEM_ROUTES: Routes = [
  {
    path: ":slug",
    component: ItemComponent,
  },
];
