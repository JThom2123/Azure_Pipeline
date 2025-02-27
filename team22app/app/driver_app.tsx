import { useState } from "react";

const DriverApplication = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sponsor: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "pending.tsx";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-3/5 max-w-2xl min-w-[400px]">
        <h2 className="text-center text-xl font-bold">Driver Application</h2>
        <label htmlFor="first-name">First Name:</label>
        <input type="text" id="first-name" name="firstName" value={formData.firstName} onChange={handleChange} required className="border p-2 w-full" />

        <label htmlFor="last-name">Last Name:</label>
        <input type="text" id="last-name" name="lastName" value={formData.lastName} onChange={handleChange} required className="border p-2 w-full" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="border p-2 w-full" />

        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="border p-2 w-full" />

        <label htmlFor="sponsor">Select a Sponsor:</label>
        <select id="sponsorDropdown" name="sponsor" value={formData.sponsor} onChange={handleChange} className="border p-2 w-full">
          <option value="">--Please choose a sponsor--</option>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
};

export default DriverApplication;
