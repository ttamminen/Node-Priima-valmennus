module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-uglify');
	var gruntConfig = require('./grunt-config.json');
	grunt.initConfig(gruntConfig);
	grunt.registerTask('default', Object.keys(gruntConfig).join(' '));
};