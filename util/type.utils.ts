export type PartialNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};

export type PartialUndefined<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | undefined;
};

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
