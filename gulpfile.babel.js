import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import { rollup } from 'rollup';
import babelRollup from 'rollup-plugin-babel';
import sequence from 'run-sequence';

gulp.task('default', ['build']);

gulp.task('build', () => {
    return sequence(['build:lib', 'build:dist'], ['build:min']);
});

gulp.task('build:lib', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('build:dist', () => {
    return rollup({
        entry: 'src/index.js',
        plugins: [
            babelRollup({
                babelrc: false,
                presets: [
                    [ 'es2015', { modules: false } ]
                ]
            })
        ]
    }).then((bundle) => {
        return bundle.write({
            format: 'umd',
            moduleName: 'mware',
            dest: 'dist/mware.js'
        });
    });
});

gulp.task('build:min', () => {
    return gulp.src(['dist/**/*.js'])
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});
