window.browserDetect = (function() {
	'use strict';

	var _getBrowserInfo = function(ua) {
		var matchStr = {
			ie: /msie [0-9.]+/,
			ieAlt: /rv:[0-9.]+/,
			edge: /edge\/[0-9.]+/,
			safari: /version\/[0-9.]+/,
			chrome: /chrome\/[0-9.]+/,
			firefox: /firefox\/[0-9.]+/
		};

		var browserInfo = {
			name: '',
			versionString: '',
			version: {
				major: 0,
				minor: 0
			},
		}

		ua = ua.toLowerCase();

		// check for Webkit (Chrome & Safari)
		if (ua.indexOf('webkit') !== -1) {
			if (ua.match(matchStr.chrome)) {
				browserInfo.name = 'chrome';

				browserInfo.versionString = ua.match(matchStr.chrome).toString().replace(/chrome\//, '');
			} else if (ua.match(matchStr.safari)) {
				browserInfo.name = 'safari';

				browserInfo.versionString = ua.match(matchStr.safari).toString().replace(/version\//, '');
			}
		}

		// check for Firefox
		if (ua.indexOf('firefox') !== -1) {
			browserInfo.name = 'firefox';

			if (ua.match(matchStr.firefox)) {
				browserInfo.versionString = ua.match(matchStr.firefox).toString().replace(/firefox\//, '');
			}
		}

		// check for IE
		if (ua.indexOf('trident') !== -1) {
			browserInfo.name = 'ie';

			if (ua.match(matchStr.ieAlt)) {
				// sometimes IE11 doesn't use MSIE, so look for 'rv:' instead
				browserInfo.versionString = ua.match(matchStr.ieAlt).toString().replace(/rv:/, '');
			} else if (ua.match(matchStr.ie)) {
				// check for MSIE identifier
				browserInfo.versionString = ua.match(matchStr.ie).toString().replace('msie ', '');
			}
		}

		// check for Edge
		if (ua.indexOf('edge/') !== -1) {
			browserInfo.name = 'edge';

			if (ua.match(matchStr.edge)) {
				browserInfo.versionString = ua.match(matchStr.edge).toString().replace(/edge\//, '');
			}
		}

		if (browserInfo.versionString) {
			var parts = browserInfo.versionString.split('.');

			browserInfo.version.major = parts[0] !== undefined ? parts[0] : 0;
			browserInfo.version.minor = parts[1] !== undefined ? parts[1] : 0;
		}

		return browserInfo;
	};

	// var _getOSInfo = function(platform) {
	// 	platform = platform.toLowerCase();
	//
	// 	if (platform.search('win') >= 0) {
	//         return 'windows';
	//     }
	//
	//     if (platform.search('mac') >= 0) {
	//         return 'osx';
	//     }
	//
	//     if (ua.search('iphone') >= 0){
	//         return 'ios';
	//     }
	//
	//     if (platform.search('linux') >= 0) {
	//         return 'linux';
	//     }
	//
	// 	return '';
	// };

	return {
		getBrowserInfo: function(ua) {
			if (ua === undefined) { ua = window.navigator.userAgent; }

			return _getBrowserInfo(ua);
		},
		addBrowserClasses: function(ua) {
			var bi = this.getBrowserInfo(ua);

			var headEl = document.querySelector('head');
			headEl.classList.add('browser-'+bi.name);
			headEl.classList.add('browser-'+bi.name+'-'+bi.version.major);
			// headEl.classList.add('browser-'+bi.name+'-'+bi.version.major+'-'+bi.version.minor);
		},
		// getOSInfo: function(platform) {
		// 	if (platform === undefined) { platform = window.navigator.platform; }
		//
		// 	return _getOSInfo(platform);
		// },
		// addOSClasses: function(platform) {
		// 	var osi = this.getOSInfo(platform);
		//
		// 	var headEl = document.querySelector('head');
		// 	headEl.classList.add('os-'+osi);
		// }
	}
})();
