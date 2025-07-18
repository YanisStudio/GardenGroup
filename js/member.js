// 簡化版會員系統相關功能

// 自定義彈窗樣式注入
function injectModalStyles() {
    if (document.querySelector('#member-modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'member-modal-styles';
    styles.textContent = `
        /* 會員系統自定義彈窗樣式 */
        .member-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .member-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
        }
        
        .member-modal-content {
            background: white;
            padding: 2.5rem;
            border-radius: 15px;
            text-align: center;
            max-width: 450px;
            margin: 0 1rem;
            position: relative;
            z-index: 1;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid #e0e0e0;
        }
        
        .member-modal-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .member-modal-content h3 {
            margin: 0 0 1rem 0;
            font-size: 1.4rem;
        }
        
        .member-modal-content p {
            margin: 0.5rem 0 1.5rem 0;
            line-height: 1.6;
            color: #666;
        }
        
        .member-modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .member-modal-actions .btn {
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s ease;
            min-width: 120px;
            border: none;
            cursor: pointer;
        }
        
        .member-modal-actions .btn:hover {
            transform: translateY(-2px);
        }

        /* 成功彈窗樣式 */
        .member-success-modal .member-modal-icon {
            color: #4caf50;
            animation: memberCheckAnimation 0.6s ease-in-out;
        }

        .member-success-modal .member-modal-content h3 {
            color: #2c5530;
        }

        .member-success-modal .btn {
            background: linear-gradient(135deg, #66bb6a, #4caf50);
            color: white;
        }

        @keyframes memberCheckAnimation {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        /* 錯誤彈窗樣式 */
        .member-error-modal .member-modal-icon {
            color: #f44336;
            animation: memberShakeAnimation 0.6s ease-in-out;
        }

        .member-error-modal .member-modal-content h3 {
            color: #c62828;
        }

        .member-error-modal .btn {
            background: linear-gradient(135deg, #f44336, #e53935);
            color: white;
        }

        @keyframes memberShakeAnimation {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* 警告彈窗樣式 */
        .member-warning-modal .member-modal-icon {
            color: #ff9800;
            animation: memberPulseAnimation 1s ease-in-out infinite;
        }

        .member-warning-modal .member-modal-content h3 {
            color: #f57c00;
        }

        .member-warning-modal .btn {
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
        }

        @keyframes memberPulseAnimation {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
            .member-modal-actions {
                flex-direction: column;
                align-items: center;
            }
            
            .member-modal-actions .btn {
                width: 100%;
                max-width: 200px;
            }
        }
    `;
    document.head.appendChild(styles);
}

// 顯示成功彈窗
function showMemberSuccessModal(title, message) {
    injectModalStyles();
    
    const modal = document.createElement('div');
    modal.className = 'member-modal member-success-modal';
    modal.innerHTML = `
        <div class="member-modal-overlay"></div>
        <div class="member-modal-content">
            <div class="member-modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="member-modal-actions">
                <button class="btn" onclick="closeMemberModal(this)">確定</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.querySelector('.member-modal-overlay').addEventListener('click', function() {
        closeMemberModal(modal);
    });
    
    // 3秒後自動關閉
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeMemberModal(modal);
        }
    }, 3000);
}

// 顯示錯誤彈窗
function showMemberErrorModal(title, message) {
    injectModalStyles();
    
    const modal = document.createElement('div');
    modal.className = 'member-modal member-error-modal';
    modal.innerHTML = `
        <div class="member-modal-overlay"></div>
        <div class="member-modal-content">
            <div class="member-modal-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="member-modal-actions">
                <button class="btn" onclick="closeMemberModal(this)">確定</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.querySelector('.member-modal-overlay').addEventListener('click', function() {
        closeMemberModal(modal);
    });
}

// 顯示警告彈窗
function showMemberWarningModal(title, message) {
    injectModalStyles();
    
    const modal = document.createElement('div');
    modal.className = 'member-modal member-warning-modal';
    modal.innerHTML = `
        <div class="member-modal-overlay"></div>
        <div class="member-modal-content">
            <div class="member-modal-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="member-modal-actions">
                <button class="btn" onclick="closeMemberModal(this)">確定</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.querySelector('.member-modal-overlay').addEventListener('click', function() {
        closeMemberModal(modal);
    });
}

// 關閉彈窗的通用函數
function closeMemberModal(element) {
    let modal;
    if (element.classList && element.classList.contains('member-modal')) {
        modal = element;
    } else {
        modal = element.closest('.member-modal');
    }
    
    if (modal && document.body.contains(modal)) {
        modal.remove();
    }
}

// 將關閉函數設為全域，供 onclick 使用
window.closeMemberModal = closeMemberModal;

// 管理員檢查函數
function isAdmin(email) {
    const adminEmails = [
        'bababa.b810@gmail.com',
        'vincentsayhello@gmail.com'
    ];
    return adminEmails.includes(email);
}

// 用戶登入狀態操作函數
function saveUserState(user) {
    if (user) {
        localStorage.setItem('userIsLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email || '');
        // 使用管理員檢查函數
        if (isAdmin(user.email)) {
            localStorage.setItem('isAdmin', 'true');
        } else {
            localStorage.removeItem('isAdmin');
        }
    } else {
        localStorage.removeItem('userIsLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('isAdmin');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 獲取各種元素
    const userActions = document.getElementById('user-actions');
    const userProfile = document.getElementById('user-profile');
    const usernameDisplay = document.getElementById('username-display');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDropdownBtn = document.getElementById('user-dropdown-btn');
    const userMenu = document.getElementById('user-menu');
    
    // 獲取管理員按鈕元素
    const adminBtn = document.getElementById('admin-btn');
    const adminBtnMobile = document.getElementById('admin-btn-mobile');
    
    // 手機版元素
    const userActionsMobile = document.getElementById('user-actions-mobile');
    const userProfileMobile = document.getElementById('user-profile-mobile');
    const usernameDisplayMobile = document.getElementById('username-display-mobile');

    // 從window對象獲取Firebase服務
    const { 
        auth, 
        db, 
        getAuth,
        signOut, 
        onAuthStateChanged,
        doc,
        setDoc,
        getDoc,
        collection,
        serverTimestamp,
        // Google 登入相關函數
        GoogleAuthProvider,
        signInWithPopup,
        signInWithRedirect,
        getRedirectResult,
        // Facebook 登入相關函數
        FacebookAuthProvider,
        // 電話號碼登入相關函數
        RecaptchaVerifier,
        signInWithPhoneNumber,
        PhoneAuthProvider,
        signInWithCredential
    } = window.firebaseServices || {};

    // 全局變量儲存確認結果
    let confirmationResult = null;

    // 檢查當前登入用戶是否為管理員
    const checkIfAdmin = function(user) {
        if (user && isAdmin(user.email)) {
            console.log('管理員登入:', user.email);
            if (adminBtn) adminBtn.style.display = 'block';
            if (adminBtnMobile) adminBtnMobile.style.display = 'block';
            localStorage.setItem('isAdmin', 'true');
        } else {
            if (adminBtn) adminBtn.style.display = 'none';
            if (adminBtnMobile) adminBtnMobile.style.display = 'none';
            localStorage.removeItem('isAdmin');
        }
    };

    // 台灣手機號碼格式驗證
    function isValidPhoneNumber(phoneNumber) {
        // 檢查手機號碼的長度是否為 10 碼
        if (phoneNumber.length !== 10) {
            return false;
        }

        // 檢查手機號碼的第一個數字是否為 0
        if (phoneNumber[0] !== "0") {
            return false;
        }

        // 使用正規表達式，檢查手機號碼是否符合全數字不帶任何符號的格式
        const regex = /^09\d{8}$/;
        return regex.test(phoneNumber);
    }

    // 設定 reCAPTCHA
    function setUpRecaptcha(phoneNumber) {
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (e) {
                console.log('清除 reCAPTCHA 錯誤:', e);
            }
            window.recaptchaVerifier = null;
        }

        // 顯示 reCAPTCHA 容器
        if (window.authModals) {
            window.authModals.showRecaptchaContainer();
        }

        // 清空容器
        const container = document.getElementById('recaptcha-container');
        if (container) {
            container.innerHTML = '';
        }

        try {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    'size': 'normal',
                    'callback': (response) => {
                        console.log('reCAPTCHA 驗證成功');
                        if (window.authModals) {
                            window.authModals.showPhoneMessage('reCAPTCHA 驗證完成，正在發送驗證碼...', false);
                        }
                        // reCAPTCHA 完成後自動發送驗證碼
                        sendVerificationCode(phoneNumber);
                    },
                    'expired-callback': () => {
                        if (window.authModals) {
                            window.authModals.showPhoneMessage('reCAPTCHA 已過期，請重新驗證', true);
                        }
                        // 重新設定 reCAPTCHA
                        setTimeout(() => {
                            setUpRecaptcha(phoneNumber);
                        }, 1000);
                    }
                }
            );
            
            return window.recaptchaVerifier.render().then((widgetId) => {
                console.log('reCAPTCHA 渲染成功');
                if (window.authModals) {
                    window.authModals.showPhoneMessage('請完成 reCAPTCHA 驗證', false);
                }
                return widgetId;
            }).catch((error) => {
                console.error('reCAPTCHA 渲染錯誤:', error);
                
                let errorMessage = 'reCAPTCHA 載入失敗: ';
                if (error.code === 'auth/app-not-authorized') {
                    errorMessage += '網域未授權，請檢查 Firebase 控制台的授權網域設定';
                } else if (error.message.includes('network')) {
                    errorMessage += '網路連線問題';
                } else {
                    errorMessage += error.message;
                }
                
                if (window.authModals) {
                    window.authModals.showPhoneMessage(errorMessage, true);
                }
                throw error;
            });
            
        } catch (error) {
            console.error('建立 reCAPTCHA 錯誤:', error);
            if (window.authModals) {
                window.authModals.showPhoneMessage('無法初始化 reCAPTCHA，請檢查網域設定', true);
            }
            throw error;
        }
    }

    // 發送驗證碼
    async function sendVerificationCode(phoneNumber) {
        try {
            // 轉換為國際格式
            const internationalPhone = phoneNumber.replace(/^0/, '+886');
            console.log('發送驗證碼到:', internationalPhone);

            confirmationResult = await signInWithPhoneNumber(auth, internationalPhone, window.recaptchaVerifier);
            
            console.log('驗證碼已發送');
            
            if (window.authModals) {
                window.authModals.showPhoneMessage('驗證碼已發送至您的手機，請輸入驗證碼', false);
                window.authModals.showVerificationSection();
                // 隱藏 reCAPTCHA 容器
                window.authModals.hideRecaptchaContainer();
            }
            
        } catch (error) {
            console.error('發送簡訊錯誤:', error);
            let errorMessage = '發送失敗: ';
            
            switch (error.code) {
                case 'auth/invalid-phone-number':
                    errorMessage += '無效的手機號碼格式';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += '請求過於頻繁，請稍後再試';
                    break;
                case 'auth/internal-error-encountered':
                    errorMessage += '系統內部錯誤，請檢查網域設定或稍後再試';
                    break;
                case 'auth/app-not-authorized':
                    errorMessage += '應用程式未獲授權，請檢查 Firebase 設定';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            if (window.authModals) {
                window.authModals.showPhoneMessage(errorMessage, true);
            }
            
            // 重置 reCAPTCHA
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    }

    // 電話號碼登入功能實現
    async function handlePhoneLogin(phoneNumber) {
        if (!RecaptchaVerifier || !signInWithPhoneNumber) {
            showMemberErrorModal('功能未啟用', '電話號碼登入功能未啟用，請聯繫網站管理員。');
            return;
        }

        // 驗證電話號碼格式
        if (!isValidPhoneNumber(phoneNumber)) {
            if (window.authModals) {
                window.authModals.showPhoneMessage('請輸入正確的台灣手機號碼格式（09開頭，共10位數字）', true);
            }
            return;
        }

        try {
            if (window.authModals) {
                window.authModals.showPhoneMessage('正在載入 reCAPTCHA...', false);
            }
            
            await setUpRecaptcha(phoneNumber);
            
        } catch (error) {
            console.error('設定 reCAPTCHA 錯誤:', error);
            if (window.authModals) {
                window.authModals.showPhoneMessage('目前無法驗證，請檢查網域設定或重新整理頁面', true);
            }
        }
    }

    // 驗證電話號碼驗證碼
    async function verifyPhoneCode(code) {
        if (!confirmationResult) {
            showMemberErrorModal('驗證錯誤', '請先發送驗證碼');
            return;
        }

        try {
            if (window.authModals) {
                window.authModals.showPhoneMessage('正在驗證...', false);
            }

            const result = await confirmationResult.confirm(code);
            const user = result.user;

            console.log('電話號碼登入成功:', user.uid);

            saveUserState(user);
            
            // 電話登入的用戶顯示為 "手機用戶"
            const displayName = '手機用戶';
            
            localStorage.setItem('userName', displayName);
            checkIfAdmin(user);

            // 保存或更新用戶資料到 Firestore
            await saveUserToFirestore(user, displayName, 'phone');

            if (window.authModals) {
                window.authModals.hideAllModals();
            }

            updateLoginUI(user);
            showMemberSuccessModal('登入成功', '電話號碼登入成功！');

        } catch (error) {
            console.error('驗證碼驗證失敗:', error);
            
            let errorMessage = '驗證失敗: ';
            if (error.code === 'auth/invalid-verification-code') {
                errorMessage += '驗證碼錯誤，請檢查並重新輸入';
            } else if (error.code === 'auth/code-expired') {
                errorMessage += '驗證碼已過期，請重新發送';
            } else {
                errorMessage += error.message;
            }
            
            if (window.authModals) {
                window.authModals.showPhoneMessage(errorMessage, true);
            }
        }
    }

    // 重新發送驗證碼
    async function resendVerificationCode() {
        const phoneNumber = document.getElementById('phone-number').value;
        if (!phoneNumber) {
            if (window.authModals) {
                window.authModals.showPhoneMessage('請輸入電話號碼', true);
            }
            return;
        }

        // 重置 reCAPTCHA 驗證器
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }

        await handlePhoneLogin(phoneNumber);
    }

    // 保存用戶資料到 Firestore
    async function saveUserToFirestore(user, displayName, provider) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            
            // 處理電話號碼格式 - 從 +886 轉換為 09
            let phoneNumber = '';
            if (user.phoneNumber) {
                phoneNumber = user.phoneNumber.replace(/^\+886/, '0');
            }
            
            if (!userSnap.exists()) {
                // 新用戶，創建用戶文檔
                const userData = {
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    provider: provider,
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                    city: '',
                    district: '',
                    address: ''
                };
                
                // 根據登入方式決定 name 和 phone 欄位
                if (provider === 'phone') {
                    userData.name = ''; // 讓用戶自己填寫姓名
                    userData.phone = phoneNumber; // 電話號碼放在 phone 欄位
                } else {
                    userData.name = displayName; // Google/Facebook 的顯示名稱
                    userData.phone = ''; // 其他登入方式 phone 欄位為空
                }
                
                await setDoc(userRef, userData);
                console.log('新用戶資料已保存:', userData);
            } else {
                // 現有用戶，更新最後登入時間
                const updateData = {
                    lastLoginAt: serverTimestamp(),
                    photoURL: user.photoURL || userSnap.data().photoURL || ''
                };
                
                // 如果是電話登入，更新電話號碼
                if (provider === 'phone') {
                    updateData.phone = phoneNumber;
                }
                
                await setDoc(userRef, updateData, { merge: true });
                
                // 如果 Firestore 中有更完整的用戶名，使用 Firestore 的
                const firestoreUserName = userSnap.data().name;
                if (firestoreUserName) {
                    localStorage.setItem('userName', firestoreUserName);
                }
                console.log('現有用戶登入時間已更新:', updateData);
            }
        } catch (error) {
            console.warn('無法保存用戶資料到數據庫:', error);
            // 即使無法保存到數據庫，也不影響登入流程
        }
    }

    // 處理認證錯誤
    function handleAuthError(error, defaultMessage) {
        let errorMessage = defaultMessage || '登入失敗，請重試。';
        
        switch(error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = '登入已取消。';
                break;
            case 'auth/popup-blocked':
                errorMessage = '瀏覽器阻擋了登入彈窗，請允許彈窗後重試。';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = '登入請求已取消。';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = '此電子郵件已使用其他登入方式註冊，請使用原來的方式登入。';
                break;
            case 'auth/network-request-failed':
                errorMessage = '網路連線問題。請檢查您的網路連線並重試。';
                break;
            case 'auth/too-many-requests':
                errorMessage = '登入嘗試次數過多。請稍後再試。';
                break;
            default:
                errorMessage = defaultMessage + ': ' + error.message;
        }
        
        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
            showMemberErrorModal('登入失敗', errorMessage);
        }
    }
    
    // Google 登入功能實現
    async function handleGoogleLogin() {
        if (!GoogleAuthProvider || !signInWithPopup) {
            showMemberErrorModal('功能未啟用', 'Google 登入功能未啟用，請聯繫網站管理員。');
            return;
        }

        const clickedBtn = document.getElementById('google-login-btn');

        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                'locale': 'zh_TW'
            });
            
            if (clickedBtn) {
                const originalText = clickedBtn.innerHTML;
                clickedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登入中...';
                clickedBtn.disabled = true;
                
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    
                    console.log('Google 登入成功:', user.uid);
                    
                    saveUserState(user);
                    const displayName = user.displayName || user.email.split('@')[0];
                    localStorage.setItem('userName', displayName);
                    checkIfAdmin(user);
                    
                    // 保存或更新用戶資料到 Firestore
                    await saveUserToFirestore(user, displayName, 'google');
                    
                    if (window.authModals) {
                        window.authModals.hideAllModals();
                    }
                    
                    updateLoginUI(user);
                    showMemberSuccessModal('登入成功', 'Google 登入成功！');
                    
                } catch (popupError) {
                    if (popupError.code === 'auth/popup-blocked') {
                        console.log('彈窗被阻擋，嘗試重定向方式');
                        await signInWithRedirect(auth, provider);
                    } else {
                        throw popupError;
                    }
                } finally {
                    if (clickedBtn) {
                        clickedBtn.innerHTML = originalText;
                        clickedBtn.disabled = false;
                    }
                }
            }
            
        } catch (error) {
            console.error('Google 登入失敗:', error);
            
            if (clickedBtn) {
                clickedBtn.innerHTML = '<i class="fab fa-google"></i> 使用 Google 登入';
                clickedBtn.disabled = false;
            }
            
            handleAuthError(error, 'Google 登入失敗');
        }
    }

    // Facebook 登入功能實現
    async function handleFacebookLogin() {
        if (!FacebookAuthProvider || !signInWithPopup) {
            showMemberErrorModal('功能未啟用', 'Facebook 登入功能未啟用，請聯繫網站管理員。');
            return;
        }

        const clickedBtn = document.getElementById('facebook-login-btn');

        try {
            const provider = new FacebookAuthProvider();
            provider.setCustomParameters({
                'locale': 'zh_TW'
            });
            
            if (clickedBtn) {
                const originalText = clickedBtn.innerHTML;
                clickedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登入中...';
                clickedBtn.disabled = true;
                
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    
                    console.log('Facebook 登入成功:', user.uid);
                    
                    saveUserState(user);
                    const displayName = user.displayName || user.email?.split('@')[0] || 'Facebook用戶';
                    localStorage.setItem('userName', displayName);
                    checkIfAdmin(user);
                    
                    // 保存或更新用戶資料到 Firestore
                    await saveUserToFirestore(user, displayName, 'facebook');
                    
                    if (window.authModals) {
                        window.authModals.hideAllModals();
                    }
                    
                    updateLoginUI(user);
                    showMemberSuccessModal('登入成功', 'Facebook 登入成功！');
                    
                } catch (popupError) {
                    if (popupError.code === 'auth/popup-blocked') {
                        console.log('彈窗被阻擋，嘗試重定向方式');
                        await signInWithRedirect(auth, provider);
                    } else {
                        throw popupError;
                    }
                } finally {
                    if (clickedBtn) {
                        clickedBtn.innerHTML = originalText;
                        clickedBtn.disabled = false;
                    }
                }
            }
            
        } catch (error) {
            console.error('Facebook 登入失敗:', error);
            
            if (clickedBtn) {
                clickedBtn.innerHTML = '<i class="fab fa-facebook-f"></i> 使用 Facebook 登入';
                clickedBtn.disabled = false;
            }
            
            handleAuthError(error, 'Facebook 登入失敗');
        }
    }
    
    // 更新登入後的 UI 狀態
    function updateLoginUI(user) {
        const displayName = localStorage.getItem('userName') || user.displayName || user.email?.split('@')[0] || user.phoneNumber || '用戶';
        
        // 更新桌面版 UI
        if (userActions) userActions.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (usernameDisplay) usernameDisplay.textContent = displayName;
        
        // 更新手機版 UI
        if (userActionsMobile) userActionsMobile.style.display = 'none';
        if (userProfileMobile) userProfileMobile.style.display = 'block';
        if (usernameDisplayMobile) usernameDisplayMobile.textContent = displayName;
    }
    
    // 初始化 UI 狀態
    function initializeUI() {
        // 首先隱藏所有用戶相關元素，防止閃現
        if (userActions) userActions.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
        if (userActionsMobile) userActionsMobile.style.display = 'none';
        if (userProfileMobile) userProfileMobile.style.display = 'none';
        
        // 從 localStorage 讀取上次的登入狀態
        const isLoggedIn = localStorage.getItem('userIsLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        
        if (isLoggedIn) {
            // 已登入狀態
            if (userActions) userActions.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            if (userActionsMobile) userActionsMobile.style.display = 'none';
            if (userProfileMobile) userProfileMobile.style.display = 'block';
            
            const displayName = userName || (userEmail ? userEmail.split('@')[0] : '用戶');
            if (usernameDisplay) usernameDisplay.textContent = displayName;
            if (usernameDisplayMobile) usernameDisplayMobile.textContent = displayName;
            
            if (isAdminUser) {
                if (adminBtn) adminBtn.style.display = 'block';
                if (adminBtnMobile) adminBtnMobile.style.display = 'block';
            }
        } else {
            // 未登入狀態
            if (userActions) userActions.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (userActionsMobile) userActionsMobile.style.display = 'block';
            if (userProfileMobile) userProfileMobile.style.display = 'none';
            
            if (adminBtn) adminBtn.style.display = 'none';
            if (adminBtnMobile) adminBtnMobile.style.display = 'none';
        }
    }
    
    // 立即初始化 UI 狀態
    initializeUI();

    try {
        console.log("Firebase 初始化成功");
        
        // 綁定登入按鈕事件
        document.addEventListener('click', function(e) {
            if (e.target.closest('#google-login-btn')) {
                e.preventDefault();
                handleGoogleLogin();
            }
            
            if (e.target.closest('#facebook-login-btn')) {
                e.preventDefault();
                handleFacebookLogin();
            }
        });

        // 綁定電話登入事件
        window.addEventListener('phoneLoginSubmit', function(e) {
            const phoneNumber = e.detail.phoneNumber;
            handlePhoneLogin(phoneNumber);
        });

        window.addEventListener('verifyCodeSubmit', function(e) {
            const code = e.detail.code;
            verifyPhoneCode(code);
        });

        window.addEventListener('resendCodeSubmit', function() {
            resendVerificationCode();
        });
        
        // 檢查重定向結果
        if (getRedirectResult) {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        const user = result.user;
                        console.log('重定向登入成功:', user.uid);
                        
                        const displayName = user.displayName || user.email?.split('@')[0] || '用戶';
                        saveUserState(user);
                        localStorage.setItem('userName', displayName);
                        checkIfAdmin(user);
                        updateLoginUI(user);
                        
                        showMemberSuccessModal('登入成功', '登入成功！');
                    }
                })
                .catch((error) => {
                    console.error('重定向登入失敗:', error);
                    showMemberErrorModal('登入失敗', '重定向登入失敗，請重試。');
                });
        }

        // 點擊用戶名稱顯示下拉選單
        if (userDropdownBtn) {
            userDropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
            });

            // 點擊頁面其他區域關閉下拉選單
            document.addEventListener('click', function(event) {
                if (!userDropdownBtn.contains(event.target) && !userMenu.contains(event.target)) {
                    userMenu.style.display = 'none';
                }
            });
        }

        // 處理用戶登出
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log("嘗試登出");
                signOut(auth)
                    .then(() => {
                        console.log("登出成功");
                        
                        // 清除本地存儲中的用戶狀態
                        saveUserState(null);
                        
                        // 關閉用戶選單
                        userMenu.style.display = 'none';
                        
                        // 確保UI更新為未登入狀態
                        if (userActions) userActions.style.display = 'flex';
                        if (userProfile) userProfile.style.display = 'none';
                        if (userActionsMobile) userActionsMobile.style.display = 'block';
                        if (userProfileMobile) userProfileMobile.style.display = 'none';
                        
                        // 確保管理員按鈕隱藏
                        if (adminBtn) adminBtn.style.display = 'none';
                        if (adminBtnMobile) adminBtnMobile.style.display = 'none';
                        
                        // 清除 reCAPTCHA 驗證器
                        if (window.recaptchaVerifier) {
                            window.recaptchaVerifier.clear();
                            window.recaptchaVerifier = null;
                        }
                        
                        // 清除確認結果
                        confirmationResult = null;
                        
                        showMemberSuccessModal('登出成功', '已成功登出');
                    })
                    .catch((error) => {
                        console.error('登出失敗:', error);
                        showMemberErrorModal('登出失敗', '登出失敗: ' + error.message);
                    });
            });
        }

        // 監聽認證狀態變化
        onAuthStateChanged(auth, function(user) {
            console.log("認證狀態變化，用戶狀態:", user ? "已登入" : "未登入");
            
            if (user) {
                console.log("用戶已登入:", user.uid);
                
                saveUserState(user);
                
                // 更新 UI
                if (userActions) userActions.style.display = 'none';
                if (userProfile) userProfile.style.display = 'flex';
                if (userActionsMobile) userActionsMobile.style.display = 'none';
                if (userProfileMobile) userProfileMobile.style.display = 'block';
                
                checkIfAdmin(user);
                
                // 更新最後登入時間
                const lastUpdate = localStorage.getItem('lastLoginUpdate');
                const now = Date.now();
                if (!lastUpdate || (now - parseInt(lastUpdate)) > 3600000) {
                    setDoc(doc(db, 'users', user.uid), {
                        lastLoginAt: serverTimestamp()
                    }, { merge: true })
                    .then(() => {
                        localStorage.setItem('lastLoginUpdate', now.toString());
                    })
                    .catch(error => {
                        console.warn('更新最後登入時間失敗:', error);
                    });
                }
                
                // 從 Firestore 獲取用戶資料
                getDoc(doc(db, 'users', user.uid))
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            console.log("獲取用戶資料:", docSnap.data().name);
                            localStorage.setItem('userName', docSnap.data().name);
                            
                            if (usernameDisplay) {
                                usernameDisplay.textContent = docSnap.data().name;
                            }
                            if (usernameDisplayMobile) {
                                usernameDisplayMobile.textContent = docSnap.data().name;
                            }
                        } else {
                            // 如果找不到用戶資料，使用預設顯示
                            const name = user.email?.split('@')[0] || user.phoneNumber || '用戶';
                            localStorage.setItem('userName', name);
                            
                            if (usernameDisplay) {
                                usernameDisplay.textContent = name;
                            }
                            if (usernameDisplayMobile) {
                                usernameDisplayMobile.textContent = name;
                            }
                        }

                        // 強制更新用戶名稱顯示
                        setTimeout(() => {
                            const userName = localStorage.getItem('userName');
                            if (userName) {
                                const usernameDisplayElem = document.getElementById('username-display');
                                const usernameDisplayMobileElem = document.getElementById('username-display-mobile');
                                
                                if (usernameDisplayElem) {
                                    usernameDisplayElem.textContent = userName;
                                }
                                
                                if (usernameDisplayMobileElem) {
                                    usernameDisplayMobileElem.textContent = userName;
                                }

                                console.log("用戶名稱顯示已更新為:", userName);
                            }
                        }, 500);
                    })
                    .catch((error) => {
                        console.warn('無法連接到數據庫:', error);
                        const name = user.email?.split('@')[0] || user.phoneNumber || '用戶';
                        localStorage.setItem('userName', name);
                        
                        if (usernameDisplay) {
                            usernameDisplay.textContent = name;
                        }
                        if (usernameDisplayMobile) {
                            usernameDisplayMobile.textContent = name;
                        }
                    });
            } else {
                console.log("用戶未登入");
                
                saveUserState(null);
                
                // 更新 UI
                if (userActions) userActions.style.display = 'flex';
                if (userProfile) userProfile.style.display = 'none';
                if (userActionsMobile) userActionsMobile.style.display = 'block';
                if (userProfileMobile) userProfileMobile.style.display = 'none';
                
                // 隱藏管理員按鈕
                if (adminBtn) adminBtn.style.display = 'none';
                if (adminBtnMobile) adminBtnMobile.style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error("Firebase 初始化失敗:", error);
        initializeUI();
    }

    // 確保頁面完全載入後，會員名稱正確顯示
    setTimeout(() => {
        const userName = localStorage.getItem('userName');
        const userIsLoggedIn = localStorage.getItem('userIsLoggedIn') === 'true';
        
        if (userIsLoggedIn && userName) {
            const usernameDisplayElem = document.getElementById('username-display');
            const usernameDisplayMobileElem = document.getElementById('username-display-mobile');
            
            if (usernameDisplayElem) {
                usernameDisplayElem.textContent = userName;
            }
            
            if (usernameDisplayMobileElem) {
                usernameDisplayMobileElem.textContent = userName;
            }
            
            console.log("頁面載入完成後，確保會員名稱顯示為:", userName);
        }
    }, 1000);
});