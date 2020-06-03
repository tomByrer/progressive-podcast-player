/* ui.js */

function clickBandTag(node, status){
	// assumes only 1 checkbox per parent group
	// const $cbModeMedia = id.getElementsByTagName('input')[0];
	logit(`set `+ $cbModeMedia.id +` to `+ status +` cb=`+ $cbModeMedia.checked)
	if ( $cbModeMedia.checked !== status ){
		$cbModeMedia.checked = status
		toggleTag( node )
	}
}
function toggleTag( $node ){
	isChecked =  $node.getElementsByTagName('input')[0].checked
	logit(`checkbox `+ $cbModeMedia.id +` to `+ isChecked)
	logit(`toggle.id `+ $node.id +` classList `+ $node.classList)
	$node.classList.toggle('toggle-on', isChecked)
	$node.classList.toggle('toggle-off', !isChecked)
	// $node.classList.remove( 'toggle-o'+ (isChecked ? 'ff' : 'n') )
	// $node.classList.add( 'toggle-o'+ (isChecked ? 'n' : 'ff') )
}
