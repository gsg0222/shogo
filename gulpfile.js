/* モジュール読み込み */
const gulp = require('gulp');

/* browser-sync */
const browserSync = require('browser-sync');

/* sass */
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const cleanCSS = require('gulp-clean-css');

/* JavaScript */
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const babel = require('gulp-babel');

/* 画像圧縮 */
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");

const imageminOption = [
	imageminPngquant({ quality: [0.65, 0.8] }),
	imageminMozjpeg({ quality: 85 }),
	imagemin.gifsicle({
		interlaced: false,
		optimizationLevel: 1,
		colors: 256
	}),
	imagemin.mozjpeg(),
	imagemin.optipng(),
	imagemin.svgo()
];

/* フォルダ指定 */
const distDir = 'dist/';
const srcDir = 'src/';

/* browser-sync */
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: distDir
		}
	});
});

/* SassをCSSにしてsrcに出力 */
gulp.task("sass", function () {
	return gulp
		.src(srcDir + "/sass/**/*.scss")
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(sassGlob())
		.pipe(sass({ outputStyle: "expanded" }))
		.pipe(postcss([autoprefixer()]))
		.pipe(postcss([cssdeclsort({ order: "alphabetical" })]))
		.pipe(mmq())
		.pipe(gulp.dest(srcDir + "/css"));
});

/*
 * srcのCSSを最小化してdistに出力、browser-syncで反映
 */
gulp.task('css', function () {
	return gulp.src(srcDir + "**/*.css")
		.pipe(cleanCSS())
		.pipe(gulp.dest(distDir))
		.pipe(browserSync.stream())
});

/*
 * minではないjsファイルを圧縮して名前にminを付与、srcに出力する
 * minなファイルはそのまま何もしない
 */
gulp.task('jsmin', function () {
	return gulp.src([srcDir + 'js/**/*.js', '!' + srcDir + 'js/**/*.min.js'])
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(babel({
			"presets": ["@babel/preset-env"]
		}))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(srcDir + 'js/'));
});

/* jsファイルをdistに出力、browser-syncで反映 */
gulp.task('js', function () {
	return gulp.src(srcDir + '**/*.js')
		.pipe(gulp.dest(distDir))
		.pipe(browserSync.stream())
});

/* srcのイメージファイルを圧縮してdistに出力、browser-syncで反映 */
gulp.task('imagemin', function () {
	return gulp
		.src(srcDir + '**/*.{png,jpg,gif,svg}')
		.pipe(imagemin(imageminOption))
		.pipe(gulp.dest(distDir))
		.pipe(browserSync.stream())
});

/* 
 * src内のHTML,PHPファイルをdistに出力
 */
gulp.task('copyResource', function () {
	return gulp.src(srcDir + '**/*.{html,php}')
		.pipe(gulp.dest(distDir))
		.pipe(browserSync.stream())
});

/*
 * html,phpの変更があったらそのままdistに出力
 * 画像ファイルに変更があったら圧縮して出力
 * sassに変更があったらcssに変換、その後cssをdistに出力
 * jsに変更があったら圧縮してminファイルに変更、jsファイルをdistに出力
 */
gulp.task('watch', function (done) {
	gulp.watch(srcDir + '**/*.+(html|php)', gulp.task('copyResource'));
	gulp.watch(srcDir + '**/*.+(jpg|jpeg|gif|png|svg)', gulp.task('imagemin'));
	gulp.watch(srcDir + '**/*.scss', gulp.task('sass'));
	gulp.watch(srcDir + '**/*.css', gulp.task('css'));
	gulp.watch([srcDir + '**/*.js', '!' + srcDir + '**/*.min.js'], gulp.task('jsmin'));
	gulp.watch(srcDir + '**/*.min.js', gulp.task('js'));
})
/* 
 * デフォルト
 * HTMLとPHP、画像のdistへの出力
 * sassをcssに変換してからdistに出力
 * jsを最小化してからdistに出力を順番に処理した後、
 * browser-syncとwatchを並列で実行する
 */
gulp.task('default',
	gulp.series(
		'copyResource',
		'imagemin',
		'sass',
		'css',
		'jsmin',
		'js',
		gulp.parallel('browser-sync', 'watch')));