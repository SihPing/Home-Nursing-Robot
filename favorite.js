//URL變數設定
const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const friends = JSON.parse(localStorage.getItem('favorite')) //承接localStorage儲存的最愛朋友資料 
let filterFd = []   //承接符合搜尋keyword的資料 & 承接符合gender的資料
let num = [] //modal能力表:承接random資料

//DOM節點
const dataPanel = document.querySelector("#data-panel");     //card
const modalAvatar = document.querySelector("#modal-avatar"); //Modal
const modalInfo = document.querySelector(".modal-body .info");
const pagination = document.querySelector("#pagination");    //分頁
const searchForm = document.querySelector("#search-form");   //搜尋器
const input = document.querySelector("#input");              //輸入處
const select = document.querySelector("#select-btn");        //gender選擇
let ctx = document.getElementById('myChart').getContext('2d') //modal 能力表

//其他變數設定
const perPageNum = 30; //設定一頁30人
let currentPage = 1 //渲染頁面預設

//功能:card內容
function cardRender(friends) {
  let rawHTML = "";
  friends.forEach(function(friend) {
    rawHTML += `
     <div class="card mx-3 my-3 col-sm-6 col-md-4 col-lg-3 mb-3" style="width: 14rem;">
  <div id="avatar-box">
  <img src="${friend.avatar}" alt="avatar" id="avatar">
  </div>
  <div class ="card-body">
  <h5 class ="card-title">${friend.name}${friend.surname}</h5>
  
  <div class="d-flex justify-content-center">
  <button class ="btn btn-dark btn-show-info" data-bs-toggle="modal" data-bs-target="#card-modal" data-id ="${friend.id}">About Me</button> 
  <button class ="btn btn-danger btn-remove-favorite ms-2" data-id="${friend.id}">delete</button>
  </div>
  
  </div>
</div>
  `;
  });
  dataPanel.innerHTML = rawHTML;
}

//功能:modal內容
function modalRender(id) {
  //要用axios再請求一次API資料給modal用
  axios
    .get(INDEX_URL + id)
    .then(function(response) {
      modalAvatar.innerHTML = `
 <img src="${response.data.avatar}" alt="avtar" id="modal-avatar-img">`;
      modalInfo.innerHTML = `
    <ul>
    <li id="modal-name">${response.data.name}
    ${response.data.surname}</li>
    <li><i class="fa-solid fa-cake-candles"></i> Manufacture Date : ${response.data.birthday}</li>
    <li><i class="fa-solid fa-venus-double"></i> Service Target Gender : ${response.data.gender}</li>
    <li><i class="fa-sharp fa-solid fa-flag"></i> Service Region : ${response.data.region}</li
    <li><i class="fa-solid fa-address-card"></i> Have provided services for : ${response.data.age} clients</li>
     <li><i class="fa-solid fa-envelope"></i> Email : ${response.data.email}</li>
    </ul>
    `;
    })
    .catch(function(error) {
      console.log("error");
    });
}


//功能:移除最愛
function removeFavorite(id) {
  if (!friends) return

  const friendIndex = friends.findIndex(friend => friend.id === id)
  if (friendIndex === -1) return

  friends.splice(friendIndex, 1)
  localStorage.setItem('favorite', JSON.stringify(friends))
  cardRender(friends)
}

//功能:分頁數量
function pageNum(amount) {
  const numberOfPages = Math.ceil(amount / perPageNum);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  pagination.innerHTML = rawHTML;
}

//功能:分隔每頁朋友資料
function perPageInfo(page) {
  const data = filterFd.length ? filterFd : friends; //三元運算子
  const startIndex = (page - 1) * perPageNum;
  return data.slice(startIndex, startIndex + perPageNum);
}

//功能:搜尋
function search(event) {
  //取消預設事件:網頁更新
  event.preventDefault();

  const keyword = input.value.trim().toLowerCase();
  if (keyword.length === 0) {
    return alert("請輸入有效關鍵字！");
  }
  //將friends[]中符合keyword的，放入新陣列filterFd
  filterFd = friends.filter((friend) =>
    friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword)
  );

  if (filterFd.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的結果`);
  }
  //執行:搜尋結果-分頁數量
  pageNum(filterFd.length);
  //重新渲染頁搜尋結果 + 功能:搜尋結果分頁內容
  cardRender(perPageInfo(currentPage));
}

//功能:select點擊，選擇gender  觀摩同學
function selectGender(event) {
  console.log(event.target.dataset.gender)
  if (event.target.dataset.gender === 'male' || event.target.dataset.gender === 'female') {
    //filterFd拿來裝符合條件的資料
    filterFd = friends.filter(friend => friend.gender === event.target.dataset.gender)
     pageNum(filterFd.length)
     cardRender(perPageInfo(currentPage))
  } else if(filterFd =[]){
     pageNum(friends.length)
     cardRender(perPageInfo(currentPage))
  }
}

//功能:page點擊
function pageClick(event) {
  console.log(event.target.dataset.page);
  cardRender(perPageInfo(Number(event.target.dataset.page)));
}

//功能:card btn點擊
function cardBtnClick(event) {
  if (event.target.matches(".btn-show-info")) {
    console.log(event.target.dataset.id);
    //功能2-4:啟用modal渲染函示
    modalRender(Number(event.target.dataset.id));
    skill()
  } else if (event.target.matches(".btn-remove-favorite")) {
    console.log(event.target.dataset.id);
    removeFavorite(Number(event.target.dataset.id));
  }
}

//功能:modal 能力表
function skill() {
  clearCanvas()
    for (j = 0; j < 5; j++) {
      let a = Math.floor(Math.random() * 50) + 50
      num.push(a)
    }
   Chart.defaults.font.size = 24;
   Chart.defaults.color = "#282876";
    let myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'First Aid Ability',
          'Medication Guidance',
          'Healthy Diet Management',
          'Housework Maintain',
          'Home Safeguard',
        ],
        datasets: [{
          label: 'Capablity List',
          data: num,
          fill: true,
          backgroundColor: 'rgba(38, 38, 178, 0.2)',
          borderColor: 'rgb(255, 162, 0)',
          pointBackgroundColor: 'rgb(255, 162, 150)',
          pointBorderColor: 'rgb(255, 162, 150)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 162, 162)'
        }]
      },
    });
}

//功能:清除HTML畫布 + num陣列清空
function clearCanvas(){
  $('#myChart').remove()
  $('#chart').append('<canvas id="myChart"></canvas>')
  ctx =document.getElementById('myChart').getContext('2d')
  num = []
}

//執行:搜尋功能- 監聽器
searchForm.addEventListener("submit", search)
//執行:分頁功能-監聽器
pagination.addEventListener("click", pageClick)
//執行:modal+移除最愛功能-監聽器
dataPanel.addEventListener("click", cardBtnClick)
//執行:選擇gender-監聽器
select.addEventListener("click", selectGender)

//執行:分頁功能- 製作分頁數量
pageNum(friends.length)
//執行:分頁功能- 渲染最愛資料+每頁30筆
cardRender(perPageInfo(currentPage))