
export default {
    ERROR: '예기치 못한 에러가 발생 했습니다. \n관리자에게 문의해 주세요.',

    NO_SEARCH_AUTH: '조회 권한이 없습니다. \n관리자에게 문의해 주세요.',

    CREATE_CONFIRM: '등록하시겠습니까?',

    UPDATE_CONFIRM: '수정하시겠습니까?',
    
    DELETE_CONFIRM: '삭제하시겠습니까?',
    
    VALIDATION_REQUIRED: '{0}은(는) 필수 입니다. ',

    VALIDATION_REQUIRED_VIEW_PROBLEM: '{0}을(를) 적어주세요. ',

    VALIDATION_SELECT_REQUIRED: '{0} 선택은 필수 입니다. ',
    
    VALIDATION_MAX_SIZE: '{0}은(는) {1}자 이하로 입력해 주세요. ',

    VALIDATION_MIN_SIZE: '{0}은(는) {1}자 이상으로 입력해 주세요',
    
    COMMENT_DELETE_CONFIRM: '이 의견을 삭제하시겠습니까?',
    
    COMMENT_MAX_SIZE: '더 이상 답변하실 수 없습니다. \n답변은 {0}개 까지만 가능합니다.',
    
    COMMENT_REPLY_MAX_SIZE: '더 이상 답변하실 수 없습니다. \n답변은 {0}단계 까지만 가능합니다.',
    
    DELETE_MIN_SIZE: '삭제할 게시물을 {0}개 이상 선택해주세요.',
    
    UPLOAD_FILE_TYPE: '{0} 형식의 파일만 등록할 수 있습니다.',
    
    MEASURE_FILE : '조치시 파일첨부 또는 조치사진이 필요합니다.',
    
    COMPLETE_MEASURE_CONFIRM : '코칭을 즉시처리 하시겠습니까? \n코칭등록 후 연속적으로 조치까지 등록되어야 완료처리됩니다.',
    
    CREATE_MESSAGE : '등록 되었습니다.',

    UPDATE_MESSAGE : '수정 되었습니다.',

    DELETE_MESSAGE : '삭제 되었습니다.'
}

export function messageUtil (key, input) {
    try {
        let result = key;
        if(input){
            input.forEach((obj, index) => {
                result = result.replace(new RegExp(`\\{${index}}`, 'gi'), obj); 
            });
        }
        return result;
    } catch (error) {
        return '';
    }
}