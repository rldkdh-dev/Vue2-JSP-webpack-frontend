
import message, {messageUtil} from "./message";

/**
 * param : 
 * [
 *  {
 *      [필수]  id : element ID
 *      [필수]  type : input or select
 *      [필수]  title : input 의 타이틀.
 *              minSize : 최소 문자수
 *              mxaSize : 최대 문자수
 *  }
 * ]
 * @param {*} obj 
 */
export default function (obj){
    let validation = true;
    let alertMessage = null;
    let alertTitle = null;
    let alertSize = null;
    let $obj;
    if(Array.isArray(obj)) {
        for(const item of obj) {
            const {id, type, title, maxSize, minSize} = item;

            if(id=='file') {
                $obj = $('.upload-hidden');
            } else {
                $obj = $(`#${id}`);
            }
            alertTitle = title;

            const data = $obj.val();

            if(!data || data == '' ) {
                alertMessage = type=='input' ? message.VALIDATION_REQUIRED : message.VALIDATION_SELECT_REQUIRED;
                validation = false;
            }
            
            if(validation) {
                if(minSize && maxSize ) {
                    if(data.length < minSize) {
                        alertMessage = message.VALIDATION_MIN_SIZE;
                        alertSize = minSize;
                        validation = false;
                    } else if (maxSize <= data.length) {
                        alertMessage = message.VALIDATION_MAX_SIZE;
                        alertSize = maxSize;
                        validation = false;    
                    }
                } else if (!minSize && maxSize && maxSize < data.length) {
                    alertMessage = message.VALIDATION_MAX_SIZE;
                    alertSize = maxSize;
                    validation = false;
                } else if (minSize && !maxSize &&  data.length < minSize) {
                    alertMessage = message.VALIDATION_MIN_SIZE;
                    alertSize = minSize;
                    validation = false;    
                }
            }

            if(!validation || alertMessage) {
                alert(messageUtil(alertMessage, [alertTitle, alertSize]));
                $obj.focus();
                return false;
            }
        }
    }
    return validation;
}