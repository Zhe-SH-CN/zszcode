/**
 * Utility types.
 */

/**
 * Recursively makes all properties of T readonly.
 */
export type DeepImmutable<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepImmutable<U>>
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
    : T extends Set<infer U>
      ? ReadonlySet<DeepImmutable<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
        : T

/**
 * Generates a union of all permutations of a tuple type.
 */
export type Permutations<T extends readonly string[]> = T extends readonly [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${First} ${Permutations<Rest>}` | First
  : never
