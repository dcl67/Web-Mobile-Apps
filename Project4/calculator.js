function Calc(){}

//returns html string for displaying calculation on the main page's content area
Calc.prototype.render = function(){
	var html_str = `
		<h2 style="margin-top: 0">Calculation Service</h2>
		<p>This page will allow you to get either the factorial or summation of a positive integer n. For example, if the given n is 5, the factorial is 1*2*3*4*5, or the summation is 1+2+3+4+5.</p>
		<p>Enter a positive integer, then select the type of calculation from the dropdown menu:</p>
		<input type="text" id="n_input" placeholder="Enter a positive integer...">
		<select id="calcul">
		<option value="fact">Factorial</option>
		<option value="sum">Summation</option>
		</select>
		<input type="button" onclick="getCalc()" value="Submit">
		<br/>
		<div id="out_calc"></div>`;
	return html_str;
}

//calculate the factorial of an integer n
Calc.prototype.fact = function(n){
	var result = 1;
	for(i=1; i<=n; i++){
		result *= i;
	}
	return result;
}

//calculate the summation of an integer n
Calc.prototype.sum = function(n){
	var result = 0;
	for(i=0; i<=n; i++){
		result += i;
	}
	return result;
}

module.exports = Calc;
