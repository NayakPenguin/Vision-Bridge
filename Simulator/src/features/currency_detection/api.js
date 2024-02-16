import axios from "axios";

const apiUrl =
  "http://ec2-3-25-210-181.ap-southeast-2.compute.amazonaws.com:8080/";

export const currency_test = async (data, options) => {
  try {
    const result = await axios.post("http://localhost:8080/predict", data);
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
// export const vehicle_classify = async (data, options) => {
//   try {
//     const result = await axios.post("http://localhost:8080/predict", data);
//     console.log(result);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };
export const object_localize = async (data, options) => {
  try {
    // console.log(data.get("file"));
    const result = await axios.post(
      "http://localhost:8080/localizeobject",
      data
    );
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
// export const getSingleFiles = async () => {
//   try {
//     const { data } = await axios.get(apiUrl + "getSingleFiles");
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
