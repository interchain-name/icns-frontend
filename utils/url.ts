import { TwitterLoginSuccess } from "../types";
import { TWITTER_LOGIN_ERROR } from "../constants/error-message";

export function request<TResponse>(
  url: string,
  config: RequestInit = {},
): Promise<TResponse> {
  return fetch(url, config)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((data) => data as TResponse);
}

export function buildQueryString(query: Record<string, any>): string {
  return Object.entries(query)
    .map(([key, value]) =>
      key && value
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : "",
    )
    .join("&");
}

export const checkTwitterAuthQueryParameter = (
  query: string,
): TwitterLoginSuccess => {
  // Twitter Login Error Check
  if (query.match("error")) {
    throw new Error(TWITTER_LOGIN_ERROR);
  }

  // Twitter state, auth code check
  const [, state, code] =
    query.match(/^(?=.*state=([^&]+)|)(?=.*code=([^&]+)|).+$/) || [];

  return {
    state,
    code,
  };
};
