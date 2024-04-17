import {
  DynamicFormComponent,
  Field,
  formsActions,
  ListErrorsComponent,
  ngrxFormsQuery,
} from "@realworld/core/forms";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  untracked,
} from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { ItemStore } from "@realworld/items/data-access";

const structure: Field[] = [
  {
    type: "INPUT",
    name: "title",
    placeholder: "Item Title",
    validator: [Validators.required],
  },
  {
    type: "INPUT",
    name: "description",
    placeholder: "What's this item about?",
    validator: [Validators.required],
  },
  {
    type: "TEXTAREA",
    name: "body",
    placeholder: "Write your item (in markdown)",
    validator: [Validators.required],
  },
  {
    type: "INPUT",
    name: "tagList",
    placeholder: "Enter Tags",
    validator: [],
  },
];

@Component({
  selector: "cdt-item-edit",
  standalone: true,
  templateUrl: "./item-edit.component.html",
  styleUrls: ["./item-edit.component.css"],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemEditComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly itemStore = inject(ItemStore);

  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  readonly setItemDataToForm = effect(() => {
    const itemLoaded = this.itemStore.getItemLoaded();
    if (itemLoaded) {
      untracked(() =>
        this.store.dispatch(
          formsActions.setData({ data: this.itemStore.data() }),
        ),
      );
    }
  });

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure }));
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.itemStore.publishItem();
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
