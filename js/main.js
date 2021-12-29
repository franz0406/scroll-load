$(function(){

    let visibleHeight = $(document).height() - $(window).height();
    const mobileMenu = $("nav > ul > li");
    const mobileMenuHeight = mobileMenu.find("> a").outerHeight();
    let loading = $(".loading");

    // JSON 변수

    let addItemCount = 3,   // 한번에 표시 할 항목 수
        addedCount = 0,     // 표시 된 항목 수
        allData = [];       // JSON 데이터

    $.getJSON('./data/article.json', init);

    function init(data){
        allData = data;
        addItems();
    }

    function addItems(){
        let elements = [],
            slicedData = allData.slice(addedCount, addedCount + addItemCount);
        
        $.each(slicedData, function(idx, item){
            let itemHTML =
                    `<article>
                        <figure>
                            <img src="${item.image}" alt="${item.title}">
                            <figcaption>
                                <h2>${item.title}</h2>
                                <p>${item.desc}</p>
                                <dl>
                                    <dt>Client :</dt>
                                    <dd>${item.client}</dd>                        
                                </dl>
                                <dl>
                                    <dt>Tags :</dt>
                                    <dd>${item.tag}</dd>
                                </dl>
                            </figcaption>
                        </figure>
                    </article>`;
            elements.push($(itemHTML).get(0))
        });
        loading.before(elements); // 엘리먼트 추가   
        addedCount += slicedData.length;        
    }

    $(window).resize(function(){
        updateHeight();
        if($(window).width() > 768){
            mobileMenu.find("ul").show();    
            mobileMenu.css({height:'auto'});        
        }else{
            mobileMenu.find("ul").hide();
        }        
    })

    mobileMenu.click(function(e){
        e.preventDefault();

        if($(window).width() <= 768){     
            $(this).toggleClass("active");
            if($(this).hasClass("active")){
                let newHeight = mobileMenuHeight + $(this).find("ul").outerHeight();
                $(this).animate({height:newHeight},500);
                $(this).find("ul").slideDown();
            }else{
                $(this).animate({height:mobileMenuHeight},500);
                $(this).find("ul").slideUp(500);
            }   

        }

    })

    $(window).scroll(function(){
        loadContent();
    })
    
    function loadContent(){ // 스크롤 할 때 함수
        
        if($(window).scrollTop() >= visibleHeight){ // 스크롤 끝에 다다랐을때
            
            $(window).off("scroll"); // 스크롤이 생겨도 스크롤이벤트 작동 X 

            if(addedCount >= allData.length){
                loading.hide();
                $(window).off("scroll");
                // 메세지 출력
                let msg = "마지막 입니다.";
                let msgHTML = '<div id="message"><div class="popup">'+ msg +'</div></div>';
                $("body").append(msgHTML);

                $("#message").click(function(){
                    $(this).fadeOut();
                })
            } else {
                loading.fadeIn(function(){ // 로딩 엘리먼트 보인 다음 할 일
                
                    setTimeout(function(){                    
                        addItems();                 
                        loading.fadeOut(function(){ // 로딩 엘리먼트 다시 감추고 그 뒤에 할일
                            updateHeight(); // 문서가 추가 됨에 따라 문서 높이 다시 구하기  
                            $(window).scroll(function(){
                                loadContent(); // 다시 스크롤 이벤트 활성
                            });
                        });
                    }, 100);                    
                });
            }           
        }
    }

    function updateHeight(){ // 문서 높이 구하는 함수
        visibleHeight = $(document).height() - $(window).height();
    }


})

