export default `
.codeScreenBg {
	perspective: 200px;
	perspective-origin: center;
}

.codeScreenBg {
	background: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCABIAIADASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHhWUyNsqZRozlhDTXvDldLnCzW01KcbCmF9ImmSIotuy2G3veW9DFnC73mxUaM1XW5WTqATTGIG0iWvER2OWoggpNMQwBAwAJXGeWpmRa4mUtgQbiA0DAd4FgAAKIEEBCICiB//8QAIxAAAQQBBAIDAQAAAAAAAAAAAQACAxESECEwMSAyBBMiI//aAAgBAQABBQIbK9ogpRsw4optlRsNy+jk/rRyPg12zjaeaR9Gdtbala5SDUJ6LdtR2U0onaHuJv5LLMyDb0j9p+28AdivjzD63yU2U26/56ONnzvSGXFfbm1x/XM11c+JWJ5KKDfAhYqvOkBw0sVjp//EABQRAQAAAAAAAAAAAAAAAAAAAFD/2gAIAQMBAT8BI//EABQRAQAAAAAAAAAAAAAAAAAAAFD/2gAIAQIBAT8BI//EABsQAAMAAwEBAAAAAAAAAAAAAAABIRARIDBg/9oACAEBAAY/AsTEzCi4XSRpEzti96QvF8abS+Y//8QAHxAAAwACAgMBAQAAAAAAAAAAAAERITEQQSBRYTBx/9oACAEBAAE/IWC7RjVT+sQ6XuFc9cs31ntiNwbcLJazs2b2dHYsHZoy2ZZfPRCaIX7iGoZzgXitG4nklwQSmy2W24fC0jCkE5p+I2TIdbRTr2IXSlSsCpPCQgfxxmtImDrPkQ8jdSd8D2Yg2HRn9D2JxpmQL43hZDdKUmqkN25xdFm/ajMEbf4rjriNnwIdeM807oStkS65Sx+o2XKXgrFr8WrI4Q//2gAMAwEAAgADAAAAELF3261HEKNNDcYDWOBNCizLMDBPOYaJPPIXfHfYXP/EABQRAQAAAAAAAAAAAAAAAAAAAFD/2gAIAQMBAT8QI//EABkRAQACAwAAAAAAAAAAAAAAAAEAESAwQP/aAAgBAgEBPxDWwzSBXJ//xAAeEAEAAwEBAAMBAQAAAAAAAAABABEhMUEQUWFxgf/aAAgBAQABPxBVDED24YAfYyo4Vw9juZZ/JELbL2D6mBShKHOuv3GodNltJsiUZSpo9fs6H3KhChxss1ucJ1nsVy8nbiuBOJl0z1BayVAKHr1ZRwAL/s5eWwPZWWR4djk0u7KVMAz9jqksb3Iz9RGEuFpEos5HSyDaDOZdRcnnsESg3m+T0oTFTarZYzl9RL4obCNxQk17P9gDFr3ZQKyZYADyHRZKilpeX8FXZH7IKWx0n3LICBabuMc0mn7iGReseW6sijAKNXexalcOkfslgnXZyH8g7MMuIWuWLZX14mU5SzEZi3TRBTjHWDVkLj2XPIYQdiCuxorbi1LghuBKZFVftj1jjk9tgk9jRCPZ18ZFCwRQX8Ytahl/cI6/k/Jgh+x35DdyBbkcqN7TDkHws6Z/scbU6gxT6grjLJWwiEREEFLYQZfww/Y5EGeRP22IDrCs/9k='), radial-gradient(ellipse 200% 100%, #EEE, #FFF);
	background-blend-mode: screen;
	background-size: cover;
	z-index: -4;
}

.codeScreenBg.blur {
	--gradient: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1));
	-webkit-mask-image: var(--gradient);
	mask-image: var(--gradient);
	filter: blur(5px);
}

.codeScreen, .rect {
	--z: 0px;
	transform: rotateX(var(--rotX)) rotateY(21deg) rotateZ(336deg) translate(25%, -20%) translateZ(var(--z));
	transform-origin: center;
}

.codeScreen {
	height: 1000px;
	overflow: hidden;
	background-color: #FFF;
	position: absolute;
	top: 0;
	left: 20%;
	right: 0;
	box-shadow: 0 0 180px 0 #0002;
	border-radius: 20px;
	border-left: 10px solid #CCC;
}

.rect {
	width: 180px;
	height: 180px;
	background-color: #8885;
	backdrop-filter: blur(2px);
	border: 4px solid #FFF;
	box-shadow: -80px -10px 30px #0005;

	--x: 0px;
	--y: 0px;
	--z: 80px;

	position: absolute;
	top: calc(50% + var(--y));
	left: calc(50% + var(--x));
}

.rect img {
	margin: 20px;
    width: calc(100% - 40px);
	filter: grayscale(1);
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
	color: rgba(0, 0, 0, 0.15);
}

pre {
	background: none !important;
	border: none !important;
	color: #000 !important;
}

pre code span {
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
