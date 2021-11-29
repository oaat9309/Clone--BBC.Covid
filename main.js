// 전역 변수 중복을 피하기 위해 즉시실행 익명 함수를 작성하고, 뒤에 연산자로 바로 호출해서 실행해주는 과정
(()=> {

    const actions = {
        birdFlies(key) {
            if(key) {
                document.querySelector('[data-index="2"] .bird').style.transform = `translateX(${window.innerWidth}px)`;
            }
            else {
                document.querySelector('[data-index="2"] .bird').style.transform = `translateX(-100%)`;
            }
        },
        birdFlies2(key) {
            if(key) {
                document.querySelector('[data-index="5"] .bird').style.transform = `translate(${window.innerWidth}px, 
                    ${-window.innerHeight*0.7}px)`;
            }
            else {
                document.querySelector('[data-index="5"] .bird').style.transform = `translateX(-100%)`;
            }
        }
    }

    const stepElems = document.querySelectorAll(".step");
    const graphicElems = document.querySelectorAll(".graphic-item");
    let currentItem = graphicElems[0];  // visible class를 부여했다가 다시 회수하기 위해 현재 데이터 인덱스에 해당하는 항목을 담을 함수
    let ioIndex;

    // 눈에 보이는 엘리먼트들에만 loop를 돌리기 위해 intersection observer 기능을 사용! 지금은 눈에 안보이는 엘리먼트들도 loop에 포함되어 있음
    const io = new IntersectionObserver((entries, observer)=> {
        ioIndex = entries[0].target.dataset.index * 1;  // 현재 index는 문자열로 들어가 있음. 이거 숫자로 바꾸는 제일 쉬운 방법은 숫자 1 곱하는 거
        console.log(ioIndex)
    })

    for (let i=0; i < stepElems.length; i++) {
        io.observe(stepElems[i]); // 모든 stepElems들을 관찰 대상으로 등록
        /*stepElems[i].setAttribute("data-index", i);*/
        stepElems[i].dataset.index = i;
        graphicElems[i].dataset.index = i;
    }

    function activate(action) {
        currentItem.classList.add("visible");
        if(action) {
            actions[action](true);  // 보통 메서드 접근할때는 . 찍고 불러오지만, action에 뭐가 들어올지 몰라서 저런 식으로 코드를 짬
        }
    }

    function deactivate(action) {
        currentItem.classList.remove("visible")
        if(action) {
            actions[action](false);
        }
    }

    window.addEventListener("scroll", () => {

        let step;
        let boundingRect;
        for(let i = ioIndex - 1; i < ioIndex + 2; i++){
            step = stepElems[i];
            if(!step) continue;  // 그냥 반목문 돌리면 최초에 step이 stepElems[-1]이 되기 때문에, continue를 넣어서 혹시 step 값이 없으면 그냥 다음 루프 돌리라는 것
            boundingRect = step.getBoundingClientRect(); //getBoundingClientRect()는 해당 엘리먼트가 뷰포트 내에서 가지는 위치 정보를 리턴한다 
            
            if (boundingRect.top > window.innerHeight*0.1 && boundingRect.top < window.innerHeight*0.8) {
                deactivate(currentItem.dataset.action);
                currentItem = graphicElems[step.dataset.index];
                activate(currentItem.dataset.action);
            }
        }
    })

    //intersection observer를 쓰기 때문에 새로고침 했을 때 다시 맨 위로 올려야 이미지 갱신이 정확해짐
    window.addEventListener("load", () => {
        setTimeout(() => scrollTo(0,0), 100);
    })

    activate();
})();

