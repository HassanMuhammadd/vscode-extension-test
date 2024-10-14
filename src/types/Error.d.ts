export type Error = {
	fileName: string;
	line: number;
	type: number;
};

export type ReturnedError = Error & {
	checked: boolean;
};