all: lib/reliefweb.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --growl

jenkins:
	@mkdir build && JUNIT_REPORT_PATH=build/report.xml ./node_modules/.bin/mocha --reporter mocha-jenkins-reporter || true

clean:
	rm -Rf build

.PHONY: all test jenkins clean

