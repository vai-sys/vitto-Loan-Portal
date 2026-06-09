const pool = require("../db");

const createApplication = async (req, res) => {
  try {
    const { name, mobile, amount, purpose, language } = req.body;

 
    if (!name || !mobile || !amount || !purpose || !language) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!/^\d{10}$/.test(mobile)) {
  return res.status(400).json({
    success: false,
    message: "Mobile number must be 10 digits",
  });
}

if (amount <= 0) {
  return res.status(400).json({
    success: false,
    message: "Loan amount must be greater than 0",
  });
}

    const allowedLanguages = [
      "Hindi",
      "Tamil",
      "Telugu",
      "Marathi",
      "English",
    ];

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    const query = `
      INSERT INTO applications
      (name,mobile,amount,purpose,language)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const values = [
      name,
      mobile,
      amount,
      purpose,
      language,
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const allowedStatuses = [
  "pending",
  "approved",
  "rejected",
];

if (
  status &&
  !allowedStatuses.includes(status)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid status filter",
  });
}

    let query = `
      SELECT *
      FROM applications
    `;

    let values = [];

    if (status) {
      query += ` WHERE status = $1`;
      values.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      applications: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

   
    const applicationExists = await pool.query(
      `
      SELECT id, status
      FROM applications
      WHERE id = $1
      `,
      [id]
    );

    if (applicationExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const currentStatus = applicationExists.rows[0].status;

  
    if (currentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be updated",
      });
    }

  
    const result = await pool.query(
      `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING *;
      `,
      [status, id]
    );

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const summaryQuery = `
      SELECT
        COUNT(*) AS total_applications,
        COALESCE(SUM(amount), 0) AS total_loan_amount,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM applications;
    `;

    const result = await pool.query(summaryQuery);

    const summary = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        totalApplications: Number(summary.total_applications),
        totalLoanAmount: Number(summary.total_loan_amount),
        pending: Number(summary.pending),
        approved: Number(summary.approved),
        rejected: Number(summary.rejected),
      },
    });
  } catch (error) {
    console.error("Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  getSummary
};