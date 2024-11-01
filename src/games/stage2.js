const pieces = document.querySelectorAll('.piece'); 
const dropZones = document.querySelectorAll('.drop-zone'); 
const submitButton = document.getElementById('submit'); 
const hintButton = document.getElementById('hint');
const message = document.getElementById('message');
const hintContainer = document.getElementById('hintContainer');
const resetButton = document.getElementById('reset');

let draggedPiece = null; 
let dropData = {}; 
let hintUsed = false;  // 힌트를 사용했는지 여부

// 드래그 시작 
pieces.forEach(piece => { 
    piece.addEventListener('dragstart', function() { 
        draggedPiece = this; 
    }); 
}); 
 
// 드랍 가능 영역으로 끌어놓기 
dropZones.forEach(zone => { 
    zone.addEventListener('dragover', function(e) { 
        e.preventDefault(); 
    }); 

    zone.addEventListener('drop', function() { 
        if (this.childNodes.length < 2) { // 최대 두 개의 조각이 들어갈 수 있도록 
            this.appendChild(draggedPiece); 
            dropData[this.id] = dropData[this.id] || []; // 배열로 초기화 
            dropData[this.id].push(draggedPiece.id); // 드롭된 조각 저장 
        } 
    }); 
}); 
 
// 정답 확인 버튼 클릭 시 정답 체크 
submitButton.addEventListener('click', function() { 
    const correctPairs = { 
        drop1: ['piece1', 'piece8'], 
        drop2: ['piece3', 'piece7'], 
        drop3: ['piece2', 'piece6'], 
        drop4: ['piece4', 'piece5'] 
    }; 
 
    let isCorrect = true; 
 
    for (let zoneId in dropData) { 
        const droppedPieces = dropData[zoneId]; 
        if (correctPairs[zoneId] &&  
            (droppedPieces.length !== 2 ||  
            !correctPairs[zoneId].every(piece => droppedPieces.includes(piece)))) { 
            isCorrect = false; 
            break; 
        } 
    } 
 
    if (isCorrect) { 
        message.textContent = "정답입니다!"; 
        message.style.color = "green"; 
    } else { 
        message.textContent = "틀렸습니다. 다시 시도하세요."; 
        message.style.color = "red"; 
    } 
}); 

// 원래 위치를 저장하기 위한 배열
let originalPositions = Array.from(pieces).map(piece => {
    return { id: piece.id, parent: piece.parentNode }; // 조각 ID와 부모 노드 저장
});
/// 힌트 버튼 클릭 이벤트 리스너 수정
hintButton.addEventListener('click', function() {
    if (hintContainer.style.display === 'block') {
        // 힌트가 이미 보이고 있을 때, 힌트 숨기기
        hintContainer.style.display = 'none';
        message.textContent = ''; // 메시지 초기화
        hintButton.textContent = '힌트 보기'; // 버튼 텍스트를 '힌트 보기'로 변경
    } else if (!hintUsed) {
        // 힌트를 아직 사용하지 않은 경우
        hintContainer.style.display = 'block';
        message.textContent = '힌트를 사용하였습니다.'; // 힌트를 사용했다는 메시지 표시
        message.style.color = 'black';
        hintButton.textContent = '힌트 닫기'; // 버튼 텍스트를 '힌트 닫기'로 변경
        hintUsed = true; // 힌트 사용 여부 업데이트
    } else {
        // 힌트를 이미 사용한 경우
        message.textContent = "힌트는 한 번만 사용할 수 있습니다.";
        message.style.color = 'red';
    }
});

// 조각 초기 위치로 되돌리기
function resetPieces() {
    originalPositions.forEach(pos => {
        const piece = document.getElementById(pos.id);
        pos.parent.appendChild(piece); // 원래 부모 요소에 추가
    });
    
    // 드롭 영역 초기화
    dropZones.forEach(zone => {
        zone.innerHTML = ''; // 드롭 영역의 내용 삭제
        dropData[zone.id] = []; // 드롭 데이터 초기화
    });
}

// 다시하기 버튼 클릭 이벤트 핸들러
resetButton.addEventListener('click', resetGame);

// 게임 초기화
function resetGame() {
    // 조각을 원래 위치로 되돌리기
    originalPositions.forEach(pos => {
        const piece = document.getElementById(pos.id);
        pos.parent.appendChild(piece); // 원래 부모 요소에 추가
        piece.classList.remove('dropped'); // 드롭 상태 제거
    });

    // 드롭 영역 초기화
    dropZones.forEach(zone => {
        zone.innerHTML = ''; // 드롭 영역의 내용 삭제
        dropData[zone.id] = []; // 드롭 데이터 초기화
    });

    // 메시지 초기화
    message.textContent = ''; // 메시지 초기화
    hintUsed = false; // 힌트 사용 여부 초기화
    hintButton.disabled = false; // 힌트 버튼 활성화
    hintContainer.style.display = 'none'; // 힌트 숨기기
}

// 드래그 시작 이벤트 핸들러
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

// 드롭 존에 드랍 이벤트 핸들러 추가
dropZones.forEach(zone => {
    zone.addEventListener('dragover', e => {
        e.preventDefault(); // 드롭 가능하게 설정
    });
    zone.addEventListener('drop', e => {
        e.preventDefault();
        const pieceId = e.dataTransfer.getData('text/plain');
        const piece = document.getElementById(pieceId);
        zone.appendChild(piece); // 드롭 존에 조각 추가
        piece.classList.add('dropped'); // 드롭 상태로 변경
    });
});

// 조각에 드래그 이벤트 추가
pieces.forEach(piece => {
    piece.addEventListener('dragstart', handleDragStart);
});
