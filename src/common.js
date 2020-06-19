let synth = window.speechSynthesis
const $mediaWrapper = document.getElementById("mediaWrapper")
const $mediaPlayer = document.getElementById("mediaPlayer")
const $cbModeMedia = document.getElementById("cbSwitch")
const $pauseAll = document.getElementById("pauseAll")
const $toggleLR = document.getElementById("toggleLR")
const $cueList = document.getElementById("timedtext")
let $curCue = $cueList.firstChild
let $curCapton = $cueList.firstChild
const $log = document.getElementById('log')

let isFirstPlay = true
$cbModeMedia.checked = false  // false = use synth
let isPlayToStop = false
let curCue = 0 //int
let curID = 0
let sayTimeout = null
// actions is obj added by build script
let hearLength = actions.hear.length
let mediaStatus = 'paused' // consider 'opened' later?

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
// switchAudio()  why is this here?  typo?
async function highlightLine( closest=findNearUnder() ) {
	$curCapton.classList.remove('speaking')
	$curCapton = document.getElementById( closest )
	$curCapton.classList.add('spoke', 'speaking')
	$curCapton.scrollIntoViewIfNeeded({behavior: "auto", block: "start", inline: "nearest"})
}
async function playMedia( closest=curCue*0.001 ) {
	logit(`startPlay `+ $mediaPlayer.currentTime)
  try {
    await $mediaPlayer.play()
    // playButton.classList.add("playing");
  } catch(err) {
    // playButton.classList.remove("playing");
  }
}

function logit( t ){
	console.log(t)
	$log.value += `\n`+ t
	$log.scrollTop = $log.scrollHeight
}
function copyLog(){
  /* Select the text field */
  $log.select()
  $log.setSelectionRange(0, 99999) /*For mobile devices*/
  document.execCommand("copy")
  alert("Copied the text: " + $log.value);
}

function switchAudio(){
	if ( $cbModeMedia.checked ){
		modeSynth()
		$curCapton.classList.remove('speaking')
	} else {
		modeAudio()
	}
	// !$cbModeMedia.checked = $cbModeMedia.checked
	isFirstPlay = false
}

/**
 * start to process TimedText click
 * @param mseconds element id marker, happens to be time
 */
async function j( mseconds ){
	if (isFirstPlay){
		logit(`first play on Jump`)
		switchAudio()
		showMediaGUI()
	}
	if (!$cbModeMedia.checked){
		isPlayToStop = false
		let arrLines = []
		curID = Date.now()
		let i = actions.hear.indexOf(mseconds)
		logit(`clicked sec=`+ mseconds +` idx=`+ i)

		const len = i + 3
		for( i; (i<=len); i++ ){
			arrLines.push({
				actID: curID,
				mseconds: actions.hear[i],
			})
			logit(`cued sec=`+ mseconds +` idx=`+ i)
		}

		if (synth.speaking) {
			await clearThenCB(arrLines, queueArray)
		} else {
			await queueArray(arrLines)
		}
	} else {
		$mediaPlayer.currentTime = mseconds * 0.001
		// $mediaPlayer.play() automatic
	}
}

function pauseAll(){
	// if (!$cbModeMedia.checked){
		clearSpeech({ all:true })
	// } else {
		$mediaPlayer.pause()
	// }
}
