$(document).ready(function () {
	$('.drawer').drawer();
});
AOS.init();
// アコーディオン制御
$('.faq__title').click(function () {
	var $answer = $(this).next();
	$answer.slideToggle();
});

// Swiper初期化
var swiper = new Swiper('.swiper-container', {
	loop: true,
	slidesPerView: 1.8,
	spaceBetween: 10,
	centeredSlides: true,
	initialSlide: 1,
	autoplay: {
		delay: 3000,
		disableOnInteraction: true
	},
	breakpoints: {
		768: {
			spaceBetween: 30,
			slidesPerView: 2.5
		},
		992: {
			spaceBetween: 56,
			slidesPerView: 3.6
		}
	},
});

// ajaxでのフォーム投稿
$(function () {

	$('#form').submit(function (event) {
		var formData = $('#form').serialize();
		$.ajax({
			url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScipCJIkTvUuuhg1O5cFHIerpkiqmZ5PfJwZxqQFqwBuler_Q/formResponse",
			data: formData,
			type: "POST",
			dataType: "xml",
			statusCode: {
				0: function () {
					$(".contact__success").slideDown();
					$(".contact__btn").fadeOut();
					//window.location.href = "thanks.html";
				},
				200: function () {
					$(".contact__false").slideDown();
				}
			}
		});
		event.preventDefault();
	});

});

// スムーススクロール
$(function () {
	$('a[href^="#"]').on("click", function () {
		var speed = 600;
		var header_height = $("header").height();
		var href = $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top - header_height;
		$('body,html').animate({ scrollTop: position }, speed, 'swing');
		return false;
	});
});