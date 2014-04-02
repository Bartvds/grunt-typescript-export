'use strict';

var grunt = require('grunt');
var assert = require('assert');

describe('export', function () {
  it('first', function () {
    var actual = grunt.file.read('test/tmp/first.d.ts').replace(/\r?\n/g, '\n');
    var expected = grunt.file.read('test/expected/first.d.ts').replace(/\r?\n/g, '\n');
    assert.strictEqual(actual, expected, 'should match the expected first.d.ts');
  });
  it('first nested', function () {
    var actual = grunt.file.read('test/tmp/nested/first-nested.d.ts').replace(/\r?\n/g, '\n');
    var expected = grunt.file.read('test/expected/first-nested.d.ts').replace(/\r?\n/g, '\n');
    assert.strictEqual(actual, expected, 'should match the expected first-nested.d.ts');
  });
});