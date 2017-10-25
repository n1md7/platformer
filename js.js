
/* Class for canvas*/
function Canvas(selector = null){
	var id = document.getElementById(selector)
	if(id === null || id === undefined)
		throw new Error('id not specified or not found; id='+ selector)
	this.canvas = id
	this.ctx = this.canvas.getContext('2d')
	this.window = {
		h : window.innerHeight,
		w : window.innerWidth
	}
	this.images = {
		player: {
			img: new Image(),
			src: './assets/girl.png',
			width: 94,
			height: 130,
			marginTop: 0,
			marginLeft: 0,
			columns: 7,
			rows: 2,
			fps: 20,
			name: 'player',
			stopedPos: {
				x: 480,
				y: 130
			}
		},
		background: {
			img: new Image(),
			src: './assets/2340_LMNnqocbql6M2f74UWq6I6lHi.png'
		}
	}

	this.clear = function(x=null,y,w,h){
		if(x === null)
			this.ctx.clearRect(0,0,this.window.w,this.window.h)
		else
			this.ctx.clearRect(x-1,y-1,w+2,h+2)
	}

}



Canvas.prototype.load = function(){
	this.loaded = {
		player: false,
		background: false
	}
	var obj = this
	this.images.player.img.src = this.images.player.src 
	this.images.background.img.src = this.images.background.src 

	this.images.player.img.onload = function(){
		obj.loaded.player = true
	}

	this.images.background.img.onload = function(){
		obj.loaded.background = true
	}
}



Canvas.prototype.draw = function(){
	var self = this
	return {
		image: function(img,sx,sy,swidth,sheight,x,y,width,height){
			// drawImage(img,x,y,width,height);
			self.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)
		},
		rect: function(x,y,w,h){
			try{
				self.ctx.strokeRect(x,y,w,h)
			}catch(e){
				console.log(e.message)
			}
			// self.ctx.stroke()
		}
	}
}

/* 	
	Class for create object {
		Player, Enemy, Border, Decoration
	}
*/
function Object(name){
	this.moving = false
	this.name = name
	this.position = {}
	this.dimansion = {}
	this.lastPosition = {}
	this.going = {
		left: false,
		right: false,
		up: false,
		down: false
	}

	this.fpsCounter = 0
	this.column = 0
	this.row = 0

	this.setPosition = function(x,y){
		this.position.x=x
		this.position.y=y
		return this
	}
	this.setDimansion = function(w,h){
		this.dimansion.w=w
		this.dimansion.h=h
		return this
	} 
	this.attachContext = function(ctx){
		this.canvas = ctx
		return this
	}

	this.update = function(){
		/* backup previous location*/
		this.lastPosition = this.position
		
		/* Draw new object in canvas*/
		this.canvas
		.draw()
		.rect(this.position.x, this.position.y, this.dimansion.w, this.dimansion.h)
		
		return this
	}

	this.animate = function(img){
		this.lastPosition = this.position

		if(!this.moving){
			this.column = 0
			this.row = 0
		}

		if(this.fpsCounter == img.fps){
			this.fpsCounter = 0

			if(this.column == img.columns - 1){
				this.column = 0
				this.row ++
			}else{
				this.column ++
				/* gahcerebuli foto urevia da magas vagdeb cilkilad*/
				if(img.name == 'player'){
					if(this.column>3 && this.row==1){
						this.column = 0
						this.row ++

					}
				}
			}

			if(this.row == img.rows){
				this.row = 0
			}
			console.log(this.row + " " + this.column)
					
		}else{
			this.fpsCounter ++
		}
		/* Draw here*/

			this.canvas.draw()
					.image(img.img,
						this.moving	?(this.column * img.width + img.marginLeft) : img.stopedPos.x,
						this.moving	?(this.row * img.height + img.marginTop) : img.stopedPos.y,
						img.width,
						img.height,
						this.position.x,
						this.position.y,
						this.dimansion.w,
						this.dimansion.h)
		
	}

}


/* Intersection calculation between, works with  one to one and one to many objects*/
function Calculate(){
	this.if = {
		object: function(target){
			this.target = target
			return this
		},
		intersects: function(objs){
			objs = objs instanceof Array? objs : [objs] 
			
			for(var index = 0; len = objs.length, index < len; index ++){
				var wBiggerOne, wSmallerOne, hBiggerOne, hSmallerOne
				this.target.dimansion.w < objs[index].dimansion.w ? (
						wBiggerOne = this.target,
						wSmallerOne = objs[index] 
					):(
						wBiggerOne = objs[index],
						wSmallerOne = this.target 
					)
				this.target.dimansion.h < objs[index].dimansion.h ? (
						hBiggerOne = this.target,
						hSmallerOne = objs[index] 
					):(
						hBiggerOne = objs[index],
						hSmallerOne = this.target 
					)

				if((
						(
							(wBiggerOne.position.x >= wSmallerOne.position.x && 
							wBiggerOne.position.x <= wSmallerOne.position.x + wSmallerOne.dimansion.w)
						||
							(wBiggerOne.position.x + wBiggerOne.dimansion.w >= wSmallerOne.position.x && 
							wBiggerOne.position.x + wBiggerOne.dimansion.w <= wSmallerOne.position.x + wSmallerOne.dimansion.w)
						)
					)&&(
							(hBiggerOne.position.y >= hSmallerOne.position.y && 
							hBiggerOne.position.y <= hSmallerOne.position.y + hSmallerOne.dimansion.w)
						||
							(hBiggerOne.position.y + hBiggerOne.dimansion.w >= hSmallerOne.position.y && 
							hBiggerOne.position.y + hBiggerOne.dimansion.w <= hSmallerOne.position.y + hSmallerOne.dimansion.w)
						)){
					return true
				}
			}

			return false
		}
	}
}




var Game = (function(document, window){
	/* Create main canvas object */
	var canvas = new Canvas('platformer')
	
	/* Loading Components: images, sounds */
	canvas.load()
	
	/* Wait for image loading */
	var imageLoader = setInterval(function(){
		if(canvas.loaded.player && canvas.loaded.background){
			console.log('All Images loaded')
			clearInterval(imageLoader)
			/* Initialize game, create object */
			new init()
		}else{
			console.clear()
			console.log('Images are Loading...')
		}
	},100)

	function init(){
		console.log('Initializing...')
		/* Set canvas to window size (max size 100%x100%) */
		canvas.canvas.width = canvas.window.w
		canvas.canvas.height = canvas.window.h 

		var xCrement = 0, yCrement = 0

		/* Create Player Object*/
		var player = new Object('Player')
		/* Set Position*/
		player.setPosition(0,0)
		/* Set Dimansion*/
		player.setDimansion(80,100)
		/* Attach current context*/
		player.attachContext(canvas)

		/* Attach events listeners to player object*/
		document.addEventListener('keydown', function(event){
			switch(event.keyCode){
				case 39:
					player.going.right = true
					player.moving = true
					xCrement = 1
				break
				case 37: 
					player.going.left = true
					player.moving = true
					xCrement = (-1)
				break
				case 38: 
					player.going.up = true
					player.moving = true
					yCrement = (-1)
				break
				case 40: 
					player.going.down = true
					player.moving = true
					yCrement = 1
				break
			}
		})

		document.addEventListener('keyup', function(event){
			switch(event.keyCode){
				case 39:
					player.going.right = false
					player.moving = false
					xCrement = 0
				break
				case 37: 
					player.moving = false
					player.going.left = false
					xCrement = 0
				break
				case 38: 
					player.moving = false
					player.going.up = false
					yCrement = 0
				break
				case 40: 
					player.moving = false
					player.going.down = false
					yCrement = 0
				break
			}
		})

		var obj  = new Object('test')
		.setPosition(140,300)
		.setDimansion(40,20)
		.attachContext(canvas)

		var obj1  = new Object('test')
		.setPosition(290,300)
		.setDimansion(30,20)
		.attachContext(canvas)


		var bottomBorder = new Object('border')
		.setPosition(0, canvas.window.h-100)
		.setDimansion(canvas.window.w, 20)
		.attachContext(canvas)


		/* Main Loop of the Game */
		var loopTimer = setInterval(function(){
			/*Clear whole canvas*/
			canvas.clear()

			if(player.going.right || player.going.left ||
				player.going.up || player.going.down){
				player.setPosition(player.position.x + xCrement, player.position.y + yCrement)
			}
			
			new Calculate()
						.if
							.object(player).intersects([obj,obj1])



			/* cheing*/
			bottomBorder.update()
			obj.update()
			obj1.update()
			// player.update()
			player.animate(canvas.images.player)


				// clearInterval(loopTimer)
		},1)

	}

})(document, window)
