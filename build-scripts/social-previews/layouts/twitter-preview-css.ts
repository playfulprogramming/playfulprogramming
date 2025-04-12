export default `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@700;800&family=Noto+Color+Emoji&family=Roboto+Mono:wght@400;700&display=swap');

* {
  font-family: inherit;
}

pre {
	counter-reset: step;
	counter-increment: step 0;
	font-family: 'Roboto Mono', monospace;
  overflow: hidden;

  font-size: 1.2rem;
  font-weight: 700;
  padding: 0 1rem;
  margin: 0;
}

pre code {
	display: block;
	position: relative;
	padding-left: 3.5rem;
	tab-size: 4;
	height: 1.4rem;
  color: #FFF;
}

pre code::before {
	content: counter(step);
	counter-increment: step;

	position: absolute;
	left: 1rem;
	width: 1rem;
	display: inline-block;
	text-align: right;
  color: #FFFA;
}

.codeScreenOverlay, .codeScreenBg {
  perspective: 1000px;
  perspective-origin: 50% 50%;
}

.codeScreenBg {
  background: hsl(205 100% 73%);
  z-index: -4;
}

.codeScreenBg::after {
  position: absolute;
  bottom: 0;
  right: -30%;
  width: 100%;
  height: 200px;
  background: radial-gradient(closest-side, rgba(255,255,255,0.1), rgba(255,255,255,0));
  transform: rotateZ(25deg);
  content: ' ';
}

.codeScreen {
  height: 200% !important;
  width: 115% !important;
  transform-origin: 50% 50%;
  transform: rotate3d(0.7, 1, 0.3, 45deg);
  background: hsl(205 100% 60%);
  border-radius: 8px;
  box-shadow: 0 0 28px #000;
}

.codeScreenOverlay {
  -webkit-mask: radial-gradient(circle 500px at 25% 50%, #0000, #000F);
  backdrop-filter: blur(10px);
  z-index: -2;
}

.absoluteFill {
  height: 100%;
  width: 100%;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background-size: cover;
}

.backgroundColor {
  background: radial-gradient(ellipse 100% 100% at 0% 100%, #C8E6FF, #C8E6FFA8 50%, #C8E6FF00),
    hsl(205 100% 70% / 60%);
}

.content {
  font-family: 'Figtree', 'Noto Color Emoji', sans-serif;
  padding: 64px;

  display: flex;
  flex-direction: column;
  gap: 48px;
}

.url {
  color: #00344D;
  background-color: #C8E6FF;
  border-radius: 64px;

  padding: 8px 32px;
  height: 64px;

  display: inline-flex;
  align-items: center;
  font-size: 2.25rem;
  font-weight: 600;
}

h1 {
  font-weight: 800;
  color: #00344D;
  margin: 2px;

  position: relative;
  z-index: 1;

  filter:
    drop-shadow( 0px  1px #E5F2FF)
    drop-shadow( 0px -1px #E5F2FF)
    drop-shadow( 1px  0px #E5F2FF)
    drop-shadow(-1px  0px #E5F2FF)
    drop-shadow( 2px  2px #E5F2FF)
    drop-shadow( 2px -2px #E5F2FF)
    drop-shadow(-2px  2px #E5F2FF)
    drop-shadow(-2px -2px #E5F2FF)
    drop-shadow( 0px  2px #E5F2FF)
    drop-shadow( 0px -2px #E5F2FF)
    drop-shadow( 2px  0px #E5F2FF)
    drop-shadow(-2px  0px #E5F2FF)
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
}

.authorImages {
  display: flex;
}

.authorImage {
  border: 6px solid #FFF;
  border-radius: 50%;
}

.authorImage:not(:first-child) {
  margin-left: -50px;
}

.postInfo {
	display: flex;
	flex-direction: column;
  gap: 4px;
  font-weight: 500;
}

.authors {
  font-size: 2.25rem;
  color: #00344D;
}

.date {
  font-size: 2rem;
  color: #006590;
}

.unicorn {
  flex-grow: 1;
  display: flex;
  justify-content: right;
  align-items: center;
  height: 0;
  overflow: visible;
}

.unicorn > svg {
  width: 120px;
  height: 120px;
}
`;
