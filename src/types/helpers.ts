export type SObj = Record<string, any>;

export type KeyArr<T> = Array<keyof T>;

// Util type to only keep the keys from an array of an object
export type Picked<Obj extends SObj, Keys extends KeyArr<Obj>> = {
  // This also works
  // [key in keyof Obj as Exclude<Keys[number], key>]: Obj[key];
  [key in keyof Obj as key extends Keys[number] ? key : never]: Obj[key];
};
