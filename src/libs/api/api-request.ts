"use server";

import { api } from "@/libs/api/axios";
import { createUrl, PathParamsObject, RouteDefinition } from "@/libs/api/route";

// 경로 파라미터가 있는 URL만 params를 받도록 타입 제한
export async function apiRequest<
  T = any,
  TUrl extends string = string,
  TQuery extends Record<string, string | number | boolean | undefined> = {}
>(
  route: RouteDefinition & { url: TUrl },
  options?: {
    params?: TUrl extends `${string}{${string}}${string}`
      ? PathParamsObject<TUrl>
      : never;
    query?: TQuery;
    body?: any;
  }
): Promise<T> {
  const url = createUrl(route.url, {
    params: options?.params,
    query: options?.query,
  });

  const method = route.method.toLowerCase() as
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch";

  // HTTP 메서드별로 처리 방식 구분
  if (method === "get" || method === "delete") {
    return api[method](url).then((response) => response.data);
  } else {
    return api[method](url, options?.body).then((response) => response.data);
  }
}
