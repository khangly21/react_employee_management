import React, { Component } from 'react'; 
import  {Button,Modal,ModalBody} from 'reactstrap';

function Modal(){
    const [modal,setModal]=React.useState(false); 
    //Toggle for Modal
    //Thực ra Modal có built-in prop toggle https://www.geeksforgeeks.org/reactjs-reactstrap-modal-component/
    //class="modal" trong Bootstrap: https://www.geeksforgeeks.org/how-to-pass-data-into-a-bootstrap-modal/
    const toggle=()=>setModal(!modal); 

    return(
      
        <div style={{
            display:'block',width:700,padding:30
        }}>
            <h4>ReactJS Reactstrap Modal component</h4>
            <Button color="primary"
                onClick={toggle}
            >
                Open Modal
            </Button>

             
            <Modal isOpen={modal}
                toggle={toggle}
                modalTransition={{timeout:2000}}
            >
                <ModalBody>
                    Simple Modal with just ModalBody...
                    <Button color="success"
                        onClick={toggle}
                    >
                        Close Modal
                    </Button>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Modal;