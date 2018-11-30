module.exports = function (grunt) {
    'use strict';

    var DEFAULT_HOST = 'arduino_iot_agent.ram.m2m.telekom.com',
        DEFAULT_PROTOCOL = 'https',
        host = DEFAULT_HOST,
        protocol = DEFAULT_PROTOCOL;

    // Load grunt-exec tasks, for execution of Cumulocity c8y tools
    grunt.loadNpmTasks('grunt-exec');
    // Load jsdoc tasks
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['plugins/**/*.js', 'test/**/*.js'],
                options: {
                    destination: 'docs',
                    configure: 'node_modules/angular-jsdoc/common/conf.json',
                    template: 'node_modules/angular-jsdoc/angular-template',
                    tutorial: 'tutorials',
                    readme: './README.md'
                }
            }
        },
        jasmine: {
            pivotal: {
                src: 'spec/**/*.js',
                options: {
                    specs: 'spec/**/*[sS]pec.js',
                    vendor: ['node_modules/angular/angular.js',
                             'node_modules/angular-route/angular-route.js',
                             'node_modules/angular-mocks/angular-mocks.js'],
                    helpers: 'helpers/**/*.js'
                }
            }
        },
        copy: {
            prepare: {
                src: './index.html',
                dest: 'build/'
            }
        },
        exec: {
            c8yBuildApp: {
                command: function() {
                    var path= '';
                    var jobUrl = String(process.env.JOB_URL);
                    grunt.log.writeln('### jobUrl:' +jobUrl);

                    if ((jobUrl !== null) &&
                        jobUrl.match(/^https:\/\/sbs.t-systems.com\/jenkins\/job/)) {
                        grunt.log.writeln('### I am on the Build server');
                        path = 'bin/';
                    }
                    return path + 'c8y build:app';
                },
                stdout: true
            }
        }

    });

    // Load jasmine tasks
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    // Default task
    grunt.registerTask('default', 'jasmine');

    if (grunt.option('host')) {
        host = grunt.option('host');
    }

    if (grunt.option('protocol')) {
        protocol = grunt.option('protocol');
    }

    grunt.config('cumulocity.host', host);
    grunt.config('cumulocity.protocol', protocol);

    grunt.config('paths.root', './');
    grunt.config('paths.temp', '.tmp');
    grunt.config('paths.build', 'build');
    grunt.config('paths.plugins', 'plugins');
    grunt.config('paths.bower', 'bower_components');

    // Set working proxy, the old one is faulty
    // grunt.config('cumulocity.localproxy', 'http://approxy.t-systems.com:3128');

    //grunt.config('cumulocity.localproxy', 'http://www-36.dienste.t-systems.com:8080');
     grunt.config('cumulocity.localproxy', 'http://www-le.dienste.t-systems.com:8080');
    // grunt.config('cumulocity.localproxy', 'http://10.206.247.65:8080');

    //Load cumulocity grunt tasks
    grunt.loadNpmTasks('grunt-cumulocity-ui-tasks');


    grunt.registerTask('server', [
        'pluginPreAll',
        'connect',
        'watch'
    ]);

    // New version for the c8y build tool.
    grunt.registerTask('build', [
        'exec:c8yBuildApp'
    ]);

};
