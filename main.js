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
