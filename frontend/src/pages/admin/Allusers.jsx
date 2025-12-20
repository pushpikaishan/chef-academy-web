import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Allusers() {
	const navigate = useNavigate()

	const goOverview = () => navigate('/admin')
	const goAdmins = () => navigate('/admin/admins')
	const goUsers = () => navigate('/admin/users')
	

	const cardStyle = {
		border: '1px solid #ddd',
		borderRadius: '8px',
		padding: '16px',
		cursor: 'pointer'
	}

	return (
		<div style={{ padding: '16px' }}>
			<h2 style={{ marginBottom: 12 }}>Management Overview</h2>

			<div style={{ marginBottom: 16 }}>
				<button onClick={goOverview} style={{ padding: '8px 12px' }}>
					Overview
				</button>
	
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
				<div role="button" onClick={goAdmins} style={cardStyle}>
					<div style={{ fontWeight: 600, marginBottom: 6 }}>Manage Admins</div>
					<div style={{ color: '#555' }}>View, edit, and delete admins</div>
				</div>

				<div role="button" onClick={goUsers} style={cardStyle}>
					<div style={{ fontWeight: 600, marginBottom: 6 }}>Manage Users</div>
					<div style={{ color: '#555' }}>View, edit, and delete users</div>
				</div>
			</div>
		</div>
	)
}

