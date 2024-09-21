import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Loader from '../components/Loader/Loader.jsx';
import axios from '../helper/axios-helper.js';
import tableIcons from "../assets/custom/js/MaterialTableIcons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckIcon from "@material-ui/icons/Check";
import MaterialTable from "material-table";
import {Modal} from "@material-ui/core";
import {Box} from "@mui/material";
import {toast} from "react-toastify";

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

const DeliveryFindPackages = () => {
    const storeData = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [modalOrder, setModalOrder] = useState(null)

    console.log(storeData)
    const fetchSellerOrders = (searchTerm, setLoading, setOrders) => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${storeData.token}`,
            }
        };

        let url = '/delivery-package-orders/COOK_READY';
        if (searchTerm) {
            url += `?payment_id=${searchTerm}`;
        }

        axios.get(url, config)
            .then(response => {
                const currOrders = response.data.map(order => ({
                    ...order,
                    created_at: formatDate(order.created_at)
                }));
                console.log('currOrders', currOrders);
                setOrders(currOrders);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    };

// Call fetchSellerOrders when needed, passing the searchTerm, setLoading, and setOrders functions as arguments
    useEffect(() => {
        fetchSellerOrders(searchTerm, setLoading, setOrders);
    }, [searchTerm]);
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        console.log(date.toLocaleDateString('en-US', options))
        return date.toLocaleDateString('en-US', options);
    };

    const columns = [
        {
            title: "Delivery Address",
            field: "address",
            sorting: true,
            filtering: true,
            filterPlaceholder: "Filter by payment id"
        },
        {
            title: "Cash on Delivery",
            field: "cod",
            sorting: true,
            filtering: true,
            filterPlaceholder: "Filter by Type"
        },
        {title: "Placed At", field: "created_at", filterPlaceholder: "Filter by date", align: 'center'},
    ];

    const handleModalOpen = (data) => {
        setModalOrder(data)
        setOpen(true)
    }
    const handleModalClose = () => {
        setModalOrder(null)
        setOpen(false)
    }

    const handleSubmitOrder = async (data) => {
        try {
            setLoading(true);
            const requestData = {type: 'package', status: 'ACCEPT', id: data.id}
            const response = await axios.post('/status-change/', JSON.stringify(requestData), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${storeData.token}`,
                },
            });
            fetchSellerOrders(searchTerm, setLoading, setOrders);
            setLoading(false)
            toast.success('Package delivery is confirmed by you!')
        } catch (e) {
            setLoading(false);
            toast.error("Something went wrong!");
        }
    }
    return (
        <>
            {(loading) && <Loader/>}
            <div class="breadcrumb-section breadcrumb-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="breadcrumb-text">
                                <p>Manage Orders</p>
                                <h1>Pending Orders</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-section mt-100 mb-150">
                <div class="container">

                    <div class="row">

                        <div class="col-lg-8 offset-lg-2 text-center">
                            <div class="section-title">
                                <h3>Product Orders List<span class="orange-text"></span></h3>
                            </div>
                        </div>

                        <Modal
                            open={open}
                            onClose={handleModalClose}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                        >
                            <Box sx={style}>
                                <div class="col-lg-12">
                                    <div class="total-section">
                                        <table class="total-table">
                                            <thead class="total-table-head">
                                            <tr class="table-total-row">
                                                <th>Payment Id</th>
                                                <th>Total Price</th>
                                                <th>Product Details</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            <tr className="total-data">
                                                <td><strong>{modalOrder?.payment_id}</strong></td>

                                                <td>{modalOrder?.total_price}</td>
                                                <td>
                                                    <table class="total-table">
                                                        <thead class="total-table-head">
                                                        <tr class="table-total-row">
                                                            <th>Name</th>
                                                            <th>Image</th>
                                                            <th>Price(per unit)</th>
                                                            <th>Quantity</th>
                                                            <th>Total Price</th>
                                                        </tr>
                                                        </thead>

                                                        <tbody>
                                                        {modalOrder?.order_products.map((item, i) => (
                                                            <tr key={i} className="total-data">
                                                                <td>{item.product.name}</td>
                                                                <td><img
                                                                    src={item.product.image}
                                                                    alt="Product Image"
                                                                    style={{
                                                                        width: 100,
                                                                        height: 100,
                                                                        borderRadius: '50%'
                                                                    }}
                                                                /></td>
                                                                <td>{item.product.price}</td>
                                                                <td>{item.quantity}</td>

                                                                <td> {parseInt(item.product.price) * item.quantity}</td>
                                                            </tr>
                                                        ))}

                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                        <div className="col-lg-12">
                            <MaterialTable title="All Pending Orders" icons={tableIcons} columns={columns} data={orders}
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
                                               // {
                                               //     icon: () => <VisibilityIcon/>,
                                               //     tooltip: "details",
                                               //     onClick: (e, data) => handleModalOpen(data),
                                               // },
                                               {
                                                   icon: () => <CheckIcon htmlColor='green'/>,
                                                   tooltip: "accept",
                                                   onClick: (e, data) => handleSubmitOrder(data),
                                               },

                                           ]}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliveryFindPackages;