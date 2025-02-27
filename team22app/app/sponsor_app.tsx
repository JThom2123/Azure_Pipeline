import { useState } from "react";
import { useRouter } from "next/router";

const SponsorApplication = () => {
    const [drivers, setDrivers] = useState([{ id: 1, firstName: "", lastName: "" }]);
    const router = useRouter();

    const addDriver = () => {
        setDrivers([...drivers, { id: drivers.length + 1, firstName: "", lastName: "" }]);
    };

    const removeDriver = () => {
        if (drivers.length > 1) {
            setDrivers(drivers.slice(0, -1));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Application submitted successfully! Redirecting to home page...");
        setTimeout(() => {
            router.push("/homepage.tsx");
        }, 1000);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-3/5 max-w-xl min-w-[400px]">
                <h2 className="text-center text-2xl font-bold">Sponsor Application</h2>
                <label htmlFor="sponsor-name">Sponsor Name:</label>
                <input type="text" id="sponsor-name" name="sponsor-name" required className="border p-2 w-full" />

                <h3 className="text-left text-lg font-semibold mt-4">Driver Information</h3>
                <div>
                    {drivers.map((driver, index) => (
                        <div key={driver.id} className="mt-2">
                            {index > 0 && <hr className="my-2 border-gray-300" />}
                            <label>Driver First Name:</label>
                            <input type="text" name="Driver-first-name" required className="border p-2 w-full" />
                            <label>Driver Last Name:</label>
                            <input type="text" name="Driver-last-name" required className="border p-2 w-full" />
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 justify-center mt-4">
                    <button type="button" onClick={addDriver} className="px-4 py-2 bg-yellow-400 text-black rounded-md">➕ Add Another Driver</button>
                    <button type="button" onClick={removeDriver} className="px-4 py-2 bg-red-500 text-white rounded-md">❌ Remove Last Driver</button>
                </div>

                <button type="submit" className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Submit</button>
            </form>
        </div>
    );
};

export default SponsorApplication;