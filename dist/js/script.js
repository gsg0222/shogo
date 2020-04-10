$(document).ready(function () {
	$('.drawer').drawer();
});
AOS.init();
// アコーディオン制御
$('.faq__title').click(function () {
	var $answer = $(this).next();
	if ($answer.hasClass('faq__body--active')) {
		$answer.removeClass('faq__body--active');
		$answer.slideUp();
	} else {
		$answer.addClass('faq__body--active');
		$answer.slideDown();
	}
});