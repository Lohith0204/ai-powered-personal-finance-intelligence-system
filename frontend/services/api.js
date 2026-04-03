const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const predictText = async (text) => {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to predict");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

export const uploadCSV = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload CSV");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};
