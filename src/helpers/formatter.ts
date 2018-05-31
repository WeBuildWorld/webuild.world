
/**
 *  Helper common functions that can be used in other situations when this class is reuthilzed.
 */
export class Hour {
	public static format2digits(num: number) {
		return num < 10 ? '0' + num : num;
	};

	public static durationToInputFormat(time: number): string { // Time in hours
		const hours = Math.floor(time);
		const minutes = Math.round((time - hours) * 60);
		return this.format2digits(hours) + ':' + this.format2digits(minutes);
	};

	// 03:30 => 3.5
	public static inputFormatToDuration(inputString: string): number { // Time in hours
		const hourMinute: string[] = inputString.split(':');
		const duration = parseInt(hourMinute[0], 0) + (parseInt(hourMinute[1], 0) / 60);
		return duration;
	};

	public static durationToHourMinuteString(time: number): string { // Time in hours
		const hours = Math.floor(time);
		const minutes = Math.round((time - hours) * 60);
		return hours + 'h' + (minutes > 0 ? ' ' + minutes + 'm' : '');
	}

	// if we get 12.33344, 2 decimals, we return 12.33
	public static durationRound(time: number, decimals: number) {
		const precision = 10 * decimals;
		// Multiplay by 10, round the rest, divide back by 10
		return Math.round(time * (precision)) / precision;
	}
}
