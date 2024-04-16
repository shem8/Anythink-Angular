import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from "@angular/core";
import { Item, User } from "@realworld/core/api-types";
import { Comment } from "@realworld/items/data-access";
import { RouterModule } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: "cdt-item-comment",
  standalone: true,
  templateUrl: "./item-comment.component.html",
  imports: [DatePipe, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCommentComponent {
  currentUser = input.required<User>();
  comment = input.required<Comment>();
  item = input.required<Item>();
  delete = output<{
    commentId: number;
    slug: string;
  }>();
}
