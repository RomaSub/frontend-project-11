install:
	npm ci

dev:
	npx webpack serve

lint:
	npx eslint .

fix:
	npx eslint --fix .

build:
 	rm -rf dist
 	NODE_ENV=production npx webpack