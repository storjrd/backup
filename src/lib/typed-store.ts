import { AnyTxtRecord } from "dns";
import { VNodeNormalizedChildren } from "vue";

type StoreFunction = (...args: any) => any;
type StoreFunctions = { [key: string]: StoreFunction };

type ExceptFirstItem<T extends unknown[]> = T extends [infer H, ...infer R]
	? R
	: never;

// transform from   ({ commit, state }, ...params)  => result
// to               ("myStoreFunction", ...params)         => result
type TransformFunction<Key, Fn extends StoreFunction> = (
	arg0: Key,
	...args: ExceptFirstItem<Parameters<Fn>>
) => ReturnType<Fn>;

// transform all properties in StoreFunctions object to form above
type TransformProperties<T extends StoreFunctions> = {
	[K in keyof T]: TransformFunction<K, T[K]>;
};

type UnionOfProperties<T> = T[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type State = { [key: string]: any };

type Mutation = (...params: any) => void;
type Mutations = { [key: string]: Mutation };

type Getter = (...params: any) => any;
type Getters = { [key: string]: Getter };

type Action = (...params: any) => any;
type Actions = { [key: string]: Action };

// combine all action dispatch signatures into a single intersection type (via a union)
export type CreateDispatch<T extends Actions> = UnionToIntersection<
	UnionOfProperties<TransformProperties<T>>
>;

export type CreateGetterContext<G extends Getters> = {
	[K in keyof G]: ReturnType<G[K]>;
};

// combine all action dispatch signatures into a single intersection type (via a union)
export type CreateActionContext<
	S extends State,
	A extends Actions,
	M extends Mutations,
	G extends Getters
> = {
	state: S;
	commit: UnionToIntersection<UnionOfProperties<TransformProperties<M>>>;
	getters: CreateGetterContext<G>;
	dispatch: CreateDispatch<A>;
};
