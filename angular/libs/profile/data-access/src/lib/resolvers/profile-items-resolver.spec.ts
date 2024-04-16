import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { profileItemsResolver } from "./profile-items-resolver";
import { cold } from "jasmine-marbles";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {
  itemListActions,
  itemListInitialState,
} from "@realworld/items/data-access";

const mockRoute: ActivatedRouteSnapshot = {
  params: { username: "stef" },
} as unknown as ActivatedRouteSnapshot;

describe("profileItemsResolver", () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });

    store = TestBed.inject(MockStore);
  });

  it("should return `true` and dispatch itemListActions.setListConfig action", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const result = TestBed.runInInjectionContext(
      () =>
        profileItemsResolver(mockRoute, {} as RouterStateSnapshot) as any,
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      itemListActions.setListConfig({
        config: {
          ...itemListInitialState.listConfig,
          filters: {
            ...itemListInitialState.listConfig.filters,
            author: "stef",
          },
        },
      }),
    );
    expect(result).toBeObservable(cold("(a|)", { a: true }));
  });
});
