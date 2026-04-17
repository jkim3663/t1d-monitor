import express from "express";
import { analyzePatient } from "../services/patient-monitor.service";

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const bundle = req.body;

    const result = analyzePatient(bundle);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze patient data" });
  }
});

export default router;