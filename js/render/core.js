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

//-- Load scripts async: http://stackoverflow.com/questions/7718935/load-scripts-asynchronously
FP.core.loadScript = function(src, callback, target) {
  var s, r;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = false;
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      if(callback) callback();
    }
  },
      target = target || document.body;
  target.appendChild(s);
}

FP.core.loadScripts = function(srcArr, callback, target) {
  var total = srcArr.length,
      curr = 0,
      cb = function(){
        curr++;
        if(total == curr){
          if(callback) callback();
        }else{
          FP.core.loadScript(srcArr[curr], cb, target);
        }
      };

  // srcArr.forEach(function(src){
  // FP.core.loadScript(src, cb, target);
  // });
  FP.core.loadScript(srcArr[curr], cb, target);

}

FP.core.toArray = function(obj) {
  var arr = [];

  for (member in obj) {
    var newitm;
    if ( obj.hasOwnProperty(member) ) {
      newitm = obj[member];
      newitm.ident = member;
      arr.push(newitm);
    }
  }

  return arr;
};

FP.core.addCss = function(src, callback, target) {
  var s, r;
  r = false;
  s = document.createElement('link');
  s.type = 'text/css';
  s.rel = "stylesheet";
  s.href = src;
  s.onload = s.onreadystatechange = function() {
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      if(callback) callback();
    }
  },
      target = target || document.body;
  target.appendChild(s);
}