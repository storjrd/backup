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
