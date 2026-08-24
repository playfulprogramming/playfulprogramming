import { ReadonlyDeep } from "type-fest";

interface X {
  a: string;
  b: {
    c?: string;
    d?: string;
  };
}

type Z = Readonly<X>;
type Y = ReadonlyDeep<X>;

// when using in built Readonly, you can re-assing properties below one level
const z: Z = {
  a: "some string",
  b: {}
};

z.a = "1";
z.b.c = "2";

const y: Y = {
  a: "some string",
  b: {}
};

// all properties are immutable and can not be re-assigned
y.a = "1";
y.b.c = "2";
