import fs from "fs";
const readJSON = (a, b = "utf8") =>
	JSON.parse(fs.readFileSync(a, { encoding: b }))


const { info, voices, tt } = readJSON('src/vfAHa5GBLio.ytttjs.json')

let ttHTM = `<article id="transcript"><ol id="timedtext">` // ~transcriptDiv
let playlistTimes = []

	//append all the subtitle texts to

for(let i=0, len = tt.length; i < len; i++) {
	ttHTM += `<li class="v`+ tt[i].v +`" id=`+ tt[i].s +` onclick="j(`+ tt[i].s +`)">`+ tt[i].t +`</li>`
	playlistTimes.push(tt[i].s)
}
ttHTM += `</ol></article>`

let outHTM = fs.readFileSync('src/head.htm', "utf8")
let synthHTM = fs.readFileSync('src/synth.htm', "utf8")

// actions act likea a 'File Access Table' for the speech line items
const actions = `let actions = {hear:[`+ playlistTimes +`]}
`
// const actions = ``//temp
const voicePacks = fs.readFileSync('src/voicePacks.js', "utf8")
let js = fs.readFileSync('src/common.js', "utf8")
    js+= fs.readFileSync('src/ui.js', "utf8")
    js+= fs.readFileSync('src/media.js', "utf8")
    js+= fs.readFileSync('src/synth.js', "utf8")
const foot = fs.readFileSync('src/foot.htm', "utf8")

outHTM += ttHTM + synthHTM +'<script>'+ voicePacks + actions + js + foot

// console.log(info)

let outHTMFile = 'index.html'
try {
  fs.writeFileSync(outHTMFile, outHTM, { mode: 0o755 });
  console.log('Wrote to: '+ outHTMFile)
} catch(err) {
  console.error(err);
}
