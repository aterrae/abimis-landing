'use strict';

// Import all plugins
import gulp from 'gulp';
import plugins  from 'gulp-load-plugins';
import utility from 'gulp-util';
import notifier from 'node-notifier';
import yargs from 'yargs';
import fs from 'fs';
import yaml from 'js-yaml'
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import browser from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';

// Console error management
function errorLog(error) {
    utility.log(error);
    this.emit('end');
}

// Building the SASS error notification message
function sassNotify(error) {
    var title = 'Error: ';
    var message = 'In: ';

    if (error.messageOriginal) {
        title += error.messageOriginal;
    }
    if (error.relativePath){
        message += error.relativePath;
    }
    if (error.line) {
        message += '\nOn Line: ' + error.line;
    }

    notifier.notify({title: title, message: message});
};

// Building the React error notification message
function reactNotify(error) {
    var title = 'Error: ';
    var message = 'In: ';

    if(error.message) {
        var errorMessage = error.message.split(':');
        title += errorMessage[1];
    }
    if(error.filename) {
        var file = error.filename.split('/');
        message += file[file.length-1];
    }
    if(error.loc) {
        message += '\nOn Line: ' + error.loc['line'];
    }

    notifier.notify({title: title, message: message});
};

// With $ (constant name) we load all Gulp Plugins
const $ = plugins()

// With DISTRIBUTION (constant name) we set the --distribution argument if it exists
const DISTRIBUTION = !!(yargs.argv.distribution);
// If DISTRIBUTION is true we set NODE_ENV = 'production'
if (DISTRIBUTION) {
    process.env.NODE_ENV = 'production';
}

// With PORT we set the port where BROWSER-SYNC will be running
// With COMPATIBILITY we set the AUTOPREFIXER
// With PATHS we set the locations of the resources used in the project
const { PORT, COMPATIBILITY, PATHS } = loadConfig();
function loadConfig() {
    let ymlFile = fs.readFileSync('settings.yml', 'utf8');
    return yaml.load(ymlFile);
}

// This BUILD function, builds all the website's files except the project's JSX
gulp.task('build',
gulp.series(clean, gulp.parallel(html, sass, jsLibs, images)));

// This DEFAULT function, calls the BUILD task, runs localhost and starts watching all changes
gulp.task('default',
gulp.series('build', server, gulp.parallel(watch, javascript)));

// This CLEAN function, deletes the dist folder
function clean(done) {
    rimraf('dist', done);
    utility.log(utility.colors.yellow('Abimis says hello from the backend side! Good work!'));
    utility.log('   _____   ___.    .__          .__');
    utility.log('  /  _  \\  \\_ |__  |__|  _____  |__|  ______');
    utility.log(' /  /_\\  \\  | __ \\ |  | /     \\ |  | /  ___/');
    utility.log('/    |    \\ | \\_\\ \\|  ||  Y Y  \\|  | \\___ \\');
    utility.log('\\____|__  / |___  /|__||__|_|  /|__|/____  >');
    utility.log('        \\/      \\/           \\/          \\/');
    utility.log('Copyright © 2017 Aterrae | Digital Growth.');
    notifier.notify({title: "Abimis is Running!", message: "Now you are coding with power! 💪"});
}

// This HTML function, compiles the .hbs files including them in their respective files
function html() {
    return gulp.src(PATHS.pages)
    .pipe($.hb({
        partials: PATHS.partials,
        helpers: PATHS.helpers,
        data: PATHS.data
    }))
    .on('error', errorLog)
    .pipe(gulp.dest(PATHS.htmlDest[0]));

}

// This SASS function, compiles the .scss files, minifying the .css if in production
function sass() {
    return gulp.src(PATHS.sassSource)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        includePaths: PATHS.sass
    })
    .on('error', sassNotify)
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
        browsers: COMPATIBILITY
    }))
    .pipe($.if(DISTRIBUTION, $.cssnano()))
    .pipe($.if(!DISTRIBUTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.sassDest[0]))
    .pipe(browser.reload({ stream: true }));
}

// This jsLibs function, compiles ES6 and concatenates .js files into a single file, minifying them if in production
function jsLibs(done) {
    if(PATHS.jsLibsSource) {
        return gulp.src(PATHS.jsLibsSource)
        .pipe($.babel())
        .pipe($.concat(PATHS.jsLibsResName[0]))
        .pipe($.if(DISTRIBUTION, $.uglify()
            .on('error', e => { utility.log(e); })
        ))
        .pipe(gulp.dest(PATHS.jsLibsDest[0]));
    } else {
        done();
    }
}

// This JAVASCRIPT function, compiles all ES6 and React JSX files into a single file, if in production it minifies it
function javascript() {
    var bundler = browserify({
        entries: [PATHS.jsxSource],
        transform: [babelify], // Compiles ES6 and React JSX
        plugin: [watchify],
        extensions: ['.jsx'],
        debug: !DISTRIBUTION,
        cache: {},
        packageCache: {},
        fullPaths: true
    })

    function build(file) {
        if (file) utility.log('Babel recompiling: ' + file);
        return bundler
        .bundle()
        .on('error', reactNotify)
        .on('error', utility.log.bind(utility, 'Hey there is a Browserify Error:'))
        .pipe(source(PATHS.jsxResName[0]))
        .pipe(buffer())
        // If in DISTRIBUTION minify js
        .pipe($.if(DISTRIBUTION, $.uglify()
            .on('error', e => { utility.log(e); })
        ))
        .pipe(gulp.dest(PATHS.jsxDest[0]))
        .pipe(browser.reload({ stream: true }));
    };

    build();
    bundler.on('update', build);
};

// This IMAGES function, minifies all image files of this type: GIF, JPEG, PNG, SVG when in distribution
function images() {
    return gulp.src(PATHS.imagesSource)
    .pipe($.if(DISTRIBUTION, $.imagemin({
        progressive: true
    })))
    .pipe(gulp.dest(PATHS.imagesDest[0]));
}

// This SERVER function, starts the server with the dist folder as it's target
function server(done) {
    browser.init({
        server: {
            baseDir: "dist",
            middleware: [historyApiFallback()] // Fixes issues with the HTML5 History API
        },
        port: PORT
    });
    done();
}

// This RELOAD function, reloads the browser
function reload(done) {
    browser.reload();
    done();
}

// This WATCH function, watches changes in the HTML, SASS and in the IMAGE files
function watch() {
    gulp.watch('src/{pages,partials,data,helpers}/**/*', gulp.series(html, reload));
    gulp.watch('src/scss/**/*.scss', gulp.series(sass, reload));
    gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
}
