install:
	npm ci

dev:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

fix:
	npx eslint --fix .	
