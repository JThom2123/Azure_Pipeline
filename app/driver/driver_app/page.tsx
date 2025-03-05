"use client";  // Ensure this is at the top of the file for client-side behavior

import { useState } from "react";  // Import useState here
import { useRouter } from "next/navigation";  // Correct import for useRouter in App Router

const DriverAppPage = () => {
  const router = useRouter();

  // Assuming you have a way to get the user role or you want to submit form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sponsor: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Form submitted', formData); // Log form data for debugging

    // After form submission, redirect to /driver/home (or any other page)
    router.replace('/driver/home');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white', margin: 0 }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '60%', maxWidth: '800px', minWidth: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>Driver Application</h2>

        <label htmlFor="first-name">First Name:</label>
        <input 
          type="text" 
          id="first-name" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleInputChange}
          required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
        />

        <label htmlFor="last-name">Last Name:</label>
        <input 
          type="text" 
          id="last-name" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleInputChange}
          required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
        />

        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange}
          required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
        />

        <label htmlFor="phone">Phone Number:</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleInputChange}
          required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
        />

        <label htmlFor="sponsor">Select a Sponsor:</label>
        <select 
          id="sponsorDropdown" 
          name="sponsor" 
          value={formData.sponsor} 
          onChange={handleInputChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
        >
          <option value="">--Please choose a sponsor--</option>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </select>

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: '2px solid #007bff', borderRadius: '4px', cursor: 'pointer', display: 'block', width: '100%', marginBottom: '10px' }} // Border added
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DriverAppPage;
