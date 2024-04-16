import { ProfileResponse, ItemResponse } from "@realworld/core/api-types";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "@realworld/core/http-client";

@Injectable({ providedIn: "root" })
export class ActionsService {
  private readonly apiService = inject(ApiService);

  followUser(username: string): Observable<ProfileResponse> {
    return this.apiService.post<ProfileResponse, void>(
      "/profiles/" + username + "/follow",
    );
  }

  unfollowUser(username: string): Observable<ProfileResponse> {
    return this.apiService.delete<ProfileResponse>(
      "/profiles/" + username + "/follow",
    );
  }

  favorite(slug: string): Observable<ItemResponse> {
    return this.apiService.post<ItemResponse, void>(
      "/items/" + slug + "/favorite",
    );
  }

  unfavorite(slug: string): Observable<ItemResponse> {
    return this.apiService.delete<ItemResponse>("/items/" + slug + "/favorite");
  }
}
