import { useEffect, useState } from 'react'
import './App.css'

interface IVoice {
    text: string,
    lang: string,
    default: boolean,
    voice: SpeechSynthesisVoice
}

function App() {
    const [voices, setVoices] = useState<Array<IVoice>>([]);
    const [voice, setVoice] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [pitch, setPitch] = useState<number>(1);
    const [rate, setRate] = useState<number>(1);

    useEffect(() => {
        const synth = window.speechSynthesis;
        function populateVoiceList(){
            const v = synth.getVoices()
            let tmpvoices = [];
            for (let i = 0; i < v.length; i++) {
                tmpvoices.push({
                    text: `${v[i].name} (${v[i].lang}) ${v[i].default ? " — DEFAULT" : ""}`,
                    lang: v[i].lang,
                    default: v[i].default,
                    voice:v[i]
                })
            }
            setVoices(tmpvoices);
        }
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }, [])


    function speech(){
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(text);
        const v = voices.find(e=>e.text == voice)?.voice;
        if(v){
            utterThis.voice = v;
        }
        utterThis.pitch = pitch;
        utterThis.rate = rate;
        synth.speak(utterThis);
    }


    return (
        <div className="App">
            <div>
                <div>
                    <h3>Texto</h3>
                    <textarea value={text} onChange={evt=>setText(evt.target.value)}></textarea>
                </div>
                <div>
                    <h3>Seleccione idioma</h3>
                    <select value={voice} onChange={evt=>setVoice(evt.target.value)} defaultValue={voices.find(e=>e.default)?.text}>
                        {voices.map(e => {
                            return (<option key={e.text} value={e.text} >{e.text}</option>)
                        })}
                    </select>
                </div>
                <div>
                    <h3>Pitch</h3>
                    <input value={pitch} onChange={evt=>setPitch(Number(evt.target.value) || 1)} type="range" min={0.4} max={3} step={0.1} /><span>{pitch}</span>
                </div>
                <div>
                    <h3>Rate</h3>
                    <input value={rate} onChange={evt=>setRate(Number(evt.target.value) || 1)} type="range" min={0.4} max={3} step={0.1} /><span>{rate}</span>
                </div>
                <button onClick={speech}>Hablar</button>
            </div>
        </div>
    )
}

export default App
