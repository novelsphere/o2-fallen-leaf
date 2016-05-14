/* global o2 Tag TagAction ImageLayer MessageLayer config renderer */
/* exported */
(function() {
	var allLeaves = [],
		leafForeLayers = [],
		leafBackLayers = [];

	o2.fallenleaf = {
		pauseForeVisible : -1,
		pauseBackVisible : -1,

		// 以下は設定

		foreVisible : true,
		backVisible : true,
		num : 0,                     // 葉の数

		xInitVelocityMin     : 0,    // 最初の横の移動速度の下限
		xInitVelocityMax     : 0,    // 最初の横の移動速度の上限
		xInitAccelerationMin : 0,    // 最初の横の加速度の下限
		xInitAccelerationMax : 1,    // 最初の横の加速度の上限
		xVelocityMin         : -1.5, // 横の移動速度の下限
		xVelocityMax         : 1.5,  // 横の移動速度の上限
		xAccelerationMin     : -0.2, // 横の加速度の下限
		xAccelerationMax     : 0.2,  // 横の加速度の上限
		xAccelerationDelta   : 0.15, /* 横の加速度の最大変化
		毎回移動する度に、加速度がランダムでちょっと変わります。
		例えば加速度が1として、横の加速度の最大変化は0.2とすると、
		加速度は 1 から「0.8 から 1.2 の間のランダム数値」に変わります。
		これは相対の変化ですから、もし加速度が 1.2 に変わったら、
		次は「1.0 から 1.4 の間のランダム数値」に変わります。
		*/

		yInitVelocityMin     : 1.9,  // 最初の縦の移動速度の下限
		yInitVelocityMax     : 4.5,  // 最初の縦の移動速度の上限
		yInitAccelerationMin : 0,    // 最初の縦の加速度の下限
		yInitAccelerationMax : 0.2,  // 最初の縦の加速度の上限
		/* 縦の加速度は最初から最後まで変わりません */

		// これはinitのみ使える属性です
		interval             : 1000 / 25,    // 1秒/フレームレート ミリ秒

		images : ["ichou1", "ichou2", "momiji1", "momiji2", "sakura1", "sakura2"]
	};

	// レイヤを追加する
	var _fore = o2.allForeLayers,
		_back = o2.allBackLayers;

	o2.allForeLayers = function() {
		var original = _fore.call(o2);
		original = original.concat(leafForeLayers);
		return original;
	};
	o2.allBackLayers = function() {
		var original = _back.call(o2);
		original = original.concat(leafBackLayers);
		return original;
	};

	var _restore = o2.importFromSaveData;
	o2.importFromSaveData = function(data) {
		if ('fallenleaf' in data) {
			if (allLeaves.length) {
				new Tag('leafuninit').run();
			}
			new Tag('leafinit', {
				forevisible          : data.fallenleaf.foreVisible,
				backvisible          : data.fallenleaf.backVisible,
				num                  : data.fallenleaf.num,
				xinitvelocitymin     : data.fallenleaf.xInitVelocityMin,
				xinitvelocitymax     : data.fallenleaf.xInitVelocityMax,
				xinitaccelerationmin : data.fallenleaf.xInitAccelerationMin,
				xinitaccelerationmax : data.fallenleaf.xInitAccelerationMax,
				xvelocitymin         : data.fallenleaf.xVelocityMin,
				xvelocitymax         : data.fallenleaf.xVelocityMax,
				xaccelerationmin     : data.fallenleaf.xAccelerationMin,
				xaccelerationmax     : data.fallenleaf.xAccelerationMax,
				xaccelerationdelta   : data.fallenleaf.xAccelerationDelta,
				yinitvelocitymin     : data.fallenleaf.yInitVelocityMin,
				yinitvelocitymax     : data.fallenleaf.yInitVelocityMax,
				yinitaccelerationmin : data.fallenleaf.yInitAccelerationMin,
				yinitaccelerationmax : data.fallenleaf.yInitAccelerationMax,
				interval             : data.fallenleaf.interval,
				images               : data.fallenleaf.images.join(',')
			}).run();
		}
		return _restore.apply(this, arguments);
	};

	var LeafLayer = function() {
		ImageLayer.call(this);
	};
	LeafLayer.prototype = Object.create(ImageLayer.prototype);

	LeafLayer.prototype.importFrom = function(otherLayer) {
		// これだけで十分です
		this.visible = otherLayer.visible;
	};

	var Leaf = function() {
		this.fore = new LeafLayer();
		this.back = new LeafLayer();

		var _this = this;

		var randomImage = o2.fallenleaf.images[Math.floor(Math.random() * o2.fallenleaf.images.length)];
		this.fore.loadImage(randomImage, {}).done(function() {
			_this.fore.images[0].cacheEnabled = false;
			_this.fore.rect.width /= 8;
			_this.fore.setRect();
		});
		this.back.loadImage(randomImage, {}).done(function() {
			_this.back.images[0].cacheEnabled = false;
			_this.back.rect.width /= 8;
			_this.back.setRect();
		});

		leafForeLayers.push(this.fore);
		leafBackLayers.push(this.back);

		var aboveImageLayer = Math.random() > 0.5,
			minMessageLayerIndex = o2.allForeLayers()
					.filter(function(thisLayer) {
						return thisLayer instanceof MessageLayer;
					})
					.reduce(function(min, thisLayer) {
						return Math.min(min, thisLayer.index);
					}, Infinity);

		if (aboveImageLayer) {
			this.fore.index = minMessageLayerIndex - 1;
			this.back.index = minMessageLayerIndex - 1;
		} else {
			this.fore.index = this.back.index = 1; // baseの上
		}

		this.clipIndex = 0;

		this.reset();
	};

	Leaf.prototype.reset = function() {
		this.xVelocity     = randomNumberBetween(o2.fallenleaf.xInitVelocityMin,     o2.fallenleaf.xInitVelocityMax);
		this.yVelocity     = randomNumberBetween(o2.fallenleaf.yInitVelocityMin,     o2.fallenleaf.yInitVelocityMax);
		this.xAcceleration = randomNumberBetween(o2.fallenleaf.xInitAccelerationMin, o2.fallenleaf.xInitAccelerationMax);
		this.yAcceleration = randomNumberBetween(o2.fallenleaf.yInitAccelerationMin, o2.fallenleaf.yInitAccelerationMax);

		this.setPosition(config.scWidth * Math.random(), -config.scHeight);
	};

	Leaf.prototype.x = function() {
		return this.fore.rect.x;
	};

	Leaf.prototype.y = function() {
		return this.fore.rect.y;
	};

	Leaf.prototype.setPosition = function(x, y) {
		var _this = this;
		renderer.animator.requestFrame(function() {
			_this.fore.rect.x = _this.back.rect.x = x;
			_this.fore.rect.y = _this.back.rect.y = y;
		});
	};

	Leaf.prototype.move = function() {
		this.xVelocity += this.xAcceleration;
		this.yVelocity += this.yAcceleration;

		this.xAcceleration += (Math.random() - 0.5) * (o2.fallenleaf.xAccelerationDelta * 2);

		if (this.xVelocity     >=  o2.fallenleaf.xVelocityMax) this.xVelocity    = o2.fallenleaf.xVelocityMax;
		if (this.xVelocity     <=  o2.fallenleaf.xVelocityMin) this.xVelocity    = o2.fallenleaf.xVelocityMin;
		if (this.xAcceleration >=  o2.fallenleaf.xAccelerationMax) this.xAcceleration = o2.fallenleaf.xAccelerationMax;
		if (this.xAcceleration <=  o2.fallenleaf.xAccelerationMax) this.xAcceleration = o2.fallenleaf.xAccelerationMax;

		var targetX = this.x() + this.xVelocity;
		var targetY = this.y() + this.yVelocity;
		if (targetY > config.scHeight) {
			this.reset();
			return;
		}

		this.setPosition(targetX, targetY);

		// animation
		if (this.fore.images.length && o2.fallenleaf.foreVisible) {
			this.fore.images[0].options.clipLeft = this.fore.rect.width * this.clipIndex;
			this.fore.images[0].options.clipWidth = this.fore.rect.width;
			this.fore.redrawRect();
		}
		if (this.back.images.length && o2.fallenleaf.backVisible) {
			this.back.images[0].options.clipLeft = this.back.rect.width * this.clipIndex;
			this.back.images[0].options.clipWidth = this.back.rect.width;
			this.back.redrawRect();
		}

		this.clipIndex++;
		this.clipIndex %= 8; //clipIndex = 0 ~ 7
	};

	var moveLeavesTimer = null;
	function moveLeaves() {
		for (let i = 0; i < allLeaves.length; i++) {
			var thisLeaf = allLeaves[i];
			thisLeaf.move();
		}
	}

	function resetVisibility() {
		allLeaves.forEach(function(thisLeaf) {
			thisLeaf.fore.visible = o2.fallenleaf.foreVisible;
			thisLeaf.back.visible = o2.fallenleaf.backVisible;
		});
	}

	Tag.actions.leafinit = new TagAction({
		rules : {
			forevisible          : {type:"BOOLEAN"},
			backvisible          : {type:"BOOLEAN"},
			num                  : {type:"INT", defaultValue:24},
			xinitvelocitymin     : {type:"FLOAT"},
			xinitvelocitymax     : {type:"FLOAT"},
			xinitaccelerationmin : {type:"FLOAT"},
			xinitaccelerationmax : {type:"FLOAT"},
			xvelocitymin         : {type:"FLOAT"},
			xvelocitymax         : {type:"FLOAT"},
			xaccelerationmin     : {type:"FLOAT"},
			xaccelerationmax     : {type:"FLOAT"},
			xaccelerationdelta   : {type:"FLOAT"},
			yinitvelocitymin     : {type:"FLOAT"},
			yinitvelocitymax     : {type:"FLOAT"},
			yinitaccelerationmin : {type:"FLOAT"},
			yinitaccelerationmax : {type:"FLOAT"},
			interval             : {type:"INT"},
			images               : {type:"STRING"}  // "img1,img2,img3"
		},
		action : function(args) {

			if (allLeaves.length) {
				o2.error('すでにinitしました');
				return 0;
			}

			new Tag('leafopt', args).run(); // 設定を入れる

			for (let i = 0; i < args.num; i++) {
				var thisLeaf = new Leaf(i % 2);

				thisLeaf.fore.rect.x = i * 50;
				thisLeaf.fore.rect.y = Math.floor(i / 10);

				thisLeaf.back.rect.x = i * 50;
				thisLeaf.back.rect.y = Math.floor(i / 10);

				allLeaves.push(thisLeaf);
			}

			if (args.num) {
				o2.refreshRendererLayers();

				if (moveLeavesTimer != null) {
					clearInterval(moveLeavesTimer);
				}
				moveLeavesTimer = setInterval(moveLeaves, o2.fallenleaf.interval);
			}

			return 0;
		}
	});

	Tag.actions.leafuninit = new TagAction({
		rules : {

		},
		action : function(args) {
			leafForeLayers = [];
			leafBackLayers = [];
			allLeaves = [];

			clearInterval(moveLeavesTimer);
			moveLeavesTimer = null;
			o2.fallenleaf.num = 0;
			o2.refreshRendererLayers();
			renderer.animator.requestFrame();

			return 0;
		}
	});

	Tag.actions.leafopt = new TagAction({
		rules : {
			forevisible          : {type:"BOOLEAN"},
			backvisible          : {type:"BOOLEAN"},
			num                  : {type:"INT", defaultValue:24},
			xinitvelocitymin     : {type:"FLOAT"},
			xinitvelocitymax     : {type:"FLOAT"},
			xinitaccelerationmin : {type:"FLOAT"},
			xinitaccelerationmax : {type:"FLOAT"},
			xvelocitymin         : {type:"FLOAT"},
			xvelocitymax         : {type:"FLOAT"},
			xaccelerationmin     : {type:"FLOAT"},
			xaccelerationmax     : {type:"FLOAT"},
			xaccelerationdelta   : {type:"FLOAT"},
			yinitvelocitymin     : {type:"FLOAT"},
			yinitvelocitymax     : {type:"FLOAT"},
			yinitaccelerationmin : {type:"FLOAT"},
			yinitaccelerationmax : {type:"FLOAT"},
			images               : {type:"STRING"}  // "img1,img2,img3"
		},
		action : function(args) {

			if (args.images) {
				o2.fallenleaf.images = args.images.split(',');
				delete args.images;
			}

			for (var optionName in o2.fallenleaf) {
				var tagArgName = optionName.toLowerCase();
				if (tagArgName in args) {
					o2.fallenleaf[optionName] = args[tagArgName];
				}
			}

			resetVisibility();

			return 0;
		}
	});

	Tag.actions.leafpause = new TagAction({
		rules : {},
		action : function(args) {

			if (o2.fallenleaf.pauseForeVisible == -1 &&
				o2.fallenleaf.pauseBackVisible == -1) {
				//pauseしていない
				o2.fallenleaf.pauseForeVisible = o2.fallenleaf.foreVisible;
				o2.fallenleaf.pauseBackVisible = o2.fallenleaf.backVisible;

				o2.fallenleaf.foreVisible = false;
				o2.fallenleaf.backVisible = false;
				resetVisibility();
			} else {
				//pauseしていて、今解除する
				o2.fallenleaf.foreVisible = o2.fallenleaf.pauseForeVisible;
				o2.fallenleaf.backVisible = o2.fallenleaf.pauseBackVisible;

				o2.fallenleaf.pauseBackVisible = o2.fallenleaf.pauseForeVisible = -1;
				resetVisibility();
			}

			return 0;
		}
	});

	function randomNumberBetween(min, max) {
		return min + Math.random() * (max - min);
	}
})();