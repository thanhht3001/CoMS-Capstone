import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import '../css/_flow.css';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

function CreateFlow() {
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [flowOrder, setOrder] = useState('');
    const [selectedFlowRole, setSelectedFlowRole] = useState([]);
    const [contractCategories, setContractCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedContractCategory, setSelectedContractCategory] = useState([]);
    const [flowList, setFlowList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");


    const contractCategoryList = contractCategories.map(category => {
        return { label: category.categoryName, value: category.id }
    })
    const filteredUserList = users.filter(user => !selectedUserId.find(selected => selected.value === user.id));

    const userList = filteredUserList.map(user => {
        return { value: user.id, label: user.fullName };
    });

    const flowRoleList = [
        { label: "Approver", value: 0 },
        { label: "Signer", value: 1 }
    ];


    const fetchContractCategoryData = async () => {
        const res = await fetch("https://localhost:7073/ContractCategories/active", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setContractCategories(data);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    };
    const fetchUserData = async () => {
        const res = await fetch("https://localhost:7073/Users/getManagers", {
            mode: "cors",
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            setUsers(data);

        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            })
        }
    };


    const fetchCreateFlow = async () => {
        try {
            const res = await fetch("https://localhost:7073/Flows/add", {
                mode: "cors",
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                body: JSON.stringify({
                    contractCategoryId: selectedContractCategory.value,
                    status: 1,
                }),
            });

            if (res.status === 200) {
                const flowData = await res.json();
                for (const flow of flowList) {
                    const addFlowDetail = await fetch("https://localhost:7073/FlowDetails/add", {
                        mode: "cors",
                        method: "POST",
                        headers: new Headers({
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        }),
                        body: JSON.stringify({
                            userId: flow.user,
                            flowRole: flow.flowRole,
                            order: flow.order,
                            flowId: flowData.id,
                        }),
                    });

                    if (addFlowDetail.status !== 200) {
                        const errorData = await addFlowDetail.json();
                        throw new Error(errorData.errorCodes);
                    }
                }

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Create Flow Successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate("/category-list");
            } else {
                const data = await res.json();
                throw new Error(data.errorCodes);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    };
    const handleOrderChange = (index, event) => {
        const updatedFlowList = [...flowList];
        updatedFlowList[index].order = event.value;
        setFlowList(updatedFlowList);
        setOrder(event);
    };

    const handleSelectUser = (index, event) => {
        const updatedFlowList = [...flowList];
        updatedFlowList[index].user = event.value;
        setFlowList(updatedFlowList);
        setSelectedUserId([...selectedUserId, event]);

        // You can also remove the selected user from the options displayed
        const updatedUsers = users.filter(user => user.id !== event.value);
        setUsers(updatedUsers);
    };

    const handleSelectFlowRole = (index, event) => {
        const updatedFlowList = [...flowList];
        updatedFlowList[index].flowRole = event.value;
        setFlowList(updatedFlowList);
        setSelectedFlowRole(event);
    };

    const handleAddFlow = () => {
        const newIndex = flowList.length; // Get the index for the new flow
        setFlowList([
            ...flowList,
            { order: newIndex + 1, user: '', flowRole: '' } // Assign the index + 1 to order
        ]);
    };
    const handleRemoveFlow = (index) => {
        const updatedFlowtList = [...flowList];
        updatedFlowtList.splice(index, 1);
        setFlowList(updatedFlowtList);
    };

    const handleSelectContractCategory = (data) => {
        setSelectedContractCategory(data);
    }

    const handleCreateClick = (e) => {
        e.preventDefault();
        fetchCreateFlow();
    }


    useEffect(() => {
        fetchContractCategoryData();
        fetchUserData();
    }, []);

    return (
        <div>
            <form onSubmit={handleCreateClick}>
                <div className="topbar intro-y">
                    <h2>
                        Add New Flow
                    </h2>
                    <div>
                        <div className="dropdown">
                            <button className="dropdown-toggle btn btn-primary" type='submit' > Save
                                <Icon icon="lucide:plus" className='icon' /></button>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="main-body">
                        <div className="main-content">
                            <div className="pos intro-y create-flow">
                                <div className="intro-y">
                                    <div className="post intro-y box">
                                        <div className="post__content tab-content">
                                            <div className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                                                <div className="dark:border-darkmode-400">
                                                    <div className="dark:border-darkmode-400">
                                                        Flow Information </div>
                                                    <div>
                                                        <div className="field" >Contract Category Name <span className="required"> *</span></div>
                                                        <Select id="select-category" options={contractCategoryList} className="form-select"
                                                            value={selectedContractCategory} onChange={handleSelectContractCategory}
                                                            required />
                                                    </div>
                                                    {flowList.length > 0 ? (
                                                        <>
                                                            {flowList.map((flow, index) => (
                                                                <div class="mt-5" key={index}>
                                                                    <div>
                                                                        <div class="order-container">
                                                                            <div>
                                                                                Order
                                                                                <span> {index + 1}</span>
                                                                            </div>
                                                                            <div class="delete-button-container">
                                                                                <button type="button" class="btn btn-danger ms-1" onClick={() => handleRemoveFlow(index)}>
                                                                                    <span className="button-content">
                                                                                        Remove Order
                                                                                        <Icon icon="lucide:delete" className="icon" />
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div>
                                                                        <div className="field">User<span className="required">*</span></div>
                                                                        <Select
                                                                            id="select-user"
                                                                            options={userList}
                                                                            className="form-select"
                                                                            value={selectedUserId[index]}
                                                                            onChange={(event) => handleSelectUser(index, event)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div className="field">Flow Role <span className="required"> *</span></div>
                                                                        <Select
                                                                            id="select-type"
                                                                            options={flowRoleList}
                                                                            className="form-select"
                                                                            value={selectedFlowRole[index]}
                                                                            onChange={(event) => handleSelectFlowRole(index, event)}
                                                                            required
                                                                        />
                                                                    </div>

                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary field"
                                                        onClick={handleAddFlow}
                                                    >
                                                        <span className="button-content">
                                                            Add Order
                                                            <Icon icon="lucide:plus" className="icon" />
                                                        </span>
                                                    </button>

                                                </div>
                                            </div>
                                            <div className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="loading-icon" style={{ display: loading ? "flex" : "none" }}>
                                    <div>
                                        <Icon icon="line-md:loading-alt-loop" className='icon' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default CreateFlow;