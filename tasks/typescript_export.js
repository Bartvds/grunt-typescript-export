'use strict';

module.exports = function (grunt) {
  var path = require('path');
  var referenceTagExp = /\/\/\/ <reference path=["']?([\w\.\/_-]*)["']? *\/>/g;

  function parseRef(str, baseDir) {
    referenceTagExp.lastIndex = 0;
    var match = referenceTagExp.exec(str);
    if (match) {
      if (typeof baseDir === 'string') {
        return path.resolve(baseDir, match[1]);
      }
      return path.resolve(match[1]);
    }
    return null;
  }

  function serialiseRef(target, baseDir) {
    if (typeof baseDir === 'string') {
      target = path.relative(baseDir, target);
    }
    return '/// <reference path="' + target.replace(/\\/g, '/') + '" />';
  }

  grunt.registerMultiTask('typescript_export', 'Concat all .d.ts into a single file for external clients to import.', function () {
    grunt.config.requires('pkg.name');
    var options = this.options({
      packageName: grunt.config('pkg.name') || 'namespace',
      indent: '    ',
      newLine: '\n'
    });

    this.files.forEach(function (group) {
      var snippets = [];
      var references = [];
      var imports = [];
      var sources = [];
      var localImportsToStrip = [];
      var dest = path.resolve(group.dest);
      var indent = options.indent;
      var baseDir = path.dirname(dest);

      grunt.file.expand(group.src).forEach(function (file) {
        if (!grunt.file.exists(file)) {
          grunt.log.warn('Source file "' + file + '" not found.');
          return;
        }

        var lines = grunt.file.read(file).trim().split(/\r?\n/g);
        lines = lines.filter(function (line) {
          if (line.match(/<reference/)) {
            var ref = parseRef(line, path.dirname(file));
            if (!ref) {
              throw new Error('Source file "' + line + '" not found.');
            }
            if (references.indexOf(ref) === -1) {
              references.push(ref);
            }
            return false;
          }
          if (line.match(/^import /)) {
            var m = line.match(/^import (\w+) = require\(['"].\//)
            if (m) {
              var name = m[1];
              grunt.log.writeln('File "' + file + '" imports local module "' + name + '"');
              if (localImportsToStrip.indexOf(name) === -1) {
                localImportsToStrip.push(name);
              }
            } else {
              if (imports.indexOf(line) === -1) {
                imports.push(line);
              }
            }
            return false;
          }
          return true;
        });

        var content = indent + lines.join(options.newLine + indent).trim();
        content = content.replace(/ declare /g, ' ').replace(/\bdeclare /g, '');

        sources.push({ content: content, file: file });
      });

      sources.forEach(function (source) {
        localImportsToStrip.forEach(function (name) {
          var re = new RegExp('\\b' + name + '\\.');
          source.content = source.content.replace(re, '');
        });
      });

      if (references.length > 0) {
        references.forEach(function (ref) {
          snippets.push(serialiseRef(ref, baseDir));
        });
        snippets.push('');
      }

      snippets.push('declare module "' + options.packageName + '" {');
      snippets.push('');

      if (imports.length > 0) {
        imports.forEach(function (line) {
          snippets.push(indent + line);
        });
        snippets.push('');
      }

      sources.forEach(function (source) {
        snippets.push(indent + '// ' + source.file);
        snippets.push(source.content);
        snippets.push('');
      });
      snippets.push('}');

      grunt.file.write(dest, snippets.join(options.newLine) + options.newLine);
      grunt.log.writeln('File "' + path.relative(process.cwd(), dest) + '" created.');
    });
  });
};
