// Convex runtime globals — these are available in Convex actions
// https://docs.convex.dev/functions/actions#built-in-libraries

// fetch is globally available in Convex actions
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

// Response is globally available
declare class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit);
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  json(): Promise<any>;
  text(): Promise<string>;
}

declare interface ResponseInit {
  headers?: HeadersInit;
  status?: number;
  statusText?: string;
}

declare type BodyInit = ReadableStream | XMLHttpRequestBodyInit;
declare type XMLHttpRequestBodyInit = Blob | BufferSource | FormData | URLSearchParams | string;
declare type HeadersInit = [string, string][] | Record<string, string> | Headers;

declare class Headers {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  forEach(callbackfn: (value: string, key: string) => void): void;
}

type RequestInfo = Request | string;

declare class Request {
  constructor(input: RequestInfo, init?: RequestInit);
  json(): Promise<any>;
}

declare interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
}
