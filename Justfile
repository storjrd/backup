default:
	npm run build; STORJ_BACKUP_USE_RELATIVE_RESTIC=true STORJ_BACKUP_DEV=false npm start

dev:
	npm run serve & npm run build-backend && STORJ_BACKUP_USE_RELATIVE_RESTIC=true STORJ_BACKUP_DEV=true npm start

backend:
	npm run build-backend && STORJ_BACKUP_USE_RELATIVE_RESTIC=true STORJ_BACKUP_DEV=true npm start

frontend:
	npm run serve

prettier:
	npx prettier --write . !dist

download-restic:
	rm -rf restic;
	mkdir -p restic;
	
	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_linux_amd64.bz2 -P restic/;
	bzip2 -dk restic/restic_0.12.1_linux_amd64.bz2;
	rm restic/restic_0.12.1_linux_amd64.bz2;
	chmod +x restic/restic_0.12.1_linux_amd64;
	
	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_windows_amd64.zip -P restic/;
	unzip -o restic/restic_0.12.1_windows_amd64.zip -d restic/;
	rm restic/restic_0.12.1_windows_amd64.zip;

	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_darwin_amd64.bz2 -P restic/;
	bzip2 -dk restic/restic_0.12.1_darwin_amd64.bz2;
	rm restic/restic_0.12.1_darwin_amd64.bz2;
	chmod +x restic/restic_0.12.1_darwin_amd64;

	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_darwin_arm64.bz2 -P restic/;
	bzip2 -dk restic/restic_0.12.1_darwin_arm64.bz2;
	rm restic/restic_0.12.1_darwin_arm64.bz2;
	chmod +x restic/restic_0.12.1_darwin_arm64;
