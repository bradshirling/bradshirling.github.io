const array = [];
let audioCtx = null;
let sorting = false;
let originalArray = [];

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

const SPEED_SETTINGS = {
    1: { label: 'Very Slow', ms: 2000 },
    2: { label: 'Slow', ms: 1000 },
    3: { label: 'Normal', ms: 500 },
    4: { label: 'Fast', ms: 100 },
    5: { label: 'Very Fast', ms: 20 }
};

const algorithmInfo = {
    bubbleSort: {
        name: "Bubble Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
    },
    quickSort: {
        name: "Quick Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        description: "A divide-and-conquer algorithm that picks a 'pivot' element and partitions the array around it."
    },
    heapSort: {
        name: "Heap Sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        description: "Builds a heap from the data and repeatedly extracts the maximum element."
    },
    insertionSort: {
        name: "Insertion Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: "Builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array."
    },
    selectionSort: {
        name: "Selection Sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: "Divides the input into a sorted and unsorted region, and repeatedly selects the smallest element from the unsorted region."
    }
};

let isPaused = false;
let stepMode = false;
let comparisons = 0;
let swaps = 0;
let currentStep = 0;

function getInputValues() {
    const n = parseInt(document.getElementById("numOfDigits").value);
    const speedLevel = parseInt(document.getElementById("speed").value);
    const s = SPEED_SETTINGS[speedLevel].ms;
    
    return { n, s };
}

document.addEventListener('DOMContentLoaded', () => {
    const digitsSlider = document.getElementById("numOfDigits");
    const speedSlider = document.getElementById("speed");
    const digitsValue = document.getElementById("digitsValue");
    const speedValue = document.getElementById("speedValue");
    const sortMethodSelect = document.getElementById("sortMethod");

    // Initialize algorithm info
    const initialAlgo = algorithmInfo[sortMethodSelect.value];
    document.getElementById('currentAlgorithm').textContent = initialAlgo.name;
    document.getElementById('timeComplexity').textContent = initialAlgo.timeComplexity;
    document.getElementById('spaceComplexity').textContent = initialAlgo.spaceComplexity;
    document.getElementById('algorithmDescription').textContent = initialAlgo.description;

    // Initialize sliders
    digitsValue.textContent = digitsSlider.value;
    speedValue.textContent = SPEED_SETTINGS[speedSlider.value].label;

    // Add event listeners
    digitsSlider.addEventListener('input', () => {
        digitsValue.textContent = digitsSlider.value;
    });

    speedSlider.addEventListener('input', () => {
        speedValue.textContent = SPEED_SETTINGS[speedSlider.value].label;
    });

    sortMethodSelect.addEventListener('change', (e) => {
        const algo = algorithmInfo[e.target.value];
        document.getElementById('currentAlgorithm').textContent = algo.name;
        document.getElementById('timeComplexity').textContent = algo.timeComplexity;
        document.getElementById('spaceComplexity').textContent = algo.spaceComplexity;
        document.getElementById('algorithmDescription').textContent = algo.description;
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('stepBtn').disabled = true;
});

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
});

document.getElementById('sortMethod').addEventListener('change', (e) => {
    const algo = algorithmInfo[e.target.value];
    document.getElementById('currentAlgorithm').textContent = algo.name;
    document.getElementById('timeComplexity').textContent = algo.timeComplexity;
    document.getElementById('spaceComplexity').textContent = algo.spaceComplexity;
    document.getElementById('algorithmDescription').textContent = algo.description;
});

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
    gainNode.gain.value = 0.05;
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

function init() {
    if (sorting) {
        sorting = false;
        return;
    }

    const initBtn = document.getElementById('initBtn');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    
    try {
        initBtn.classList.add('loading');
        const { n } = getInputValues();
        array.length = 0;
        
        for (let i = 0; i < n; i++) {
            array[i] = Math.random();
        }

        originalArray = [...array];
        showBars();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
        
        isPaused = false;
        stepMode = false;
        comparisons = 0;
        swaps = 0;
        currentStep = 0;
        updateStats({ type: 'reset' });
        
    } catch (error) {
        console.error('Initialization error:', error);
        alert('An error occurred during initialization');
    } finally {
        initBtn.classList.remove('loading');
    }
}

function play() {
    const playBtn = document.getElementById('playBtn');
    const initBtn = document.getElementById('initBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    
    try {
        const { s } = getInputValues();
        const sortMethod = document.getElementById("sortMethod").value;
        const sortFunction = sortAlgorithms[sortMethod];

        if (!sortFunction) {
            throw new Error('Invalid sorting algorithm selected');
        }

        playBtn.classList.add('loading');
        playBtn.disabled = true;
        initBtn.disabled = true;
        pauseBtn.disabled = false;
        stepBtn.disabled = false;
        sorting = true;

        const copy = [...array];
        let moves = sortFunction(copy);
        animate(moves, s);
    } catch (error) {
        console.error('Sorting error:', error);
        alert('An error occurred during sorting');
        sorting = false;
    }
}

function updateStats(move) {
    if (move.type === 'comp') comparisons++;
    if (move.type === 'swap') swaps++;
    currentStep++;
    
    document.getElementById('compCount').textContent = comparisons;
    document.getElementById('swapCount').textContent = swaps;
    document.getElementById('currentStep').textContent = currentStep;
}

function pause() {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

function step() {
    isPaused = true;
    stepMode = true;
    document.getElementById('pauseBtn').textContent = 'Resume';
}

function reset() {
    if (sorting) {
        sorting = false;
    }
    
    array.length = 0;
    array.push(...originalArray);
    
    isPaused = false;
    stepMode = false;
    comparisons = 0;
    swaps = 0;
    currentStep = 0;
    
    updateStats({ type: 'reset' });
    showBars();
    
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;
    document.getElementById('pauseBtn').textContent = 'Pause';
}

function animate(moves, s) {
    if (!sorting || moves.length === 0) {
        showBars();
        const playBtn = document.getElementById('playBtn');
        const initBtn = document.getElementById('initBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stepBtn = document.getElementById('stepBtn');
        
        playBtn.classList.remove('loading');
        playBtn.disabled = false;
        initBtn.disabled = false;
        pauseBtn.disabled = true;
        stepBtn.disabled = true;
        sorting = false;
        return;
    }

    if (isPaused && !stepMode) {
        setTimeout(() => animate(moves, s), 100);
        return;
    }

    stepMode = false;
    const move = moves.shift();
    updateStats(move);
    const [i, j] = move.indices;

    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    const freqI = 200 + array[i] * 500;
    const freqJ = 200 + array[j] * 500;

    if (isFinite(freqI)) playNote(freqI);
    if (isFinite(freqJ)) playNote(freqJ);
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
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            moves.push({ indices: [left, largest], type: "comp" });
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            moves.push({ indices: [right, largest], type: "comp" });
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            moves.push({ indices: [i, largest], type: "swap" });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    }

    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        heapify(array, array.length, i);
    }

    for (let i = array.length - 1; i > 0; i--) {
        moves.push({ indices: [0, i], type: "swap" });
        [array[0], array[i]] = [array[i], array[0]];
        heapify(array, i, 0);
    }

    return moves;
}

function insertionSort(array) {
    const moves = [];

    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            moves.push({ indices: [j - 1, j], type: "comp" });
            moves.push({ indices: [j - 1, j], type: "swap" });
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }

    return moves;
}

function selectionSort(array) {
    const moves = [];

    for (let i = 0; i < array.length; i++) {
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
