import { formatTime } from '../../libs/utils'
import ThreejsScene from './threejsScene';
class AudioPlayer {
    constructor(config) {
        this.audioId = config.audioId;
        this.audioConfig = {};
        this.audioCtx = null;
        this.audioAnalyser = null;
        ({
            audioId: this.audioConfig.audioId,
            width: this.audioConfig.width,
            height: this.audioConfig.height,
            effect:  this.audioConfig.effect,
        } = config);
        this.audio = document.getElementById(this.audioConfig.audioId);
        this.audio.setAttribute('style', 'display: none;');
        this.audioPlayerDom = null;
        this.isEnd = false;
        this.reqstAnmtId = 0;
        this.audioScene = null;
        this.createAudio();
        this.createAudioContent();
    }
    createAudio() {
        let parentNode = this.audio.parentNode;
        let audioControl = this.createAudioControl();
        let tpl = `<div class="audio-player" id="audioPlayer-${this.audioConfig.audioId}">
                <div class="audio-content" style="width: ${this.audioConfig.width}px; height: ${this.audioConfig.height}px;"></div>
                ${audioControl}
            </div>`;
        let dom = (new DOMParser()).parseFromString(tpl, 'text/html').querySelector('.audio-player');
        this.audioPlayerDom = dom;
        parentNode.insertBefore(dom, this.audio);
        this.audioPlayerDom.insertBefore(this.audio, this.audioPlayerDom.querySelector('.audio-content'));
        this.initEvent();
        let sceneDom = this.audioPlayerDom.querySelector('.audio-content');
        this.audioScene = new ThreejsScene({
            sceneDom: sceneDom,
            effect: this.audioConfig.effect
        })
    }
    createAudioControl() {
        let tpl = ` 
            <div class="audio-control">
                <div class="audio-control_btn j_audio_play"></div>
                <div class="audio-control_progress">
                    <input class="audio-control_progress-input" type="range" value="0" max="100" mmin="0" step="0.1"/>
                </div>
                <div class="audio-control_time">
                    <span class="audio-control_time-current j_audioPlayer_current">00:00</span>
                    <span>/</span>
                    <span class="audio-control_time-all j_audioPlayer_duration">00:00</span>
                </div>
            </div>`;
        return tpl;
    }
    createAudioContent() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        // AnalyserNode 用于获取音频的频率数据（ FrequencyData ）和时域数据（ TimeDomainData ）。从而实现音频的可视化。
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        // 通过<audio>节点创建音频源
        const source = ctx.createMediaElementSource(this.audio);
        // 将音频源关联到分析器
        source.connect(analyser);
        // 将分析器关联到输出设备（耳机、扬声器）
        analyser.connect(ctx.destination);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        this.audioAnalyser = analyser;
        this.audioCtx = ctx;
    }
    renderProgress() {
        let currentTime = parseInt(this.audio.currentTime);
        let duration = parseInt(this.audio.duration);
        let percentage = ((currentTime / duration) * 100).toFixed(1);
        let progressInput = this.audioPlayerDom.querySelector('.audio-control_progress input');
        let currentTimeDom = this.audioPlayerDom.querySelector('.j_audioPlayer_current');
        let bufferLength = this.audioAnalyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        if (currentTime < duration) {
            currentTimeDom.innerHTML = formatTime(currentTime);
            progressInput.setAttribute('value', percentage);
            this.audioAnalyser.getByteFrequencyData(dataArray);
            this.audioScene.renderScene(dataArray);
            this.reqstAnmtId = requestAnimationFrame(() => {
                this.renderProgress();
            });
        } else {
            cancelAnimationFrame(this.reqstAnmtId);
        }
    }
    changeProgress() {

    }
    initData() {
        this.audio.addEventListener("durationchange", function () {
            // 可以显示播放时长了哟
            this.audioPlayerDom.querySelector('.j_audioPlayer_duration').innerHTML = this.audio.duration;
        });
    }
    initEvent() {
        let playBtn = this.audioPlayerDom.querySelector('.audio-control_btn');
        document.body.addEventListener("click", (event) => {
            const ev = event || window.event;
            const target = ev.target || ev.srcElement;
            if (target.classList.contains('j_audio_play')) {
                if (playBtn.classList.contains('play')) {
                    this.audio.pause();
                    cancelAnimationFrame(this.reqstAnmtId);
                } else {
                   /*  this.audio.play(); */
                    this.audioCtx.resume().then(() => {
                        this.audioPlayerDom.querySelector('.j_audioPlayer_duration').innerHTML = formatTime(parseInt(this.audio.duration));
                        this.audio.play();
                        this.renderProgress();
                    })
                }
                playBtn.classList.toggle('play');
            }
            if (target.classList.contains('audio-control_progress-input')) {

            }
            
        });
        document.body.addEventListener("change", (event) => {
            const ev = event || window.event;
            const target = ev.target || ev.srcElement;
            if (target.classList.contains('audio-control_progress-input')) {
                alert('channge');
            }
            
        });
    }
}
export default AudioPlayer