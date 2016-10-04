
function newMapOperator(o){
	this.el= o;
	this.tip = '';
	this.setTip = function(t){
		this.tip = t;
	}

	this.showTip = function(t,x,y){
		maptip.showTip(t,x,y);
	}


	this.hideTip = function(){
		return function(){
			maptip.hideTip();
		}
	}

	this.eventMouseMove = function(){
		var ot =this;
		return function(e){
			tar = e.target;//console.log(e);
			py =  e.clientY + (window.pageYOffset || document.body.scrollTop);
			px =  e.clientX + (window.pageXOffset || document.body.scrollLeft);

			ot.showTip(this.className.baseVal,px,py);
		}
	}

	spotsList = o.getElementsByClassName('spot');
	for(var i=0;i<spotsList.length;i++){
		spotsList[i].addEventListener('mousemove',this.eventMouseMove());
		//spotsList[i].addEventListener('mouseover',this.eventMouseMove());
		spotsList[i].addEventListener('mouseout' ,this.hideTip());
	}
}
