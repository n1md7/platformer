
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
	 
	 

	this.playerLoaded = new Array()

	this.allFrames = 0

	this.player = {
		attack: {
			frames: 17
		},
		block: {
			frames: 15
		},
		death: {
			frames: 8
		},
		gothit: {
			frames: 12
		},
		idle: {
			frames: 15
		},
		jump: {
			frames: 15
		},
		run: {
			frames: 16
		},
		walk: {
			frames: 14
		}
	}

 	for(var p in this.player){
 		this.player[p].images = new Array()
 		this.player[p].loaded = new Array()
 	}

	var self = this
	for(var pos in self.player){
		fill(self.player[pos].frames).forEach(function(num){
			if(self.player.hasOwnProperty(pos)){
				self.allFrames ++
				var img = new Image()
				img.src = './assets/knight/'+pos+'/crusader_'+pos+'_200'+num+'.png'
				self.player[pos].images.push(img)
				img.addEventListener('load',function(){
					self.playerLoaded.push(true)
				})
			}
		})
	}

					console.log(self.playerLoaded)
					console.log(this.allFrames)
	// this.sources.push(player)
	console.log(this.player)


	this.clear = function(x=null,y,w,h){
		if(x === null)
			this.ctx.clearRect(0,0,this.window.w,this.window.h)
		else
			this.ctx.clearRect(x-1,y-1,w+2,h+2)
	}


}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fill(e){
	var a = []
	for(var i = 0; i < e; i ++) 
		a.push(i<10?'0'+i:i)
	return a
}

Array.prototype.last = function(){
    return this[this.length - 1]
}


Array.prototype.count = function(el){
	var counter = 0
	this.forEach(function(e){
		if(e==el)counter++
	})
	return counter
}
 
 

Canvas.prototype.draw = function(){
	var self = this
	return {
		image: function(img,sx,sy,swidth,sheight,x,y,width,height){
			try{
				self.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)
			}catch(e){
				console.log(e.message)
				console.log(img)
			}
		},
		rect: function(x,y,w,h){
			try{
				self.ctx.strokeRect(x,y,w,h)
			}catch(e){
				console.log(e.message)
			}
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
	/* for relative dimansion*/
	this.relative = {}
	this.lastPosition = {}
	this.jumpingFps = 0

	/* 
		save current image to compare next one and if different change this.frameIndex to 0
		in order to match frame count 
	*/
	this.previousFrameImg = {}

	this.frameIndex = 0

	this.speedX = 0
    this.speedY = 0 
    this.gravity = 0.03
    this.gravitySpeed = 0
    this.touchedGround = false
	this.going = {
		left: false,
		right: false,
		up: false,
		down: false
	}
	this.jumping = false

	this.fpsCounter = 0
	this.column = 0
	this.row = 0

	this.setPosition = function(x,y){
		this.position.x=x
		this.position.y=y
		return this
	}
	/* w h , relative w and relative h*/
	this.setDimansion = function(w,h,rw=0,rh=0){
		this.dimansion.w=w
		this.dimansion.h=h

		this.relative.w = rw!=0?rw:w
		this.relative.h = rh!=0?rh:h
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

	this.animate = function(img, width, height, sx, sy){
		this.lastPosition = this.position

		if(!this.moving){
			this.column = 0
			this.row = 0
			// this.frameIndex = 0
		}

		if(this.fpsCounter >= 4){
			this.fpsCounter = 0

			if(this.frameIndex == img.frames-1){
				this.frameIndex = 0
			}else{
				this.frameIndex ++
			}
			/*if(this.column == img.columns - 1){
				this.column = 0
				this.row ++
			}else{
				this.column ++
				if(img.name == 'player'){
					if(this.column>3 && this.row==1){
						this.column = 0
						this.row ++

					}
				}
			}

			if(this.row == img.rows){
				this.row = 0
			}*/
		}else{
			this.fpsCounter ++
		}

			if(this.previousFrameImg != img)
				this.frameIndex = 0
		/* Draw here*/
			this.canvas.draw()
					.image(img.images[this.frameIndex],
							sx,
							sy,
							width,
							height,
							this.position.x,
							this.position.y,
							this.dimansion.w,
							this.dimansion.h
						)
			this.previousFrameImg = img
		return this
		
	}

	this.attachGravity = function(objs){
		var intersected = new Calculate().if.object(this).intersects(objs)
		/*intersected.forEach(function(e){
			if(e == true){
				this.touchedGround = true
			}
		})*/
		var index = intersected.indexOf(true) 
		if(index != -1){
			this.touchedGround = true
			// this.position.y = objs[index].position.y - this.dimansion.h + 20
			// console.log(objs)
		}else{
			// this.touchedGround = false
			this.gravitySpeed += this.gravity
	        this.position.x += this.speedX
	        this.position.y += this.speedY + this.gravitySpeed

		}
		
		return this
	}

	this.attachJumping = function(){
		if(this.jumping){

		}
		return this
	}

}


/* Intersection calculation between, works with  one to one and one to many objects*/
function Calculate(){
	this.if = {
		object: function(target){
			this.target = target
			return this
		},
		next: function(target, increment){
			this.target = target
			this.target.position.x+=increment
			return this
		},
		intersects: function(objs){
			objs = objs instanceof Array? objs : [objs] 
			objIndexes = new Array()
			for(var index = 0; len = objs.length, index < len; index ++){
				var wBiggerOne, wSmallerOne, hBiggerOne, hSmallerOne
				this.target.relative.w < objs[index].relative.w ? (
						wBiggerOne = this.target,
						wSmallerOne = objs[index] 
					):(
						wBiggerOne = objs[index],
						wSmallerOne = this.target 
					)
				this.target.relative.h < objs[index].relative.h ? (
						hBiggerOne = this.target,
						hSmallerOne = objs[index] 
					):(
						hBiggerOne = objs[index],
						hSmallerOne = this.target 
					)

				if((
						(
							(wBiggerOne.position.x >= wSmallerOne.position.x && 
							wBiggerOne.position.x <= wSmallerOne.position.x + wSmallerOne.relative.w)
						||
							(wBiggerOne.position.x + wBiggerOne.relative.w >= wSmallerOne.position.x && 
							wBiggerOne.position.x + wBiggerOne.relative.w <= wSmallerOne.position.x + wSmallerOne.relative.w)
						)
					)&&(
							(hBiggerOne.position.y >= hSmallerOne.position.y && 
							hBiggerOne.position.y <= hSmallerOne.position.y + hSmallerOne.relative.w)
						||
							(hBiggerOne.position.y + hBiggerOne.relative.h >= hSmallerOne.position.y && 
							hBiggerOne.position.y /*+ hBiggerOne.relative.h*/ <= hSmallerOne.position.y + hSmallerOne.relative.h)
						)){
					objIndexes.push(true)
				}else{
					objIndexes.push(false)
				}
			}
			/* returns array with passed object conditions*/
			return objIndexes
		}
	}
}




var Game = (function(document, window){
	/* Create main canvas object */
	var canvas = new Canvas('platformer')
	
	/* Loading Components: images, sounds */
	
	/* Wait for image loading */
	var myloader = setInterval(function(){
		if(canvas.allFrames == canvas.playerLoaded.count(true)){
			console.log('everitying has been loaded')
			clearInterval(myloader)

			new init()
			console.log((canvas.playerLoaded.count(true)/canvas.allFrames)*100+' %')

		}else{
			// do it forever
			console.log((canvas.playerLoaded.count(true)/canvas.allFrames)*100+' %')
		}
	},1)

	function init(){
		console.log('Initializing...')
		/* Set canvas to window size (max size 100%x100%) */
		canvas.canvas.width = canvas.window.w
		canvas.canvas.height = canvas.window.h 

		var xCrement = 0, yCrement = 0

		var playerStartedWalking = 0
		var xCrementSetByRunner = false
		/* Create Player Object*/
		var player = new Object('Player')
		/* Set Position*/
		player.setPosition(0,0)
		/* Set Dimansion*/
		player.setDimansion(299, 240, 200, 230)
		/* Attach current context*/
		player.attachContext(canvas)

		var PLAYER_IMG = canvas.player.idle

		/* Attach events listeners to player object*/
		document.addEventListener('keydown', function(event){
			switch(event.keyCode){
				case 39:
					player.going.right = true
					player.moving = true
					
					xCrementSetByRunner?
						null:
						!player.touchedGround?
							xCrement = 1:
						null

					PLAYER_IMG = canvas.player.walk
					playerStartedWalking!=0?
						null:
						playerStartedWalking=(new Date()).getTime()
				break
				case 37: 
					player.going.left = true
					player.moving = true
					xCrement = (-1)
					PLAYER_IMG = canvas.player.walk

				break
				case 38: 
					player.going.up = true
					player.moving = true
					yCrement = (-10)
					// player.gravity = -0.06
					PLAYER_IMG = canvas.player.jump
					player.touchedGround = false
					// player.jumping = true
					// player.touchedGround = false
				break
				case 40: 
					PLAYER_IMG = canvas.player.walk
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
					PLAYER_IMG = canvas.player.idle
					playerStartedWalking = 0
				break
				case 37: 
					player.moving = false
					player.going.left = false
					xCrement = 0
					PLAYER_IMG = canvas.player.idle

				break
				case 38: 
					player.moving = false
					// player.jumping = false
					// player.touchedGround = false
					player.going.up = false
					player.gravity = 0.05
					yCrement = 0
					PLAYER_IMG = canvas.player.idle

				break
				case 40: 
					player.moving = false
					player.going.down = false
					yCrement = 0
					PLAYER_IMG = canvas.player.idle

				break
			}
		})



		

		var bottomBorder = new Object('border')
		.setPosition(0, canvas.window.h-100)
		.setDimansion(canvas.window.w, 20)
		.attachContext(canvas)


		var obstacles = new Array()
		fill(2).forEach(function(e){	
			var obs = new Object('obstacle')
			obs.setPosition(getRandomInt(80,canvas.window.w), 0)
			obs.setDimansion(50,50)
			obs.attachContext(canvas)
			obstacles.push(obs)
		})



		/* Main Loop of the Game */
		var loopTimer = setInterval(function(){
			/*Clear whole canvas*/
			canvas.clear()

			if(player.going.right || player.going.left ||
				player.going.up || player.going.down){
				player.setPosition(player.position.x + xCrement, player.position.y + yCrement)
			}


 
			/*karoche amgari Caxlartulia  1 iani nishnavs x+1 Seamowmos rebna rom maq mand 3 i t gadadis

				roca dadismushaobs rbenis droara
				rom x+3 vwer mashin urevs sul dadis da jer ver movwvi ratom
				
			*/
			if(new Calculate().if.next(player,1).intersects(obstacles).indexOf(true)==-1 && player.going.right){
				console.log("intersected")
				xCrement = 1
			}else if(new Calculate().if.next(player,-1).intersects(obstacles).indexOf(true)==-1 && player.going.left){
				console.log("intersected")
				xCrement = -1
			}else{
				xCrement = 0
			}

			// canvas.ctx.fillRect(20, 20, 1050, 1000);

			/* cheing*/
			bottomBorder.update()
			// obj.update()
			// obj.attachGravity(bottomBorder)

			/*obj1.update()
			obj1.attachGravity(bottomBorder)
			*/
			obstacles.forEach(function(e){
				e.update()
				e.attachGravity(bottomBorder)
			})

			// player.setDimansion(240,299)
			player.setDimansion(80,109, 50, 109)

			if(player.going.right && (new Date().getTime()-playerStartedWalking>600) /*&& !player.touchedGround*/){
				xCrementSetByRunner = true
				xCrement = 2
				if((new Date().getTime()-playerStartedWalking>750)){
					xCrement = 3
				}
				player.animate(canvas.player.run, 138,155, 100,23)

			}else{
				player.animate(PLAYER_IMG, 138,155, 100,23)
				xCrementSetByRunner = false
			}
			// player.update()

			var allgrvtObjs = new Array()
			obstacles.forEach(function(e){
				allgrvtObjs.push(e)
			})
				player.attachGravity(allgrvtObjs.concat(bottomBorder))

			// player.attachGravity([bottomBorder,obj1])
			// player.attachGravity([bottomBorder,obj,obj1])
			// player.attachJumping()

console.log(player.touchedGround)
				// clearInterval(loopTimer)
		},15)

	}

})(document, window)
