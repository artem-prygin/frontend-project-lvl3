develop:
	npx webpack serve
install:
	npm ci
lint:
	npx eslint .
build:
	rm -rf dist
	NODE_ENV=production npx webpack
test:
	npx -n --experimental-vm-modules jest
test-watch:
	npx -n --experimental-vm-modules jest --watch
test-coverage:
	npx -n --experimental-vm-modules jest --coverage --coverageProvider=v8
