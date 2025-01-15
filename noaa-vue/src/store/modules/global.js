const global = {
    namespaced: true,
    // 공통 관리되는 상태값을 관리,  접근방법- this.$store.state.items
    state: { 
        userInfo: null,             // 사용자 정보
        currentPageAuth: null,       // 현재 페이지 권한 정보.
        menuList : null,
        menuTitleInfo: null
        //map: {}
    },
    // 공유되는 상태 값을 조회 로직을 관리, 접근방법 - this.$store.getters['경로명/함수명']
    getters: { 
        // //사용자 접속 권한 
        // getUserMenuAuth: (state) => {
        //     const userInfo = state.userInfo;
        //     const result = userInfo && Array.isArray(userInfo.user_menu_auth) && userInfo.user_menu_auth.filter((obj) => {
        //         return obj.menu_path == state.currentPage;
        //     });
        //     return Array.isArray(result) ? result[0] : result;
        // }
    },
    // 상태 값을 변경하는 로직을 관리, 접근방법 - this.$store.commit('경로명/함수명')
    mutations: { 
        // 사용자 정보 셋팅.
        setUserInfo(state, _userInfo) {
            state.userInfo = _userInfo;
        },
        // 사용자 정보 삭제.
        clearUserInfo(state) {  
            state.userInfo = null;
        },
        //현재 페이지 권한 수정.
        setCurrentPageAuth(state, _currentPageAuth) {
            state.currentPageAuth = _currentPageAuth;
        },
        //메뉴 정보
        setMenuList(state, menuList) {
            state.menuList = menuList;
        },
        //타이틀 정보
        setMenuTitleInfo(state, menuTitleInfo) {
            state.menuTitleInfo = menuTitleInfo;
        },
        //지도 정보
        // setMap(state, map) {
        //     state.map = map;
        // }
    },
    // 비동기 통신 및 동작을 정의하고 관리, 접근방법 - this.$store.dispatch('경로명/함수명')
    actions: { 
        
    }

  };
  
  export default global;