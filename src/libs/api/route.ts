type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RouteDefinition = { url: string; method: HTTPMethod };
export type RouteObject = { [key: string]: RouteDefinition | RouteObject };

export const API_ROUTES = {
  auth: {
    login: { url: "/auth/login", method: "POST" },
    logout: { url: "/auth/logout", method: "POST" },
    register: { url: "/auth/register", method: "POST" },
    me: { url: "/auth/me", method: "GET" },
    verifyNickname: { url: "/auth/verify-nickname", method: "GET" },
    updateNickname: { url: "/auth/update-nickname", method: "POST" },
    completeSocialSignup: {
      url: "/auth/complete-social-signup",
      method: "POST",
    },
  },
  points: {
    my: { url: "/points/my", method: "GET" },
    myBadges: { url: "/points/my/badges", method: "GET" },
    userRank: { url: "/points/user/{userId}", method: "GET" },
    userBadges: { url: "/points/user/{userId}/badges", method: "GET" },
    leaderboard: { url: "/points/leaderboard", method: "GET" },
  },
  user: {
    profile: {
      get: { url: "/user/profile", method: "GET" },
      updateImage: { url: "/user/profile/image", method: "PATCH" },
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
  boards: {
    list: { url: "/boards", method: "GET" },
    getBySlug: { url: "/boards/slug/{slug}", method: "GET" },
  },
  posts: {
    getByBoard: { url: "/posts/board/{boardId}", method: "GET" },
    getByBoardSlug: { url: "/posts/board/slug/{slug}", method: "GET" },
    getById: { url: "/posts/{id}", method: "GET" },
    create: { url: "/posts", method: "POST" },
    update: { url: "/posts/{id}", method: "PUT" },
    delete: { url: "/posts/{id}", method: "DELETE" },
    toggleNotice: { url: "/posts/{id}/notice", method: "PATCH" },
    moveNoticeUp: { url: "/posts/{id}/notice-order/up", method: "PATCH" },
    moveNoticeDown: { url: "/posts/{id}/notice-order/down", method: "PATCH" },
    setNoticeOrder: { url: "/posts/{id}/notice-order", method: "PATCH" },
  },
  comments: {
    getByPost: { url: "/comments/post/{postId}", method: "GET" },
    getBestByPost: { url: "/comments/post/{postId}/best", method: "GET" },
    create: { url: "/comments", method: "POST" },
    createReply: { url: "/comments/{parentId}/reply", method: "POST" },
    update: { url: "/comments/{id}", method: "PUT" },
    delete: { url: "/comments/{id}", method: "DELETE" },
    verifyPassword: { url: "/comments/{id}/verify-password", method: "POST" },
  },
  eloRankings: {
    monthly: {
      get: { url: "/elo-rankings/monthly", method: "GET" },
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
  streamers: {
    list: { url: "/streamers", method: "GET" },
    getById: { url: "/streamers/{id}", method: "GET" },
    create: { url: "/streamers", method: "POST" },
    update: { url: "/streamers/{id}", method: "PUT" },
    delete: { url: "/streamers/{id}", method: "DELETE" },
    removeFromCrew: { url: "/streamers/{id}/remove-from-crew", method: "POST" },
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
  likes: {
    posts: {
      getStatus: { url: "/likes/posts/{postId}/status", method: "GET" },
      getCounts: { url: "/likes/posts/{postId}/count", method: "GET" },
      like: { url: "/likes/posts/{postId}/like", method: "POST" },
      dislike: { url: "/likes/posts/{postId}/dislike", method: "POST" },
    },
    comments: {
      getStatus: { url: "/likes/comments/{commentId}/status", method: "GET" },
      getCounts: { url: "/likes/comments/{commentId}/count", method: "GET" },
      like: { url: "/likes/comments/{commentId}/like", method: "POST" },
      dislike: { url: "/likes/comments/{commentId}/dislike", method: "POST" },
    },
  },
  crewMemberHistory: {
    get: { url: "/crew-member-histories/streamer/{streamerId}", method: "GET" },
    create: { url: "/crew-member-histories", method: "POST" },
    update: { url: "/crew-member-histories/{id}", method: "PUT" },
    delete: { url: "/crew-member-histories/{id}", method: "DELETE" },
  },
  crawler: {
    broadcasts: { url: "/crawler/broadcasts", method: "GET" },
    liveCrews: { url: "/crawler/live-crews", method: "GET" },
    matchHistory: { url: "/crawler/match-history", method: "GET" },
    saveMatchData: { url: "/crawler/save-match-data", method: "GET" },
    updateSoopIds: { url: "/crawler/update-soop-ids", method: "GET" },
  },
  crews: {
    list: { url: "/crews", method: "GET" },
    getById: { url: "/crews/{crewId}", method: "GET" },
    create: { url: "/crews", method: "POST" },
    update: { url: "/crews/{id}", method: "PUT" },
    delete: { url: "/crews/{id}", method: "DELETE" },
    rankings: { url: "/crews/rankings", method: "GET" },
    updateSignatureOverviewImageUrl: {
      url: "/crews/{id}/signature-overview-image-url",
      method: "PATCH",
    },
  },
  crewRanks: {
    getByCrewId: { url: "/crew-ranks/crew/{crewId}", method: "GET" },
  },
  crewEarnings: {
    getByCrewId: { url: "/crew-earnings/crew/{crewId}", method: "GET" },
    create: { url: "/crew-earnings", method: "POST" },
  },
  crewBroadcasts: {
    create: { url: "/crew-broadcasts", method: "POST" },
  },
  crewSignatures: {
    getByCrewId: { url: "/crew-signatures/crew/{crewId}", method: "GET" },
    create: { url: "/crew-signatures", method: "POST" },
    update: { url: "/crew-signatures/{id}", method: "PUT" },
    delete: { url: "/crew-signatures/{id}", method: "DELETE" },
  },
  soopAuth: {
    generateCode: { url: "/soop-auth/generate-code", method: "POST" },
    verify: { url: "/soop-auth/verify", method: "POST" },
    status: { url: "/soop-auth/status", method: "GET" },
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
