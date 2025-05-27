// import React, { useEffect, useState } from 'react';

// const AdminProfile = () => {
//   const [user, setUser] = useState({
//     name: "Admin",
//     email: "admin@green.com",
//     phoneNumber: 9876543210,
//   });

//   // Simulate fetching user data (replace with actual API call if needed)
//   useEffect(() => {
//     // Placeholder for API call
//     // const fetchUserData = async () => {
//     //   try {
//     //     const response = await axios.get("http://localhost:8080/api/v1/auth/user/getAdmin", {
//     //       headers: {
//     //         Authorization: "bearer " + localStorage.getItem("token")
//     //       }
//     //     });
//     //     setUser(response.data);
//     //   } catch (error) {
//     //     console.log(error);
//     //   }
//     // };
//     // fetchUserData();
//   }, []);

//   return (
//     <div style={{ 
//       display: 'flex', 
//       height: 'calc(100vh - 100px)', 
//       marginLeft: '220px', 
//       padding: '30px 20px', 
//       overflowX: 'auto'
//     }}>
//       <div style={{ flex: 1 }}>
//         <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#1b4332' }}>Admin Profile</h2>
//         <div style={{ 
//           backgroundColor: '#01694D', 
//           padding: '20px', 
//           borderRadius: '10px', 
//           color: 'white'
//         }}>
//           <div style={{ marginBottom: '15px' }}>
//             <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Name</span>
//             <span style={{ marginLeft: '10px' }}>: {user.name}</span>
//           </div>
//           <div style={{ marginBottom: '15px' }}>
//             <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Email</span>
//             <span style={{ marginLeft: '10px' }}>: {user.email}</span>
//           </div>
//           <div style={{ marginBottom: '15px' }}>
//             <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Contact No</span>
//             <span style={{ marginLeft: '10px' }}>: {user.phoneNumber}</span>
//           </div>
//           <button style={{ 
//             backgroundColor: '#3498db', 
//             color: '#fff', 
//             border: 'none', 
//             padding: '8px 16px', 
//             borderRadius: '5px', 
//             cursor: 'pointer'
//           }}>
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;