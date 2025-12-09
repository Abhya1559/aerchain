import { runRfpAgent } from "../services/aiServices.js";

export const rfpAgent = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(404).json({ message: "Google not responding" });
    }
    const response = await runRfpAgent(message);

    return res
      .status(200)
      .json({ success: true, message: "API fetching data", data: response });
  } catch (error) {
    console.log("API Error", error);
    return res
      .status(501)
      .json({ message: "Server is not responding", error: error.message });
  }
};
