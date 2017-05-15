function Product_carousel(){
	this.$unit = $("#product .product_unit");
	this.$circles = $("#product .circles li");
	this.$dom = $("#product");
	this.idx = 0;
	this.speed = 300;

	//********************************
	//手指惯性滑动
	this.x = 0;  //transform:translate(0px,0px);
	this.startX;
	this.dx;
	this.lastpoint;
	this.lastTwoPointDistance;
	this.timer = 0;
	this.min = $("#product .product_unit li").length * (218 + 43) - 43 - $(window).width();
	var self = this;
	//当屏幕尺寸变化的时候，此时要改变min
	$(window).resize(function(){
		self.min = $("#product .product_unit li").length * (218 + 43) - 43 - $(window).width();
		 
	})
	 

	//********************************
	this.bindEvent();
}
Product_carousel.prototype.goidx = function(number){
	if(this.$unit.is(":animated")) return;

	this.$unit.animate({"left" : -1040 * number} , this.speed);
	this.idx = number;
	this.$circles.eq(this.idx).addClass("cur").siblings().removeClass("cur");
}

Product_carousel.prototype.bindEvent = function(number){
	var self = this;
	this.$circles.click(function(){
		self.goidx($(this).index());
	});

	this.$dom.on("touchstart", function(){
		self.touchstarthandler();
	});

	this.$dom.on("touchmove", function(){
		self.touchmovehandler();
	});

	this.$dom.on("touchend", function(){
		self.touchendhandler();
	});
}

Product_carousel.prototype.touchstarthandler = function(){
	//停表
	clearInterval(this.timer);
	//阻止默认事件
	event.preventDefault();
	//手指
	var finger = event.touches[0];
	//坐标
	this.startX = finger.clientX;
	//去掉过渡
	this.$unit.css("transition","none");

	console.log(this.startX);
}
Product_carousel.prototype.touchmovehandler = function(){
	//阻止默认事件
	event.preventDefault();
	//手指
	var finger = event.touches[0];
	//增量
	this.dx = finger.clientX - this.startX;
	//去掉过渡
	this.$unit.css("transition","none");
	//反应这个增量
	this.$unit.css("transform","translate(" + (this.x + this.dx) + "px,0px)");
	//计算最后两个点的距离，等于当前这个点减去上一个点
	this.lastTwoPointDistance = finger.clientX - this.lastpoint;
	//让自己成为上一个点
	this.lastpoint = finger.clientX;

}
Product_carousel.prototype.touchendhandler = function(){
	//脏标记，一会儿用于减速
	this.flag = true;
	var zongzhenshu = 50;
	//信号量反应增量
	this.x += this.dx;
	//手指离开的一瞬间，要用定时器帮我们继续运动50帧
	//滑动，要根据公式计算50帧，每帧的变化量
	var frame = 0;
	clearInterval(this.timer);
	var self = this;
	this.timer = setInterval(function(){
		console.log("★");
		frame++;
		if(frame > 50){
			//帧数到了50帧，停表
			clearInterval(self.timer);
			//验收，看看x是否合法
			if(self.x > 0){
				self.x = 0;
				//过渡回来，过渡到0点
				self.$unit.css("transition","all 0.25s cubic-bezier(0, 0.9, 0.56, 0.99) 0s");
				self.$unit.css("transform","translate(0px,0px)");
			}else if(self.x < -self.min){
				self.x = -self.min;
				self.$unit.css("transition","all 0.25s cubic-bezier(0, 0.9, 0.56, 0.99) 0s");
				self.$unit.css("transform", "translate(-" + self.min + "px,0px)");
			}
		}
		//公式计算
		//开始减速这一帧的帧编号
		self.x += calcDeltaX(frame,self.lastTwoPointDistance,zongzhenshu);
		if(self.x > 0 && self.flag){
			frame = zongzhenshu - 20;
			self.flag = false;
		}else if(self.x < -3080 && self.flag){
			frame = zongzhenshu - 20;
			self.flag = false;
		}
		//反应增量
		self.$unit.css("transform","translate(" + self.x + "px,0px)");

		console.log(self.x)
	},20);

}

function calcDeltaX(t,b,d){
	return b * (t - d) * (t - d) / (d * d);
}
