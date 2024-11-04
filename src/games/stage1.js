// 카드 데이터를 정의 (가로세로 비율에 따라 높이와 너비 설정)
const cardData = [
    { id: '초성-ㅅ', image: '/assets/images/stage1/a.jpg', width: 80, height: 120 },
    { id: '중성-ㅗ', image: '/assets/images/stage1/o.jpg', width: 80, height: 120 },
    { id: '종성-ㄹ', image: '/assets/images/stage1/r.jpg', width: 80, height: 120 },
    { id: '중성-ㅣ', image: '/assets/images/stage1/i.jpg', width: 80, height: 120 },
    { id: '초성-ㄱ', image: '/assets/images/stage1/g.jpg', width: 80, height: 120 },
    { id: '중성-ㅡ', image: '/assets/images/stage1/ee.jpg', width: 80, height: 120 },
    { id: '종성-ㄹ', image: '/assets/images/stage1/r.jpg', width: 80, height: 120 },
    { id: '초성-ㅈ', image: '/assets/images/stage1/j.jpg', width: 80, height: 120 },
    { id: '중성-ㅏ', image: '/assets/images/stage1/a.jpg', width: 80, height: 120 }
];

// 드랍 영역 설정
const dropArea = document.getElementById('drop-area');
const dropAreaMessage = document.createElement('p');
dropAreaMessage.textContent = "여기에 단어를 조합하세요";
dropArea.appendChild(dropAreaMessage);

// 드랍 영역의 크기를 계산
const dropAreaWidth = dropArea.offsetWidth;
const dropAreaHeight = dropArea.offsetHeight;

// 카드를 드랍 영역에 무작위 위치로 표시
cardData.forEach(cardInfo => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('draggable', 'true');
    card.setAttribute('id', cardInfo.id);
    card.textContent = cardInfo.content;

    // 카드 배경 이미지 설정
    card.style.backgroundImage = `url('${cardInfo.image}')`;
    card.style.width = `${cardInfo.width}px`; // 카드 너비 설정
    card.style.height = `${cardInfo.height}px`; // 카드 높이 설정

    // 카드 위치를 무작위로 설정
    const randomX = Math.random() * (dropAreaWidth - cardInfo.width);  // 카드 너비에 맞게 조정
    const randomY = Math.random() * (dropAreaHeight - cardInfo.height); // 카드 높이에 맞게 조정

    card.style.left = `${randomX}px`;
    card.style.top = `${randomY}px`;

    card.style.position = 'absolute';  // 무작위 위치 적용을 위한 절대 위치
    dropArea.appendChild(card);

    // 드래그 시작 이벤트
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.id);
    });
});

// 드랍 영역에 카드 배치
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text');
    const card = document.getElementById(cardId);

    // 드랍된 카드를 드랍 위치에 맞게 이동
    const x = e.offsetX - card.offsetWidth / 2;
    const y = e.offsetY - card.offsetHeight / 2;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    dropArea.appendChild(card);

    // 카드를 드롭하면 메시지 제거
    if (dropAreaMessage) {
        dropArea.removeChild(dropAreaMessage);
    }
});

// 정답 제출 기능
document.getElementById('submit-btn').addEventListener('click', () => {
    const answerInput = document.getElementById('answer-input').value;
    const correctAnswer = "소리글자";  // 올바른 정답

    const feedback = document.getElementById('feedback');
    if (answerInput === correctAnswer) {
        feedback.textContent = '정답입니다! 🎉';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = '틀렸습니다. 다시 시도하세요.';
        feedback.style.color = 'red';
    }
});

// 리셋 기능
document.getElementById('reset-btn').addEventListener('click', () => {
    // 카드 위치를 무작위로 다시 설정
    cardData.forEach(cardInfo => {
        const card = document.getElementById(cardInfo.id);

        const randomX = Math.random() * (dropAreaWidth - cardInfo.width);  // 카드 너비에 맞게 조정
        const randomY = Math.random() * (dropAreaHeight - cardInfo.height); // 카드 높이에 맞게 조정

        card.style.left = `${randomX}px`;
        card.style.top = `${randomY}px`;
    });
    
    // 피드백 메시지 초기화
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';

    // 메시지 복원
    dropArea.appendChild(dropAreaMessage);

    // 입력란 초기화
    document.getElementById('answer-input').value = '';
});
