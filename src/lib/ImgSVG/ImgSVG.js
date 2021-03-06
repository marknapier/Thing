var Thing = require('../Thing/Thing.js');

/*
// works with star.svg as base64
-webkit-mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiI…tzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gIDwvZz48L3N2Zz4=);
-webkit-mask-repeat: no-repeat;
-webkit-mask-size: 100%;

// circle svg also works
-webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><circle shape-rendering='geometricPrecision' cx='15' cy='15' r='10' stroke='black' stroke-width='5' fill='none'/></svg>");
-webkit-mask-repeat: no-repeat;
-webkit-mask-size: 100%;

.star {
  -webkit-mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB2ZXJzaW9uPSIxLjEiICAgaWQ9InN2ZzIiICAgdmlld0JveD0iMCAwIDk5Ljk5OTk5NyA5OS45OTk5OTciICAgaGVpZ2h0PSIxMDAiICAgd2lkdGg9IjEwMCI+ICA8ZGVmcyAgICAgaWQ9ImRlZnM0IiAvPiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGE3Ij4gICAgPHJkZjpSREY+ICAgICAgPGNjOldvcmsgICAgICAgICByZGY6YWJvdXQ9IiI+ICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4gICAgICAgIDxkYzp0eXBlICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+ICAgICAgPC9jYzpXb3JrPiAgICA8L3JkZjpSREY+ICA8L21ldGFkYXRhPiAgPGcgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTk1Mi4zNjIyMykiICAgICBpZD0ibGF5ZXIxIj4gICAgPHBhdGggICAgICAgZD0iTSA1MC4wMDAwMDEsOTU0LjgwOTM5IDY1LjQ1MDg0OCw5ODYuMTE2MjQgMTAwLDk5MS4xMzY1MiA3NC45OTk5OTgsMTAxNS41MDU1IDgwLjkwMTY5OSwxMDQ5LjkxNSA1MCwxMDMzLjY2OTEgMTkuMDk4Mjk4LDEwNDkuOTE1IDI1LjAwMDAwMSwxMDE1LjUwNTUgLTEuMjEzNDMzNmUtNiw5OTEuMTM2NTIgMzQuNTQ5MTUxLDk4Ni4xMTYyNCBaIiAgICAgICBpZD0icGF0aDQxMzYiICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eTowLjUwMjIyMjI0O3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyMi42NzcxNjU5OTtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gIDwvZz48L3N2Zz4=);
}
*/

class ImgSVG extends Thing {
  init (props) {
    var defaultProps = {
      lineWidth: 5,
      radius: 10
    };
    this.props = props = $.extend({}, defaultProps, props);
    this.setDefaultProps(props);
    this.type = 'ImgSVG';
    this.$element = Thing.makeElement(this.html(), this.props, this.type);
    this.$element.addClass(props.pattern);
  }

  render () {
    let svgTag = ImgSVG.makeCircleSVG(this.props.radius, this.props.lineWidth);
    super.render();
    this.$element.append(svgTag);
  }

  getURL () {
    return ImgSVG.makeURL(ImgSVG.makeCircleSVG(this.props.radius, this.props.lineWidth));
  }

  static makeURL (svgTag) {
    return `url("data:image/svg+xml;utf8,${svgTag}")`;
  }

  static makeCircleSVG (radius, lineWidth) {
    let outerRadius = radius + lineWidth;
    let width = (outerRadius) * 2;
    let svgTag = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${width}'><circle shape-rendering='geometricPrecision' cx='${outerRadius}' cy='${outerRadius}' r='${radius}' stroke='black' stroke-width='${lineWidth}' fill='none'/></svg>`;
    return svgTag;
  }

  // radius: radius of dot (will be capped at 1/4 of size, so dots don't overflow image bounds)
  // size: size of two-dot image (square)
  //
  // SVGs scale up/down very well, so there's no need to set a large size. Just use 100 and scale the image in CSS.
  static makePolkaDotsSVG (radius=20, size=100) {
    let left = size * 0.25;
    let right = size * 0.75;
    let r = radius > size * 0.25 ? size * 0.25 : radius;
    let svgTag = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle shape-rendering='geometricPrecision' cx='${left}' cy='${left}' r='${r}' fill='black'/><circle shape-rendering='geometricPrecision' cx='${right}' cy='${right}' r='${r}' fill='black'/></svg>`;
    return svgTag;
  }
}

Thing.addClass(ImgSVG);

module.exports = ImgSVG;


/** SVG Polka dot pattern, filled into rectangle

<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
        <pattern x="561.2000122070312" y="167" id="pattern-output" width="400" height="350" patternUnits="userSpaceOnUse">
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="350">
                <rect width="100%" height="100%" fill="#fbfbfb"></rect>
                <g transform="translate(99, 89), rotate(0, 0, 0), scale(1)" fill="#000000" stroke-width="2" stroke="none">
                    <circle r="25" transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(400, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(0, 350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(400, 350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <rect transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none" class="shape-overlay"></rect>
                    <rect transform="translate(400, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(0, 350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(400, 350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                </g>
                <g transform="translate(302, 258), rotate(0, 0, 0), scale(1)" fill="#000000" stroke-width="2" stroke="none">
                    <circle r="25" transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(-400, 0), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(0, -350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <circle r="25" class="clone" transform="translate(-400, -350), rotate(0, 0, 0), scale(4.5)"></circle>
                    <rect transform="translate(0, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none" class="shape-overlay"></rect>
                    <rect transform="translate(-400, 0), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(0, -350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                    <rect transform="translate(-400, -350), rotate(0, 0, 0), scale(4.5)" x="-25" y="-25" width="50" height="50" fill="transparent" stroke="none"></rect>
                </g>
            </svg>
        </pattern>
    </defs>
    <rect class="preview-output" width="100%" height="100%" fill="url(#pattern-output)"></rect>
</svg>
*/
