import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { ItemStore } from "./item.store";
import { provideMockStore } from "@ngrx/store/testing";

describe("ItemStore", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemStore, provideMockStore({})],
    });
  });

  it("should be created", inject(
    [ItemStore],
    (service: typeof ItemStore) => {
      expect(service).toBeTruthy();
    },
  ));
});
