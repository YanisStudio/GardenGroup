// 會員管理系統功能

// 管理員檢查函數 - 與 member.js 保持一致
function isAdmin(email) {
    const adminEmails = [
        'bababa.b810@gmail.com',
        'vincentsayhello@gmail.com'
    ];
    return adminEmails.includes(email);
}

document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const usersList = document.getElementById('users-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const statusFilter = document.getElementById('status-filter');
    const pagination = document.getElementById('pagination');
    
    // 新增會員相關元素
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserModal = document.getElementById('add-user-modal');
    const closeAddUser = document.getElementById('close-add-user');
    const addUserForm = document.getElementById('add-user-form');
    const cancelAddUser = document.getElementById('cancel-add-user');
    
    // 編輯會員相關元素
    const editUserModal = document.getElementById('edit-user-modal');
    const closeEditUser = document.getElementById('close-edit-user');
    const cancelEditUser = document.getElementById('cancel-edit-user');
    const editUserForm = document.getElementById('edit-user-form');
    
    // 提示訊息元素
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastClose = document.querySelector('.toast-close');
    
    
    // 從window對象獲取Firebase服務
    const { 
        auth, 
        db, 
        createUserWithEmailAndPassword, 
        onAuthStateChanged,
        collection,
        getDocs,
        query,
        orderBy,
        doc,
        setDoc,
        getDoc,
        serverTimestamp,
        where
    } = window.firebaseServices;

    // 分頁設置
    let currentPage = 1;
    const usersPerPage = 10;
    let filteredUsers = [];
    
    // 檢查用戶是否為管理員 - 修正版本
    const checkAdminAccess = function() {
        onAuthStateChanged(auth, function(user) {
            if (!user || !isAdmin(user.email)) {
                console.log('非管理員訪問，重定向回首頁');
                window.location.href = 'index.html';
            } else {
                console.log('管理員已登入:', user.email);
                // 更新顯示的管理員名稱
                getDoc(doc(db, 'users', user.uid))
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            document.getElementById('username-display').textContent = userData.name || user.email.split('@')[0];
                        } else {
                            document.getElementById('username-display').textContent = user.email.split('@')[0];
                        }
                        // 加載會員資料
                        loadUsers();
                    })
                    .catch((error) => {
                        console.error('獲取用戶資料失敗:', error);
                        document.getElementById('username-display').textContent = user.email.split('@')[0];
                        // 加載會員資料
                        loadUsers();
                    });
            }
        });
    };
    
    // 載入會員資料和統計數據 - 增加錯誤處理
    const loadUsers = async function() {
        try {
            console.log('開始載入會員資料...');
            usersList.innerHTML = `
                <tr class="loading-row">
                    <td colspan="7">
                        <div class="loader"></div>
                        <p>載入會員資料中...</p>
                    </td>
                </tr>
            `;
            
            // 檢查 Firebase 服務是否可用
            if (!db || !collection || !getDocs) {
                throw new Error('Firebase 服務未正確初始化');
            }
            
            // 獲取所有訂單以計算消費會員數
            console.log('正在獲取訂單資料...');
            const ordersSnapshot = await getDocs(collection(db, 'orders'));
            const userOrdersMap = new Map();
            
            ordersSnapshot.forEach(doc => {
                const order = doc.data();
                if (order.userId) {
                    userOrdersMap.set(order.userId, (userOrdersMap.get(order.userId) || 0) + 1);
                } else if (order.customer && order.customer.email) {
                    // 如果沒有 userId，嘗試使用 customer.email
                    const email = order.customer.email;
                    userOrdersMap.set(email, (userOrdersMap.get(email) || 0) + 1);
                }
            });
            
            console.log('訂單統計完成，找到', userOrdersMap.size, '個有訂單的用戶');
            
            // 從 Firestore 獲取用戶數據
            console.log('正在獲取用戶資料...');
            const usersCollection = collection(db, 'users');
            const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
            const usersSnapshot = await getDocs(usersQuery);
            
            console.log('用戶查詢完成，找到', usersSnapshot.size, '個用戶');
            
            if (usersSnapshot.empty) {
                usersList.innerHTML = `
                    <tr class="no-data-row">
                        <td colspan="7">尚無會員資料</td>
                    </tr>
                `;
                return;
            }
            
            // 統計資料
            let totalUsers = 0;
            let activeUsers = 0;
            let newUsersThisMonth = 0;
            let purchasingUsers = 0;
            
            // 當前日期
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            // 處理用戶數據
            const users = [];
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                totalUsers++;
                
                // 計算活躍用戶 (有訂單的用戶)
                const hasOrdersByUid = userOrdersMap.has(doc.id);
                const hasOrdersByEmail = userData.email && userOrdersMap.has(userData.email);
                
                if (hasOrdersByUid || hasOrdersByEmail) {
                    activeUsers++;
                    purchasingUsers++; // 計算消費會員數
                }
                
                // 檢查是否為本月新增用戶
                if (userData.createdAt && userData.createdAt.toDate) {
                    const createdDate = userData.createdAt.toDate();
                    if (createdDate >= firstDayOfMonth) {
                        newUsersThisMonth++;
                    }
                }
                
                const orderCount = Math.max(
                    userOrdersMap.get(doc.id) || 0,
                    userOrdersMap.get(userData.email) || 0
                );
                
                users.push({
                    id: doc.id,
                    name: userData.name || '未設置姓名',
                    email: userData.email || '',
                    createdAt: userData.createdAt ? new Date(userData.createdAt.seconds * 1000) : new Date(),
                    lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt.seconds * 1000) : null,
                    orderCount: orderCount
                });
            });
            
            console.log('統計數據:', { totalUsers, activeUsers, newUsersThisMonth, purchasingUsers });
            
            // 更新統計面板
            document.getElementById('total-users').textContent = totalUsers;
            document.getElementById('active-users').textContent = activeUsers;
            document.getElementById('new-users').textContent = newUsersThisMonth;
            document.getElementById('purchasing-users').textContent = purchasingUsers;
            
            // 保存所有用戶數據
            filteredUsers = [...users];
            
            // 顯示用戶數據
            displayUsers(filteredUsers);
            
        } catch (error) {
            console.error('載入會員數據失敗:', error);
            usersList.innerHTML = `
                <tr class="no-data-row">
                    <td colspan="7">載入會員資料失敗：${error.message}</td>
                </tr>
            `;
            
            // 將統計數據設置為0
            document.getElementById('total-users').textContent = 0;
            document.getElementById('active-users').textContent = 0;
            document.getElementById('new-users').textContent = 0;
            document.getElementById('purchasing-users').textContent = 0;
        }
    };
    
    // 顯示會員數據
    const displayUsers = function(users, page = 1) {
        // 獲取當前頁會員
        const startIndex = (page - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const currentUsers = users.slice(startIndex, endIndex);
        
        if (currentUsers.length === 0) {
            usersList.innerHTML = `
                <tr class="no-data-row">
                    <td colspan="7">無符合條件的會員資料</td>
                </tr>
            `;
            pagination.innerHTML = '';
            return;
        }
        
        // 創建表格內容
        let html = '';
        currentUsers.forEach((user, index) => {
            const displayId = startIndex + index + 1; // 顯示序號
            const createdDate = formatDate(user.createdAt);
            
            // 格式化最後登入日期
            let lastLoginText = '從未登入';
            if (user.lastLoginAt) {
                lastLoginText = formatDate(user.lastLoginAt);
            }
            
            html += `
                <tr data-user-id="${user.id}">
                    <td>${displayId}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${createdDate}</td>
                    <td>${lastLoginText}</td>
                    <td>${user.orderCount}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        usersList.innerHTML = html;
        
        // 創建分頁控制
        createPagination(users.length, page);
        
        // 設置編輯按鈕事件
        setupEditButtons();
    };
    
    // 設置編輯按鈕事件
    const setupEditButtons = function() {
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                editUserDetails(userId);
            });
        });
    };
    
    // 編輯用戶詳情
    const editUserDetails = async function(userId) {
        try {
            // 獲取用戶數據
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                
                // 填充表單
                document.getElementById('edit-user-name').value = userData.name || '';
                document.getElementById('edit-user-email').value = userData.email || '';
                document.getElementById('edit-user-phone').value = userData.phone || '';
                document.getElementById('edit-user-address').value = userData.address || '';
                
                // 格式化註冊日期
                let registerDate = '未知日期';
                if (userData.createdAt && userData.createdAt.toDate) {
                    const date = userData.createdAt.toDate();
                    registerDate = date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW');
                }
                document.getElementById('edit-user-register-date').textContent = registerDate;
                
                // 格式化最後登入日期
                let lastLogin = '從未登入';
                if (userData.lastLoginAt && userData.lastLoginAt.toDate) {
                    const date = userData.lastLoginAt.toDate();
                    lastLogin = date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW');
                }
                document.getElementById('edit-user-last-login').textContent = lastLogin;
                
                // 設置表單的用戶ID
                document.getElementById('edit-user-form').setAttribute('data-id', userId);
                
                // 顯示模態框
                document.getElementById('edit-user-modal').style.display = 'block';
            } else {
                showToast('找不到該用戶資料', 'error');
            }
        } catch (error) {
            console.error('獲取用戶詳情失敗:', error);
            showToast('獲取用戶詳情失敗', 'error');
        }
    };
    
    // 創建分頁控制
    const createPagination = function(totalItems, currentPage) {
        const totalPages = Math.ceil(totalItems / usersPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // 上一頁按鈕
        html += `
            <div class="page-item">
                <a href="#" class="page-link ${currentPage === 1 ? 'disabled' : ''}" 
                   onclick="${currentPage > 1 ? 'changePage(' + (currentPage - 1) + ')' : 'return false'}" 
                   title="上一頁">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </div>
        `;
        
        // 頁碼按鈕
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <div class="page-item">
                    <a href="#" class="page-link ${i === currentPage ? 'active' : ''}" 
                       onclick="changePage(${i})">${i}</a>
                </div>
            `;
        }
        
        // 下一頁按鈕
        html += `
            <div class="page-item">
                <a href="#" class="page-link ${currentPage === totalPages ? 'disabled' : ''}" 
                   onclick="${currentPage < totalPages ? 'changePage(' + (currentPage + 1) + ')' : 'return false'}" 
                   title="下一頁">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </div>
        `;
        
        pagination.innerHTML = html;
    };
    
    // 切換頁面
    window.changePage = function(page) {
        currentPage = page;
        displayUsers(filteredUsers, currentPage);
    };
    
    // 格式化日期
    const formatDate = function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // 過濾會員
    const filterUsers = function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const statusValue = statusFilter.value;
        
        let result = [...filteredUsers];
        
        // 按關鍵字過濾
        if (searchTerm) {
            result = result.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // 按狀態過濾
        if (statusValue === 'active') {
            // 只顯示有訂單的會員
            result = result.filter(user => user.orderCount > 0);
        } else if (statusValue === 'no-orders') {
            // 只顯示無訂單的會員
            result = result.filter(user => user.orderCount === 0);
        }
        
        // 重置頁碼並顯示結果
        currentPage = 1;
        displayUsers(result, currentPage);
    };
    
    // 顯示提示訊息
    const showToast = function(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = 'toast';
        if (type === 'error') toast.classList.add('error');
        toast.style.display = 'flex';
        
        // 5秒後自動隱藏
        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    };
    
    // 更新用戶詳情 - 只更新允許的字段
    const updateUserDetails = async function() {
        const form = document.getElementById('edit-user-form');
        const userId = form.getAttribute('data-id');
        
        // 獲取表單數據
        const name = document.getElementById('edit-user-name').value.trim();
        const phone = document.getElementById('edit-user-phone').value.trim();
        const address = document.getElementById('edit-user-address').value.trim();
        
        // 驗證表單
        if (!name) {
            showToast('姓名不能為空', 'error');
            return;
        }
        
        // 禁用提交按鈕，顯示載入狀態
        const submitBtn = form.querySelector('.btn-primary');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = '儲存中...';
        submitBtn.disabled = true;
        
        try {
            // 更新用戶資料到 Firestore
            await setDoc(doc(db, 'users', userId), {
                name: name,
                phone: phone || null,
                address: address || null,
                updatedAt: serverTimestamp()
            }, { merge: true }); // 使用merge確保只更新指定欄位
            
            // 關閉模態框
            document.getElementById('edit-user-modal').style.display = 'none';
            
            // 顯示成功訊息
            showToast('會員資料已更新', 'success');
            
            // 重新載入會員列表
            loadUsers();
            
        } catch (error) {
            console.error('更新會員資料失敗:', error);
            showToast('更新失敗: ' + (error.message || '未知錯誤'), 'error');
        } finally {
            // 恢復按鈕狀態
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    };
    
    // 新增會員
    const addNewUser = async function() {
        // 獲取表單數據
        const name = document.getElementById('new-user-name').value.trim();
        const email = document.getElementById('new-user-email').value.trim();
        const password = document.getElementById('new-user-password').value;
        const phone = document.getElementById('new-user-phone').value.trim();
        const address = document.getElementById('new-user-address').value.trim();
        
        // 驗證表單
        if (!name || !email || !password) {
            showToast('姓名、電子郵件和密碼不能為空', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('密碼長度至少需要6個字符', 'error');
            return;
        }
        
        // 禁用提交按鈕，顯示載入狀態
        const submitBtn = document.querySelector('#add-user-form .btn-primary');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = '處理中...';
        submitBtn.disabled = true;
        
        try {
            // 創建用戶帳號
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 將用戶資料保存到 Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                phone: phone || null,
                address: address || null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            // 關閉模態框
            document.getElementById('add-user-modal').style.display = 'none';
            
            // 重置表單
            document.getElementById('add-user-form').reset();
            
            // 顯示成功訊息
            showToast('會員新增成功', 'success');
            
            // 重新載入會員列表
            loadUsers();
            
        } catch (error) {
            console.error('新增會員失敗:', error);
            let errorMessage = '新增會員失敗';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = '此電子郵件已被使用';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = '無效的電子郵件格式';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = '密碼強度太弱，請使用更強的密碼';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            // 恢復按鈕狀態
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    };
    
    // 初始化頁面功能
    const initializePage = function() {
        // 漢堡選單功能
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        const menuOverlay = document.getElementById('menu-overlay');
        const body = document.body;

        if (menuToggle && mainNav && menuOverlay) {
            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mainNav.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                body.classList.toggle('menu-open');
            });
            
            menuOverlay.addEventListener('click', function() {
                mainNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            });
        }

        // 用戶下拉選單功能
        const userDropdownBtn = document.getElementById('user-dropdown-btn');
        const userMenu = document.getElementById('user-menu');

        if (userDropdownBtn && userMenu) {
            userDropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', function(e) {
                if (!userDropdownBtn.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.style.display = 'none';
                }
            });
        }

        // 登出功能
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn && window.firebaseServices) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.firebaseServices.signOut(window.firebaseServices.auth)
                    .then(() => {
                        console.log('登出成功，重定向到首頁');
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('登出錯誤', error);
                        alert('登出時發生錯誤，請稍後再試');
                    });
            });
        }

        // 監聽搜尋按鈕點擊
        if (searchBtn) {
            searchBtn.addEventListener('click', filterUsers);
        }
        
        // 監聽搜尋輸入框回車鍵
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filterUsers();
                }
            });
        }
        
        // 監聽狀態過濾器變化
        if (statusFilter) {
            statusFilter.addEventListener('change', filterUsers);
        }
        
        // 新增會員彈窗
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                addUserModal.style.display = 'block';
            });
        }
        
        // 關閉新增會員彈窗
        if (closeAddUser) {
            closeAddUser.addEventListener('click', function() {
                addUserModal.style.display = 'none';
                addUserForm.reset();
            });
        }
        
        // 取消新增會員
        if (cancelAddUser) {
            cancelAddUser.addEventListener('click', function() {
                addUserModal.style.display = 'none';
                addUserForm.reset();
            });
        }
        
        // 關閉編輯會員彈窗
        if (closeEditUser) {
            closeEditUser.addEventListener('click', function() {
                editUserModal.style.display = 'none';
            });
        }
        
        // 取消編輯
        if (cancelEditUser) {
            cancelEditUser.addEventListener('click', function() {
                editUserModal.style.display = 'none';
            });
        }
        
        // 關閉提示訊息
        if (toastClose) {
            toastClose.addEventListener('click', function() {
                toast.style.display = 'none';
            });
        }
        
        // 提交新增會員表單
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addNewUser();
            });
        }
        
        // 提交編輯會員表單
        if (editUserForm) {
            editUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updateUserDetails();
            });
        }
        
        // 點擊彈窗外關閉彈窗
        window.addEventListener('click', function(event) {
            if (event.target === addUserModal) {
                addUserModal.style.display = 'none';
                addUserForm.reset();
            }
            if (event.target === editUserModal) {
                editUserModal.style.display = 'none';
            }
        });
        
        // 設置密碼顯示切換功能
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        });
    };
    
    // 執行頁面初始化
    initializePage();
    
    // 檢查管理員權限并加載數據
    try {
        console.log("Firebase 檢查初始化");
        if (!window.firebaseServices) {
            throw new Error('Firebase 服務未初始化');
        }
        checkAdminAccess();
    } catch (error) {
        console.error("Firebase 初始化失敗:", error);
        alert("Firebase 初始化失敗，會員管理功能可能無法正常使用: " + error.message);
    }
});