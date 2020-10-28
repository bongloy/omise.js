export interface Attributes {
  [s: string]: Object;
}

export interface Response {
  status: number;
  data:   Attributes;
}
