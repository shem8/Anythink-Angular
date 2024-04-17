import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ItemListItemComponent } from "./item-list-item/item-list-item.component";
import { PagerComponent } from "@realworld/ui/components";
import { ItemsListStore } from "@realworld/items/data-access";

@Component({
  selector: "cdt-item-list",
  standalone: true,
  templateUrl: "./item-list.component.html",
  imports: [ItemListItemComponent, PagerComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListComponent {
  private readonly itemsListStore = inject(ItemsListStore);
  private readonly router = inject(Router);

  $totalPages = this.itemsListStore.totalPages;
  $items = this.itemsListStore.items.entities;
  $listConfig = this.itemsListStore.listConfig;
  $isLoading = this.itemsListStore.getItemsLoading;

  favorite(slug: string) {
    this.itemsListStore.favouriteItem(slug);
  }

  unFavorite(slug: string) {
    this.itemsListStore.unFavouriteItem(slug);
  }

  navigateToItem(slug: string) {
    this.router.navigate(["/item", slug]);
  }

  setPage(page: number) {
    this.itemsListStore.setListPage(page);
  }
}
