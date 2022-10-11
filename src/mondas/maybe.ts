/*
Motivation:

Let's imagine a data structure like a map with such an interface

Map<K,V> {
  set(k: K, v: V) => void
  get(k: K) => V
}

When we want to get some data out of the Map we can't be sure if
the key we used actually existed. What do we return from the Map in such
a case and remain type safe? Null? Undefined? Throw an error?

We don't want to throw an error, that's just annoying!
Also, there is no typesafe way to make sure we handle that thrown error.

What about null or undefined?

Map<K,V> {
  set(k: K, v: V) => void
  get(k: K) => V | undefined
}

const value = Map<string, number>.get("some key")
if (value === undefined)
  handle the missing key

But what if our value is a union with undefined?

const value Map<string, number | undefined>.get("some key")
if (value === undefined)
  ... what does that mean? Is the key missing? Is the value undefined?

Maybe<T> = Some<T> | None<T>
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars
export interface Maybe<Just> {
  map: <NewJust>(
    m: (just: Just) => NewJust
  ) => Maybe<NewJust>

  match: <Some, None>(
    onSome: (just: Just) => Some,
    onNone: () => None,
  ) => Some | None
}
interface Some<Just> extends Maybe<Just> {
  just: Just

  map: <NewJust>(
    m: (just: Just) => NewJust
  ) => Some<NewJust>

  match: <Some, None>(
    onSome: (just: Just) => Some,
    onNone: () => None,
  ) => Some
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface None<Just> extends Maybe<Just>{
  map: <NewJust>(
    m: (just: Just) => NewJust
  ) => None<NewJust>

  match: <Some, None>(
    onSome: (just: Just) => Some,
    onNone: () => None,
  ) => None
}

export function isSome<Just>(maybe: Maybe<Just>): maybe is Some<Just> {
  return "just" in maybe;
}

export function isNone<Just>(maybe: Maybe<Just>): maybe is None<Just> {
  return !isSome(maybe);
}

export function some<Just>(just: Just): Some<Just> {
  return {
    just,
    map: (m) => some(m(just)),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match: (onSome, _) => onSome(just),
  };
}

export function none<Just>(): None<Just> {
  return {
    map: () => none(),
    match: (_, onNone) => onNone(),
  };
}
