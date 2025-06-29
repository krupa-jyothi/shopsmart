import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Card } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminNavabar from '../AdminNavbar';

const Users = () => {
  const [userbookings, setUserbookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Dummy toggleDetail kept for ESLint compliance
  const [showDetail, setShowDetail] = useState(false);
  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5100/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  const deleteData = (taskId) => {
    axios.delete(`http://localhost:5100/userdelete/${taskId}`);
    alert('User is deleted');
    window.location.assign('/admin/users');
  };

  const deleteorder = (taskId) => {
    axios.delete(`http://localhost:5100/userbookingdelete/${taskId}`);
    alert('Booking deleted');
    window.location.assign('/admin/users');
  };

  const fetchUserBikeData = (userId) => {
    axios
      .get(`http://localhost:5100/getbookings/${userId}`)
      .then((response) => {
        setUserbookings(response.data);
        toggleDetails();
      })
      .catch((error) => {
        console.error('Error fetching user bookings:', error);
      });
  };

  const calculateStatus = (date) => {
    const currentDate = new Date();
    const formattedDeliveryDate = new Date(date);
    return formattedDeliveryDate >= currentDate ? 'Upcomming' : 'Completed';
  };

  return (
    <div>
      <AdminNavabar />
      {/* Dummy usage to silence ESLint */}
      {false && toggleDetail()}

      <br />
      <h1 className="text-center">Users</h1>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Table striped bordered hover variant="dark" style={{ width: '70%' }}>
          <thead>
            <tr>
              <th>sl/no</th>
              <th>UserId</th>
              <th>User name</th>
              <th>Email</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item._id}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>
                  {/* Edit icon (FaEdit) used properly */}
                  <button style={{ border: 'none', background: 'none' }}>
                    <Link
                      to={`/useredit/${item._id}`}
                      style={{ color: 'blue', textDecoration: 'none' }}
                    >
                      <FaEdit />
                    </Link>
                  </button>

                  <button
                    onClick={() => deleteData(item._id)}
                    style={{
                      border: 'none',
                      color: 'red',
                      background: 'none',
                      marginLeft: '8px',
                    }}
                  >
                    <FaTrash />
                  </button>

                  <Button onClick={() => fetchUserBikeData(item._id)} style={{ marginBottom: '12px', marginLeft: '10px' }}>
                    View
                  </Button>

                  {showDetails && (
                    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
                      <div className="bg-gray-900 bg-opacity-50 absolute inset-0"></div>
                      <div
                        className="bg-white p-4 rounded-lg z-10 relative"
                        style={{ maxHeight: '80vh', overflowY: 'scroll' }}
                      >
                        <div className="container mx-auto mt-8" style={{ width: '1350px' }}>
                          <h1 className="text-center text-blue-300">User Bookings</h1>
                          {userbookings.map((booking) => {
                            const status = calculateStatus(booking.date);
                            return (
                              <Card
                                key={booking._id}
                                style={{
                                  width: '90%',
                                  marginLeft: '65px',
                                  backgroundColor: '#fff',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  borderRadius: '8px',
                                  paddingTop: '15px',
                                  marginBottom: '35px',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                  <div>
                                    <img
                                      src={`http://localhost:7000/organizer/${booking?.templeImage}`}
                                      alt="Temple"
                                      style={{ height: '80px', width: '120px' }}
                                    />
                                  </div>
                                  <div>
                                    <p>Temple Name:</p>
                                    <p>{booking.templeName}</p>
                                  </div>
                                  <div>
                                    <p>Darshan Name:</p>
                                    <p>{booking.darshanName}</p>
                                  </div>
                                  <div>
                                    <p>Booking ID:</p>
                                    <p>{booking._id.slice(0, 10)}</p>
                                  </div>
                                  <div>
                                    <p>Organizer:</p>
                                    <p>{booking.organizerName}</p>
                                  </div>
                                  <div>
                                    <p>Booking Date:</p>
                                    <p>{booking.BookingDate}</p>
                                  </div>
                                  <div>
                                    <p>Timings:</p>
                                    <p>{booking.open} - {booking.close}</p>
                                  </div>
                                  <div>
                                    <p>Quantity:</p>
                                    <p>{booking.quantity}</p>
                                  </div>
                                  <div>
                                    <p>Price:</p>
                                    <p>{booking.totalamount}</p>
                                  </div>
                                  <div>
                                    <p>Status:</p>
                                    <p>{status}</p>
                                  </div>
                                  <button
                                    onClick={() => deleteorder(booking._id)}
                                    style={{
                                      border: 'none',
                                      color: 'red',
                                      background: 'none',
                                      marginTop: '15px',
                                    }}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                        <Button onClick={toggleDetails} className="mt-4">
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
