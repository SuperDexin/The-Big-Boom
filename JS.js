
"use strict";
class blocks {
	constructor(color, value){
		this.color = parseInt(color);
		this.value = parseInt(value);
		this.exist = true;
	}
}

Array.prototype.copy = function(){
	let a = this.concat();
	return a;
}

var main_table =  new Array(6);
for(let i = 0; i < main_table.length; i++){
	main_table[i] = new Array(6);
}

var colors = ["LightPink", "PaleGreen", "SkyBlue", "Plum", "Gold"];
var colors_cn = ["红", "绿", "蓝", "紫", "金"];

var score = 0;

var del_num = 3;

var remove_bool = false;

function init(){
	for (let i = 0; i < 6; i++){
		for (let j = 0; j < 6; j++){
			let color = Math.floor(Math.random()*4);
			let value = Math.floor(Math.random()*3 + 1);
			main_table[i][j] = new blocks(color, value);
			let button = document.getElementById(`${i}${j}`);
			button.style.background = colors[color];
			button.innerHTML = value;
		}		
	}

	score = 0;
	document.getElementById("score").innerHTML = score;

	del_num = 3;
	document.getElementById("del_num").innerHTML = del_num;

	remove_bool = false;
	document.getElementById("del").disabled = false;
	document.getElementById("del").checked = false;

}

function choose(x, y){
	x = parseInt(x);
	y = parseInt(y);
	let obj = main_table[x][y];

	if(remove_bool){
		return remove_block(x, y);
	}

	if(obj.color == 4){
		return;
	}

	let a = search(x, y, obj.color, 0, 0);
	let final_value = a[0];
	let num = a[1];

	obj.exist = true;

	if (num > 1){
		score += final_value + num + (2 ** Math.floor(num/3)) - 1;

		if (final_value > 100){
		obj.color = 4;
		score += obj.value;
		
		del_num += 1;
		document.getElementById("del_num").innerHTML = del_num;
		document.getElementById("del").disabled = false;
		}

		document.getElementById("score").innerHTML = score;
		obj.value = final_value;
		refresh_block();
	}
	check_game_over();
}

function search(x, y, color, value, num){
	if (x < 0 || y < 0 || x == 6 || y == 6){
		return [value, num];
	}

	if (main_table[x][y].color == color && main_table[x][y].exist){
		let a;
		num += 1;
		main_table[x][y].exist = false;
		value += main_table[x][y].value;

		a = search(x+1, y, color, value, num);
		value = a[0];
		num = a[1];

		a = search(x, y+1, color, value, num);
		value = a[0];
		num = a[1];

		a = search(x-1, y, color, value, num);
		value = a[0];
		num = a[1];

		a = search(x, y-1, color, value, num);
		value = a[0];
		num = a[1];

	}
	   
	return [value, num];
}

function refresh_block(){
	for (let i = 0; i < 6; i++){
		let j = 0
		for (let k = 0; k < 6; k++){
			if (!main_table[i][j].exist){
				main_table[i].splice(j, 1);
				let color = Math.floor(Math.random()*4);
				let value = Math.floor(Math.random()*3 + 1);
				main_table[i].push(new blocks(color, value));
			}
			else{
				j += 1;
			}
		}
	}

	for (let i = 0; i < 6; i++){
		for (let j = 0; j < 6; j++){
			let obj = main_table[i][j];
			let button = document.getElementById(`${i}${j}`);
			button.style.background = colors[obj.color];
			button.innerHTML = obj.value;
		}		
	}

}

function del_block(){
	remove_bool = !remove_bool;
}

function remove_block(x, y){
	x = parseInt(x);
	y = parseInt(y);
	let obj = main_table[x][y];

	if(window.confirm(`你确定要删除这个 ${colors_cn[obj.color]}色 的 ${obj.value} 吗？`)){
		obj.exist = false;
		score -= obj.value;
		if(obj.color == 4) score -= obj.value;
		if (score < 0) score = 0;
		document.getElementById("score").innerHTML = score;
		refresh_block();
		del_num -= 1;
		document.getElementById("del_num").innerHTML = del_num;
		if (del_num == 0){
			document.getElementById("del").disabled = true;	
		}
		document.getElementById("del").checked = false;	
		remove_bool = false;
		check_game_over();
	}
}

function check_game_over(){
	for (let i = 0; i < 6; i++){
		for (let j = 0; j < 6; j++){
			if (main_table[i][j].color != 4){
				let a = search(i, j, main_table[i][j].color, 0, 0);
				let final_value = a[0];
				let num = a[1];
				if (num > 1){
					for (let m = 0; m < 6; m++){
						for (let n = 0; n < 6; n++){
							main_table[m][n].exist = true;
						}
					}
					refresh_block();
					return;
				}
			}
		}
	}

	for (let m = 0; m < 6; m++){
		for (let n = 0; n < 6; n++){
			main_table[m][n].exist = true;
		}
	}
	if(del_num > 0){
		alert("无可合并，试试移除一个方块");
	}
	else{
		alert(`游戏结束！得分 ${score}`);
	}
	
}

function undo(){

}