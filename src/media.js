/* media.js */
// NOTE times are always in ms, though $mediaPlayer.currentTime is in decimal seconds
let closest = 0
let closestOld = 0
let idxPrevious = 0
let curTime = 0
function findNearUnder( arr=actions.hear, val=curTime ){
	return Math.max.apply(null, arr.filter(
		function( v ){
			return v <= val}
	))
}
$mediaPlayer.ontimeupdate = function(){
	// $curCapton.classList.remove('spoke')
	curTime = $mediaPlayer.currentTime * 1000
	logit( `play time~`+ curTime )
	closest = findNearUnder()
	if ( closest !== closestOld ){	
		logit( `closest under~`+closest )
		if ( !$cbModeMedia.checked ) {
			$mediaPlayer.pause()
			j( closest )
			return
		} else {
			// don't highlight until playing
			if ( mediaStatus==='playing' ) highlightLine( closest )
			closestOld = closest
			if ( mediaStatus==='paused'){
				highlightLine(closest)
				logit( `▶ unpause` )
				playMedia(closest)
			}
		}
	}
}

function modeAudio(){
	$mediaWrapper.classList.add('active')
	// $synthWrapper.classList.remove('active')
	logit('fliped to audio')
}

$mediaPlayer.addEventListener('play', (event) => {
  // logit(`|> play event`)
	if ( !$cbModeMedia.checked ){
		$mediaPlayer.pause()
		logit(`|| stay paused`)
	}
})

$mediaPlayer.addEventListener('pause', function(){
	logit( `⏸️pause time~`+ getMediaTime() +`ms` )
	mediaStatus = 'paused'
	
	if ( !$cbModeMedia.checked ){
		logit(`|| stay paused media, play synth`)
		j( findNearUnder() )
	}
})

$mediaPlayer.onplaying = function(){
	logit( `▶️playing time~`+ getMediaTime() +`ms` )
	mediaStatus = 'playing'
}

function getMediaTime(){
	return $mediaPlayer.currentTime*1000 //ms
}