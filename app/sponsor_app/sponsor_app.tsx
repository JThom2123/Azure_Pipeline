import { useState } from "react";
import { useRouter } from "next/router";

const SponsorApplication = () => {
    const [drivers, setDrivers] = useState([{ id: 1 }]);
    const router = useRouter();

    const addDriver = () => {
        setDrivers([...drivers, { id: drivers.length + 1 }]);
    };

    const removeDriver = () => {
        if (drivers.length > 1) {
            setDrivers(drivers.slice(0, -1));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert("Application submitted successfully! Redirecting to sponsor page...");
        router.push("/sponsor/home");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md w-3/5 max-w-2xl min-w-[400px]">
                <h2 className="text-center text-xl font-bold">Sponsor Application</h2>
                <label htmlFor="sponsor-name">Sponsor Name:</label>
                <input type="text" id="sponsor-name" name="sponsor-name" required className="border p-2 w-full mb-2" />
                
                <h3 className="text-left text-lg font-semibold">Driver Information</h3>
                <div id="driversContainer">
                    {drivers.map((driver) => (
                        <div key={driver.id} className="driver mb-4">
                            <label>Driver First Name:</label>
                            <input type="text" name="Driver-first-name" required className="border p-2 w-full mb-2" />
                            <label>Driver Last Name:</label>
                            <input type="text" name="Driver-last-name" required className="border p-2 w-full mb-2" />
                        </div>
                    ))}
                </div>
                
                <div className="flex gap-2 justify-center mt-4">
                    <button type="button" onClick={addDriver} className="p-2 w-48 bg-yellow-400 text-black rounded-md hover:bg-yellow-500">
                        ➕ Add Another Driver
                    </button>
                    <button type="button" onClick={removeDriver} className="p-2 w-48 bg-red-400 text-white rounded-md hover:bg-red-500">
                        ❌ Remove Last Driver
                    </button>
                </div>
                
                <button type="submit" className="p-2 w-full mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SponsorApplication;
