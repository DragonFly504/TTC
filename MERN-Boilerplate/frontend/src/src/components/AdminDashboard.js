import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function AdminDashboard() {
    const [trackingList, setTrackingList] = useState([]);
    useEffect(() => { axios.get('/api/tracking/all').then(res => setTrackingList(res.data)); }, []);
    const updateStatus = (id, status) => {
        axios.post('/api/tracking/update-status', { trackingId: id, newStatus: status })
            .then(() => alert('Status updated and email sent!'));
    };
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <table>
                <thead><tr><th>Tracking Number</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {trackingList.map(item => (
                        <tr key={item._id}>
                            <td>{item.trackingNumber}</td>
                            <td>{item.status}</td>
                            <td>
                                <select onChange={(e) => updateStatus(item._id, e.target.value)}>
                                    <option>Pending</option>
                                    <option>Picked Up</option>
                                    <option>In Transit</option>
                                    <option>Arrived at Hub</option>
                                    <option>Out for Delivery</option>
                                    <option>Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
