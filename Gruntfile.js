'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: {
      name: 'foo'
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      test: ['tmp', 'test/tmp']
    },
    typescript_export: {
      first: {
        options: {
        },
        files: {
          'test/tmp/first.d.ts': ['test/fixtures/api.d.ts', 'test/fixtures/foo.d.ts', 'test/fixtures/bar.d.ts']
        }
      },
      first_deeper: {
        options: {
        },
        files: {
          'test/tmp/nested/first-nested.d.ts': ['test/fixtures/api.d.ts', 'test/fixtures/foo.d.ts', 'test/fixtures/bar.d.ts']
        }
      }
    },
    mochaTest: {
      options: {
        reporter: 'mocha-unfunk-reporter',
        timeout: 3000
      },
      spec: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['clean:test', 'typescript_export', 'mochaTest:spec']);

  grunt.registerTask('default', ['jshint', 'test']);
};
