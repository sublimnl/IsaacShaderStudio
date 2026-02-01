export type ANM2AnimationFrame = {
	height: number;
	width: number;
	rotation: number;
	interpolated: number;
	visible: boolean;
	xPosition: number;
	yPosition: number;
	xPivot: number;
	yPivot: number;
	xCrop: number;
	yCrop: number;
	xScale: number;
	yScale: number,
	redTint: number;
	greenTint: number;
	blueTint: number;
	alphaTint: number;
	redOffset: number;
	greenOffset: number;
	blueOffset: number
}

export type ANM2LayerAnimation = {
	layerId: number;
	visible: boolean;
	frames: ANM2AnimationFrame[];
}

export type ANM2NullAnimation = {
	layerId: number;
	visible: boolean;
	frames: ANM2AnimationFrame[];
}

export type ANM2Trigger = {
	eventId: number;
	atFrame: number;
}
