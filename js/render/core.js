FP.core = {}

//-- Get a element for an id
FP.core.getEl = function(elem) {
  return document.getElementById(elem);
}

//-- Get all elements for a class
FP.core.getEls = function(classes) {
  return document.getElementsByClassName(classes);
}

FP.core.loadXML = function(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.overrideMimeType('text/xml');

	xhr.onload = function(e) {
		if (this.status == 200) {
			callback(this.responseXML);
		}
	};

	xhr.send();
}

FP.core.loadFile = function(url, callback){
	var xhr = new XMLHttpRequest();
	
	this.succeeded = function(response){
		if(callback){
			callback(response);
		}
	}

	this.failed = function(err){
		console.log("Error:", err);
	}

	this.start = function(){
		var that = this;
		
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';

		xhr.onload = function(e) {
			if (this.status == 200) {
				that.succeeded(this.response);
			}
		};

		xhr.onerror = function(e) {
			that.failed(this.status); //-- TODO: better error message
		};

		xhr.send();
	}

	return {
		"start": this.start,
		"succeeded" : this.succeeded,
		"failed" : this.failed
	}
}

FP.core.crossBrowserColumnCss = function(){
	//-- From Readium: reflowable_pagination_view.js

	// ask modernizr for the vendor prefixed version
	FP.core.columnAxis =  Modernizr.prefixed('columnAxis') || 'columnAxis';
	FP.core.columnGap =  Modernizr.prefixed('columnGap') || 'columnGap';
	FP.core.columnWidth =  Modernizr.prefixed('columnWidth') || 'columnWidth';

}
