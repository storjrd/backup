default:
	npm run build; npm start

prettier:
	npx prettier --write . !dist
