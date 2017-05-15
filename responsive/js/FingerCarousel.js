//构造函数
function FingerCarousel(JSONParams){
	//自己的最大盒子
	this.box = document.querySelector("#" + JSONParams.id);
	//所有li
	this.lis = this.box.querySelectorAll(".item");
	//所有图片
	this.imgs = this.box.querySelectorAll(".item img");
	$(window).on("load",function(){
		this.h = parseFloat(getComputedStyle(this.imgs[0])["height"]);
	});
	//宽度
	this.w = JSONParams.width;
	//算一个高度
	var self = this;
	//信号量，表示谁在中间
	this.idx = 0;
	//动画时间
	this.duration = JSONParams.duration;
	//缓冲
	this.easingWord = JSONParams.easingWord;
	//过渡
	this.transition = "all " + JSONParams.duration / 1000 + "s " + JSONParams.easingWord + " 0s";
	//绑定监听
	this.bindEvent();
}
FingerCarousel.prototype.refresh = function(width){
	console.log(width);
	//改变宽度
	this.w = width;
	this.box.style.width = this.w + "px";
	for(var i = 0 ; i < this.lis.length ; i++){
		this.lis[i].style.width = this.w + "px";
	}

	$(window).on("load",function(){
		this.h = parseFloat(getComputedStyle(this.imgs[0])["height"]);
	});
	this.box.style.height = this.h + "px";

	//就位
	//计算信号量前后都是谁：
	var prev = this.idx - 1 > 0 ? this.idx - 1 : this.lis.length - 1;
	var next = this.idx + 1 < this.lis.length ? this.idx + 1 : 0;

	//让所有图片根据新的宽度来进行调整
	for(var i = 0 ; i < this.lis.length ; i++){
		this.lis[i].style.transform = "translate(" + this.w + "px,0px)";
	}
	//三个特定元素
	this.lis[prev].style.transform = "translate(" + -this.w + "px,0px)";
	this.lis[this.idx].style.transform = "translate(0px,0px)";
	this.lis[next].style.transform = "translate(" + this.w + "px,0px)";
		
}
//绑定监听
FingerCarousel.prototype.bindEvent = function(){
	var self = this;
	this.box.addEventListener("touchstart", function(event){
		self.touchstartlistener(event);
	}, true);

	this.box.addEventListener("touchmove", function(event){
		self.touchmovelistener(event);
	}, true);

	this.box.addEventListener("touchend", function(event){
		self.touchendlistener(event);
	}, true);
	 
}
//开始触摸的时候事件处理函数
FingerCarousel.prototype.touchstartlistener = function(event){
	//阻止默认事件
	event.preventDefault();
	//得到手指
	var finger = event.touches[0];
	//记录开始触摸的位置
	this.startX = finger.clientX;
	//给所有li去掉过渡
	for(var i = 0 ; i < this.lis.length ; i++){
		this.lis[i].style.transition = "none";
	}
	//记录时间戳
	this.startTime = new Date();
	//判定这次的点击和上一次的离开时间差
	var time2 = this.startTime - this.endTime;
	if(time2 < 100){
		this.transition = "none";
	}else if(time2 < this.duration){
		//变为0.1s
		this.transition = "all 0.1s ease 0s";
	}else{
		//正常
		this.transition = "all " + this.duration / 1000 + "s " + this.easingWord + " 0s";
	}
	return false;
}
//滑动触摸的时候事件处理函数
FingerCarousel.prototype.touchmovelistener = function(){
	 
	//得到手指
	var finger = event.touches[0];
	//增量
	this.dX = finger.clientX - this.startX;
	//计算信号量前后都是谁：
	var prev = this.idx - 1 > 0 ? this.idx - 1 : this.lis.length - 1;
	var next = this.idx + 1 < this.lis.length ? this.idx + 1 : 0;
	//给所有li去掉过渡
	for(var i = 0 ; i < this.lis.length ; i++){
		this.lis[i].style.transition = "none";
	}
	//跟随手指运动，核心语句。让三个li以各自不同的基准线反应增量：
	this.lis[prev].style.transform = "translate(" + (-this.w + this.dX) + "px,0px)";
	this.lis[this.idx].style.transform = "translate(" + (0 + this.dX) + "px,0px)";
	this.lis[next].style.transform = "translate(" + (this.w + this.dX) + "px,0px)";
	
	return false;
}
//触摸结束的时候事件处理函数
FingerCarousel.prototype.touchendlistener = function(event){
	//阻止默认事件
	event.preventDefault();
	//计算信号量前后都是谁：
	var prev = this.idx - 1 > 0 ? this.idx - 1 : this.lis.length - 1;
	var next = this.idx + 1 < this.lis.length ? this.idx + 1 : 0;
	//时间戳
	this.endTime = new Date();
	//从开始碰到屏幕到离开屏幕的总时间毫秒数
	var time = this.endTime - this.startTime;
	 
	//判断dX是不是已经过了一半
	if(this.dX >= this.w / 2 || this.dX > 0 && time < 200){
		//往→→→→→→→→→滑动成功
		//增加过渡
		this.lis[this.idx].style.transition = this.transition;
		this.lis[prev].style.transition = this.transition;
		//移动到标准位置
		this.lis[this.idx].style.transform = "translate(" + this.w + "px,0)";
		this.lis[prev].style.transform = "translate(0px,0)";
		//信号量改变
		this.idx--;
		if(this.idx < 0){
			this.idx = this.lis.length - 1;
		}
		//延迟一定的时间给所有li去掉过渡
		var self = this;
		setTimeout(function(){
			for(var i = 0 ; i < self.lis.length ; i++){
				self.lis[i].style.transition = "none";
			}
		},this.duration);	
	}else if(this.dX <= -this.w / 2 || this.dX < 0 && time < 200){
		//往←←←←←←←滑动成功
		//增加过渡
		this.lis[this.idx].style.transition = this.transition;
		this.lis[next].style.transition = this.transition;
		//移动到标准位置
		this.lis[this.idx].style.transform = "translate(" + -this.w + "px,0)";
		this.lis[next].style.transform = "translate(0px,0)";
		//信号量改变
		this.idx++;
		if(this.idx > this.lis.length - 1){
			this.idx = 0;
		}
		//延迟一定的时间给所有li去掉过渡
		var self = this;
		setTimeout(function(){
			for(var i = 0 ; i < self.lis.length ; i++){
				self.lis[i].style.transition = "none";
			}
		},this.duration);	
	}else{
		//没有滑动成功
		this.lis[prev].style.transition = this.transition;
		this.lis[this.idx].style.transition = this.transition;
		this.lis[next].style.transition = this.transition;
		//移动到标准位置
		this.lis[prev].style.transform = "translate(" + -this.w + "px,0)";
		this.lis[this.idx].style.transform = "translate(0px,0)";
		this.lis[next].style.transform = "translate(" + this.w + "px,0)";
		//延迟一定的时间给所有li去掉过渡
		var self = this;
		setTimeout(function(){
			for(var i = 0 ; i < self.lis.length ; i++){
				self.lis[i].style.transition = "none";
			}
		},this.duration);	
	}


	//小圆点
	$(".banner_finger .circles li").eq(this.idx).addClass("cur").siblings().removeClass("cur");

	return false;
}