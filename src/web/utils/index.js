let g_svgDOM_hidden = null
export function getSVGTextSize(text) {
	const ns = 'http://www.w3.org/2000/svg'
	if (g_svgDOM_hidden == null) {
		g_svgDOM_hidden = document.createElementNS(ns, 'svg');
		Object.assign(g_svgDOM_hidden.style, { visibility: 'hidden', position: 'absolute', left: '0px', top: '0px', width: '1px', height: '1px' })
	}
	document.body.appendChild(g_svgDOM_hidden);

	let txtNode = document.createTextNode(text);
	let tmpSVGText = document.createElementNS(ns, 'text');
	tmpSVGText.appendChild(txtNode)

	g_svgDOM_hidden.appendChild(tmpSVGText)
	let {width, height} = tmpSVGText.getBBox()
	g_svgDOM_hidden.removeChild(tmpSVGText)

	document.body.removeChild(g_svgDOM_hidden);

	return {width, height}
}