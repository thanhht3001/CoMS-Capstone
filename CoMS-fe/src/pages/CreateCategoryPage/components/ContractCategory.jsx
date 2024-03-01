import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import '../css/_contractCategory.css';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

function CreateFlow() {
    const [categoryName, setCategoryName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState([]);
    const [flowOrder, setOrder] = useState('');
    const [selectedFlowRole, setSelectedFlowRole] = useState([]);
    const [contractCategories, setContractCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedContractCategory, setSelectedContractCategory] = useState([]);
    const [userMapping, setUserMapping] = useState({});
    const [flowList, setFlowList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");


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

            // Create a mapping between user IDs and names
            const mapping = {};
            data.forEach(user => {
                mapping[user.id] = user.fullName;
            });
            setUserMapping(mapping);
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.title
            });
        }
    };

    const fetchCreateCategory = async () => {
        try {
            const res = await fetch("https://localhost:7073/ContractCategories/add", {
                mode: "cors",
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                body: JSON.stringify({
                    contractCategoryName: categoryName,
                    status: 1,
                }),
            });

            if (res.status === 200) {
                const categoryData = await res.json();
                const res2 = await fetch("https://localhost:7073/Flows/add", {
                    mode: "cors",
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    }),
                    body: JSON.stringify({
                        contractCategoryId: categoryData.id,
                        status: 1,
                    }),
                });
                if (res2.status === 200) {
                    const flowData = await res2.json();
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

        // Remove the selected user from the options displayed
        const updatedUsers = users.filter(user => user.id !== event.value);
        setUsers(updatedUsers);

        // Update selectedUserId for the specific order
        setSelectedUserId(prevSelected => {
            const newSelected = [...prevSelected];
            const existingIndex = newSelected.findIndex(selected => selected.value === updatedFlowList[index].user);

            if (existingIndex !== -1) {
                // Update the existing selected user for the order
                newSelected[existingIndex] = event;
            } else {
                // Add the new selected user for the order
                newSelected.push(event);
            }

            return newSelected;
        });
    };

    const handleSelectFlowRole = (index, event) => {
        const updatedFlowList = [...flowList];
        updatedFlowList[index].flowRole = event.value;
        setFlowList(updatedFlowList);
        setSelectedFlowRole(event);
    };




    const handleAddFlow = () => {
        const newIndex = flowList.length + 1; // Get the index for the new flow
        const isSignerExists = flowList.some(flow => flow.flowRole === 1);

        // Check if adding a new flow exceeds the number of users
        if (users.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Cannot add more flows. No available users.',
            });
        } else if (isSignerExists) {
            // Display an error or alert if a signer order already exists
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Signer order already exists. Only one Signer order is allowed.',
            });

        } else {
            setFlowList([
                ...flowList,
                { order: newIndex, user: '', flowRole: '' } // Assign the index to order
            ]);
        }
    };

    const handleRemoveFlow = (index) => {
        const removedFlow = flowList[index];

        // Check if the removed user is not empty before adding it back
        if (removedFlow.user) {
            setUsers(prevUsers => [...prevUsers, { id: removedFlow.user, fullName: userMapping[removedFlow.user] }]);
        }

        // Remove the flow from the flowList
        const updatedFlowList = [...flowList];
        updatedFlowList.splice(index, 1);
        setFlowList(updatedFlowList);

        // Remove the selected user of the removed order from the selectedUserId list
        setSelectedUserId(prevSelected => prevSelected.filter(selected => selected.value !== removedFlow.user));
    };


    const handleCategoryNameChange = e => {
        setCategoryName(e.target.value);
    }



    const handleCreateClick = async (e) => {
        e.preventDefault();

        // Validation check for categoryName
        if (!categoryName || /^\s*$/.test(categoryName)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Contract Category Name cannot be blank or contain only spaces.',
            });
            return;
        }

        // Check if contractCategories is defined
        if (!contractCategories) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Contract Categories data is not available.',
            });
            return;
        }

        // Trim the entered categoryName and check if it already exists
        const trimmedCategoryName = categoryName.trim();
        const categoryNameExists = contractCategories.some(
            (existingCategory) => existingCategory.categoryName.trim() === trimmedCategoryName
        );

        if (categoryNameExists) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Contract Category Name already exists. Please choose a different name.',
            });
            return;
        }

        // Check if there is only one signer in the flow
        const signerCount = flowList.filter(flow => flow.flowRole === 1).length;
        
        // alert(JSON.stringify(signerCount));
        if (signerCount > 1 ) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There must be exactly one Signer in the flow.',
            });
            return;
        }
        const approverCount = flowList.filter(flow => flow.flowRole === 0).length;
        if (signerCount == 0 && approverCount == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There must be at least one Signer and Approver in the flow.',
            });
            return;
        }
        if (approverCount == 0 ) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There must be at least one Approver in the flow.',
            });
            return;
        }

        var index = flowList.findIndex(flow => flow.flowRole === 1) + 1;

        var myFlows = document.getElementsByName('flows');
        var numberOfFlows = myFlows.length;
        if (index !== numberOfFlows) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Signer must be the last person in the flow.',
            });
            return;
        }

        // Continue with the API call
        try {
            setLoading(true);
            await fetchCreateCategory();
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchContractCategoryData();
        fetchUserData();
    }, []);

    return (
        <div>
            <form onSubmit={handleCreateClick}>
                <div className="topbar intro-y">
                    <h2>
                        Create Category
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
                            <div className="pos intro-y contract-category">
                                <div className="intro-y">
                                    <div className="post intro-y box">
                                        <div className="post__content tab-content">
                                            <div className="tab-pane active" role="tabpanel" aria-labelledby="content-tab">
                                                <div className="dark:border-darkmode-400">
                                                    <div className="dark:border-darkmode-400">
                                                        Category Information </div>
                                                    <div class="input-container">
                                                        <div class="field">Contract Category Name <span class="required">*</span></div>
                                                        <input
                                                            type="text"
                                                            class="cateName-input"
                                                            value={categoryName}
                                                            onChange={handleCategoryNameChange}
                                                            placeholder="Category Name"
                                                            required
                                                        />
                                                    </div>
                                                    {flowList.length > 0 ? (
                                                        <>
                                                            {flowList.map((flow, index) => (
                                                                <div class="mt-5" key={index} name="flows">
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