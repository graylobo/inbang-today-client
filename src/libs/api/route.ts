type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RouteDefinition = { url: string; method: HTTPMethod };
type RouteObject = { [key: string]: RouteDefinition | RouteObject };

export const API_ROUTES = {
  user: {
    profile: {
      get: { url: "/user/profile", method: "GET" },
    },
  },
} as const satisfies RouteObject;
