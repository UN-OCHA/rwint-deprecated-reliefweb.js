all: lib/reliefweb.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --growl

jenkins:
	@NODE_ENV=test \
        JUNIT_REPORT_PATH=build/report.xml ./node_modules/.bin/mocha --reporter mocha-jenkins-reporter || true

init:
	@mkdir build

clean:
	rm -Rf build

.PHONY: all test jenkins clean init

