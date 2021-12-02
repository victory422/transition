$(function(){
    var $body = $('body');

	$(window).scroll(function(){
		var sct = $(this).scrollTop();
		var $view = $('.view');
		var target = $view.length ? $view.offset().top : 0;
		sct > target ? $body.addClass('is-scroll') : $body.removeClass('is-scroll');
	}).trigger('scroll');
});
