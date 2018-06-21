let interval = null;		// generation change timer
let speed = 100;			// generation change speed 
let size = 11;				// tile size for zoom
let cSize = [0, 0];			// canvas size
let offset = [0, 0];		// offset for centering
let offset2 = [0, 0];		// offset for drag
let pSize = [0, 0]			// pattern size
let alive = {};				// current pattern
let generation = 0;			// generation counter

//default patterns
let patterns = {
	"Empty" : {},
	"Block" : {"0,0":9,"0,1":9,"1,1":9,"1,0":9},
	"Beehive" : {"0,1":9,"1,0":9,"2,0":9,"3,1":9,"2,2":9,"1,2":9},
	"Loaf" : {"0,1":9,"1,0":9,"2,0":9,"3,1":9,"1,2":9,"3,2":9,"2,3":9},
	"Boat" : {"0,0":9,"0,1":9,"1,0":9,"1,2":9,"2,1":9},
	"Tub" : {"0,1":9,"1,0":9,"1,2":9,"2,1":9},
	"Blinker" : {"0,1":9,"0,2":9,"0,0":9},
	"Toad" : {"0,2":9,"3,1":9,"1,3":9,"0,1":9,"2,0":9,"3,2":9},
	"Beacon" : {"0,1":9,"0,0":9,"1,1":9,"1,0":9,"2,2":9,"3,2":9,"2,3":9,"3,3":9},
	"Pulsar" : {"0,2":9,"0,3":9,"0,4":9,"2,0":9,"3,0":9,"4,0":9,"5,2":9,"5,3":9,"5,4":9,"4,5":9,"3,5":9,"2,5":9,"4,7":9,"2,7":9,"3,7":9,"5,8":9,"5,9":9,"5,10":9,"7,2":9,"7,3":9,"7,4":9,"8,5":9,"9,5":9,"10,5":9,"7,10":9,"7,9":9,"7,8":9,"8,7":9,"9,7":9,"10,7":9,"8,0":9,"9,0":9,"10,0":9,"12,4":9,"12,3":9,"12,2":9,"4,12":9,"3,12":9,"2,12":9,"8,12":9,"9,12":9,"10,12":9,"0,10":9,"0,8":9,"0,9":9,"12,8":9,"12,9":9,"12,10":9},
	"Pentadecathlon" : {"0,0":9,"0,1":9,"0,2":9,"0,3":9,"0,4":9,"0,5":9,"0,6":9,"0,7":9,"0,8":9,"0,9":9},
	"Glider" : {"0,2":9,"1,2":9,"2,2":9,"2,1":9,"1,0":9},
	"Lightweight Spaceship" : {"1,0":9,"2,0":9,"3,0":9,"4,0":9,"0,1":9,"0,3":9,"4,1":9,"4,2":9,"3,3":9},
	"The R-pentomino" : {"1,0":9,"1,1":9,"1,2":9,"2,0":9,"0,1":9},
	"Diehard" : {"0,1":9,"1,1":9,"1,2":9,"5,2":9,"6,2":9,"7,2":9,"6,0":9},
	"Acorn" : {"0,2":9,"1,2":9,"1,0":9,"3,1":9,"6,2":9,"5,2":9,"4,2":9},
	"Gosper Glider Gun" : {"0,4":9,"0,5":9,"1,4":9,"1,5":9,"10,4":9,"10,5":9,"10,6":9,"11,3":9,"12,2":9,"13,2":9,"11,7":9,"12,8":9,"13,8":9,"14,5":9,"15,3":9,"15,7":9,"16,4":9,"16,6":9,"16,5":9,"17,5":9,"20,4":9,"20,3":9,"20,2":9,"21,2":9,"21,3":9,"21,4":9,"22,1":9,"22,5":9,"24,1":9,"24,0":9,"24,5":9,"24,6":9,"34,2":9,"34,3":9,"35,3":9,"35,2":9},
	"Infinite 1" : {"0,5":9,"2,4":9,"2,5":9,"4,1":9,"4,2":9,"4,3":9,"6,0":9,"6,1":9,"6,2":9,"7,1":9},
	"Infinite 2" : {"0,0":9,"0,1":9,"0,4":9,"1,0":9,"2,0":9,"4,0":9,"3,2":9,"4,2":9,"4,3":9,"4,4":9,"1,3":9,"2,3":9,"2,4":9},
	"Infinite 3" : {"0,0":9,"1,0":9,"2,0":9,"3,0":9,"5,0":9,"4,0":9,"6,0":9,"7,0":9,"9,0":9,"10,0":9,"11,0":9,"12,0":9,"13,0":9,"17,0":9,"18,0":9,"19,0":9,"26,0":9,"27,0":9,"28,0":9,"29,0":9,"30,0":9,"31,0":9,"32,0":9,"34,0":9,"35,0":9,"36,0":9,"37,0":9,"38,0":9}
};



$( document ).ready(function() {
	//set canvas size
	cSize = [$('#canvas').width(), $('#canvas').height()];
	//load default pattern
	loadPattern("Gosper Glider Gun");
	//event handlers
	$('#speed-slider').slider();
	$('#speed-slider').on("change", function(slideEvt) {
		$("#speed-text").text(slideEvt.value.newValue);
		speed = Math.abs(slideEvt.value.newValue*5 - 499);
		if (interval) {
			clearInterval(interval);
			interval = setInterval(function(){ 
			nextGen();
			draw(); 
			}, speed);
		}
	});
	
	var sideSlider = $('#size-slider').slider();
	$('#size-slider').on("change", function(slideEvt) {
		resize(slideEvt.value.newValue);
	});
	
	$('#canvas').on("dblclick", function(e) {
		let rect = document.getElementById('canvas').getBoundingClientRect();
		mouseX=Math.floor((e.clientX-rect.left - offset2[0])/size - offset[0]);
		mouseY=Math.floor((e.clientY-rect.top - offset2[1])/size - offset[1]);
		if ( mouseX + "," + mouseY in alive ) {
			delete alive[mouseX + "," + mouseY];
		} else {
			alive[mouseX + "," + mouseY] = 9;
		}
		generation = 0;
		$('#counter').text(generation);
		draw();
	});
	
	$('#canvas').on("wheel", function(e) {
		e.preventDefault();
		if (e.originalEvent.deltaY < 0  && size <= 15) {
			resize(size);
			sideSlider.slider('setValue', size-1);
		} else if (e.originalEvent.deltaY >0 && size > 2) {
			resize(size - 2);
			sideSlider.slider('setValue', size-2);
		}
		
	});
	
	$('#canvas').on("mousedown", function(e) {
		var initCoords = [e.clientX, e.clientY];
		$('#canvas').on("mousemove", function(e) {
			offset2[0] -= initCoords[0] - e.clientX;
			offset2[1] -= initCoords[1] - e.clientY;
			initCoords = [e.clientX, e.clientY];
			draw();
		});
	});
	
	$('#canvas').on("mouseup mouseleave", function(e) {
		$('#canvas').off("mousemove");
	});
	
	$('#run-button').on("click", function(e) {
		if (interval) {
			$('#run-button').removeClass('stop-button').addClass('start-button').text("Start");
			$('#run-card').removeClass('stop-button').addClass('start-button');
			clearInterval(interval);
			interval = null;
		} else {
			$('#run-button').removeClass('start-button').addClass('stop-button').text("Stop");
			$('#run-card').removeClass('start-button').addClass('stop-button');
			interval = setInterval(function(){ 
				nextGen(); 
				draw(); 
			}, speed);
		}
	});
	
	$('#next-button').on("click", function(e) {
		nextGen();
		draw();
	});
	
	$('#clear-button').on("click", function(e) {
		loadPattern("Empty");
	});
	
	$('.list-group-item').on("click", function(e) {
		loadPattern($(this).text());
	});
});

function resize(s) {
	$("#size-text").text(s);
	size = s + 1;
	//change offsets
	offset[0] = Math.floor(((cSize[0]/size) - (pSize[0] + 1))/2);
	offset[1] = Math.floor(((cSize[1]/size) - (pSize[1] + 1))/2);
	//redraw
	draw();
}

function draw() {
	let canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		let ctx = canvas.getContext('2d');

		// draw background
		ctx.fillStyle = "#2f3136";
		ctx.lineWidth = 1;
		ctx.fillRect (0, 0, cSize[0], cSize[1]);
		
		//draw grid
		ctx.strokeStyle = "#202225";
		for ( let n = -  size + (offset2[0] % size); n <= cSize[0]; n += size ) {
			ctx.beginPath();
			ctx.moveTo(n + .5, 0);
			ctx.lineTo(n + .5, cSize[1]);
			ctx.stroke();
		}
		
		for ( let n = - size + (offset2[1] % size); n <= cSize[1]; n += size ) {
			ctx.beginPath();
			ctx.moveTo(0, n + .5);
			ctx.lineTo(cSize[0], n + .5);
			ctx.stroke();
		}

		//draw pattern
		ctx.fillStyle = "#28a745";
		ctx.lineWidth = 1;

		for ( let a in alive ) {
			let cell =  a.split(",");
			ctx.fillRect(cell[0] * size + 1 + offset[0] * size + offset2[0], cell[1] * size + 1 + offset[1] * size + offset2[1], size - 1, size - 1);
		}
	}
}

function loadPattern(name) {
	alive = Object.assign({}, patterns[name]);
	generation = 0;
	$('#counter').text(generation);
	//set offsets
	pSize = [0, 0];
	offset2 = [0, 0];
	for ( let p in alive ) {
		p = p.split(",");
		if ( parseInt(p[0], 10) > pSize[0] ) { pSize[0] = parseInt(p[0], 10)};
		if ( parseInt(p[1], 10) > pSize[1] ) { pSize[1] = parseInt(p[1], 10)};
	}
		
	offset[0] = Math.floor(((cSize[0]/size) - (pSize[0] + 1))/2);
	offset[1] = Math.floor(((cSize[1]/size) - (pSize[1] + 1))/2);
	//redraw
	draw();
	//stop if running
	if (interval) {
		$('#run-button').removeClass('btn-danger');
		$('#run-button').addClass('btn-success').text("Start");
		clearInterval(interval);
		interval = null;
	}
}

function nextGen() {
	//calculate number of neighbours for each living cell and their neighbour cells
	for ( let a in alive ) {
		let cell =  a.split(",");
		let directions = {x: [1, 1, 1, -1, -1, -1, 0, 0], y: [1, -1, 0, 1, -1, 0, 1, -1]};
		for ( let i = 0; i  < directions.x.length; i++ ) {
			let index = (parseInt(cell[0], 10) + directions.x[i]) + "," + (parseInt(cell[1], 10) + directions.y[i]);
			if ( index in alive ) {
				if (alive[index] >= 8) {
					alive[cell[0] + "," + cell[1]] ++;
				} else {
					alive[index] ++;
				}
			} else {
				alive[index] = 1;
			}
		}
	}
	//remove dead cells
	for ( let a in alive ) {
		if ( alive[a] == 3 || alive[a] == 11 || alive[a] == 12 ) {
			alive[a] = 9; 
		} else {
			delete alive[a];
		}
		
	}
	// set generation counter
	generation++; 
	$('#counter').text(generation);
	//return new shape
	return alive;
}