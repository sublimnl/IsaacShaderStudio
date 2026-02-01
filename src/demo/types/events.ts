export interface LoadingEvent extends Event {
	readonly detail: {
		progress: number;
	};
}

export interface TickEvent extends Event {
	readonly detail?: {
		delta: number;
		fps: string;
	};
}


export interface OnFocusEvent extends Event {
	readonly detail?: {
		state: boolean;
	};
}
