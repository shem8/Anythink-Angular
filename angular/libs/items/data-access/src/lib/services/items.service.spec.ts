import { ApiService } from "@realworld/core/http-client";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";
import { ItemsService } from "./items.service";
import { MockProvider } from "ng-mocks";

describe("ItemsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService, MockProvider(ApiService)],
    });
  });

  it("should be created", inject(
    [ItemsService],
    (service: ItemsService) => {
      expect(service).toBeTruthy();
    },
  ));
});
