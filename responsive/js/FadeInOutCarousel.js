function FadeInOutCarousel(JSONParams){
	this.id = JSONParams.id;
	this.interval = JSONParams.interval;
	this.duration = JSONParams.duration;

	this.$dom = $("#" + this.id);

	this.$imagesLis = this.$dom.find(".images li");
	this.$circlesLis = this.$dom.find(".circles li");

	this.idx = 0;
	this.timer;

	this.bindEvent();
	this.autoplay();

}

FadeInOutCarousel.prototype.goto = function(number){
	if(this.$imagesLis.is(":animated")){return;}

	this.$imagesLis.eq(this.idx).fadeOut(this.duration);
	this.idx = number;
	this.$imagesLis.eq(this.idx).fadeIn(this.duration);

	//小圆点
	this.$circlesLis.eq(this.idx).addClass("cur").siblings().removeClass("cur");
}

FadeInOutCarousel.prototype.bindEvent = function(){
	var self = this;
	this.$circlesLis.click(function(){
		var i = $(this).index();
		self.goto(i);
	});

	this.$dom.mouseenter(function(){
		self.pause();
	});

	this.$dom.mouseleave(function(){
		self.autoplay();
	});
}

FadeInOutCarousel.prototype.autoplay = function(){
	var self = this;
	this.timer = setInterval(function(){
		var i = self.idx + 1;
		if(i > self.$imagesLis.length - 1){
			i = 0;
		}
		self.goto(i);
	},this.interval);
}


FadeInOutCarousel.prototype.pause = function(){
	clearInterval(this.timer);
}