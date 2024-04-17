import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { ItemsListStore } from "./items-list.store";
import { provideMockStore } from "@ngrx/store/testing";

describe("ItemsListStore", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsListStore, provideMockStore({})],
    });
  });

  it("should be created", inject(
    [ItemsListStore],
    (service: typeof ItemsListStore) => {
      expect(service).toBeTruthy();
    },
  ));
});
