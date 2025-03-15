
// Add this at the beginning of the script section
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

/* ------------------------------
   Tab Switching Logic
------------------------------ */
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

/* ------------------------------
   STACK Implementation
------------------------------ */
const stackContainer = document.getElementById('stack-container');
const pushStackBtn = document.getElementById('pushStackBtn');
const popStackBtn = document.getElementById('popStackBtn');
const stack = [];

function updateStackVisual() {
  stackContainer.innerHTML = '';
  stack.forEach((plateValue) => {
    const plate = document.createElement('div');
    plate.classList.add('plate');
    plate.textContent = plateValue;
    stackContainer.appendChild(plate);
  });
}

pushStackBtn.addEventListener('click', () => {
  const newPlate = stack.length + 1;
  stack.push(newPlate);
  updateStackVisual();
});

popStackBtn.addEventListener('click', () => {
  if (stack.length > 0) {
    stack.pop();
    updateStackVisual();
  } else {
    alert('Stack is empty!');
  }
});

/* ------------------------------
   QUEUE Implementation
------------------------------ */
const queueContainer = document.getElementById('queue-container');
const enqueueBtn = document.getElementById('enqueueBtn');
const dequeueBtn = document.getElementById('dequeueBtn');
const queue = [];

function updateQueueVisual() {
  queueContainer.innerHTML = '';
  queue.forEach((value) => {
    const item = document.createElement('div');
    item.classList.add('queue-item');
    item.textContent = value;
    queueContainer.appendChild(item);
  });
}

enqueueBtn.addEventListener('click', () => {
  const newItem = queue.length + 1;
  queue.push(newItem);
  updateQueueVisual();
});

dequeueBtn.addEventListener('click', () => {
  if (queue.length > 0) {
    queue.shift();
    updateQueueVisual();
  } else {
    alert('Queue is empty!');
  }
});

/* ------------------------------
   LINKED LIST Implementation
------------------------------ */
const linkedListContainer = document.getElementById('linkedlist-container');
const addNodeBtn = document.getElementById('addNodeBtn');
const removeNodeBtn = document.getElementById('removeNodeBtn');
const linkedList = [];

function updateLinkedListVisual() {
  linkedListContainer.innerHTML = '';
  if (linkedList.length === 0) {
    const nullText = document.createElement('span');
    nullText.classList.add('arrow');
    nullText.textContent = 'null';
    linkedListContainer.appendChild(nullText);
  } else {
    linkedList.forEach((value, index) => {
      const node = document.createElement('div');
      node.classList.add('list-node');
      node.textContent = value;
      linkedListContainer.appendChild(node);
      if(index < linkedList.length - 1) {
        const arrow = document.createElement('span');
        arrow.classList.add('arrow');
        arrow.textContent = '→';
        linkedListContainer.appendChild(arrow);
      } else {
        const nullText = document.createElement('span');
        nullText.classList.add('arrow');
        nullText.textContent = '→ null';
        linkedListContainer.appendChild(nullText);
      }
    });
  }
}

addNodeBtn.addEventListener('click', () => {
  const newNode = linkedList.length + 1;
  linkedList.push(newNode);
  updateLinkedListVisual();
});

removeNodeBtn.addEventListener('click', () => {
  if(linkedList.length > 0) {
    linkedList.shift();
    updateLinkedListVisual();
  } else {
    alert('Linked List is empty!');
  }
});

/* ------------------------------
   BINARY TREE Implementation
   (Complete Binary Tree using an array)
------------------------------ */
const binaryTreeContainer = document.getElementById('binarytree-container');
const binaryTreeSvg = document.getElementById('binarytree-svg');
const insertTreeNodeBtn = document.getElementById('insertTreeNodeBtn');
const removeTreeNodeBtn = document.getElementById('removeTreeNodeBtn');
const binaryTree = [];

function updateBinaryTreeVisual() {
  // Clear container and reset SVG
  while(binaryTreeContainer.firstChild) {
    binaryTreeContainer.removeChild(binaryTreeContainer.firstChild);
  }
  binaryTreeContainer.appendChild(binaryTreeSvg);
  binaryTreeSvg.innerHTML = '';
  
  const containerWidth = binaryTreeContainer.clientWidth;
  const verticalSpacing = 80;
  const topMargin = 20;
  const nodeDiameter = 40;
  const positions = [];
  
  binaryTree.forEach((value, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const nodesInLevel = Math.pow(2, level);
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const spacing = containerWidth / (nodesInLevel + 1);
    const x = spacing * (positionInLevel + 1);
    const y = topMargin + level * verticalSpacing;
    positions.push({x, y});
    
    const nodeDiv = document.createElement('div');
    nodeDiv.classList.add('tree-node');
    nodeDiv.style.left = (x - nodeDiameter / 2) + 'px';
    nodeDiv.style.top = (y - nodeDiameter / 2) + 'px';
    nodeDiv.textContent = value;
    binaryTreeContainer.appendChild(nodeDiv);
  });
  
  // Draw connecting lines from each node to its parent
  binaryTree.forEach((value, index) => {
    if(index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const childPos = positions[index];
      const parentPos = positions[parentIndex];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y);
      line.setAttribute("stroke", "#000");
      binaryTreeSvg.appendChild(line);
    }
  });
}

insertTreeNodeBtn.addEventListener('click', () => {
  const newValue = binaryTree.length + 1;
  binaryTree.push(newValue);
  updateBinaryTreeVisual();
});

removeTreeNodeBtn.addEventListener('click', () => {
  if(binaryTree.length > 0) {
    binaryTree.pop();
    updateBinaryTreeVisual();
  } else {
    alert('Binary Tree is empty!');
  }
});

// Initialize all visualizations
updateStackVisual();
updateQueueVisual();
updateLinkedListVisual();
updateBinaryTreeVisual();
