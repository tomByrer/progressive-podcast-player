/* synth.js */
const $synthWrapper = document.getElementById("synthWrapper")
const $inputForm = document.querySelector('form');
const $inputTxt = document.querySelector('.txt');
const $voiceSelect = document.querySelector('select');
const $pitch = document.getElementById('pitch');
const $pitchValue = document.querySelector('.pitch-value');
const $rate = document.getElementById('rate')
const $rateValue = document.querySelector('.rate-value')
let arrTemp = []

/*
 * fill voice info for both UX & db
 */
let osVoices = []
let allVoices = []
function populateVoiceList(){
  osVoices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = $voiceSelect.selectedIndex < 0 ? 0 : $voiceSelect.selectedIndex
  $voiceSelect.innerHTML = ''
  for(i = 0; i < osVoices.length ; i++) {
		// populate array for later use
    let tempVoice = {}
    tempVoice.default = osVoices[i].default
    tempVoice.lang = osVoices[i].lang
    tempVoice.localService = osVoices[i].localService
    tempVoice.name = osVoices[i].name
    tempVoice.voiceURI = osVoices[i].voiceURI
    allVoices[i] = tempVoice

    let option = document.createElement('option')
    option.textContent = tempVoice.name + ' (' + tempVoice.lang + ')';
    
    if(tempVoice.default) {
      option.textContent += ' -- DEFAULT'
    }

    option.setAttribute('data-lang', tempVoice.lang)
    option.setAttribute('data-name', tempVoice.name)
    $voiceSelect.appendChild(option);
  }
	$voiceSelect.selectedIndex = selectedIndex
}
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
logit(`allVoices = 
`+ allVoices)
$inputForm.onsubmit = function(event){
	event.preventDefault()
	if ($inputTxt.value !== '') {
		speakLine({ text:$inputTxt.value })
	}
  $inputTxt.blur()
}
$pitch.onchange = function(){ $pitchValue.textContent = $pitch.value }
$rate.onchange = function(){ $rateValue.textContent = $rate.value }
$voiceSelect.onchange = function(){ speakLine() }

function modeSynth(){
	$mediaWrapper.classList.remove('active')
	$synthWrapper.classList.add('active')
	logit('flip to synth')
}

function playSpeachDemo( arg='' ){
	isPlayToStop = false
	let idxStart = 0
	if (arg==='random') { idxStart = getRandomInt(0, hearLength-5) }
	logit(`🏃🏼 playSpeachDemo@`+ idxStart +` arg=`+  arg)
	$cueList.children[ idxStart ].click()
	const timeoutID = window.setTimeout( showMediaGUI, getRandomInt(22, 77) )
	// const timeoutID = window.setTimeout( showMediaGUI, getRandomInt(2222, 5555) )
}
function showMediaGUI(){
	$mediaWrapper.classList.remove('cover')
	$mediaPlayer.classList.add("show")
	$mediaPlayer.classList.remove('hide')
	$toggleMode.classList.add("show")
	$toggleMode.classList.remove("hide")
	$pauseAll.classList.add("show")
	$pauseAll.classList.remove("hide")
}


async function queueArray( arr ){
	for ( i = 0; ( (i < arr.length) && !isPlayToStop) ; i++ ){
		if (arr[i].actID !== curID) break
		curCue = arr[i].mseconds
		$curCue = document.getElementById( curCue )
		arr[i].text = $curCue.textContent
		arr[i].vox = $curCue.classList[0].charAt(1) // assumes voice number is 1st classs
		logit( `prep:`+ curCue +` actID:`+ arr[i].actID +` # `+ i +` voice:`+ arr[i].voice +`
		`+ arr[i].text )  
		// highlight
		$curCue.classList.add('spoke', 'speaking')
		const $futureCue = $curCue
		// location.href = "#" work around old Webkit bug
		// location.href = `#`+ $curCue.previousSibling.id
		//fIX scrollIntoView Firfox compat, might need previousSibling
		$curCue.scrollIntoViewIfNeeded({behavior: "auto", block: "start", inline: "nearest"})
		await speakLine(arr[i])
		logit( `line `+ i +` done ✔️` )
		$futureCue.classList.remove('speaking')
		if ( $cbModeMedia.checked ){
			// play next cue line in media
			const t = actions.hear.indexOf( curCue )
			$mediaPlayer.currentTime = actions.hear[t+1] * 0.001
			// playMedia() automatic
			break
		}
	}
}

async function clearThenCB(arrLines, cb){
	logit(`clear then speek`)
	synth.cancel()
	isPlayToStop = false
	// timer needed to ensure SECOND line is spoken
	if (sayTimeout !== null) clearTimeout(sayTimeout)
	sayTimeout = setTimeout(function(){
		cb(arrLines)
		logit(`sayTimeout ⏱️`)
	}, 444 ) // long timeout needed to prevent lines skipped on many jumps
	
}

async function clearSpeech({
	all=false,
}={}){
	logit(`🆑 clearing, stop all = `+  all)
	if (all===true) isPlayToStop = true
	// cancel the current utterance
	if (synth.speaking) {
		logit(`synth.speaking, now to cancel 🛑`)
		synth.cancel()
	}
}

/**
 * Use speach synth for 1 segement
 * @param {Object} obj
 * @param {string} obj.text - words to be spoken
 * @param {number} obj.fPitch - float 0-2
 * @param {number} obj.fRate - float 0-2
 */
async function speakLine({
	text = '',
	vox = 0,
}={}){
	let sayThis = new SpeechSynthesisUtterance(text)
	sayThis.pitch = voicePacks[vox].pitch
	sayThis.rate = voicePacks[vox].rate
	sayThis.voice = osVoices[vox]
	synth.speak(sayThis)

	return new Promise( resolve =>{
		logit(`resolve returned curCue:`+ curCue)
		sayThis.onend = resolve
	})
}
