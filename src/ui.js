// @2020 Tom Byrer, release MIT License

// assumes default state is unchecked
function clickBandTag($node, status){
	// should be only 1 input: checkbox that drives toggle
	const $cbToggle = $node.getElementsByTagName('input')[0]
	logit(`set `+ $cbToggle.id +` to `+ status +` cb=`+ $cbToggle.checked)
	if ( $cbToggle.checked !== status ){
		$cbToggle.checked = status
		postSwitch( $node )
	}
}
function postSwitch( $node ){
	const $cbToggle = $node.getElementsByTagName('input')[0]
	$cbToggle.focus()
	const isChecked =  $cbToggle.checked
	logit(`toggle.id `+ $node.id +` classList `+ $node.classList)
	$node.classList.toggle( 'toggle-on', isChecked )
	$node.classList.toggle( 'toggle-off', !isChecked )
}
