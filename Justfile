default:
	npm run build; STORJ_BACKUP_DEV=false npm start

dev:
	npm run serve & STORJ_BACKUP_DEV=true npm start

backend:
	STORJ_BACKUP_DEV=true npm start

frontend:
	npm run serve

prettier:
	npx prettier --write . !dist

download-restic:
	rm -rf bin;
	mkdir -p bin;
	
	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_linux_amd64.bz2 -P bin/;
	bzip2 -dk bin/restic_0.12.1_linux_amd64.bz2;
	rm bin/restic_0.12.1_linux_amd64.bz2;
	chmod +x bin/restic_0.12.1_linux_amd64;
	
	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_windows_amd64.zip -P bin/;
	unzip -o bin/restic_0.12.1_windows_amd64.zip -d bin/;
	rm bin/restic_0.12.1_windows_amd64.zip;

	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_darwin_amd64.bz2 -P bin/;
	bzip2 -dk bin/restic_0.12.1_darwin_amd64.bz2;
	rm bin/restic_0.12.1_darwin_amd64.bz2;
	chmod +x bin/restic_0.12.1_darwin_amd64;

	wget https://github.com/restic/restic/releases/download/v0.12.1/restic_0.12.1_darwin_arm64.bz2 -P bin/;
	bzip2 -dk bin/restic_0.12.1_darwin_arm64.bz2;
	rm bin/restic_0.12.1_darwin_arm64.bz2;
	chmod +x bin/restic_0.12.1_darwin_arm64;
