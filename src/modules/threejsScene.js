import { formatTime } from '../../libs/utils'
class ThreejsScene {
    constructor(config) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.allGeo = [];
        this.canvasCtx = null;
        ({sceneDom: this.sceneDom, effect: this.effect} = config);
        this.init();
        
    }
    create2dSence(){
        let playContainerWidth = this.sceneDom.getAttribute('data-width') || this.sceneDom.offsetWidth;
        let playContainerHeight = this.sceneDom.getAttribute('data-height') || this.sceneDom.offsetHeight;
        let canvas = document.createElement('canvas');
        this.canvasCtx = canvas.getContext("2d");
        canvas.width = playContainerWidth;
        canvas.height = playContainerHeight;
        canvas.style.backgroundColor = '#FF0000';
        this.sceneDom.appendChild(canvas);
    }
    create3dSence() {
        let playContainerWidth = this.sceneDom.getAttribute('data-width') || this.sceneDom.offsetWidth;
        let playContainerHeight = this.sceneDom.getAttribute('data-height') || this.sceneDom.offsetHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, playContainerWidth / playContainerHeight, 0.1, 3000);
        let axes = new THREE.AxisHelper(playContainerHeight);
        this.renderer = new THREE.WebGLRenderer();
        this.camera.position.set(-10, 1000, 400);
        this.camera.lookAt(this.scene.position);
        this.renderer.setSize(playContainerWidth, playContainerHeight);
        this.renderer.setClearColor(new THREE.Color(0x99CCCC));

        this.sceneDom.appendChild(this.renderer.domElement);
        this.scene.add(axes);
        this.renderer.render(this.scene, this.camera);

        let planeGeometry = new THREE.PlaneGeometry(playContainerWidth, playContainerHeight);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -45;
        this.scene.add(plane);
        this.createBarList(this.scene);
        this.renderer.render(this.scene, this.camera);
    }
    createBarList(scene) {
        for (let i = -16; i < 16; i++) {
            let boxGeometry = new THREE.BoxGeometry(10, 10, 10);
            let boxMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });
            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.name = "bar";
            box.position.set(i * 30, 0, 0);
            this.allGeo.push(box);
            scene.add(box);
        }

    }
    renderScene(dataArray) {
        let effect = this.effect;
        switch(effect){
            case '2d':
                this.render2d(dataArray);
                break;
            case '3d':
                this.render3d(dataArray);
                break;
        }
       
    }
    render2d(audioArray) {
        let cWidth = this.sceneDom.getAttribute('data-width') || this.sceneDom.offsetWidth;
        let cHeight = this.sceneDom.getAttribute('data-height') || this.sceneDom.offsetHeight;
        this.canvasCtx.clearRect(0,0,cWidth,cHeight);
        for(let i = 0;i < audioArray.length;i ++){
            this.canvasCtx.fillRect(i*15,cHeight-audioArray[i],10,cHeight);
        }
    }
    render3d (dataArray){
        for (let i = 0; i < this.allGeo.length; i++) {
            this.allGeo[i].scale.y = dataArray[i];
        }
        this.renderer.render(this.scene, this.camera);
    }
    /* animate() {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);
        console.log('dataArray', dataArray);
        for (let i = 0; i < allGeo.length; i++) {
            allGeo[i].scale.y = dataArray[i];
        }
        renderer.render(scene, camera);
    } */
   init() {
       let effect = this.effect;
        switch(effect){
            case '2d':
                this.create2dSence();
                break;
            case '3d':
                this.create3dSence();
                break;
        }
   }
}
export default ThreejsScene