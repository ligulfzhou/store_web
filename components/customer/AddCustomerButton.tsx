import React, {useState} from "react";
import {Button} from "antd";
import AddCustomerModal from "@/components/customer/AddCustomer";


const AddCustomerButton = () => {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false)

    return (
        <div>
            <AddCustomerModal open={isAddCustomerOpen} closeFn={(success)=> {
                setIsAddCustomerOpen(false)
                console.log("close modal...")
            }}/>
            <Button
                className='mb-4'
                type="primary"
                onClick={() => {
                    setIsAddCustomerOpen(true)
                    console.log("add...")
                }}
            >
                添加
            </Button>
        </div>
    )
}

export default AddCustomerButton
