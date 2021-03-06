'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stylesheet = require('../../../lib/stylesheet/stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  list: {
    preview: {
      marginBottom: 20,
      display: 'flex',
      position: 'relative'
    },
    image: {
      width: 162,
      height: 93
    },
    text: {
      // flex: 1,
      display: 'inline-block', //non flex fallback
      paddingLeft: 20,
      lineHeight: 1.2,
      height: '2.4rem'
    },
    title: {
      marginBottom: 10,
      lineHeight: 1.2,
      height: '2.4rem',
      overflow: 'hidden',
      maxWidth: '260px'
    },
    badgeContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 162,
      height: 93,
      zIndex: 1
    }
  },
  grid: {
    preview: {
      cursor: 'pointer',
      position: 'relative',
      display: 'inline-block', //non flex fallback
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: 100
    },
    text: {},
    title: {
      marginTop: 10,
      marginBottom: 10,
      lineHeight: 1.2,
      height: '2.4rem',
      overflow: 'hidden',
      maxWidth: '210px'
    },
    badgeContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 90,
      zIndex: 1
    }
  },
  after: {
    clear: 'both',
    display: 'table'
  },
  link: {
    color: _stylesheet.defaults.colors.dmBrand
  },
  selectable: {},
  selected: {
    opacity: .7
  },
  selectableHover: {
    // boxShadow: '0 0 5px rgba(0,0,0,0.2)'
  },
  selectableHoverImage: {}
};

exports.default = styles;