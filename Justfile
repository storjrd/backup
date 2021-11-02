default:
	npm run build; npm start

dev:
	npm run serve & STORJ_BACKUP_DEV=true npm start

prettier:
	npx prettier --write . !dist
