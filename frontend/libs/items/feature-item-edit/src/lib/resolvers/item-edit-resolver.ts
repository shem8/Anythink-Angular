import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { ItemStore } from "@realworld/items/data-access/src";
import { of } from "rxjs";

export const itemEditResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
) => {
  const slug = route.params["slug"];
  const itemStore = inject(ItemStore);

  if (slug) {
    itemStore.getItem(slug);
  }

  return of(true);
};
