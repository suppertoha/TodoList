export function getTasksLocalStorage() {
	try {
		const json = localStorage.getItem('tasks');
		return json ? JSON.parse(json) : [];
	} catch (e) {
		console.error('Ошибка чтения задач из localStorage:', e);
		return [];
	}
}

export function setTasksLocalStorage(tasks) {
	try {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	} catch (e) {
		console.error('Ошибка записи задач в localStorage:', e);
	}
}

export function generateUniqueId() {
	return typeof crypto?.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
