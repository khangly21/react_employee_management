import {STAFFS_LOADING,STAFFS_FETCHING_FAILED,STAFFS_DISPATCHING,ADD_STAFF} from "../actionTypesList";
import {baseUrl} from '../../../shared/baseUrl'; //15 nhân viên

console.log(baseUrl);//ok, nhưng console.log(staffs_object); chưa ra consolelog cho tới khi hàm fetchStaffs được connectedMain gọi trong componentDidMount()

//Thunk là hàm  trả về 1  hàm lấy dispatch hoặc setState làm tham số, nhưng setState không dùng trong store?
//hiện reference tới Thunk fetchStaffs = 0, làm sao kết nối và khi nào ? Lúc Main gọi hàm componentDidMount chứa fetchStaffs
export const fetchStaffs = () => (dispatch) => {
    dispatch(staffsLoading(true)); //why có tham số true?

    return fetch(baseUrl + "staffs") //https://rjs101xbackend.herokuapp.com/staffs  cũng như https://rjs101xbackend.herokuapp.com
      .then((response) => response.json())
      .then((staffs_object) => {
          dispatch(fetchStaffsSuccess(staffs_object));
          console.log(staffs_object);
        }
      ) //dispatch hành động tới store để cập nhật bản copy của initial state
      .catch((error) => dispatch(fetchStaffsFailed(error.message)));
};



export const fetchStaffsFailed = (ErrorMessage) => ({
  type: STAFFS_FETCHING_FAILED,
  payload: ErrorMessage  //là kiểu dữ liệu gì cũng được
});

export const fetchStaffsSuccess = (staffs) => ({
  type: STAFFS_DISPATCHING,
  payload: staffs
});

export const staffsLoading = () => ({
  type: STAFFS_LOADING
});

//Hàm sau sẽ trả về 1 đối tượng gói đối tượng chứa các thông tin user input về nhân viên mới cùng với ActionTypes
//postStaff sẽ sử dụng addStaff để đóng gói type và payload
export const addStaffToReduxStore=(staff_with_id_on_server)=>(
  //BEFORE:với sự kiện onSubmit trong CommentForm, Main đã ạo 1 đối tượng gói 4 thông tin người dùng rồi đt này được dispatch tới Redux
  //AFTER: không nhận comment gồm 4 thông tin của người dùng nữa (do postComment đã làm), thực tế là nhận OK_response từ server trả về, rồi gói thành 1 đối tượng để postStaff dispatch nó đi tới Redux store
  { 
    type:ADD_STAFF,
    payload:{nhan_vien_moi:staff_with_id_on_server} //thì bên Reducer DedicatedReducer_Staff.js sẽ truy cập bằng var x = action.payload.nhan_vien_moi;
  }
);

//post_FormStaff_ToServer không cần nhận các form inputs vì chúng đã được lưu vào localStorage
//Lab10_3 gọi postComment lúc submit form, , lúc đó cho tất cả form inputs làm tham số của postComment
//ở đây không làm giống Lab10_3, do đó post không cần các tham số, mà get dữ liệu từ localStorage
export const post_FormStaff_ToServer=()=>(dispatch)=>{
  //get dữ liệu từ localStorage ở dòng 100 của trang employeeBodyComponent.js
  //cách get từ localStorage: https://www.w3schools.com/jsref/prop_win_localstorage.asp
  const newStaff={
      Ten_nhan_vien:localStorage.getItem("Ho_ten"),
      Ngay_sinh:localStorage.getItem("Ngay_sinh"),
      Ngay_vao_lam:localStorage.getItem("Ngay_vao_lam"),
      Phong_ban:localStorage.getItem("Phong_ban"),
      He_so_luong:localStorage.getItem("He_so_luong"),
      Luong:localStorage.getItem("Luong"),
      So_ngay_nghi_con_lai:localStorage.getItem("So_ngay_nghi_con_lai"),
      So_ngay_da_lam_them:localStorage.getItem("So_ngay_lam_them"),
  }

  console.log(newStaff);
  //baseUrl+'staffs'
  return fetch('https://rjs101xbackend.herokuapp.com/staffs',
      {
        method: "POST",
        body: JSON.stringify(newStaff),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin" 
      }
  )
  .then(response => {
       if (response.ok) {
         console.log(response.text);
         return response;
         
       } else {//không nhận được trả lời từ server
         var error = new Error('Error ' + response.status + ': ' + response.statusText);
         error.response = response;
         throw error;
       } 
  },
    //nhận được trả lời nhưng là báo lỗi
    error => {
       var errness=new Error(error.message);
       throw errness;
    }
  )
  .then(response => response.json())
    //dữ liệu updated response.json() nhận được từ server đã bao gồm newComment và id được gán cho nó
  .then(response => dispatch(addStaffToReduxStore(response))) //sử dụng addStaffToReduxStore trong cùng file
  .catch(error =>  { 
      console.log('post comments', error.message); 
      alert('Your comment could not be posted\nError: '+error.message); //EX  unexpected token o in JSON at position1
  })
}

