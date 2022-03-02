import type { Api } from "../api";

type ApiFn = (...params: any[]) => any;
type ApiT = { [key: string]: ApiFn };

type TransformFunction<Key, Fn extends ApiFn> = (
	arg0: Key,
	...args: Parameters<Fn>
) => ReturnType<Fn>;

type TransformProperties<T extends ApiT> = {
	[K in keyof T]: TransformFunction<K, T[K]>;
};

type UnionOfProperties<T> = T[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type CreateInvoke<T extends ApiT> = UnionToIntersection<
	UnionOfProperties<TransformProperties<T>>
>;

interface Backend {
	invoke: CreateInvoke<Api>;
}

const { backend } = window as unknown as { backend: Backend };

export default backend;
