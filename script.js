const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const bettedArr = []
const modal = $('.modal')
const betBox = $('.bet-box')
const bettedBox = $('.betted-box')
const betInput = $('.moneyBet')
const betBtn = $('.bet-btn')
const cancelButton = $('.cancel-btn')
const removeBetButton = $('.betted-close-icon')
const doneBetbtn = $('.doneBet-btn')
var currentCoins = 10000
var currentUser = {}
const quantityCoins = $('.quantity')
const form1 = $('#form-1')
const loginBtn = $('.login-btn')
const logoutBtn = $('.logout-btn')
const registerBtn = $('.register-btn')
var totalcoinsbetted = 0
const modalOverlay = $('.modal__overlay')
modalOverlay.onclick = function() {
    modal.style.display = 'none'
    form1.style.display = 'none'
    formRegister.style.display = 'none'

}
const resultBox = $('.result')
//register
updateCoins()
const nameRegister = $('#name-register')
const usernameRegister = $('#username-register')
const emailRegister = $('#email-register')
const passwordRegister = $('#password-register')
const formRegister = $('#form-2')
const passwordConfirm = $('#password-register-confirm')
const formRegisterBtn = $('.form-btn-register')

passwordConfirm.oninput = function() {
    if(passwordRegister.value === passwordConfirm.value) {
        $('.confirm-password-icon').style.display = 'inline-block'
    } else {
        $('.confirm-password-icon').style.display = 'none'
    }
}

function register() {
    // formRegister.reset()
    var userInfoRegister = {}
    var isExist = false
    userInfoRegister.name = nameRegister.value
    userInfoRegister.username = usernameRegister.value
    userInfoRegister.password = passwordRegister.value
    userInfoRegister.gmail = emailRegister.value
    userInfoRegister.coins = 10000
    var passwordConfirmvalue = passwordConfirm.value
    // nhập lại mật khẩu
    
    // xử lí trùng tài khoản hoặc email
    getUser(function(datas) {
        for(var data of datas) {
            if(data.username == userInfoRegister.username || data.gmail == userInfoRegister.gmail) {
                console.log('trùng')
                isExist = true
                break
            }
        }// gửi tài khoản lên hệ thống
        if(isExist) {
            showErrorRegisterToast()
        }else {
            if (passwordConfirmvalue !== userInfoRegister.password) {
                alert('Mật khẩu nhập lại không đúng')
            } else {
                sendInfo(userInfoRegister)
                showSuccessToast()
            }
        }
    })
    
}


registerBtn.onclick = function() {
    formRegister.reset()
    $('.form-modal').style.display = 'block'
    modal.style.display = 'flex'
    modal.querySelector('.bet-modal-wrap').style.display = 'none'
    form1.style.display = 'none'
    formRegister.style.display = 'block'
    formRegisterBtn.onclick = function(e) {
        e.preventDefault()
        register()
    }
}

function sendInfo(data) {
    fetch(userApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
//
const randomDice = function () {
    const randomDiceArr = new Array(3);
    for (let i = 0; i < 3; i++) {
        randomDiceArr[i] = Math.floor(Math.random() * 6)
    }
    return randomDiceArr;
}
function updateCoins() {
    quantityCoins.innerText = currentCoins
}

// json server
const userApi = "http://localhost:3000/user"
function getUser(callback) {
    fetch(userApi)
        .then(response => response.json())
        .then(callback) //callback sẽ nhận được data từ server
}

//login
loginBtn.onclick = function() {
    resultBox.style.display = "none"
    $('.bet-modal-wrap').style.display = 'none'
    $('.form-modal').style.display = 'block'
    modal.style.display = 'flex'
    form1.style.display = 'block'
    login()
}

function login() {
    form1.reset()
    //get user info form
    const userInfo = {}
    form1.querySelector('.form-btn').onclick = function (e) {
        e.preventDefault()
        userInfo.username = form1.querySelector('#username').value
        userInfo.password = form1.querySelector('#password').value
        getUser(function (datas){
            for(var data of datas){
                if(data.username == userInfo.username && data.password == userInfo.password) {
                    //nếu tìm thấy tài khoản thì cập nhật thông tin user lên chương trình
                    currentCoins = data.coins
                    currentUser = data
                    //tắt form đăng nhập
                    modal.style.display = 'none'
                    $('.form-modal').display = 'none'
                    //hiện thông tin user lên
                    updateCoins()
                    $('.login-btn-box').style.display = 'none'
                    $('.user-box').style.display = 'flex'
                    $('.user-name').innerText = currentUser.name
                } else {
                    form1.reset()
                }
            }
            if(currentUser === {}) {
                alert('Sai tài khoản/mật khẩu rồi ba :v')
            }
        })
    }
}

//logout
logoutBtn.onclick = function() {
    console.log('log out')
    logout()
}

function logout() {
    currentUser = undefined
    currentCoins = 0
    updateCoins()
    $('.user-box').style.display = 'none'
    $('.login-btn-box').style.display = 'flex'
}

// updateCoins()
// handle event click on bet box
betBox.onclick = function (e) {
    var money
    modal.querySelector('.bet-modal').style.backgroundImage = `url(./assets/Images/${e.target.id}.png)`
    if(e.target.classList.contains('bet-box__item') && !e.target.classList.contains('betted')) {
        resultBox.style.display = 'none'
        $('.bet-modal-wrap').style.display = 'block'
        $('.form-modal').style.display = 'none'
        modal.style.display = 'flex'
        betBtn.onclick = function () {
            modal.style.display = 'none'
            money = parseInt(betInput.value)
            if(money + totalcoinsbetted > currentCoins) {
                showErrorToast()
            } else if (money) {
                e.target.classList.toggle('betted')
                if (e.target.classList.contains('betted')) {
                    bettedArr.push({id: e.target.id, money: parseInt(money)})
                } else {
                    const index = bettedArr.indexOf(e.target.id);
                    if (index > -1) {
                        bettedArr.splice(index, 1);
                    }
                }
                bettedBox.innerHTML = renderBettedBox(bettedArr)
                betInput.value = ''
                updateTotalCoinBetted()
            }
        }
        cancelButton.onclick = function () {
            // close modal
            modal.style.display = 'none'
        }
    }
}
// $('.doneBet-btn').onclick = function (e) {
//     e.preventDefault()
//     doneBet()
//     e.stopPropagation()
// }
function doneBet() {
    updateTotalCoinBetted()
    if(totalcoinsbetted > currentCoins) {
        showErrorToast()
    } else if(bettedArr.length > 0) {
        const animalsArr = ['deer', 'gourd', 'chicken', 'fish', 'crab', 'shrimp']
        const animalsBetted = []
        for(index of randomDice()) {
            animalsBetted.push(animalsArr[index])
        }
        $('.dice-item-1').style.backgroundImage = `url(./assets/Images/${animalsBetted[0]}Dice.png)`
        $('.dice-item-2').style.backgroundImage = `url(./assets/Images/${animalsBetted[1]}Dice.png)`
        $('.dice-item-3').style.backgroundImage = `url(./assets/Images/${animalsBetted[2]}Dice.png)`
        $('.dice-item-1').style.transform = `rotate(${random(-30, 30)}deg)`
        $('.dice-item-2').style.transform = `rotate(${random(-30, 70)}deg)`
        $('.dice-item-3').style.transform = `rotate(${random(-30, 90)}deg)`
        if(random(0, 1) == 1) {
            $('.dice-item-1').style.left = `${random(30, 70)}px`
            $('.dice-item-2').style.left = `160px`
            $('.dice-item-2').style.top = `${random(130, 140)}px`
            $('.dice-item-3').style.left = `${random(30, 80)}px`
        } else {
            $('.dice-item-1').style.left = `${random(110, 160)}px`
            $('.dice-item-2').style.top = `${random(130, 140)}px`
            $('.dice-item-2').style.left = `30px`
            $('.dice-item-3').style.left = `${random(110, 150)}px`
        }
        for(bettedItem of bettedArr) {
            var count = 0
            for(index of animalsBetted) {
                if(index === bettedItem.id) {
                    count++
                }
            }
            bettedItem.quantityLucky = count
        }
        //handle the quantity of coins
        for(bettedItem of bettedArr) {
            if(bettedItem.quantityLucky > 0) {
                currentCoins += bettedItem.quantityLucky * bettedItem.money
                updateCoins()
            } else {
                currentCoins -= bettedItem.money
                updateCoins()
            }
        }
        currentUser.coins = currentCoins
        changeData(currentUser.id, currentUser, function(a){
            currentUser = a
        })
        console.log(bettedArr)
        // if(renderResults() > 0)
        //render kết quả
    resultBox.style.display = 'block'
        renderResults()
    }
}

function renderResults() {
    const congratulations = $('.result__congratulation')
    const condolences = $('.result__dontCry')
    var resultArr = []
    var count = 0
    for(bettedItem of bettedArr) {
        resultArr.push(`
            <li class="betted-result-item">
                <div class="betted-item">${bettedItem.id}:</div>
                <div class="appear-times">${bettedItem.quantityLucky} lần</div>    
            </li>`
        )
        if(bettedItem.quantityLucky > 0) {
            count += bettedItem.quantityLucky * bettedItem.money
        } else {
            count -= bettedItem.money
        }
    }
    var htmls = resultArr.join('/n')
    if(count > 0) {
        $('.bet-modal-wrap').style.display = 'none'
        modal.style.display = 'flex'
        condolences.style.display = 'none'
        congratulations.style.display = 'flex'
        resultBox.style.display = 'block'
        congratulations.querySelector('.result__dontCry-content').innerHTML = `
            Lãi ${count}
            <i class="fa-solid fa-coins coin-icon"></i>`
        congratulations.querySelector('.betted-result-list').innerHTML = htmls
        console.log('lời ' + count)
    } else {
        if(count < 0) {
            $('.bet-modal-wrap').style.display = 'none'
            modal.style.display = 'flex'
            congratulations.style.display = 'none'
            condolences.style.display = 'flex'
            resultBox.style.display = 'block'
            condolences.querySelector('.result__dontCry-content').innerHTML = `
                Lỗ ${count*-1}
                <i class="fa-solid fa-coins coin-icon"></i>`
            console.log('lỗ '+ count)
            condolences.querySelector('.betted-result-list').innerHTML = htmls
        }
    }
}

function updateTotalCoinBetted() {
    totalcoinsbetted = 0
    for(bettedItem of bettedArr) {
        totalcoinsbetted += bettedItem.money
    }
}

removeBetted = function (selector) {
    const needToRemove = $(selector)
    const objectNeedToRemove = bettedArr.find((ele) => ele.id === needToRemove.id.split('-')[0])
    const index = bettedArr.indexOf(objectNeedToRemove);
    $(`#${needToRemove.id.split('-')[0]}`).classList.remove('betted')
    if (index > -1) {
        bettedArr.splice(index, 1);
    }
    bettedBox.removeChild(needToRemove)
    updateTotalCoinBetted()
}

const renderBettedBox = function(arr) {
    var htmls = ''
    arr.forEach(function(e) {
        htmls += `
        <div class="betted-box__item" id="${e.id}-betted">
            <div class="betted-img" style="background-image: url('./assets/Images/${e.id}.png')"></div>
            <span class="betted-money">${e.money} <i class="fa-solid fa-coins coin-icon"></i></span>
            <i class="fa-solid fa-xmark betted-close-icon" onclick="removeBetted('#${e.id}-betted')"></i>
        </div>`
    })
    return htmls;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeData(id, data, callback) {
    fetch(userApi + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(res){
        return res.json();
    })
    .then(callback)
}

//toast
function toast({
    type = '',
    title = '',
    msg = '',
    duration = 3000,
}) {
    const main = document.getElementById('toast');
    console.log(main)
    if(main) {
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast--${type}`);
        const icons = {
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-circle-exclamation'
        }
        icon = icons[type];
        toast.innerHTML = 
        `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <div class="toast__title">${title}</div>
                <div class="toast__msg">${msg}</div>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `
        main.appendChild(toast);
        const autoRemove = setTimeout(function () {
            main.removeChild(toast);
        }, 4000)

        toast.onclick = function(e) {
            if(e.target.closest('.toast__close')) {
                main.removeChild(toast);
            }
            clearTimeout(autoRemove);
        }
    }
}

function showSuccessToast () {
    toast({
        type: 'success',
        title: 'Thành công',
        msg: 'Chúc mừng bạn đã đăng kí thành công, đăng nhập để nhận 10000 coins free',
        duration: 3000
    })
}

function showErrorToast () {
    toast({
        type: 'error',
        title: 'Lỗi',
        msg: 'Không đủ tiền, nạp thêm để chơi',
        duration: 3000
    })
}

function showErrorRegisterToast() {
    toast({
        type: 'error',
        title: 'Lỗi',
        msg: 'Dã có người đăng ký bằng tài khoản hoặc email này',
        duration: 3000
    })
}