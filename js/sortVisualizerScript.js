const array=[];

let audioCtx=null;

let sorting = false;

function getInputValues(){
    const n =parseInt(document.getElementById("numOfDigits").value);
    const s =parseInt(document.getElementById("speed").value);

    if (isNaN(n) || isNaN(s)) {
        alert("Please enter valid values");
        return {n:0,s:0};
    }else if(n<2 || n>100){
        alert("Please enter a number of digits between 2 and 100");
        return {n:0,s:0};
    }else if(s<20 || s>2000){
        alert("Please enter a speed between 20 and 2000");
        return {n:0,s:0};
    }

    return {n,s};
}

function playNote(freq){
    if (audioCtx==null){
        audioCtx=new(
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    if (sorting) {
        sorting = false;
    }
    document.querySelector('button[onclick="play()"]').disabled = false;
    const { n } = getInputValues();
    array.length = 0;
    container.innerHTML = "";
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
}

function play() {
    let { s } = getInputValues();
    if (!s || s == 0) {
        s = 50;
    }

    const sortMethod = document.getElementById("sortMethod").value;
    document.querySelector('button[onclick="play()"]').disabled = true;
    sorting = true;

    const copy = [...array];
    let moves;
    
    if (sortMethod === "bubbleSort") {
        moves = bubbleSort(copy);
    } else if (sortMethod === "mergeSort") {
        moves = mergeSort(copy);
    }

    document.getElementById("form").reset();
    animate(moves, s);
}

function animate(moves, s){
    if (!sorting) return;
    if(moves.length==0){
        showBars();
        document.querySelector('button[onclick="play()"]').disabled = false;
        sorting = false;
        return;
    }
    const move=moves.shift();
    const [i,j]=move.indices;

    if(move.type=="swap"){
        [array[i],array[j]]=[array[j],array[i]];
    }

    playNote(200+array[i]*500);
    playNote(200+array[j]*500);

    showBars(move);
    setTimeout(function(){
        animate(moves,s);
    },s);
}

function bubbleSort(array){
    const moves=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            moves.push({indices:[i-1,i],type:"comp"});
            if(array[i-1]>array[i]){
                swapped=true;
                moves.push({indices:[i-1,i],type:"swap"});
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return moves;
}

function showBars(move){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");

        if(move && move.indices.includes(i)){
            bar.style.backgroundColor=
            move.type=="swap"?"red":"blue";
        }
        container.appendChild(bar);
    }
}
