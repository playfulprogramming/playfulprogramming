import style from "./long-wave.module.scss";
import longWave from "../../../../../public/patterns/long_wave.svg?raw";

export function LongWave() {
	return (
		<div className={style.loopContainer}>
			<div className={style.loop_line}>
				<span
					className={style.longWaveSpan}
					dangerouslySetInnerHTML={{ __html: longWave }}
				></span>
				<span
					className={style.longWaveSpan}
					dangerouslySetInnerHTML={{ __html: longWave }}
				></span>
				<span
					className={style.longWaveSpan}
					dangerouslySetInnerHTML={{ __html: longWave }}
				></span>
			</div>
			<div className={style.loopFade} />
			<div className={style.loopFadeRight} />
		</div>
	);
}
