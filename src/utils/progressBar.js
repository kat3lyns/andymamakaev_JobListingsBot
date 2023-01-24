function progressBar(total, current, size = 20, line = '░', slider = '▓') {
	if(total == 0) return "["+line.repeat(size)+"]";
    
    if (current > total) {
		const bar = slider.repeat(size);
		const percentage = (current / total) * 100;

		return "["+bar+"]";
	} else {
		const percentage = current / total;
		const progress = Math.round((size * percentage));
		const emptyProgress = size - progress;
		const progressText = slider.repeat(progress);
		const emptyProgressText = line.repeat(emptyProgress);
		const bar = progressText + emptyProgressText;
		const calculated = percentage * 100;

		return "["+bar+"]";
	}
}

module.exports = {
    progressBar
}