/******************/

lightBox = {
'node' :document.getElementById('lightpre'),
'lightgrids':document.getElementById('lightbox').getElementsByClassName('lightgrid'),
'index':0,
'loadImg':function(src,tip){
	//console.log(this.node);
	var imgo = document.getElementById('imgarea');
	imgo.removeEventListener('load',this.onloadEvent());
	imgo.addEventListener	('load',this.onloadEvent());
	this.hideImg();
	var imgo = document.getElementById('imgarea');
	imgo.src = src;
},

'showImg':function(){
	var imgo = document.getElementById('imgarea');
	imgo.style.visibility = 'visible';
},

'hideImg':function(){
	var imgo = document.getElementById('imgarea');
	imgo.style.visibility = 'hidden';
},

'onloadEvent':function(){
	var ot =this;
	return function(){
		ot.showImg();
	}
},

'getImgInfo':function(index){
	if(index >= this.lightgrids.length) return false;

	og = this.lightgrids[index];
	return {'src':og.dataset.preview, 'note':og.dataset.note,};
},

'setImg':function(index){
	index = parseInt(index);
	inf = this.getImgInfo(index);
	if(!inf) return false;
	this.index = index;
	this.loadImg(inf.src,inf.note);
},

'hideBox':function(){
	this.node.style.display='none';
},
	
'showBox':function(){
	this.node.style.display='block';
	resizeElements();
},

}

var lightgrids = document.getElementById('lightbox').getElementsByClassName('lightgrid');
for(var i=0;i<lightgrids.length;i++){
	lightgrids[i].addEventListener('click',function(){
		lightBox.setImg.call(lightBox,this.dataset.index);
		lightBox.showBox();
	});
}


avatarOp = {
	'dom':document.getElementById('avatar'),
	'setScale':function(direction,length){
		length = length>0?length:0;
		avatarDom = document.getElementById('avatar');
		normalDom = document.getElementById('avatar').getElementsByClassName('normal')[0];
		scaledDom = document.getElementById('avatar').getElementsByClassName('scaled')[0];
		
		switch(direction){
		case 'up':
			avatarDom.className = 'avatar up';
			normalDom.style.top = length+'px';
			normalDom.style.bottom = normalDom.style.left = normalDom.style.right = null;
			scaledDom.style.top = scaledDom.style.height = length+'px';
			scaledDom.style.bottom = scaledDom.style.left = scaledDom.style.right = scaledDom.style.width = null;
			break;
		case 'down':
			avatarDom.className = 'avatar down';
			normalDom.style.bottom = length+'px';
			normalDom.style.top = normalDom.style.left = normalDom.style.right = null;
			scaledDom.style.bottom = scaledDom.style.height = length+'px';
			scaledDom.style.top = scaledDom.style.left = scaledDom.style.right = scaledDom.style.width = null;
			break;
		case 'left':
			avatarDom.className = 'avatar left';
			normalDom.style.left = length+'px';
			normalDom.style.top = normalDom.style.bottom = normalDom.style.right = null;
			scaledDom.style.left = scaledDom.style.width = length+'px';
			scaledDom.style.top = scaledDom.style.bottom = scaledDom.style.right = scaledDom.style.height = null;
			break;
		case 'right':
			avatarDom.className = 'avatar right';
			normalDom.style.right = length+'px';
			normalDom.style.top = normalDom.style.left = normalDom.style.bottom = null;
			scaledDom.style.right = scaledDom.style.width = length+'px';
			scaledDom.style.top = scaledDom.style.left = scaledDom.style.bottom = scaledDom.style.height = null;
			break;
		case 'static':
			avatarDom.className = 'avatar static';
			normalDom.style.right = normalDom.style.top = normalDom.style.left = normalDom.style.bottom = null;
			scaledDom.style.right = scaledDom.style.width = scaledDom.style.top = scaledDom.style.left = scaledDom.style.bottom = scaledDom.style.height = null;
			break;
		}
	},
	'getCursorArea':function(cl,ct){
		var res = {'direction':'','length':0};
		var avatarDom = document.getElementById('avatar');
		var ch = avatarDom.clientHeight;
		var cw = avatarDom.clientWidth;
		//console.log(ch,cw);
		if(ct < cl){
			if(ct > ch-cl){
				 res.direction='right';
				 res.length=cw-cl;
			}else{
				 res.direction='up';
				 res.length=ct;
			}
		}else{
			if(ct < ch-cl){
				 res.direction='left';
				 res.length=cl;
			}else{
				 res.direction='down';
				 res.length=ch-ct;
			}
		}

		//res.length = res.length/2;

		return res;
	},
	'makeReact':function(cl,ct){
		var node = document.getElementById('avatar');
		var ch = node.clientHeight;
		var cw = node.clientWidth;

		if(node.className.indexOf('static')+1){
			var arg = this.getCursorArea(cl,ct);
			this.setScale(arg.direction,arg.length/2);
		}else{
			var direct = node.className.replace('avatar','').replace(' ','');
			var len = 0;
			switch(direct){
				case 'up':len = ct/2;break;
				case 'down':len = (ch-ct)/2;break;
				case 'right':len = (cw-cl)/2;break;
				case 'left':len = cl/2;break;
				default: direct='static';
			}
			this.setScale(direct,len);
		}
	},
};


(function(){
	node = document.getElementById('mouseEcho');
	node.addEventListener('mousemove',function(e){
		console.log(e.layerX , e.layerY);
		var arg = avatarOp.getCursorArea(e.offsetX||e.clientX , e.offsetY||e.layerY);
		avatarOp.makeReact(e.offsetX||e.layerX , e.offsetY||e.layerY);
		//window;
	});
	node.addEventListener('mouseout',function(){
		avatarOp.setScale('static');
	});
})();


function smoothScroll(top,time,fps){
	window.whenScrolling =true;

	//var d = new Date();
	//console.log(d.getTime()/1000);
	var time = (time>0 && time!==undefined)?time:3;
	//console.log(time);
	var currentPos = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
	/*if(fps===undefined || fps<=0){
		fps=100;
	}else{
		fps = parseInt(fps);
	}
	var spf = 1/fps;
	var fnum = time*fps;
	var distancePer = (top-currentPos)/fnum;
	var deepScroll = function(from,dest,redo){
		if(redo>1){
			window.setTimeout(function(){deepScroll(from+dest,dest,redo-1)},spf*1000);
		}else{
			var d = new Date();
			console.log(d.getTime()/1000);
			return true;
		}
		window.scrollTo(0,from+dest);

	}
	deepScroll(currentPos,distancePer,fnum);
	*/

	speed = (top-currentPos)/(time*100);
	var t = window.setInterval(function(){
		if(Math.abs(top - (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop))<Math.abs(speed)){
			window.whenScrolling =false;
			document.body.onscroll();
			window.clearInterval(t);
		}else{
			window.scrollBy(0,speed);
		}
	},10);

}

function startRocket(){
	var aniEle = document.getElementById('rocket-animation');
	aniEle.style.visibility = 'visible'; aniEle.className = ''; 

	var rocketEle = document.getElementById('float-rocket');
	var toTopEle = document.getElementById('rocket-top');
	rocketEle.style.top = st+'px';
	//rocketEle.style.left = toTopEle.offestLeft;
	var st = toTopEle.getBoundingClientRect().top;
	var r = window.setInterval(function(){
		if(window.whenScrolling == false){
			window.clearInterval(r);
			aniEle.className = 'rocket-hidden'; 
			window.setTimeout(function(){ aniEle.style.visibility = 'hidden'; },1000); 
		}else{
			rocketEle.style.top = (st*(window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop)/document.body.clientHeight) + 'px';
			//console.log(rocketEle.style.top,st);
		}
	},1);
	
	smoothScroll(0,2);
}

function smoothTo(id){
	var el = document.getElementById(id);
	if(el){
		smoothScroll(el.offsetTop,0.5);
	}
}
