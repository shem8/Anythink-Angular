import {
  Component,
  ChangeDetectionStrategy,
  output,
  input,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgClass, DatePipe } from "@angular/common";
import { Item } from "@realworld/core/api-types";
@Component({
  selector: "cdt-item-list-item",
  standalone: true,
  templateUrl: "./item-list-item.component.html",
  imports: [RouterModule, NgClass, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListItemComponent {
  item = input.required<Item>();
  favorite = output<string>();
  unFavorite = output<string>();
  navigateToItem = output<string>();

  toggleFavorite(item: Item) {
    if (item.favorited) {
      this.unFavorite.emit(item.slug);
    } else {
      this.favorite.emit(item.slug);
    }
  }
}
