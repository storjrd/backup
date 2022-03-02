export interface Snapshot {
	time: string;
	parent: string;
	tree: string;
	paths: string[];
	hostname: string;
	username: string;
	uid: Number;
	gid: Number;
	id: string;
	short_id: string;
}

export interface Backup {
	name: string;
	historic: {
		id: string;
		time: string;
		name: string;
		progress: number;
		hostname: string;
	}[];
}

export type BackupStatusEvent = {
	message_type: "status";
	bytes_done: number;
	files_done: number;
	percent_done: number;
	total_bytes: number;
	total_files: number;
	current_files: string[] | undefined;
};

export type BackupSummaryEvent = {
	message_type: "summary";
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
};

export type BackupEvent = BackupStatusEvent | BackupSummaryEvent;

export interface ModalConfig {
	backupId: string;
	view: string;
}

export type AccountTypes = {
	freeAccount: string;
};
