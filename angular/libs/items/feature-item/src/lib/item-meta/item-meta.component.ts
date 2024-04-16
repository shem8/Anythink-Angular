import { DatePipe, NgClass } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { Item } from "@realworld/core/api-types";
@Component({
  selector: "cdt-item-meta",
  standalone: true,
  templateUrl: "./item-meta.component.html",
  imports: [RouterModule, NgClass, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMetaComponent {
  item = input.required<Item>();
  canModify = input.required<boolean>();
  follow = output<string>();
  unfollow = output<string>();
  unfavorite = output<string>();
  favorite = output<string>();
  delete = output<string>();

  toggleFavorite() {
    if (this.item().favorited) {
      this.unfavorite.emit(this.item().slug);
    } else {
      this.favorite.emit(this.item().slug);
    }
  }

  toggleFollow() {
    if (this.item().author.following) {
      this.unfollow.emit(this.item().author.username);
    } else {
      this.follow.emit(this.item().author.username);
    }
  }

  deleteItem() {
    this.delete.emit(this.item().slug);
  }
}
