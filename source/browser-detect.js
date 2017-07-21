window.browserDetect = (function() {
	'use strict';

	var _getBrowserInfo = function(ua) {
		var matchStr = {
			ie: /msie [0-9.]+/,
			ieAlt: /rv:[0-9.]+/,
			edge: /edge\/[0-9.]+/,
			safari: /version\/[0-9.]+/,
			chrome: /chrome\/[0-9.]+/,
			firefox: /firefox\/[0-9.]+/,
			chromeiOS: /crios\/[0-9.]+/,
			firefoxiOS: /fxios\/[0-9.]+/
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

		// check for Chrome on iOS
		if (ua.indexOf('crios') !== -1) {
			browserInfo.name = 'chrome-ios';

			if (ua.match(matchStr.chromeiOS)) {
				browserInfo.versionString = ua.match(matchStr.chromeiOS).toString().replace(/crios\//, '');
			}
		}

		// check for Firefox
		if (ua.indexOf('firefox') !== -1) {
			browserInfo.name = 'firefox';

			if (ua.match(matchStr.firefox)) {
				browserInfo.versionString = ua.match(matchStr.firefox).toString().replace(/firefox\//, '');
			}
		}

		// check for Firefox on iOS
		if (ua.indexOf('fxios') !== -1) {
			browserInfo.name = 'firefox-ios';

			if (ua.match(matchStr.firefoxiOS)) {
				browserInfo.versionString = ua.match(matchStr.firefoxiOS).toString().replace(/fxios\//, '');
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

	var _getOSInfo = function(platform, ua) {
		var osInfo = {
			name: '',
			versionString: '',
			versionClass: '',
			version: {
				major: 0,
				minor: 0
			},
		}

		var verStrReplace = '';
		var uaMatch = false;

		platform = platform.toLowerCase();


		if (platform.search('linux') >= 0) {
			osInfo.name = 'linux';

			uaMatch = ua.match(/Android (\d+).(\d+)/);

			if (uaMatch) {
				osInfo.name = 'android';
				verStrReplace = 'Android ';
			}
		}

		if (platform.search('win') >= 0) {
			osInfo.name = 'win';

			// TODO: add windows version numbers
		}

		if (platform.search('mac') >= 0) {
			osInfo.name = 'osx';

			uaMatch = ua.match(/OS X (\d+).(\d+)/);

			if (uaMatch) {
				verStrReplace = 'OS X ';
			}
		}

		if (platform.search('iphone') >= 0 || platform.search('ipad') >= 0) {
			osInfo.name = 'ios';

			uaMatch = ua.match(/OS (\d+).(\d+)/);

			if (uaMatch) {
				verStrReplace = 'OS ';
			}
		}

		if (uaMatch) {
			osInfo.versionString = (uaMatch && verStrReplace) ? uaMatch[0].toString().replace(verStrReplace, '') : '';
			osInfo.version.major = (uaMatch.length >= 2) ? uaMatch[1] : '';
			osInfo.version.minor = (uaMatch.length >= 3) ? uaMatch[2] : '';
		}


		return osInfo;
	};

	return {
		getBrowserInfo: function(ua) {
			if (ua === undefined) { ua = window.navigator.userAgent; }

			return _getBrowserInfo(ua);
		},
		addBrowserClasses: function(ua) {
			var bi = this.getBrowserInfo(ua);

			var htmlTag = document.querySelector('html');
			htmlTag.classList.add('browser-'+bi.name);
			htmlTag.classList.add('browser-'+bi.name+'-'+bi.version.major);
			// htmlTag.classList.add('browser-'+bi.name+'-'+bi.version.major+'-'+bi.version.minor);
		},
		getOSInfo: function(platform, ua) {
			if (platform === undefined) { platform = window.navigator.platform; }
			if (ua === undefined) { ua = window.navigator.userAgent; }

			return _getOSInfo(platform, ua);
		},
		addOSClasses: function(platform, ua) {
			var osInfo = this.getOSInfo(platform, ua);

			if (osInfo.name) {
				var htmlTag = document.querySelector('html');
				htmlTag.classList.add('os-'+osInfo.name);

				if (osInfo.version.major) {
					htmlTag.classList.add('os-'+osInfo.name+'-'+osInfo.version.major);
				}

				if (osInfo.version.major && osInfo.version.minor) {
					htmlTag.classList.add('os-'+osInfo.name+'-'+osInfo.version.major+'-'+osInfo.version.minor);
				}
			}
		}
	}
})();
