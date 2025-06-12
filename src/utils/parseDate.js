export function parseDateLong(dateString) {
	try {
        if (!dateString) return '';
        if (typeof dateString !== 'string') throw new Error('Invalid date string');
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
		  year: 'numeric',
		  month: 'long',
		  day: '2-digit',
		  hour: '2-digit',
		  minute: '2-digit',
		  hour12: true
		});
    } catch (error) {
		console.error('Error parsing date:', error);
        return '';
    }
}
export function parseDateShort(dateString) {
	try {
        if (!dateString) return '';
        if (typeof dateString !== 'string') throw new Error('Invalid date string');
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
		  year: 'numeric',
		  month: 'long',
		  day: '2-digit'
		});
    } catch (error) {
		console.error('Error parsing date:', error);
        return '';
    }
}