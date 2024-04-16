import { Field, formsActions, ngrxFormsQuery } from "@realworld/core/forms";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
} from "@angular/core";
import {
  ItemStore,
  ItemsListStore,
} from "@realworld/items/data-access";
import { ItemMetaComponent } from "./item-meta/item-meta.component";
import { AsyncPipe } from "@angular/common";
import { MarkdownPipe } from "./pipes/markdown.pipe";
import { ItemCommentComponent } from "./item-comment/item-comment.component";
import { AddCommentComponent } from "./add-comment/add-comment.component";
import { Store } from "@ngrx/store";
import { RouterLink } from "@angular/router";
import { AuthStore } from "@realworld/auth/data-access";

const structure: Field[] = [
  {
    type: "TEXTAREA",
    name: "comment",
    placeholder: "Write a comment...",
    attrs: {
      rows: 3,
    },
  },
];

@Component({
  selector: "cdt-item",
  standalone: true,
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
  imports: [
    AsyncPipe,
    ItemMetaComponent,
    ItemCommentComponent,
    MarkdownPipe,
    AddCommentComponent,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent implements OnInit, OnDestroy {
  slug = input<string>("");

  private readonly store = inject(Store);
  private readonly authStore = inject(AuthStore);
  private readonly itemStore = inject(ItemStore);
  private readonly itemsListStore = inject(ItemsListStore);

  $item = this.itemStore.data;
  $comments = this.itemStore.comments;
  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);
  touchedForm$ = this.store.select(ngrxFormsQuery.selectTouched);

  $authorUsername = this.itemStore.data.author.username;
  $isAuthenticated = this.authStore.loggedIn;
  $currentUser = this.authStore.user;
  $canModify = computed(
    () => this.authStore.user.username() === this.$authorUsername(),
  );

  ngOnInit() {
    this.itemStore.getItem(this.slug());
    this.itemStore.getComments(this.slug());
    this.store.dispatch(formsActions.setStructure({ structure }));
    this.store.dispatch(formsActions.setData({ data: "" }));
  }

  follow(username: string) {
    this.itemStore.followUser(username);
  }
  unfollow(username: string) {
    this.itemStore.unfollowUser(username);
  }
  favorite(slug: string) {
    this.itemsListStore.favouriteItem(slug);
  }
  unfavorite(slug: string) {
    this.itemsListStore.unFavouriteItem(slug);
  }
  delete(slug: string) {
    this.itemStore.deleteItem(slug);
  }
  deleteComment(data: { commentId: number; slug: string }) {
    this.itemStore.deleteComment(data);
  }
  submit(slug: string) {
    this.itemStore.addComment(slug);
  }
  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  ngOnDestroy() {
    this.itemStore.initializeItem();
  }
}
