import React from 'react'

export default class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		const css_input = {
			border: '1px solid #FF7F00',
			lineHeight: this.props.mini ? '24px' : '32px',
			fontSize: this.props.mini ? '12px' : '14px',
			borderTopLeftRadius: '16px',
			borderBottomLeftRadius: '16px',
			padding: '0px 16px',
			width: '160px',
			fontWeight: 'bold',
			boxSizing: 'border-box',
			margin: '0px',
			outline: 'none'
		}
		const css_span = {
			display: 'inline-block',
			backgroundColor: '#ff7f00',
			height: this.props.mini ? '26px' : '34px',
			lineHeight: this.props.mini ? '26px' : '34px',
			padding: this.props.mini ? '0px 12px 0px 6px' : '0px 16px 0px 8px',
			borderTopRightRadius: '16px',
			borderBottomRightRadius: '16px',
			color: '#fff',
			fontSize: '14px',
			cursor: 'pointer',
		}

		const css_frame = {
			textAlign: 'center',
			verticalAlign: 'middle',
			whiteSpace: 'nowrap',
		}

		let text = this.props.mini ? <Icon name='icon-search' style={{ fontSize: '14px', color: '#fff' }} /> : '搜索'

		return (
			<div style={css_frame}>
				<input style={css_input} onKeyDown={(e) => { e.keyCode == 13 && this.props.onSearch() }} onChange={(e) => { this.props.onSearchTextChange(e.target.value) }} value={this.props.searchText} />
				<span style={css_span} onClick={this.props.onSearch}>{text}</span>
			</div>
		)
	}
}