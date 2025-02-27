import { useState } from "react";

const ProductInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([
    "This is the product description. It provides an overview of the product’s features, benefits, and key details."
  ]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const addTextBox = () => {
    setDescriptions([...descriptions, "New description text..."]);
  };

  const removeTextBox = (index: number) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
        <div className="flex gap-4">
          <button className="bg-gray-600 px-4 py-2 rounded">Home</button>
          <button className="bg-gray-600 px-4 py-2 rounded">Catalog</button>
          <button className="bg-gray-600 px-4 py-2 rounded">Points</button>
          <button className="bg-gray-600 px-4 py-2 rounded">More</button>
        </div>
        <button className="bg-red-600 px-4 py-2 font-bold rounded" onClick={toggleEditing}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r-2 border-gray-300">
          <h3 className="underline mb-2">Project Details</h3>
          <p><b>Team Number:</b> 22</p>
          <p><b>Sprint Number:</b> 2</p>
          <p><b>Release Date:</b> February 6, 2025</p>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-10">
          <h1 className="text-2xl font-bold mb-4">Product Name</h1>

          <div>
            {descriptions.map((desc, index) => (
              <div
                key={index}
                className={`border-2 border-gray-300 rounded-lg shadow-md p-4 mt-4 bg-white relative ${isEditing ? "border-blue-500 bg-blue-50" : ""}`}
                contentEditable={isEditing}
              >
                {desc}
                {isEditing && (
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
                    onClick={() => removeTextBox(index)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={addTextBox}>
                Add Text Box
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductInfo;
