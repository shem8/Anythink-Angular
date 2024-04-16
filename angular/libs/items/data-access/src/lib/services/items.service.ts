import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "@realworld/core/http-client";
import {
  Item,
  ItemResponse,
  MultipleCommentsResponse,
  SingleCommentResponse,
} from "@realworld/core/api-types";
import { HttpParams } from "@angular/common/http";
import { ItemsListConfig } from "../models/items-list.model";

@Injectable({ providedIn: "root" })
export class ItemsService {
  private readonly apiService = inject(ApiService);

  getItem(slug: string): Observable<ItemResponse> {
    return this.apiService.get<ItemResponse>("/items/" + slug);
  }

  getComments(slug: string): Observable<MultipleCommentsResponse> {
    return this.apiService.get<MultipleCommentsResponse>(
      `/items/${slug}/comments`,
    );
  }

  deleteItem(slug: string): Observable<void> {
    return this.apiService.delete<void>("/items/" + slug);
  }

  deleteComment(commentId: number, slug: string): Observable<void> {
    return this.apiService.delete<void>(
      `/items/${slug}/comments/${commentId}`,
    );
  }

  addComment(slug: string, payload = ""): Observable<SingleCommentResponse> {
    return this.apiService.post<
      SingleCommentResponse,
      { comment: { body: string } }
    >(`/items/${slug}/comments`, {
      comment: { body: payload },
    });
  }

  query(
    config: ItemsListConfig,
  ): Observable<{ items: Item[]; itemsCount: number }> {
    return this.apiService.get(
      "/items" + (config.type === "FEED" ? "/feed" : ""),
      this.toHttpParams(config.filters),
    );
  }

  publishItem(item: Item): Observable<ItemResponse> {
    if (item.slug) {
      return this.apiService.put<ItemResponse, ItemResponse>(
        "/items/" + item.slug,
        {
          item: item,
        },
      );
    }
    return this.apiService.post<ItemResponse, ItemResponse>(
      "/items/",
      { item: item },
    );
  }

  // TODO: remove any
  private toHttpParams(params: any) {
    return Object.getOwnPropertyNames(params).reduce(
      (p, key) => p.set(key, params[key]),
      new HttpParams(),
    );
  }
}
