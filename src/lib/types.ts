export interface Task {
	id: number;
	text: string;
	done: boolean;
	sortOrder: number;
	createdAt: number;
	updatedAt: number;
	priority: 'low' | 'medium' | 'high';
	category: string;
	dueDate?: number | null;
}

export interface Activity {
	id: string;
	type: 'add' | 'delete' | 'toggle' | 'edit' | 'reorder';
	taskText: string;
	timestamp: number;
}
