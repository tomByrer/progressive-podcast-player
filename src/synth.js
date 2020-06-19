/* synth.js */
const $inputForm = document.querySelector('form')

const $Aselect = document.getElementById('Aselect')
const $Apitch = document.getElementById('Apitch')
const $ApitchValue = document.getElementById('ApitchValue')
const $Arate = document.getElementById('Arate')
const $ArateValue = document.getElementById('ArateValue')
const $Aplay = document.getElementById('Aplay')

const $Surma = document.getElementById('Surma')
 // workaround since have to re-assign $Bselect after cloning from $Aselect
let $Bselect = document.getElementById('Bselect')
const $Bpitch = document.getElementById('Bpitch')
const $BpitchValue = document.getElementById('BpitchValue')
const $Brate = document.getElementById('Brate')
const $BrateValue = document.getElementById('BrateValue')
const $Bplay = document.getElementById('Bplay')

const $Narrator = document.getElementById('Narrator')
 // workaround since have to re-assign $Bselect after cloning from $Aselect
let $Nselect = document.getElementById('Nselect')
const $Npitch = document.getElementById('Npitch')
const $NpitchValue = document.getElementById('NpitchValue')
const $Nrate = document.getElementById('Nrate')
const $NrateValue = document.getElementById('NrateValue')
const $Nplay = document.getElementById('Nplay')

let arrTemp = []

/*
 * fill voice info for both UX & db
 */
let osVoices = []
let allVoices = []
let voxDefault = 0
let voicePackNarrator = []
let matchedVoicePack = []  //TODO: see if global VP values are needed for state, or just use GUI as state storage
function ApopulateVoiceList(){
  osVoices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  })
	let words = ''
	let tVox = []
	let AvoxSelect = 0
	let idxFound = 0
	let optionNames = []

  for(i = 0; i < osVoices.length ; i++ ){
		if ( osVoices[i].localService ){
			// populate array for later use
			let tempVoice = {} 
			words = osVoices[i].name.split(' ')
			tempVoice.default = osVoices[i].default
			tempVoice.lang = osVoices[i].lang
			tempVoice.localService = osVoices[i].localService
			tempVoice.name = osVoices[i].name
			tempVoice.voiceURI = osVoices[i].voiceURI
			allVoices[i] = tempVoice

			logit('🏗️ add osVoice '+i)
			let option = document.createElement('option')
			option.textContent = words[1] +' '+ words[0] +' '+ tempVoice.lang
			if(tempVoice.default) {
				option.textContent += ' -- DEFAULT'
				voxDefault = i
			}
			option.setAttribute('data-voxid', i)
			$Aselect.appendChild(option)
			
			optionNames.push(words[1])
		}
  }
	
	// cloning Aselect seems to be the only way to get other Selects filled
	let Bclone = $Aselect.cloneNode(true)
	Bclone.id = 'Bselect'
	$Surma.insertBefore( Bclone, $Surma.getElementsByTagName("br")[0] )
	$Bselect = document.getElementById('Bselect')
	let Nclone = $Aselect.cloneNode(true)
	Nclone.id = 'Nselect'
	$Narrator.insertBefore( Nclone, $Narrator.getElementsByTagName("br")[0] )
	$Nselect = document.getElementById('Nselect')

	// use presets to set GUI
	logit('optionNames: '+ optionNames)
	let $curVP // node of VoicePack's fieldset
	let speakerVoices = []
	let tName = ''
	let tPitch = 1 // default
	let tRate = 1
	let speakerVoice = []
	let keyVP = ''
	for ( let h=0; h<3; h++ ){ // h = VoicePack counter
		keyVP = Object.keys(voicePacks)[h]
		// logit(keyVP)
		speakerVoices = voicePacks[keyVP].split(', ')
		speakerPreferenceLoop:
		for ( let i=0; i<speakerVoices.length; i++ ){
			speakerVoice = speakerVoices[i].split(' ')
			tName = speakerVoice[0]
			// logit('Jake:'+ tName)
			for ( let j=0; j<optionNames.length; j++ ){
				// logit(keyVP +':'+ tName +' opt:'+ optionNames[j])
				if ( tName === optionNames[j] ){
					matchedVoicePack[h] = {}
					$curVP = document.getElementById(keyVP)
					matchedVoicePack[h].name = tName
					matchedVoicePack[h].option = j
					$curVP.getElementsByTagName("select")[0].selectedIndex = j
					tPitch = speakerVoice[1]
					matchedVoicePack[h].pitch = tPitch
					$curVP.getElementsByClassName("pitch-value")[0].innerText = tPitch
					$curVP.getElementsByClassName("pitch-range")[0].value = tPitch
					tRate = speakerVoice[2]
					matchedVoicePack[h].rate = tRate
					$curVP.getElementsByClassName("rate-value")[0].innerText = tRate
					$curVP.getElementsByClassName("rate-range")[0].value = tRate
					break speakerPreferenceLoop
				}
			}
		}
		logit(keyVP +'='+ matchedVoicePack[h].name +'🍉'+ matchedVoicePack[h].option)
	}

	logit('avox:'+ AvoxSelect)
	logit('voicepacks loaded 🏢')
}
// populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
	logit('pop voice list')
	synth.onvoiceschanged = ApopulateVoiceList
}

$Nplay.onclick = function(){ speakTest( 0 ) }
$Npitch.onchange = function(){ $NpitchValue.textContent = $Npitch.value }
$Nrate.onchange = function(){ $NrateValue.textContent = $Nrate.value }
$Aplay.onclick = function(){ speakTest( 1 ) }
$Apitch.onchange = function(){ $ApitchValue.textContent = $Apitch.value }
$Arate.onchange = function(){ $ArateValue.textContent = $Arate.value }
$Bplay.onclick = function(){ speakTest( 2 ) }
$Bpitch.onchange = function(){ $BpitchValue.textContent = $Bpitch.value }
$Brate.onchange = function(){ $BrateValue.textContent = $Brate.value }

function speakTest( vox ){
	event.preventDefault()
	// if ($inputTxt.value === '') { $inputTxt.value = 'test synthesiser' }
	speakLine({
		text: document.getElementsByClassName('txt')[vox].value,
		vox: vox,
	})
  // $inputTxt.blur()
}

function modeSynth(){
	// $mediaWrapper.classList.remove('active')
	// $synthWrapper.classList.add('active')  TODO: synth highlight
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
	$toggleLR.classList.add("show")
	$toggleLR.classList.remove("hide")
	$pauseAll.classList.add("show")
	$pauseAll.classList.remove("hide")
}


async function queueArray( arr ){
	for ( i = 0; ( (i < arr.length) && !isPlayToStop) ; i++ ){
		if (arr[i].actID !== curID) break
		curCue = arr[i].mseconds
		$curCue = document.getElementById( curCue )
		arr[i].text = $curCue.textContent
		arr[i].vox = 1 * $curCue.classList[0].charAt(1) // assumes voice number is 1st classs
		logit( `prep:`+ curCue +` actID:`+ arr[i].actID +` # `+ i +` voice:`+ arr[i].vox +`
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
	let voxid = 0
	let sayThis = new SpeechSynthesisUtterance(text)
	if ( vox === 1 ){
		voxid = $Aselect.options[$Aselect.selectedIndex].getAttribute('data-voxid')
		sayThis.pitch = $Apitch.value
		sayThis.rate = $Arate.value
		sayThis.voice = osVoices[voxid]
	} else if ( vox === 2 ){
		voxid = $Bselect.options[$Bselect.selectedIndex].getAttribute('data-voxid')
		sayThis.pitch = $Bpitch.value
		sayThis.rate = $Brate.value
		sayThis.voice = osVoices[voxid]
	} else { // Narrator
		voxid = $Bselect.options[$Nselect.selectedIndex].getAttribute('data-voxid')
		sayThis.pitch = $Npitch.value
		sayThis.rate = $Nrate.value
		sayThis.voice = osVoices[voxid]
	}
	logit('speakLine sel:'+ $Aselect.selectedIndex +' mapped:'+ voxid +' vox:'+ vox )
	synth.speak(sayThis)

	return new Promise( resolve =>{
		logit(`resolve returned curCue:`+ curCue)
		sayThis.onend = resolve
	})
}
