import React, {useEffect, useRef, useState} from 'react';
import Loader from '../components/Loader/Loader';
import useLoading from '../hook/customHook';

import {Modal} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ClearIcon from '@material-ui/icons/DeleteForever';
import {Box} from '@mui/material';
import MaterialTable from "material-table";
import Select from 'react-select';
import {toast} from 'react-toastify';
import tableIcons from "../assets/custom/js/MaterialTableIcons";
import axios from '../helper/axios-helper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingTop: '10px',
    paddingBottom: '10px',
    background: 'white',

};

const SellerPackageDashboard = () => {
    const isLoading = useLoading();
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const imageInputRef = useRef(null);
    const updateModalImageInputRef = useRef(null);

    const [allOptions, setAllOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [updateSelectedOptions, setUpdateSelectedOptions] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
    });

    const [updateModalFormData, setUpdateModalFormData] = useState({
        name: '',
        description: '',
        image: null,
    });

    const [packages, setPackages] = useState([]);
    useEffect(() => {
        fetchPackages();
        fetchProducts();
    }, []);
    const fetchPackages = () => {
        axios.get('/packages/')
            .then(response => {
                console.log(response.data);
                setPackages(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };
    const fetchProducts = () => {
        axios.get('/products-for-seller/')
            .then(response => {
                const productList = response.data;
                const tempAllOptions = [];
                productList.map((product) => {
                    tempAllOptions.push({
                        value: product.id,
                        label: product.name
                    });
                });
                setAllOptions(tempAllOptions);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdateChange = (e) => {
        const {name, value} = e.target;
        setUpdateModalFormData({
            ...updateModalFormData,
            [name]: value,
        });
    };

    const handleProductChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };
    const handleUpdateProductChange = (selectedOptions) => {
        console.log('opt', selectedOptions)
        setUpdateSelectedOptions(selectedOptions);
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleUpdateFileChange = (e) => {
        const file = e.target.files[0];
        setUpdateModalFormData({
            ...updateModalFormData,
            image: file,
        });
    };

    const handleTextClick = () => {
        imageInputRef.current.click();
    };

    const handleUpdateTextClick = () => {
        updateModalImageInputRef.current.click();
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleUpdateOpen = (data) => {
        console.log(data);

        setUpdateModalFormData({
            id: data.id,
            name: data.name,
            description: data.description,
            image: data.image,
        });
        const tempUpdateOptions = []
        data.products.map(prod => {
            tempUpdateOptions.push({
                value: prod.id,
                label: prod.name,
            })
        })
        setUpdateSelectedOptions(tempUpdateOptions)
        setOpenUpdateModal(true);
    };

    const handleClose = () => {

        setOpen(false);
        setFormData({
            name: '',
            description: '',
            image: null,
        });
        setSelectedOptions([]);
    };

    const handleUpdateClose = () => {

        setOpenUpdateModal(false);
        setUpdateModalFormData({
            name: '',
            description: '',
            image: null,
        });
        setUpdateSelectedOptions([]);
    };

    const columns = [
        {title: "Name", field: "name", sorting: true, filtering: true, filterPlaceholder: "Filter by name"},
        {title: "Description", field: "description", filterPlaceholder: "Filter by price", align: 'center'},
        {
            title: "Image", field: "image", filtering: false, align: 'center', render: rowData => (
                <img
                    src={rowData.image}
                    alt="Product Image"
                    style={{width: 100, height: 100, borderRadius: '50%'}}
                />
            ),
        },
    ];
    const isFormDataValid = () => {
        for (const key in formData) {
            if (!formData[key]) {
                return false;
            }
        }
        return true;
    };
    const handleSubmit = async () => {
        try {
            setModalLoading(true);
            const regformData = new FormData();
            regformData.append('name', formData.name);
            regformData.append('description', formData.description);
            if (formData.image) {
                regformData.append('image', formData.image);
            }
            if (!isFormDataValid()) {
                setModalLoading(false);
                toast.warning('Please fill all the field');
                return;
            }
            const finalProducts = selectedOptions.map(item => item.value);
            finalProducts.forEach(prod => {
                regformData.append('products', prod)
            })
            console.log(1, finalProducts, regformData)
            const response = await axios.post('/create-package/', regformData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            fetchPackages();
            setModalLoading(false);
            handleClose();
            toast.success("Product succesfully created!");

        } catch (error) {

            setModalLoading(false);
            toast.error("Something went wrong!");
        }
    };

    const handleUpdateSubmit = async () => {
        try {
            setModalLoading(true);

            const regformData = new FormData();
            regformData.append('id', updateModalFormData.id);
            regformData.append('name', updateModalFormData.name);
            regformData.append('description', updateModalFormData.description);

            if (updateModalFormData.image && updateModalFormData.image instanceof File) {
                regformData.append('image', updateModalFormData.image);
            }

            const finalProducts = updateSelectedOptions.map(item => item.value);
            finalProducts.forEach(prod => regformData.append('products', prod))
            console.log(2, finalProducts, regformData)

            const response = await axios.post('/update-package/', regformData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchPackages();
            setModalLoading(false);
            handleUpdateClose();
            toast.success("Product succesfully updated!");

        } catch (error) {

            setModalLoading(false);
            toast.error("Something went wrong!");
        }
    };
    const handleDelete = async (id) => {
        try {

            setLoading(true)
            const response = await axios.delete('/delete-package/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchPackages();
            setLoading(false)
            toast.success("Product successfully deleted!");
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong!");
        }

    }
    return (
        <>
            {(isLoading || loading) && <Loader/>}
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Modify your store </p>
                                <h1>Seller Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* create modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <div class="container">
                        <div class="row">

                            <div class="col-lg-12 mx-auto text-center">
                                <div class="checkout-accordion-wrap">
                                    <div class="accordion" id="accordionExample">
                                        <div class="card single-accordion">
                                            <div class="card-header" id="headingOne">
                                                <h5 class="mb-0">
                                                    <button class="btn btn-link" type="button" data-toggle="collapse"
                                                            data-target="#collapseOne" aria-expanded="true"
                                                            aria-controls="collapseOne">
                                                        Enter Details For Creating Product
                                                    </button>
                                                </h5>
                                            </div>


                                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                                 data-parent="#accordionExample">
                                                <div class="card-body">
                                                    <div class="billing-address-form">

                                                        <form>
                                                            <p>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Name"
                                                                    value={formData.name}
                                                                    onChange={handleChange}

                                                                />
                                                            </p>
                                                            <p>
                                                                <Select
                                                                    isMulti={true}
                                                                    options={allOptions}
                                                                    placeholder="Select Product Type"
                                                                    value={selectedOptions}
                                                                    onChange={handleProductChange}
                                                                />

                                                            </p>

                                                            <p>
                                                                <input
                                                                    type="tel"
                                                                    name="description"
                                                                    placeholder="Description"
                                                                    value={formData.description}
                                                                    onChange={handleChange}
                                                                />
                                                            </p>


                                                            <p class="d-flex flex-row-reverse" style={{gap: '20px'}}>
                                                                {formData.image && (
                                                                    <img
                                                                        src={URL.createObjectURL(formData.image)}
                                                                        alt="Profile Preview"
                                                                        style={{
                                                                            width: "160px",
                                                                            height: "100px",
                                                                        }}
                                                                    />
                                                                )}
                                                                <input
                                                                    type="text"
                                                                    style={{cursor: 'pointer'}}
                                                                    placeholder="Upload Package's Image"
                                                                    value={formData.image ? formData.image.name : "Upload Package's Image"}
                                                                    onClick={handleTextClick}
                                                                    readOnly
                                                                />
                                                                <input
                                                                    type="file"
                                                                    ref={imageInputRef}
                                                                    style={{display: 'none'}}
                                                                    onChange={handleFileChange}
                                                                    accept="image/*"
                                                                />
                                                            </p>
                                                        </form>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">

                                        </div>
                                        {modalLoading ? <div class="card single-accordion">
                                                <div class="card-header" id="headingOne">

                                                    <h5 class='create-post-submit-btn'>
                                                    <span>
                                                        Loading...
                                                    </span>
                                                    </h5>

                                                </div>
                                            </div> :
                                            <div class="card single-accordion">
                                                <div class="card-header" id="headingOne">

                                                    <h5 class='create-post-submit-btn' onClick={handleSubmit}>
                                                        <span>
                                                            Create Package
                                                        </span>
                                                    </h5>

                                                </div>
                                            </div>


                                        }


                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>
                </Box>
            </Modal>

            {/* Update Modal */}
            <Modal
                open={openUpdateModal}
                onClose={handleUpdateClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <div class="container">
                        <div class="row">

                            <div class="col-lg-12 mx-auto text-center">
                                <div class="checkout-accordion-wrap">
                                    <div class="accordion" id="accordionExample">
                                        <div class="card single-accordion">
                                            <div class="card-header" id="headingOne">
                                                <h5 class="mb-0">
                                                    <button class="btn btn-link" type="button" data-toggle="collapse"
                                                            data-target="#collapseOne" aria-expanded="true"
                                                            aria-controls="collapseOne">
                                                        Enter Details For Updating Package
                                                    </button>
                                                </h5>
                                            </div>


                                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                                                 data-parent="#accordionExample">
                                                <div class="card-body">
                                                    <div class="billing-address-form">

                                                        <form>
                                                            <p>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Name"
                                                                    value={updateModalFormData.name}
                                                                    onChange={handleUpdateChange}

                                                                />
                                                            </p>
                                                            <p>
                                                                <Select
                                                                    isMulti={true}
                                                                    options={allOptions}
                                                                    placeholder="Update Products"
                                                                    value={updateSelectedOptions}
                                                                    onChange={handleUpdateProductChange}
                                                                />

                                                            </p>

                                                            <p>
                                                                <input
                                                                    type="tel"
                                                                    name="description"
                                                                    placeholder="Description"
                                                                    value={updateModalFormData.description}
                                                                    onChange={handleUpdateChange}
                                                                />
                                                            </p>


                                                            <p class="d-flex flex-row-reverse" style={{gap: '20px'}}>
                                                                {updateModalFormData.image && (
                                                                    typeof updateModalFormData.image === 'object' ? (
                                                                        <img
                                                                            src={URL.createObjectURL(updateModalFormData.image)}
                                                                            alt="Product Preview"
                                                                            style={{
                                                                                width: "160px",
                                                                                height: "100px",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={updateModalFormData.image}
                                                                            alt="Product Preview"
                                                                            style={{
                                                                                width: "160px",
                                                                                height: "100px",
                                                                            }}
                                                                        />
                                                                    )
                                                                )}

                                                                <input
                                                                    type="text"
                                                                    style={{cursor: 'pointer'}}
                                                                    placeholder="Upload Product's Image"
                                                                    value={updateModalFormData.image ? updateModalFormData.image.name : "Upload Product's Image"}
                                                                    onClick={handleUpdateTextClick}
                                                                    readOnly
                                                                />
                                                                <input
                                                                    type="file"
                                                                    ref={updateModalImageInputRef}
                                                                    style={{display: 'none'}}
                                                                    onChange={handleUpdateFileChange}
                                                                    accept="image/*"
                                                                />
                                                            </p>
                                                        </form>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">

                                        </div>
                                        {modalLoading ? <div class="card single-accordion">
                                                <div class="card-header" id="headingOne">

                                                    <h5 class='create-post-submit-btn'>
                                                    <span>
                                                        Loading...
                                                    </span>
                                                    </h5>

                                                </div>
                                            </div> :
                                            <div class="card single-accordion">
                                                <div class="card-header" id="headingOne">

                                                    <h5 class='create-post-submit-btn' onClick={handleUpdateSubmit}>
                                                        <span>
                                                            Update Package
                                                        </span>
                                                    </h5>

                                                </div>
                                            </div>


                                        }


                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>
                </Box>
            </Modal>

            <div class="checkout-section mt-100 mb-150">
                <div class="container">
                    <div class="row">

                        <div class="col-lg-9 mx-auto text-center">
                            <div class="card single-accordion">
                                <div class="card-header" id="headingOne">

                                    <h5 class='create-post-submit-btn' onClick={handleOpen}>
                                        <span>
                                            Create Package
                                        </span>
                                    </h5>

                                </div>
                            </div>
                            {packages.length > 1 ?
                                <MaterialTable title="All Products" icons={tableIcons} columns={columns} data={packages}
                                               options={{
                                                   sorting: true,
                                                   search: true,
                                                   searchFieldAlignment: "right",
                                                   searchAutoFocus: true,
                                                   searchFieldVariant: "standard",
                                                   filtering: true,
                                                   paging: true,
                                                   pageSizeOptions: [2, 5, 10, 20],
                                                   pageSize: 5,
                                                   paginationType: "normal",
                                                   showFirstLastPageButtons: true,
                                                   paginationPosition: "bottom",
                                                   exportButton: false,
                                                   exportAllData: true,
                                                   exportFileName: "TableData",
                                                   addRowPosition: "first",
                                                   actionsColumnIndex: -1,
                                                   selection: false,
                                                   showSelectAllCheckbox: false,
                                                   showTextRowsSelected: false,
                                                   selectionProps: rowData => ({
                                                       // disabled: rowData.passingYear == null,

                                                   }),
                                                   columnsButton: false,
                                                   rowStyle: {
                                                       fontSize: 16,
                                                   }
                                                   /*rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
                                                   headerStyle: { background: "#f44336", color: "#fff" }*/
                                               }}
                                               localization={{
                                                   header: {
                                                       actions: 'action',

                                                   }
                                               }}
                                               actions={[
                                                   {
                                                       icon: () => <VisibilityIcon/>,
                                                       tooltip: "details",
                                                       onClick: (e, data) => handleUpdateOpen(data),
                                                   },

                                                   {
                                                       icon: () => <ClearIcon htmlColor='red'/>,
                                                       tooltip: "reject",
                                                       onClick: (e, data) => handleDelete(data.id),
                                                   }
                                               ]}

                                />
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerPackageDashboard;