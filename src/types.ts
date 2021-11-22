export interface Snapshot {
	hostname: string;
	time: string;
	paths: string[];
}

export interface IBackup {
	name: string;
	progress: number;
	hostname: string;
}

export interface BackupEvent {
	message_type: string;
}

export interface BackupStatusEvent extends BackupEvent {
	bytes_done: number;
	files_done: number;
	percent_done: number;
	total_bytes: number;
	total_files: number;
	current_files: string[] | undefined;
}

export interface BackupSummaryEvent extends BackupEvent {
	data_added: number;
	data_blobs: number;
	dirs_changed: number;
	dirs_new: number;
	dirs_unmodified: number;
	files_changed: number;
	snapshot_id: string;
	total_bytes_processed: number;
	total_duration: number;
	total_files_processed: number;
	tree_blobs: number;
}
