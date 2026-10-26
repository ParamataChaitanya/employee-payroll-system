// ==========================================
// PayMaster Pro - Frontend Application Logic
// ==========================================

const API_BASE = window.location.origin.includes('8080') 
  ? window.location.origin 
  : 'http://localhost:8080';

let employeesData = [];
let currentSalaries = {};
let auditLogs = [];

// Corporate Department to Designation Mapping
const DEPARTMENT_DESIGNATIONS = {
  "Engineering": [
    "Software Engineer",
    "Senior Software Engineer",
    "Lead Engineer",
    "Principal Architect",
    "Engineering Manager",
    "QA Automation Engineer",
    "DevOps Engineer"
  ],
  "Human Resources": [
    "HR Generalist",
    "HR Manager",
    "Talent Acquisition Specialist",
    "Recruiter",
    "HR Director"
  ],
  "Finance": [
    "Financial Analyst",
    "Accountant",
    "Payroll Specialist",
    "Finance Manager",
    "Chief Financial Officer (CFO)"
  ],
  "Marketing": [
    "Marketing Lead",
    "Digital Marketing Specialist",
    "Content Strategist",
    "SEO Specialist",
    "Marketing Director"
  ],
  "Operations": [
    "Operations Manager",
    "Business Analyst",
    "Project Manager",
    "Scrum Master",
    "Logistics Coordinator"
  ],
  "Sales": [
    "Sales Executive",
    "Account Executive",
    "Sales Manager",
    "Business Development Representative",
    "Sales Director"
  ],
  "Legal & Compliance": [
    "Legal Counsel",
    "Compliance Officer",
    "Corporate Lawyer"
  ]
};

// Department & Role Standard Compensation Matrix
const ROLE_SALARY_MATRIX = {
  // Engineering
  "Software Engineer": { basic: 45000, hra: 18000, allowances: 9000, deductions: 4500 },
  "Senior Software Engineer": { basic: 65000, hra: 26000, allowances: 13000, deductions: 6500 },
  "Lead Engineer": { basic: 85000, hra: 34000, allowances: 17000, deductions: 8500 },
  "Principal Architect": { basic: 120000, hra: 48000, allowances: 24000, deductions: 12000 },
  "Engineering Manager": { basic: 110000, hra: 44000, allowances: 22000, deductions: 11000 },
  "QA Automation Engineer": { basic: 42000, hra: 16800, allowances: 8400, deductions: 4200 },
  "DevOps Engineer": { basic: 55000, hra: 22000, allowances: 11000, deductions: 5500 },

  // Human Resources
  "Recruiter": { basic: 32000, hra: 12800, allowances: 6400, deductions: 3200 },
  "Talent Acquisition Specialist": { basic: 38000, hra: 15200, allowances: 7600, deductions: 3800 },
  "HR Generalist": { basic: 35000, hra: 14000, allowances: 7000, deductions: 3500 },
  "HR Manager": { basic: 55000, hra: 22000, allowances: 11000, deductions: 5500 },
  "HR Director": { basic: 95000, hra: 38000, allowances: 19000, deductions: 9500 },

  // Finance
  "Accountant": { basic: 35000, hra: 14000, allowances: 7000, deductions: 3500 },
  "Payroll Specialist": { basic: 40000, hra: 16000, allowances: 8000, deductions: 4000 },
  "Financial Analyst": { basic: 48000, hra: 19200, allowances: 9600, deductions: 4800 },
  "Finance Manager": { basic: 65000, hra: 26000, allowances: 13000, deductions: 6500 },
  "Chief Financial Officer (CFO)": { basic: 150000, hra: 60000, allowances: 30000, deductions: 15000 },

  // Marketing
  "SEO Specialist": { basic: 35000, hra: 14000, allowances: 7000, deductions: 3500 },
  "Content Strategist": { basic: 38000, hra: 15200, allowances: 7600, deductions: 3800 },
  "Digital Marketing Specialist": { basic: 42000, hra: 16800, allowances: 8400, deductions: 4200 },
  "Marketing Lead": { basic: 52000, hra: 20800, allowances: 10400, deductions: 5200 },
  "Marketing Director": { basic: 90000, hra: 36000, allowances: 18000, deductions: 9000 },

  // Operations
  "Logistics Coordinator": { basic: 30000, hra: 12000, allowances: 6000, deductions: 3000 },
  "Business Analyst": { basic: 45000, hra: 18000, allowances: 9000, deductions: 4500 },
  "Scrum Master": { basic: 55000, hra: 22000, allowances: 11000, deductions: 5500 },
  "Project Manager": { basic: 65000, hra: 26000, allowances: 13000, deductions: 6500 },
  "Operations Manager": { basic: 60000, hra: 24000, allowances: 12000, deductions: 6000 },

  // Sales
  "Business Development Representative": { basic: 32000, hra: 12800, allowances: 6400, deductions: 3200 },
  "Sales Executive": { basic: 38000, hra: 15200, allowances: 7600, deductions: 3800 },
  "Account Executive": { basic: 48000, hra: 19200, allowances: 9600, deductions: 4800 },
  "Sales Manager": { basic: 65000, hra: 26000, allowances: 13000, deductions: 6500 },
  "Sales Director": { basic: 95000, hra: 38000, allowances: 19000, deductions: 9500 },

  // Legal & Compliance
  "Compliance Officer": { basic: 45000, hra: 18000, allowances: 9000, deductions: 4500 },
  "Corporate Lawyer": { basic: 60000, hra: 24000, allowances: 12000, deductions: 6000 },
  "Legal Counsel": { basic: 75000, hra: 30000, allowances: 15000, deductions: 7500 }
};

const DEPARTMENT_DEFAULT_SALARY = {
  "Engineering": { basic: 50000, hra: 20000, allowances: 10000, deductions: 5000 },
  "Human Resources": { basic: 40000, hra: 16000, allowances: 8000, deductions: 4000 },
  "Finance": { basic: 45000, hra: 18000, allowances: 9000, deductions: 4500 },
  "Marketing": { basic: 42000, hra: 16800, allowances: 8400, deductions: 4200 },
  "Operations": { basic: 45000, hra: 18000, allowances: 9000, deductions: 4500 },
  "Sales": { basic: 42000, hra: 16800, allowances: 8400, deductions: 4200 },
  "Legal & Compliance": { basic: 55000, hra: 22000, allowances: 11000, deductions: 5500 }
};

const DEFAULT_SALARY = { basic: 40000, hra: 16000, allowances: 8000, deductions: 4000 };

function getSalaryForRoleAndDepartment(dept, role) {
  if (role && ROLE_SALARY_MATRIX[role]) {
    return ROLE_SALARY_MATRIX[role];
  }
  if (dept && DEPARTMENT_DEFAULT_SALARY[dept]) {
    return DEPARTMENT_DEFAULT_SALARY[dept];
  }
  return DEFAULT_SALARY;
}

// Handle Department Change to Dynamically Populate Designation Options
function handleDepartmentChange(selectedDesignation = '') {
  const deptSelect = document.getElementById('formEmpDept');
  const desigSelect = document.getElementById('formEmpDesignation');
  if (!deptSelect || !desigSelect) return;

  const dept = deptSelect.value;
  desigSelect.innerHTML = '';

  if (!dept) {
    desigSelect.innerHTML = '<option value="">-- Select Department First --</option>';
    return;
  }

  const list = DEPARTMENT_DESIGNATIONS[dept] || [];
  desigSelect.innerHTML = '<option value="">-- Select Designation --</option>';

  let found = false;
  list.forEach(desig => {
    const isSelected = selectedDesignation && selectedDesignation === desig;
    if (isSelected) found = true;
    desigSelect.innerHTML += `<option value="${escapeHtml(desig)}" ${isSelected ? 'selected' : ''}>${escapeHtml(desig)}</option>`;
  });

  // Preserve existing custom designation if not in the standard list
  if (selectedDesignation && !found) {
    desigSelect.innerHTML += `<option value="${escapeHtml(selectedDesignation)}" selected>${escapeHtml(selectedDesignation)}</option>`;
  }
}

// Helper to get present pay period (MM-YYYY)
function getPresentPayPeriod() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${mm}-${yyyy}`;
}

// Monthly Net Outflow Aggregator
async function updateMonthlyNetflow(period) {
  const filterInput = document.getElementById('dashPeriodFilter');
  const targetPeriod = period || (filterInput ? filterInput.value.trim() : '') || getPresentPayPeriod();
  
  if (filterInput && filterInput.value !== targetPeriod) {
    filterInput.value = targetPeriod;
  }

  const subEl = document.getElementById('dashDisbursementSub');
  try {
    const res = await fetch(`${API_BASE}/api/payroll/period/${encodeURIComponent(targetPeriod)}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    
    if (json.success && Array.isArray(json.data)) {
      const records = json.data;
      const totalNet = records.reduce((sum, item) => sum + (Number(item.netPay) || 0), 0);
      document.getElementById('dashDisbursement').innerText = formatCurrency(totalNet);
      if (subEl) {
        subEl.innerText = `${records.length} processed in ${targetPeriod}`;
      }
    } else {
      document.getElementById('dashDisbursement').innerText = formatCurrency(0);
      if (subEl) {
        subEl.innerText = `0 processed in ${targetPeriod}`;
      }
    }
  } catch (err) {
    console.warn('Error fetching monthly netflow:', err);
    document.getElementById('dashDisbursement').innerText = formatCurrency(0);
    if (subEl) {
      subEl.innerText = `Period: ${targetPeriod} (No records)`;
    }
  }
}

function handleDashPeriodChange() {
  const filterInput = document.getElementById('dashPeriodFilter');
  if (filterInput && filterInput.value.trim()) {
    updateMonthlyNetflow(filterInput.value.trim());
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  const presentPeriod = getPresentPayPeriod();
  
  const calcPeriodEl = document.getElementById('calcPayPeriod');
  if (calcPeriodEl && !calcPeriodEl.value) {
    calcPeriodEl.value = presentPeriod;
  }
  
  const payslipPeriodEl = document.getElementById('payslipPeriodInput');
  if (payslipPeriodEl && !payslipPeriodEl.value) {
    payslipPeriodEl.value = presentPeriod;
  }

  const dashFilterEl = document.getElementById('dashPeriodFilter');
  if (dashFilterEl && !dashFilterEl.value) {
    dashFilterEl.value = presentPeriod;
  }

  fetchData();
  recalcLiveMath();
  logAudit('SYSTEM_INIT', 'Application frontend initialized successfully. Connected to ' + API_BASE);
});

// View Navigation
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item button').forEach(btn => btn.classList.remove('active'));

  const targetSection = document.getElementById(`view-${viewId}`);
  const targetNav = document.getElementById(`nav-${viewId}`);
  if (targetSection) targetSection.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  const titles = {
    dashboard: { title: 'Overview & KPI Dashboard', sub: 'Real-time statistics across active staff, transactions, and payroll status' },
    employees: { title: 'Employee Master Directory (Module 1)', sub: 'Manage corporate employee records with relational integrity validation' },
    payroll: { title: 'Payroll Processing Engine (Module 2 & 3)', sub: 'ACID transactional salary computation with mathematical verification' },
    payslip: { title: 'Payslip Generation & SOAP Service (Module 4)', sub: 'Contract-first XML web services and printable corporate salary slips' },
    audit: { title: 'Spring AOP Live Audit Stream (Module 3)', sub: 'Non-intrusive method interception, execution timings, and commit/rollback logs' }
  };

  if (titles[viewId]) {
    document.getElementById('viewHeading').innerText = titles[viewId].title;
    document.getElementById('viewSubheading').innerText = titles[viewId].sub;
  }
}

// Fetch All Employees & Populate Views
async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/api/employees`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    
    if (json.success && Array.isArray(json.data)) {
      employeesData = json.data;
      renderDashboard();
      renderEmployeesTable();
      populateSelectDropdowns();
      document.getElementById('backendStatusText').innerText = 'Backend Online (8080)';
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showToast('Failed to connect to backend: ' + err.message, 'danger');
    document.getElementById('backendStatusText').innerText = 'Connection Error';
  }
}

// Render Dashboard
function renderDashboard() {
  document.getElementById('dashTotalEmp').innerText = employeesData.length;
  
  const depts = new Set(employeesData.map(e => e.department).filter(Boolean));
  document.getElementById('dashDepts').innerText = depts.size;

  // Aggregate monthly net outflow for current period
  updateMonthlyNetflow();

  // Recent preview table
  const tbody = document.getElementById('dashEmpTableBody');
  tbody.innerHTML = '';

  employeesData.slice(0, 5).forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center;">
          <span class="avatar">${getInitials(emp.employeeName)}</span>
          <div>
            <strong>${escapeHtml(emp.employeeName)}</strong>
            <div style="font-size: 0.78rem; color: var(--text-sub);">${escapeHtml(emp.email)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${escapeHtml(emp.designation || 'Staff')}</td>
      <td><span class="badge ${emp.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${emp.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Employees Table (Module 1)
function renderEmployeesTable(filtered = employeesData) {
  const tbody = document.getElementById('employeesTableBody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-sub); padding: 2rem;">No employee records found.</td></tr>`;
    return;
  }

  filtered.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${emp.employeeId}</td>
      <td>
        <div style="display: flex; align-items: center;">
          <span class="avatar">${getInitials(emp.employeeName)}</span>
          <div>
            <strong>${escapeHtml(emp.employeeName)}</strong>
            <div style="font-size: 0.78rem; color: var(--text-sub);">${escapeHtml(emp.email)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${escapeHtml(emp.designation || 'N/A')}</td>
      <td>${escapeHtml(emp.phone || '-')}</td>
      <td><span class="badge ${emp.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}">${emp.status}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary btn-sm" onclick="quickPay(${emp.employeeId})" title="Calculate Pay">Pay</button>
        <button class="btn btn-secondary btn-sm" onclick="viewHistory(${emp.employeeId})" title="Salary History">History</button>
        <button class="btn btn-secondary btn-sm" onclick="openEditEmployeeModal(${emp.employeeId})" title="Edit">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${emp.employeeId})" title="Delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate Select Dropdowns
function populateSelectDropdowns() {
  const deptSelect = document.getElementById('departmentFilter');
  const calcSelect = document.getElementById('calcEmployeeSelect');
  const payslipSelect = document.getElementById('payslipEmpSelect');

  // Departments
  const depts = Array.from(new Set(employeesData.map(e => e.department).filter(Boolean)));
  deptSelect.innerHTML = '<option value="">All Departments</option>';
  depts.forEach(d => {
    deptSelect.innerHTML += `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`;
  });

  // Employee Dropdowns
  calcSelect.innerHTML = '<option value="">-- Choose Staff Member --</option>';
  payslipSelect.innerHTML = '<option value="">-- Select Staff Member --</option>';

  employeesData.forEach(e => {
    const opt = `<option value="${e.employeeId}">${escapeHtml(e.employeeName)} (#${e.employeeId} - ${escapeHtml(e.department)})</option>`;
    calcSelect.innerHTML += opt;
    payslipSelect.innerHTML += opt;
  });

  if (employeesData.length > 0 && !calcSelect.value) {
    calcSelect.value = employeesData[0].employeeId;
    payslipSelect.value = employeesData[0].employeeId;
    handleCalcEmployeeChange();
    loadEmployeePayslip();
  }
}

// Filter Employees
function filterEmployees() {
  const search = document.getElementById('employeeSearchInput').value.toLowerCase();
  const dept = document.getElementById('departmentFilter').value;

  const filtered = employeesData.filter(e => {
    const matchSearch = e.employeeName.toLowerCase().includes(search) || 
                        e.email.toLowerCase().includes(search) ||
                        (e.department && e.department.toLowerCase().includes(search));
    const matchDept = !dept || e.department === dept;
    return matchSearch && matchDept;
  });

  renderEmployeesTable(filtered);
}

// Add / Edit Employee Modals
function openAddEmployeeModal() {
  document.getElementById('modalEmpTitle').innerText = 'Register New Employee';
  document.getElementById('editEmployeeId').value = '';
  document.getElementById('addEmployeeForm').reset();
  document.getElementById('formEmpDept').value = '';
  handleDepartmentChange('');
  openModal('addEmployeeModal');
}

function openEditEmployeeModal(id) {
  const emp = employeesData.find(e => e.employeeId === id);
  if (!emp) return;

  document.getElementById('modalEmpTitle').innerText = 'Update Employee Profile';
  document.getElementById('editEmployeeId').value = emp.employeeId;
  document.getElementById('formEmpName').value = emp.employeeName;
  
  // Set department dropdown or append if custom
  const deptSelect = document.getElementById('formEmpDept');
  let deptFound = Array.from(deptSelect.options).some(o => o.value === emp.department);
  if (!deptFound && emp.department) {
    deptSelect.innerHTML += `<option value="${escapeHtml(emp.department)}">${escapeHtml(emp.department)}</option>`;
  }
  deptSelect.value = emp.department;

  // Populate and select designation
  handleDepartmentChange(emp.designation || '');

  document.getElementById('formEmpEmail').value = emp.email;
  document.getElementById('formEmpPhone').value = emp.phone || '';
  document.getElementById('formEmpStatus').value = emp.status || 'ACTIVE';

  openModal('addEmployeeModal');
}

async function handleEmployeeFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('editEmployeeId').value;
  const payload = {
    employeeName: document.getElementById('formEmpName').value.trim(),
    department: document.getElementById('formEmpDept').value.trim(),
    email: document.getElementById('formEmpEmail').value.trim(),
    designation: document.getElementById('formEmpDesignation').value.trim(),
    phone: document.getElementById('formEmpPhone').value.trim(),
    status: document.getElementById('formEmpStatus').value
  };

  const isEdit = !!id;
  const url = isEdit ? `${API_BASE}/api/employees/${id}` : `${API_BASE}/api/employees`;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    logAudit('AOP_BEFORE', `Invoking EmployeeService.${isEdit ? 'updateEmployee' : 'createEmployee'} with payload: ${payload.email}`);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      logAudit('AOP_EXCEPTION', `Operation failed with HTTP ${res.status}: ${data.message || 'Validation error'}`);
      throw new Error(data.message || (data.details ? data.details.join(', ') : 'Request failed'));
    }

    logAudit('AOP_SUCCESS', `Employee ${isEdit ? 'updated' : 'registered'} successfully with ID: ${data.data?.employeeId}`);
    showToast(data.message || 'Saved successfully', 'success');
    closeModal('addEmployeeModal');
    await fetchData();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

async function deleteEmployee(id) {
  if (!confirm(`Are you sure you want to delete employee #${id}? This will cascade delete associated salary records.`)) return;

  try {
    logAudit('AOP_BEFORE', `Invoking EmployeeService.deleteEmployee(${id})`);
    const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      logAudit('AOP_EXCEPTION', `Failed to delete employee #${id}`);
      throw new Error(data.message || 'Deletion failed');
    }

    logAudit('AOP_SUCCESS', `Successfully deleted employee #${id}`);
    showToast('Employee deleted successfully', 'success');
    await fetchData();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// Live Math Recalculation for Payroll Engine
function recalcLiveMath() {
  const basic = parseFloat(document.getElementById('calcBasic').value) || 0;
  const hra = parseFloat(document.getElementById('calcHra').value) || 0;
  const allowances = parseFloat(document.getElementById('calcAllowances').value) || 0;
  const deductions = parseFloat(document.getElementById('calcDeductions').value) || 0;

  const gross = basic + hra + allowances;
  const netPay = gross - deductions;

  document.getElementById('previewBasic').innerText = formatCurrency(basic);
  document.getElementById('previewHra').innerText = formatCurrency(hra);
  document.getElementById('previewAllowances').innerText = formatCurrency(allowances);
  document.getElementById('previewGross').innerText = formatCurrency(gross);
  document.getElementById('previewDeductions').innerText = formatCurrency(deductions);
  document.getElementById('previewNetPay').innerText = formatCurrency(netPay);

  const warnEl = document.getElementById('calcDeductionWarning');
  if (deductions > gross) {
    warnEl.classList.add('active');
  } else {
    warnEl.classList.remove('active');
  }
}

function quickPay(id) {
  switchView('payroll');
  document.getElementById('calcEmployeeSelect').value = id;
  handleCalcEmployeeChange();
}

function handleCalcEmployeeChange() {
  const id = document.getElementById('calcEmployeeSelect').value;
  const badgeEl = document.getElementById('calcEmpRoleBadge');
  if (!id) {
    if (badgeEl) badgeEl.style.display = 'none';
    return;
  }
  
  // Sync with payslip view
  document.getElementById('payslipEmpSelect').value = id;

  const emp = employeesData.find(e => e.employeeId == id);
  if (!emp) return;

  const dept = emp.department || '';
  const role = emp.designation || '';

  if (badgeEl) {
    document.getElementById('calcDeptName').innerText = dept || 'General';
    document.getElementById('calcRoleName').innerText = role || 'Staff';
    badgeEl.style.display = 'flex';
  }

  // Auto-fill salary fields according to department and role
  const sal = getSalaryForRoleAndDepartment(dept, role);
  document.getElementById('calcBasic').value = sal.basic;
  document.getElementById('calcHra').value = sal.hra;
  document.getElementById('calcAllowances').value = sal.allowances;
  document.getElementById('calcDeductions').value = sal.deductions;

  // Immediately recalculate live mathematical preview
  recalcLiveMath();
}

// Handle Payroll Calculation & Persistence (Module 2 & 3)
async function handlePayrollSubmit(e) {
  e.preventDefault();
  const empId = document.getElementById('calcEmployeeSelect').value;
  if (!empId) {
    showToast('Please select an employee first', 'warning');
    return;
  }

  const payload = {
    payPeriod: document.getElementById('calcPayPeriod').value.trim(),
    basicSalary: parseFloat(document.getElementById('calcBasic').value) || 0,
    hra: parseFloat(document.getElementById('calcHra').value) || 0,
    allowances: parseFloat(document.getElementById('calcAllowances').value) || 0,
    deductions: parseFloat(document.getElementById('calcDeductions').value) || 0
  };

  const startTime = performance.now();
  logAudit('AOP_BEFORE', `[TX BEGIN] calculateAndProcessSalary for empId: ${empId}, period: ${payload.payPeriod}`);

  try {
    const res = await fetch(`${API_BASE}/api/payroll/calculate/${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const elapsed = Math.round(performance.now() - startTime);
    const data = await res.json();

    if (!res.ok) {
      logAudit('AOP_ROLLBACK', `[TRANSACTION ROLLBACK] Error: ${data.message} (took ${elapsed}ms)`);
      throw new Error(data.message || 'Payroll calculation rejected');
    }

    logAudit('AOP_COMMIT', `[TRANSACTION COMMIT] Salary persisted. Gross: ₹${data.data.grossSalary}, Net: ₹${data.data.netPay} (took ${elapsed}ms)`);
    showToast(`Payroll committed successfully for ${data.data.payPeriod}! Net Pay: ₹${data.data.netPay}`, 'success');
    
    // Dynamically update cumulative monthly net outflow for this period
    await updateMonthlyNetflow(payload.payPeriod);
    
    // Sync payslip
    loadEmployeePayslip();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// Rollback Demo Helper
function triggerRollbackDemo() {
  document.getElementById('calcBasic').value = '20000';
  document.getElementById('calcHra').value = '5000';
  document.getElementById('calcAllowances').value = '3000';
  document.getElementById('calcDeductions').value = '50000';
  recalcLiveMath();
  showToast('Set Deductions (₹50,000) > Gross (₹28,000). Click Calculate to trigger rollback!', 'warning');
}

// View Salary History Modal
async function viewHistory(id) {
  const emp = employeesData.find(e => e.employeeId === id);
  document.getElementById('historyModalTitle').innerText = `Salary History: ${emp ? emp.employeeName : '#' + id}`;
  
  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Fetching history...</td></tr>';
  openModal('salaryHistoryModal');

  try {
    const res = await fetch(`${API_BASE}/api/payroll/employee/${id}`);
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      tbody.innerHTML = '';
      data.data.forEach(sal => {
        tbody.innerHTML += `
          <tr>
            <td><strong>${sal.payPeriod}</strong></td>
            <td>₹${sal.grossSalary.toLocaleString()}</td>
            <td style="color: #f87171;">₹${sal.deductions.toLocaleString()}</td>
            <td style="color: #38bdf8; font-weight: 700;">₹${sal.netPay.toLocaleString()}</td>
            <td style="font-size: 0.78rem; color: var(--text-sub);">${sal.processedDate ? sal.processedDate.substring(0, 10) : '-'}</td>
          </tr>
        `;
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-sub);">No historical payroll records found for this employee.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: #f87171; text-align: center;">Error loading history: ${err.message}</td></tr>`;
  }
}

// Number to Words for Indian Rupees
function convertNumberToWords(amount) {
  if (!amount || isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '') + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? numToWords(n % 10000000) : '');
  }

  const intPart = Math.floor(amount);
  const words = numToWords(intPart).trim();
  return 'Rupees ' + words + ' Only';
}

// Load Employee Payslip (Module 4)
async function loadEmployeePayslip() {
  const empId = document.getElementById('payslipEmpSelect').value;
  const period = (document.getElementById('payslipPeriodInput').value || '').trim() || getPresentPayPeriod();
  
  const alertEl = document.getElementById('payslipUnprocessedAlert');
  const sheetEl = document.getElementById('printablePayslip');
  const printBtn = document.getElementById('btnPrintPayslip');

  if (!empId) {
    if (alertEl) alertEl.style.display = 'none';
    if (sheetEl) sheetEl.style.display = 'none';
    if (printBtn) {
      printBtn.disabled = true;
      printBtn.style.opacity = '0.6';
      printBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  const emp = employeesData.find(e => e.employeeId == empId);
  const empName = emp ? emp.employeeName : `#${empId}`;

  // Update SOAP sample code box with selected IDs
  document.getElementById('soapReqBox').innerText = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://example.com/payroll/soap">
    <soapenv:Header/>
    <soapenv:Body>
        <soap:getPayslipRequest>
            <soap:employeeId>${empId}</soap:employeeId>
            <soap:payPeriod>${period}</soap:payPeriod>
        </soap:getPayslipRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

  // Try to fetch actual salary for this period
  try {
    const res = await fetch(`${API_BASE}/api/payroll/employee/${empId}/period/${encodeURIComponent(period)}`);
    const data = await res.json();

    if (res.ok && data.success && data.data) {
      const s = data.data;
      if (emp) {
        document.getElementById('psEmpId').innerText = `#${emp.employeeId}`;
        document.getElementById('psEmpName').innerText = emp.employeeName;
        document.getElementById('psEmpEmail').innerText = emp.email;
        document.getElementById('psDept').innerText = emp.department;
        document.getElementById('psDesignation').innerText = emp.designation || 'Staff Member';
        document.getElementById('psPayPeriod').innerText = `Pay Period: ${period}`;
        document.getElementById('psSlipNo').innerText = `Slip No: CTG/PAY/${period.replace('-', '')}/${String(emp.employeeId).padStart(3, '0')}`;
        document.getElementById('psBankAcc').innerText = `HDFC-XXXX-${(1000 + Number(emp.employeeId) * 123).toString().substring(0, 4)}`;
      }

      // Calculate days in period
      let daysInMonth = 31;
      const parts = period.split('-');
      if (parts.length === 2) {
        const m = parseInt(parts[0], 10);
        const y = parseInt(parts[1], 10);
        if (!isNaN(m) && !isNaN(y)) {
          daysInMonth = new Date(y, m, 0).getDate();
        }
      }
      const calDaysEl = document.getElementById('psCalDays');
      const paidDaysEl = document.getElementById('psPaidDays');
      if (calDaysEl) calDaysEl.innerText = String(daysInMonth);
      if (paidDaysEl) paidDaysEl.innerText = String(daysInMonth);

      // Financial breakdown
      const totalDed = s.deductions || 0;
      const pfShare = Math.round(totalDed * 0.60);
      const taxShare = totalDed - pfShare;

      document.getElementById('psBasic').innerText = (s.basicSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psHra').innerText = (s.hra || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psAllowances').innerText = (s.allowances || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      
      const pfEl = document.getElementById('psPf');
      const taxEl = document.getElementById('psTax');
      if (pfEl) pfEl.innerText = pfShare.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      if (taxEl) taxEl.innerText = taxShare.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      document.getElementById('psGross').innerText = '₹' + (s.grossSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psTotalDeductions').innerText = '₹' + totalDed.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      document.getElementById('psNetPay').innerText = '₹' + (s.netPay || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      
      const wordsEl = document.getElementById('psNetWords');
      if (wordsEl) wordsEl.innerText = convertNumberToWords(s.netPay || 0);

      document.getElementById('psGenDate').innerText = s.processedDate ? s.processedDate.replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19);
      const txnEl = document.getElementById('psTxnId');
      if (txnEl) txnEl.innerText = 'TXN-' + Math.abs(((s.salaryId || 101) * 789123) % 9000000 + 1000000);

      // Show sheet, hide unprocessed alert, enable print button
      if (alertEl) alertEl.style.display = 'none';
      if (sheetEl) sheetEl.style.display = 'block';
      if (printBtn) {
        printBtn.disabled = false;
        printBtn.style.opacity = '1';
        printBtn.style.cursor = 'pointer';
      }
    } else {
      showUnprocessedPayslipState(empName, period);
    }
  } catch (err) {
    showUnprocessedPayslipState(empName, period);
  }
}

function showUnprocessedPayslipState(empName, period) {
  const alertEl = document.getElementById('payslipUnprocessedAlert');
  const sheetEl = document.getElementById('printablePayslip');
  const printBtn = document.getElementById('btnPrintPayslip');

  if (sheetEl) sheetEl.style.display = 'none';
  if (printBtn) {
    printBtn.disabled = true;
    printBtn.style.opacity = '0.6';
    printBtn.style.cursor = 'not-allowed';
  }
  if (alertEl) {
    document.getElementById('unprocessedTitle').innerText = `Payroll Not Processed for ${empName}`;
    document.getElementById('unprocessedMsg').innerText = `No salary calculation has been computed or committed for period ${period}. Payslips are strictly locked until payroll processing is completed.`;
    alertEl.style.display = 'block';
  }
}

function goToProcessPayrollForCurrent() {
  const empId = document.getElementById('payslipEmpSelect').value;
  const period = (document.getElementById('payslipPeriodInput').value || '').trim() || getPresentPayPeriod();
  switchView('payroll');
  if (empId) {
    document.getElementById('calcEmployeeSelect').value = empId;
    handleCalcEmployeeChange();
  }
  if (period) {
    document.getElementById('calcPayPeriod').value = period;
  }
  recalcLiveMath();
}

// Enterprise Multi-Protocol Payslip Printing Engine
function printPayslip() {
  const sheet = document.getElementById('printablePayslip');
  if (!sheet || sheet.style.display === 'none') {
    showToast('Cannot print payslip: No valid processed payroll record loaded.', 'warning');
    return;
  }

  const empName = (document.getElementById('psEmpName')?.innerText || 'Employee').trim();
  const period = (document.getElementById('psPayPeriod')?.innerText || '').replace(/[^0-9-]/g, '') || getPresentPayPeriod();
  const cleanDocTitle = `Payslip_${empName.replace(/[^a-zA-Z0-9]/g, '_')}_${period}`;

  logAudit('PAYSLIP_PRINT', `Executive payslip printing initiated for ${empName} (${period})`);

  // Build clean, standalone printable document inside an isolated hidden iframe
  let printIframe = document.getElementById('payslipPrintIframe');
  if (printIframe) {
    try { document.body.removeChild(printIframe); } catch (e) {}
  }

  printIframe = document.createElement('iframe');
  printIframe.id = 'payslipPrintIframe';
  printIframe.style.position = 'fixed';
  printIframe.style.right = '0';
  printIframe.style.bottom = '0';
  printIframe.style.width = '0';
  printIframe.style.height = '0';
  printIframe.style.border = '0';
  printIframe.style.visibility = 'hidden';
  document.body.appendChild(printIframe);

  const sheetClone = sheet.cloneNode(true);
  sheetClone.style.display = 'block';

  const doc = printIframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${cleanDocTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.35;
      padding: 0;
      margin: 0;
    }
    .payslip-sheet {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 14px 18px !important;
      border: 2px solid #0f172a !important;
      border-radius: 4px !important;
      background: #ffffff !important;
      box-sizing: border-box !important;
      page-break-inside: avoid !important;
    }
    .payslip-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      border-bottom: 2px solid #0f172a !important;
      padding-bottom: 10px !important;
      margin-bottom: 10px !important;
    }
    .payslip-logo-badge {
      width: 44px !important;
      height: 44px !important;
      background: #0f172a !important;
      color: #38bdf8 !important;
      border-radius: 6px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .payslip-title h2 {
      color: #0f172a !important;
      font-size: 1.22rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.01em;
      margin-bottom: 2px;
    }
    .payslip-title p {
      color: #475569 !important;
      font-size: 0.76rem !important;
      line-height: 1.3;
    }
    .payslip-doc-badge {
      display: inline-block !important;
      background: #0f172a !important;
      color: #ffffff !important;
      padding: 3px 10px !important;
      border-radius: 4px !important;
      font-size: 0.72rem !important;
      font-weight: 800 !important;
      letter-spacing: 0.05em !important;
    }
    #psPayPeriod {
      color: #0f172a !important;
      font-size: 0.85rem !important;
      font-weight: 700 !important;
      margin: 4px 0 0 0 !important;
    }
    #psSlipNo {
      color: #475569 !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
    }
    .payslip-meta-container {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 4px !important;
      padding: 8px 12px !important;
      margin: 10px 0 !important;
    }
    .payslip-meta-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 12px !important;
      font-size: 0.82rem !important;
    }
    .meta-item {
      display: flex !important;
      justify-content: space-between !important;
      padding: 2px 0 !important;
      border-bottom: 1px dashed #e2e8f0 !important;
    }
    .meta-label {
      color: #64748b !important;
      font-weight: 600 !important;
    }
    .meta-val {
      color: #0f172a !important;
      font-weight: 700 !important;
    }
    .badge {
      display: inline-block !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      font-size: 0.72rem !important;
      font-weight: 700 !important;
    }
    .badge-active {
      background: #dcfce7 !important;
      color: #15803d !important;
      border: 1px solid #86efac !important;
    }
    .payslip-attendance-bar {
      margin-top: 6px !important;
      padding-top: 6px !important;
      border-top: 1px solid #cbd5e1 !important;
      display: flex !important;
      justify-content: space-between !important;
      font-size: 0.76rem !important;
      color: #334155 !important;
    }
    .payslip-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 10px 0 !important;
      border: 1px solid #94a3b8 !important;
    }
    .payslip-table th {
      background: #e2e8f0 !important;
      color: #0f172a !important;
      border: 1px solid #94a3b8 !important;
      padding: 5px 8px !important;
      font-size: 0.76rem !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
    }
    .payslip-table td {
      border: 1px solid #cbd5e1 !important;
      padding: 5px 8px !important;
      font-size: 0.82rem !important;
      color: #0f172a !important;
    }
    .payslip-table .total-row td {
      background: #f1f5f9 !important;
      font-weight: 800 !important;
      border-top: 2px solid #0f172a !important;
      color: #0f172a !important;
    }
    .payslip-net-box {
      background: #f8fafc !important;
      border: 2px solid #0f172a !important;
      padding: 8px 12px !important;
      border-radius: 4px !important;
      margin: 10px 0 !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
    .net-title {
      font-size: 0.88rem !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      letter-spacing: 0.03em !important;
    }
    .net-words {
      font-size: 0.76rem !important;
      color: #475569 !important;
      font-style: italic !important;
      margin-top: 2px !important;
      font-weight: 600 !important;
    }
    .net-value {
      font-size: 1.4rem !important;
      font-weight: 900 !important;
      color: #0f172a !important;
    }
    .payslip-footer {
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-end !important;
      border-top: 1px solid #cbd5e1 !important;
      padding-top: 10px !important;
      margin-top: 10px !important;
    }
    .payslip-legal p {
      font-size: 0.72rem !important;
      color: #475569 !important;
      margin: 1px 0 !important;
    }
    .stamp-box {
      border: 2px dashed #475569 !important;
      color: #0f172a !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
      text-align: center !important;
    }
    .stamp-title {
      font-size: 0.72rem !important;
      font-weight: 800 !important;
      letter-spacing: 0.04em !important;
    }
    .stamp-sub {
      font-size: 0.62rem !important;
      color: #64748b !important;
    }
    .stamp-status {
      font-size: 0.66rem !important;
      color: #15803d !important;
      font-weight: 800 !important;
      margin-top: 2px !important;
    }
  </style>
</head>
<body>
  ${sheetClone.outerHTML}
</body>
</html>`);
  doc.close();

  // Trigger print dialog
  setTimeout(() => {
    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();
  }, 250);
}

// Direct SOAP XML Execution
async function sendSoapRequestDirectly() {
  const reqXml = document.getElementById('soapReqBox').innerText;
  const resBox = document.getElementById('soapResBox');
  resBox.innerText = 'Connecting to SOAP endpoint at /ws...';

  logAudit('AOP_BEFORE', 'Sending SOAP 1.1 Envelope to /ws (Action: getPayslipRequest)');

  try {
    const res = await fetch(`${API_BASE}/ws`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
      body: reqXml
    });

    const xmlText = await res.text();
    resBox.innerText = formatXml(xmlText);

    if (res.ok && !xmlText.includes('Fault')) {
      logAudit('AOP_SUCCESS', 'SOAP Response 200 OK received with GetPayslipResponse schema payload');
      showToast('SOAP Web Service call executed successfully!', 'success');
    } else {
      logAudit('AOP_EXCEPTION', 'SOAP Fault returned: Payroll not processed for this employee/period');
      showToast('SOAP Fault: Payroll has not been processed for this employee/period', 'warning');
    }
  } catch (err) {
    resBox.innerText = 'SOAP Request Failed: ' + err.message;
    showToast('Failed to execute SOAP call: ' + err.message, 'danger');
  }
}

function toggleSoapTester() {
  const el = document.getElementById('soapTesterCard');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// AOP Live Audit Stream (Module 3)
function logAudit(type, message) {
  const stream = document.getElementById('auditLiveStream');
  if (!stream) return;

  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = 'audit-item';

  let badgeClass = 'audit-entry';
  let badgeLabel = type;

  if (type === 'AOP_COMMIT') { badgeClass = 'audit-commit'; badgeLabel = 'COMMIT'; }
  else if (type === 'AOP_ROLLBACK' || type === 'AOP_EXCEPTION') { badgeClass = 'audit-rollback'; badgeLabel = 'ROLLBACK'; }
  else if (type === 'AOP_SUCCESS') { badgeClass = 'audit-commit'; badgeLabel = 'SUCCESS'; }

  div.innerHTML = `
    <span style="color: var(--text-sub); font-family: monospace; font-size: 0.78rem;">${time}</span>
    <span class="audit-badge ${badgeClass}">${badgeLabel}</span>
    <span style="color: var(--text-main);">${escapeHtml(message)}</span>
  `;

  stream.insertBefore(div, stream.firstChild);

  // Keep max 50 items
  while (stream.children.length > 50) {
    stream.removeChild(stream.lastChild);
  }
}

function clearAuditLog() {
  document.getElementById('auditLiveStream').innerHTML = '';
}

// Modal Helpers
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Utilities
function formatCurrency(val) {
  return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInitials(name) {
  if (!name) return 'EP';
  const parts = name.trim().split(' ');
  return parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : parts[0].substring(0, 2).toUpperCase();
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatXml(xml) {
  let formatted = '';
  let pad = 0;
  xml.split(/>\s*</).forEach(node => {
    let indent = 0;
    if (node.match(/^\/\w/)) pad = Math.max(0, pad - 1);
    else if (node.match(/^<?\w[^>]*[^\/]$/)) indent = 1;
    formatted += '  '.repeat(pad) + '<' + node + '>\n';
    pad += indent;
  });
  return formatted.trim();
}
