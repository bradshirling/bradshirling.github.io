const array = [];
let audioCtx = null;
let sorting = false;

const sortAlgorithms = {
    bubbleSort,
    quickSort,
    heapSort,
    insertionSort,
    selectionSort,
    //radixSort,
    //mergeSort,
    // Add more algorithms here as needed
};

function getInputValues() {
    const n = parseInt(document.getElementById("numOfDigits").value);
    const s = parseInt(document.getElementById("speed").value);

    if (n < 2 || n > 100 || s < 20 || s > 2000) {
        alert("Please enter valid inputs for digits (2-100) and speed (20-2000).");
        return { n: 0, s: 0 };
    }
    
    return { n, s };
}

const playNote = (freq) => {
    if (!audioCtx) {
        audioCtx = new (AudioContext || webkitAudioContext)();
    }

    const duration = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + duration);

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

function init() {
    if (sorting) sorting = false;

    document.querySelector('button[onclick="play()"]').disabled = false;
    const { n } = getInputValues();
    if (n === 0) return;  // Don't proceed if input is invalid

    array.length = 0;
    container.innerHTML = "";

    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }

    showBars();
}

function play() {
    let { s } = getInputValues();
    if (s === 0) return;  // Invalid input, stop the function

    const sortMethod = document.getElementById("sortMethod").value;
    const sortFunction = sortAlgorithms[sortMethod];

    if (!sortFunction) {
        alert("Invalid sorting algorithm selected");
        return;
    }

    document.querySelector('button[onclick="play()"]').disabled = true;
    sorting = true;

    const copy = [...array];
    let moves = sortFunction(copy);

    document.getElementById("form").reset();
    animate(moves, s);
}

function animate(moves, s) {
    if (!sorting || moves.length === 0) {
        showBars();
        document.querySelector('button[onclick="play()"]').disabled = false;
        sorting = false;
        return;
    }

    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);
    showBars(move);

    setTimeout(() => animate(moves, s), s);
}

function bubbleSort(array) {
    const moves = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);

    return moves;
}

function quickSort(array) {
    const moves = [];

    function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            moves.push({ indices: [j, high], type: "comp" });
            if (arr[j] < pivot) {
                i++;
                moves.push({ indices: [i, j], type: "swap" });
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        moves.push({ indices: [i + 1, high], type: "swap" });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        return i + 1;
    }

    function quickSortRecursive(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    }

    quickSortRecursive(array, 0, array.length - 1);
    return moves;
}

function heapSort(array) {
    const moves = [];

    function heapify(arr, n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            moves.push({ indices: [left, largest], type: "comp" });
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            moves.push({ indices: [right, largest], type: "comp" });
            largest = right;
        }

        if (largest !== i) {
            moves.push({ indices: [i, largest], type: "swap" });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    }

    function buildMaxHeap(arr) {
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
    }

    const n = array.length;
    buildMaxHeap(array);

    for (let i = n - 1; i > 0; i--) {
        moves.push({ indices: [0, i], type: "swap" });
        [array[0], array[i]] = [array[i], array[0]];

        heapify(array, i, 0);
    }

    return moves;
}

function insertionSort(array) {
    const moves = [];

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        moves.push({ indices: [i, j], type: "comp" });

        while (j >= 0 && array[j] > key) {
            moves.push({ indices: [j, j + 1], type: "swap" });
            array[j + 1] = array[j];
            j--;
        }

        array[j + 1] = key;
    }

    return moves;
}

function selectionSort(array) {
    const moves = [];

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [j, minIndex], type: "comp" });

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }

    return moves;
}

function showBars(move) {
    container.innerHTML = "";

    array.forEach((value, i) => {
        const bar = document.createElement("div");
        bar.style.height = value * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
        }

        container.appendChild(bar);
    });
}
