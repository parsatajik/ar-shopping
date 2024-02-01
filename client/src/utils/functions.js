import axios from "axios";

export const uploadImage = async (imageFile, setResults, setIsLoading) => {
  const formData = new FormData();
  formData.append("image_file", imageFile);

  try {
    setIsLoading(true);
    const response = await axios.post(
      "http://localhost:8000/uploadfile/",
      formData
    );

    if (response.status === 200) {
      setResults(response.data.results);
      console.log(response.data.results);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    setIsLoading(false);
  }
};
