/*	expecting filters in two array forms
	filter = [field, comparison, value]
	or [filter, 'and', filter, 'and', filter]
	where each 0/even index is a filter array of the first form above

	Returns an XML string of the form
		<Parameter>
			<Start field1="value"1 field2="value2"/>
			<End field1="value1" field2="value2"/>
			<Compare field1="comparisonFunction" field2="comparisonFunction"/>
		</Parameter>
*/
function processFilterArray (filterArray) {
	var startParam 	= '<Parameter>',
		endParam 	= '</Parameter>';
	var data = { start:{}, end:{}, compare:{} },
		conjunction;

	if(!filterArray) {
		return null;
	}
	if(Array.isArray(filterArray[0])) {
		filterArray.forEach(function(el, index, array) {
			if(isEven(index)) {
				if(Array.isArray(el[0])) { 
					processArray(el, data, conjunction);
				} else {
					processFilter(el, data, conjunction);
				}
			} else {
				conjunction = el;
			}
		});
	} else {
        processFilter(filterArray, data, null);
    }

    //return data;
	return 	startParam 
			+ '<Start ' + processObjtoXML(data.start) + '/>' 
			+ '<End ' + processObjtoXML(data.end) + '/>'
			+ '<Compare ' + processObjtoXML(data.compare) + '/>' + endParam;
}

/* process individual filter array of the form [field, comparison, value] */
function processFilter(filter, data, conj) {
	if(data.start[filter[0]]) {
		data.end[filter[0]] = filter[2];
		data.compare[filter[0]] = data.compare[filter[0]].concat(conjOperator(conj), getComparisonFunc(filter[1]));
	} else {
		data.start[filter[0]] = filter[2];
		data.end[filter[0]] = '';
		data.compare[filter[0]] = getComparisonFunc(filter[1]);
	}
}

function processArray(arr, data, conj) {
	arr.forEach(function(el, index, array) {
		if(isEven(index)) {
			processFilter(el, data, conj);
		} else {
			conj = el;
		}
	});
	return;
}

function processObjtoXML(obj) {
	var result = '';
	for (var i in obj) {
		result += i + '="' + obj[i] + '" ';
	}
	return result;
}

/* used to check even index in array for index n */
function isEven(n) {
   return n == parseFloat(n) && (n % 2 == 0);
}

/* comparison function from dxDataGrid translated to web service function codes */
function getComparisonFunc(func) {
    switch(func) {
        case '=': 			return '01';
        case '<>': 			return '09';
        case '>': 			return '02';
        case '>=': 			return '03';
        case '<': 			return '07';
        case '<=': 			return '08';
        case 'startswith': 	return '10';
        case 'contains': 	return '00';
        default: 			return '00';
    }
}

function conjOperator(op) {
	var conjCode;
	switch(op) {
		case 'and': return '1';
		case 'or': return '2';
		default: return '0';
	}
}