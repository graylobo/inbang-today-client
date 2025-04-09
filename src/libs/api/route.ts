type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RouteDefinition = { url: string; method: HTTPMethod };
export type RouteObject = { [key: string]: RouteDefinition | RouteObject };

export const API_ROUTES = {
  user: {
    profile: {
      get: { url: "/user/profile", method: "GET" },
    },
    list: {
      get: { url: "/user", method: "GET" },
    },
    admin: {
      update: { url: "/user/{userId}/admin", method: "PATCH" },
    },
    superAdmin: {
      update: { url: "/user/{userId}/super-admin", method: "PATCH" },
    },
  },
  userPermission: {
    user: {
      get: { url: "/user-permissions/user/{userId}", method: "GET" },
    },
    me: {
      crews: {
        get: { url: "/user-permissions/me/crews", method: "GET" },
      },
    },
    check: {
      get: { url: "/user-permissions/check/{crewId}", method: "GET" },
    },
    list: {
      get: { url: "/user-permissions", method: "GET" },
    },
    create: { url: "/user-permissions", method: "POST" },
    delete: {
      url: "/user-permissions/{userId}/crew/{crewId}",
      method: "DELETE",
    },
  },
  categories: {
    getAll: { url: "/categories", method: "GET" },
    getById: { url: "/categories/{id}", method: "GET" },
  },
  streamerCategories: {
    getByStreamer: {
      url: "/streamer-categories/streamer/{streamerId}",
      method: "GET",
    },
    getByCategory: {
      url: "/streamer-categories/category/{categoryId}",
      method: "GET",
    },
    setCategories: {
      url: "/streamer-categories/streamer/{streamerId}/categories",
      method: "POST",
    },
  },
} as const satisfies RouteObject;

// URL에서 경로 파라미터 추출하는 타입
export type ExtractPathParams<T extends string> =
  T extends `${infer Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : never;

// 경로 파라미터를 필수 키로 갖는 객체 타입 생성
export type PathParamsObject<T extends string> = {
  [K in ExtractPathParams<T>]: string | number;
};

// 경로 매개변수/쿼리 매개변수 치환
export function createUrl<
  T extends string,
  Q extends Record<string, string | number | boolean | undefined> = {}
>(
  urlTemplate: T,
  options?: {
    params?: T extends `${string}{${string}}${string}`
      ? PathParamsObject<T>
      : never;
    query?: Q;
  }
): string {
  // 반환 타입을 T에서 string으로 변경
  let url = urlTemplate as string; // 타입을 string으로 명시적 변환

  // 경로 매개변수 치환
  if (options?.params) {
    for (const key in options.params) {
      if (Object.prototype.hasOwnProperty.call(options.params, key)) {
        const value = options.params[key];
        url = url.replace(`{${key}}`, String(value));
      }
    }
  }

  // 쿼리 매개변수 추가
  if (options?.query) {
    const queryParams = Object.entries(options.query)
      .filter(([_, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");

    if (queryParams) {
      url += url.includes("?") ? `&${queryParams}` : `?${queryParams}`;
    }
  }

  return url;
}
