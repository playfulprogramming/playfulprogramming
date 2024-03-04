export default `
@import url('https://fonts.googleapis.com/css2?family=Noto+Emoji&family=Roboto+Mono:wght@400;700&display=swap');

* {
	font-family: inherit;
}

pre {
	counter-reset: step;
	counter-increment: step 0;
	font-family: 'Roboto Mono', monospace;
}

pre code {
	display: block;
	position: relative;
	padding-left: 3.5rem;
	tab-size: 4;
	height: 1.4rem;
	color: #000;
}

pre code::before {
	content: counter(step);
	counter-increment: step;

	position: absolute;
	left: 1rem;
	width: 1rem;
	display: inline-block;
	text-align: right;
	color: #888;
}

.theme-0 {
	--color-screen-background: #FFF;
	--color-screen-border: #CCC;
	--color-rect-background: #8885;
	--color-rect-border: #FFF;
	--color-text: #000;
	--color-text-faded: rgba(0, 0, 0, 0.15);
}

.theme-1 {
	--color-screen-background: #DDD;
	--color-screen-border: #FFF;
	--color-rect-background: #8885;
	--color-rect-border: #777;
	--color-text: #555;
	--color-text-faded: rgba(0, 0, 0, 0.15);
}

.theme-1 pre {
	font-weight: bold;
}

.theme-2 {
	--color-screen-background: #FFF;
	--color-screen-border: #CCC;
	--color-rect-background: #FFF5;
	--color-rect-border: #FFF;
	--color-text: #000;
	--color-text-faded: rgba(0, 0, 0, 0);
}

.theme-2 .tags {
	-webkit-text-stroke: 3px #0003;
}

.codeScreenBg {
	perspective: 200px;
	perspective-origin: center;
}

.codeScreenBg {
	background: radial-gradient(ellipse 200% 100%, #EEE, #FFF);
	z-index: -4;
}

.codeScreen, .rect {
	--z: 0px;
	transform: rotateX(var(--rotX)) rotateY(var(--rotY)) rotateZ(336deg) translate(25%, -20%) translateZ(var(--z));
	transform-origin: center;
}

.codeScreen {
	height: 1000px;
	overflow: hidden;
	background-color: var(--color-screen-background);
	position: absolute;
	top: 0;
	left: var(--left);
	right: 0;
	box-shadow: 0 0 180px 0 #0002;
	border-radius: 20px;
	border-left: 10px solid var(--color-screen-border);
}

.rect {
	width: 180px;
	height: 180px;
	background-color: var(--color-rect-background);
	backdrop-filter: blur(2px);
	border: 4px solid var(--color-rect-border);
	box-shadow: -40px -10px 30px #0005;

	--x: 0px;
	--y: 0px;
	--z: 80px;

	position: absolute;
	top: calc(50% + var(--y));
	left: calc(50% + var(--x));
}

.rect svg {
	margin: 20px;
    width: calc(100% - 40px);
	height: calc(100% - 40px);
	filter: grayscale(1);
}

.rect.emoji {
	font-family: 'Noto Emoji';
	font-size: 100px;
	color: #333;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tags {
	position: absolute;
	top: 25%;
	left: 5%;
	font-size: 10rem;
	font-family: monospace;
	text-transform: uppercase;
	font-weight: bolder;
}

.tags span {
	display: block;
	color: var(--color-text-faded);
}

pre code {
	color: var(--color-text) !important;
	text-shadow: currentColor 1px 0 10px;
}

.absoluteFill {
	height: 100%;
	width: 100%;
	position: absolute;
	box-sizing: border-box;
	top: 0;
	left: 0;
}

.codeScreenOverlay {
	background: linear-gradient(340deg, rgba(0,0,0,.5), rgba(0,0,0,0)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
	background-blend-mode: screen;
	filter: contrast(800%) brightness(200%) saturate(0%);
	opacity: 0.1;
	z-index: -2;
}
`;
