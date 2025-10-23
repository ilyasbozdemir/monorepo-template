type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Utility class to build URLs with path segments and query parameters.
 * Can be used to construct any API Uç Noktasıs dynamically.
 */
export class UrlBuilder {
  private baseUrl: string;
  private segments: string[] = [];
  private query: QueryParams = {};

  /**
   * Initializes a new UrlBuilder.
   * @param baseUrl - Optional base URL to start from (default is empty string).
   */
  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  /**
   * Sets or updates the base URL.
   * @param url - The new base URL.
   * @returns Current instance for chaining.
   */
  setBase(url: string) {
    this.baseUrl = url;
    return this;
  }
  /**
   * Adds a path segment to the URL.
   * @param segment - Path segment (e.g., "users", "v1").
   * @returns Current instance for chaining.
   */
  addSegment(segment: string) {
    this.segments.push(segment);
    return this;
  }
  /**
   * Sets or updates query parameters.
   * @param params - Object with key-value pairs representing query parameters.
   * @returns Current instance for chaining.
   */
  setQuery(params: QueryParams) {
    this.query = { ...this.query, ...params };
    return this;
  }
  /**
   * Removes a query parameter by key.
   * @param key - The key of the query parameter to remove.
   * @returns Current instance for chaining.
   */
  removeQuery(key: string) {
    delete this.query[key];
    return this;
  }
  /**
   * Builds the full URL string including path segments and query parameters.
   * @returns Fully constructed URL as a string.
   */
  build(): string {
    const path = this.segments.map((s) => s.replace(/^\/|\/$/g, "")).join("/");
    const queryString = Object.entries(this.query)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
      .join("&");

    let url = this.baseUrl.replace(/\/$/, "");
    if (path) url += "/" + path;
    if (queryString) url += "?" + queryString;

    return url;
  }
}
