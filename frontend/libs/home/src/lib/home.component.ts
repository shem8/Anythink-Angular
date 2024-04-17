import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
  untracked,
} from "@angular/core";
import {
  ItemsListStore,
  ListType,
  itemsListInitialState,
} from "@realworld/items/data-access";
import { AsyncPipe, NgClass } from "@angular/common";
import { TagsListComponent } from "./tags-list/tags-list.component";
import { ItemListComponent } from "@realworld/items/feature-items-list/src";
import { HomeStoreService } from "./home.store";
import { provideComponentStore } from "@ngrx/component-store";
import { AuthStore } from "@realworld/auth/data-access";

@Component({
  selector: "cdt-home",
  standalone: true,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [AsyncPipe, NgClass, TagsListComponent, ItemListComponent],
  providers: [provideComponentStore(HomeStoreService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly itemsListStore = inject(ItemsListStore);
  private readonly authStore = inject(AuthStore);
  private readonly homeStore = inject(HomeStoreService);

  $listConfig = this.itemsListStore.listConfig;
  tags$ = this.homeStore.tags$;
  $isLoggedIn = this.authStore.loggedIn;

  constructor() {
    this.itemsListStore.loadItems(this.$listConfig);
  }

  readonly loadItemsOnLogin = effect(() => {
    untracked(() => this.getItems(this.$isLoggedIn()));
  });

  setListTo(type: ListType = "ALL") {
    const config = { ...itemsListInitialState.listConfig, type };
    this.itemsListStore.setListConfig(config);
  }

  getItems(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.setListTo("FEED");
    } else {
      this.setListTo("ALL");
    }
  }

  setListTag(tag: string) {
    this.itemsListStore.setListConfig({
      ...itemsListInitialState.listConfig,
      filters: {
        ...itemsListInitialState.listConfig.filters,
        tag,
      },
    });
  }
}
