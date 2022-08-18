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
        msg: 'Chúc mừng bạn đã đăng kí thành công',
        duration: 3000
    })
}

function showErrorToast () {
    toast({
        type: 'error',
        title: 'Lỗi',
        msg: 'Có lỗi xảy ra, vui lòng thử lại sau',
        duration: 3000
    })
}