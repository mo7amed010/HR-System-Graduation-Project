const SummaryService = require("../Services/summaryService");
const EmployeeModel = require("../Models/employee");
const dayjs = require("dayjs");

/**
 * Get employee summary
 * GET /employees/:id/summary
 */
const getEmployeeSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, preview } = req.query;

    // Validate employee ID
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Employee ID is required",
      });
    }

    // Check if employee exists
    const employeeExists = await EmployeeModel.findById(id);
    if (!employeeExists) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    // Get current date information
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-based (01 = Jan)
    const currentYear = today.getFullYear();

    // Determine the month to analyze
    let targetMonth;
    let requestedMonth, requestedYear;
    
    if (month && year) {
      requestedMonth = parseInt(month);
      requestedYear = parseInt(year);
      targetMonth = `${year}-${month.padStart(2, '0')}`;
    } else if (month) {
      // If only month is provided, assume current year
      requestedMonth = parseInt(month);
      requestedYear = currentYear;
      targetMonth = `${currentYear}-${month.padStart(2, '0')}`;
    } else {
      requestedMonth = currentMonth;
      requestedYear = currentYear;
      targetMonth = dayjs().format("YYYY-MM");
    }

    // Check if requested month/year equals current month/year
    console.log({ requestedMonth, requestedYear, currentMonth, currentYear });
    const isCurrentMonth = requestedMonth === currentMonth && requestedYear === currentYear;

    // منع التقارير للأشهر المستقبلية
    if (
      requestedYear > currentYear ||
      (requestedYear === currentYear && requestedMonth > currentMonth)
    ) {
      return res.json({
        message: "التقرير غير متاح الآن.",
        partialReportAvailable: false
      });
    }

    // If it's the current month and preview is not explicitly set to "true"
    if (isCurrentMonth && preview !== "true") {
      return res.json({
        message: "التقرير غير متاح حاليًا، سيتم توليده في نهاية الشهر.",
        partialReportAvailable: false
      });
    }

    // Generate summary with isCurrentMonth flag
    const summary = await SummaryService.generateEmployeeSummary(id, targetMonth, isCurrentMonth);

    // Add partialReportAvailable field
    const responseData = {
      ...summary,
      partialReportAvailable: isCurrentMonth && preview === "true"
    };

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.error("Error generating employee summary:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to generate employee summary",
    });
  }
};

/**
 * Get all employees for summary selection
 * GET /employees/summary/list
 */
const getEmployeesForSummary = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({})
      .populate("department", "name")
      .select("name department jobTitle")
      .lean();

    const employeeList = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      department: emp.department?.name || "Unknown",
      jobTitle: emp.jobTitle,
    }));

    res.status(200).json({
      status: "success",
      data: employeeList,
    });
  } catch (error) {
    console.error("Error fetching employees for summary:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch employees",
    });
  }
};

module.exports = {
  getEmployeeSummary,
  getEmployeesForSummary,
}; 